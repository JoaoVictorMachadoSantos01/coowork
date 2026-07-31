import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../utils/AppError.js";
import { expirarPendentes } from "./reservaServicer.js";

type AtualizarSalaData = {
  nome?: string;
  preco?: number;
  capacidade?: number;
  descricao?: string;
};

export type FiltroSala = {
  dia?: string;
  turno?: string;
};

const TURNOS = ["manha", "tarde", "noite"] as const;


export async function create(data:Prisma.SalaCreateInput) {
    
const { nome, preco, capacidade, descricao } = data;

const salaExiste = await prisma.sala.findUnique({
    where : {nome}
})
  

if (salaExiste){

    throw new AppError("SAlA JA CADASTRADA" , 409, "SALA_JA_EXISTE")
}

return await prisma.sala.create({
    data : {nome , preco , capacidade , descricao}
})

}




export async function getAll(filtros?: FiltroSala) {
  await expirarPendentes();

 if (!filtros?.dia || !filtros?.turno) {
    return await prisma.sala.findMany();
  }

  const dia = new Date(filtros.dia);
  dia.setUTCHours(0, 0, 0, 0);



  return await prisma.sala.findMany({
    where: {
      reservas: {
        none: {
          diaDaReserva: dia,
          turno: filtros.turno,
          status: { in: ["pendente", "confirmada"] }
        }
      }
    }
  });
}

// devolve todas as salas com o status (livre/ocupado) dos 3 turnos, numa query só
export async function getAllComDisponibilidade(diaParam: string) {
  await expirarPendentes();

  const dia = new Date(diaParam);
  dia.setUTCHours(0, 0, 0, 0);

  const salas = await prisma.sala.findMany({
    include: {
      reservas: {
        where: {
          diaDaReserva: dia,
          status: { in: ["pendente", "confirmada"] }
        }
      }
    }
  });

  return salas.map(({ reservas, ...sala }) => {
    const ocupados = new Set(reservas.map((reserva) => reserva.turno));

    return {
      ...sala,
      disponibilidade: Object.fromEntries(
        TURNOS.map((turno) => [turno, !ocupados.has(turno)])
      ) as Record<(typeof TURNOS)[number], boolean>
    };
  });
}









export async function getById(id: number) {
  // findUnique; se não achar → AppError 404
    const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new AppError(
      "Sala não encontrado.",
      404,
      "SALA_NAO_ENCONTRADO",
    );

    throw error;
  }

  return sala;

}


export async function updateById(id: number, data : AtualizarSalaData) {
  // 1. busca a sala; se não achar → 404
  
  const { nome, preco, capacidade, descricao } = data;

  const sala = await prisma.sala.findUnique({
    where : {id}
})


if (!sala){

    throw new AppError("sala nao existe" , 404, "SALA_NAO_ENCONTRADA")
}
  // 2. se mandou nome E é diferente do atual → checa duplicidade → 409
if (nome && nome !== sala.nome) {
    const salaExistente = await prisma.sala.findUnique({
      where: { nome },
    });
    if (salaExistente) {
      const error = new AppError(
        "nome já em uso por outra sala.",
        409,
        "NOME_ALREADY_EXISTS",
      );

      throw error;
    }
  }

  return await prisma.sala.update({
    where : {id},
    data : {nome , preco , capacidade , descricao}
  })
}


export async function deleteSala(id: number) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new AppError("sala nao existe.", 404, "SALA_NOT_FOUND");

    throw error;
  }

 

  await prisma.sala.delete({
    where: { id },
  });

  return { success: true, message: "sala deletado com sucesso." };
}
