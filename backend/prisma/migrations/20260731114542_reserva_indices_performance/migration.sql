-- CreateIndex
CREATE INDEX "Reservas_status_expireAt_idx" ON "Reservas"("status", "expireAt");

-- CreateIndex
CREATE INDEX "Reservas_id_doUsuario_idx" ON "Reservas"("id_doUsuario");
