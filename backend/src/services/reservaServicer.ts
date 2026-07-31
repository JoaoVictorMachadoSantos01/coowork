import prisma from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

type CriarReservasData = {
    idDaSala : number;
    diaDaReserva : string;
    turno : string;


}

// tempo que o cliente tem pra "pagar" antes da reserva expirar e o slot voltar a ficar livre
export const MINUTOS_PARA_EXPIRAR = 5;

// não temos um worker/cron rodando em background, então a expiração é "preguiçosa":
// toda leitura/escrita que depende da disponibilidade real chama isso antes,
// cancelando pendentes cujo prazo já passou.
export async function expirarPendentes() {
  await prisma.reserva.updateMany({
    where: {
      status: "pendente",
      expireAt: { lt: new Date() }
    },
    data: { status: "cancelada" }
  });
}

export async function create(data:CriarReservasData, usuarioId : number) {

    const {idDaSala , diaDaReserva , turno} = data

    await expirarPendentes();

    //SALA EXISTE?
    const sala = await prisma.sala.findUnique({
        where : {id : idDaSala}
    })

    if(!sala){
        throw new AppError("sala nao encontrada", 404 , "SALA_NAO_ENCONTRADA")
    }
    
    // 2. normaliza a data — zera a hora pra comparar só o dia
  //    (evita que 20/07 às 14h e 20/07 às 9h sejam tratados como dias diferentes)

  const dia = new Date(diaDaReserva);
  dia.setUTCHours(0, 0, 0, 0); 

  // A SALA JA TEM RESERVA PRA ESSA DATA E TURNO ?
//    findFirst porque não filtra por usuário — qualquer reserva ativa bloqueia
    const jaReservada = await prisma.reserva.findFirst({where: {
      idDaSala,
      diaDaReserva: dia,
      turno,
      status: { in: ["pendente", "confirmada"] }   // canceladas/expiradas não contam
    }
  });

  if (jaReservada) {
     throw new AppError("Sala já reservada neste turno.", 409, "SLOT_OCUPADO");
  }

// criar reserva com status pendente e prazo de 5 minutos pra confirmar o pagamento

return await prisma.reserva.create({
    data: {
        idDaSala,
        idDoUser : usuarioId,
        diaDaReserva : dia,
        turno,
        expireAt: new Date(Date.now() + MINUTOS_PARA_EXPIRAR * 60 * 1000)
    },
    include: {
      sala: { select: { nome: true, preco: true, capacidade: true } }
    }
})

}


export async function getAll(usuarioId: number, isAdmin: boolean) {
  await expirarPendentes();

  if (isAdmin) {
    return await prisma.reserva.findMany({
      include: {
        sala: { select: { nome: true, preco: true, capacidade: true } },
        usuario: { select: { nome: true, email: true } }
      },
      orderBy: { diaDaReserva: "asc" }
    });
  }

  return await prisma.reserva.findMany({
    where: { idDoUser: usuarioId },
    include: { sala: { select: { nome: true, preco: true, capacidade: true } } },
    orderBy: { diaDaReserva: "asc" }
  });
}








export async function getById(id: number, usuarioId: number, isAdmin: boolean) {
  await expirarPendentes();

  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: {
      sala: { select: { nome: true, preco: true, capacidade: true } },
      usuario: { select: { nome: true, email: true } }
    }
  });

  if (!reserva) {
    throw new AppError("Reserva não encontrada.", 404, "RESERVA_NAO_ENCONTRADA");
  }

  if (!isAdmin && reserva.idDoUser !== usuarioId) {
    throw new AppError("Acesso negado.", 403, "FORBIDDEN");
  }

  return reserva;
}



// "pagamento aprovado" — só confirma se ainda estiver pendente e dentro do prazo
export async function confirmar(id: number, usuarioId: number, isAdmin: boolean) {
  await expirarPendentes();

  const reserva = await prisma.reserva.findUnique({ where: { id } });

  if (!reserva) {
    throw new AppError("Reserva não encontrada.", 404, "RESERVA_NAO_ENCONTRADA");
  }

  if (!isAdmin && reserva.idDoUser !== usuarioId) {
    throw new AppError("Acesso negado.", 403, "FORBIDDEN");
  }

  if (reserva.status !== "pendente") {
    throw new AppError(
      "Essa reserva não está mais aguardando pagamento (pode ter expirado ou sido cancelada).",
      409,
      "RESERVA_NAO_PENDENTE"
    );
  }

  return await prisma.reserva.update({
    where: { id },
    data: { status: "confirmada" },
    include: { sala: { select: { nome: true, preco: true, capacidade: true } } }
  });
}

export async function cancelar(id: number, usuarioId: number, isAdmin: boolean) {
  const reserva = await prisma.reserva.findUnique({ where: { id } });

  if (!reserva) {
    throw new AppError("Reserva não encontrada.", 404, "RESERVA_NAO_ENCONTRADA");
  }

  if (!isAdmin && reserva.idDoUser !== usuarioId) {
    throw new AppError("Acesso negado.", 403, "FORBIDDEN");
  }

  // já cancelada? evita cancelar duas vezes
  if (reserva.status === "cancelada") {
    throw new AppError("Reserva já cancelada.", 409, "JA_CANCELADA");
  }

  // SOFT DELETE — muda o status, não apaga a linha
  // a sala volta a ficar livre sozinha, porque a query de disponibilidade
  // só conta reservas 'pendente' ou 'confirmada'
  return await prisma.reserva.update({
    where: { id },
    data: { status: "cancelada" }
  });
}