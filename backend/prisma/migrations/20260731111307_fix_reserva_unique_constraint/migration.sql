-- DropIndex
DROP INDEX "Reservas_id_daSala_diaDaReserva_turno_key";

-- CreateIndex
CREATE INDEX "Reservas_id_daSala_diaDaReserva_turno_idx" ON "Reservas"("id_daSala", "diaDaReserva", "turno");

-- Unicidade condicional: só reservas pendente/confirmada bloqueiam o slot.
-- Reservas canceladas/expiradas não contam, então não podem participar de uma
-- constraint única incondicional (senão cancelar e reservar de novo o mesmo
-- slot falha com violação de unique constraint).
CREATE UNIQUE INDEX "Reservas_slot_ativo_key" ON "Reservas"("id_daSala", "diaDaReserva", "turno")
WHERE "status" IN ('pendente', 'confirmada');
