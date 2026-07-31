import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

const SENHA_TESTE = "senha123";

async function main() {
  console.log("Apagando dados atuais (Reservas, Salas, Usuarios)...");
  await prisma.reserva.deleteMany({});
  await prisma.sala.deleteMany({});
  await prisma.usuario.deleteMany({});

  console.log("Criando salas de teste...");
  await prisma.sala.createMany({
    data: [
      { nome: "Sala Foco", preco: 25, capacidade: 1, descricao: "Sala individual, ideal pra chamadas e trabalho focado." },
      { nome: "Sala Colmeia", preco: 60, capacidade: 4, descricao: "Sala pra squads pequenos, com TV e quadro branco." },
      { nome: "Sala Ágora", preco: 120, capacidade: 10, descricao: "Sala de reunião grande, com projetor." },
      { nome: "Auditório Nexus", preco: 300, capacidade: 40, descricao: "Auditório pra eventos e apresentações." },
      { nome: "Sala Criativa", preco: 45, capacidade: 6, descricao: "Espaço descontraído pra brainstorm e trabalho em grupo." }
    ]
  });

  console.log("Criando usuários de teste...");
  const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);

  await prisma.usuario.createMany({
    data: [
      { nome: "Admin Teste", email: "admin@coowork.com", cpf: "11111111111", senha: senhaHash, isAdmin: true },
      { nome: "Usuário Teste", email: "usuario@coowork.com", cpf: "22222222222", senha: senhaHash, isAdmin: false }
    ]
  });

  console.log(`Pronto. Login rápido: admin@coowork.com / usuario@coowork.com — senha: ${SENHA_TESTE}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
