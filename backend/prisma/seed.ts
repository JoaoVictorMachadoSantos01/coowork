import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  const nome = process.env.ADMIN_NOME;
  const email = process.env.ADMIN_EMAIL;
  const cpf = process.env.ADMIN_CPF;
  const senha = process.env.ADMIN_SENHA;

  if (!nome || !email || !cpf || !senha) {
    console.log(
      "ADMIN_NOME / ADMIN_EMAIL / ADMIN_CPF / ADMIN_SENHA não configurados — pulando seed de admin."
    );
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: { isAdmin: true },
    create: { nome, email, cpf, senha: senhaHash, isAdmin: true }
  });

  console.log(`Admin pronto: ${admin.email} (id ${admin.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
