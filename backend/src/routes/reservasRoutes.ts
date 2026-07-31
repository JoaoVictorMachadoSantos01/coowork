import { Router } from "express";
import { autenticar } from "../middlewares/auth.middlewares.js";
import * as reservaController from "../controllers/reservaController.js";

const router = Router();

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma reserva pendente (expira em 5 minutos se não for confirmada)
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaReservaInput'
 *     responses:
 *       201:
 *         description: Reserva criada com status "pendente"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: Sala já reservada nesse turno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/", autenticar, reservaController.create);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista as reservas do usuário logado (ou todas, se admin)
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
router.get("/", autenticar, reservaController.getAll);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Busca uma reserva pelo ID (dono da reserva ou admin)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Reserva não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/:id", autenticar, reservaController.getById);

/**
 * @swagger
 * /reservas/{id}/confirmar:
 *   post:
 *     summary: Confirma o pagamento de uma reserva pendente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva confirmada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       409:
 *         description: Reserva não está mais pendente (expirou ou já foi cancelada)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/:id/confirmar", autenticar, reservaController.confirmar);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Cancela uma reserva (soft delete — a sala volta a ficar livre)
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       409:
 *         description: Reserva já estava cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete("/:id", autenticar, reservaController.cancelar);

export default router;
