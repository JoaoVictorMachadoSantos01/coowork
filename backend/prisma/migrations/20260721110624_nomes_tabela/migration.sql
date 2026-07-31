/*
  Warnings:

  - You are about to drop the `Sala` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_id_daSala_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_id_doUsuario_fkey";

-- DropTable
DROP TABLE "Sala";

-- DropTable
DROP TABLE "reservas";

-- DropTable
DROP TABLE "usuarios";

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "e_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_locacao" DOUBLE PRECISION NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservas" (
    "id" SERIAL NOT NULL,
    "diaDaReserva" TIMESTAMP(3) NOT NULL,
    "turno" TEXT NOT NULL,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_doUsuario" INTEGER NOT NULL,
    "id_daSala" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_cpf_key" ON "Usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Salas_nome_key" ON "Salas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Reservas_id_daSala_diaDaReserva_turno_key" ON "Reservas"("id_daSala", "diaDaReserva", "turno");

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_id_doUsuario_fkey" FOREIGN KEY ("id_doUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_id_daSala_fkey" FOREIGN KEY ("id_daSala") REFERENCES "Salas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
