-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "e_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sala" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "preco_locacao" DOUBLE PRECISION NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "diaDaReserva" TIMESTAMP(3) NOT NULL,
    "turno" TEXT NOT NULL,
    "data_de_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_doUsuario" INTEGER NOT NULL,
    "id_daSala" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Sala_nome_key" ON "Sala"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_id_daSala_diaDaReserva_turno_key" ON "reservas"("id_daSala", "diaDaReserva", "turno");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_doUsuario_fkey" FOREIGN KEY ("id_doUsuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_daSala_fkey" FOREIGN KEY ("id_daSala") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
