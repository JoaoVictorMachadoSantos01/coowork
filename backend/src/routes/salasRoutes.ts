import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middlewares.js";
import { autenticar } from "../middlewares/auth.middlewares.js";
import * as salasController from "../controllers/salasController.js";

const router = Router();

// localhost:3000/api/salas

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Lista todas as salas
 *     tags: [Salas]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: dia
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *           enum: [manha, tarde, noite]
 *     responses:
 *       200:
 *         description: Lista de salas (filtrada por dia/turno livres, se informados)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sala'
 */
router.get("/", salasController.getAll); // público — cliente precisa ver salas

/**
 * @swagger
 * /salas/disponibilidade:
 *   get:
 *     summary: Lista todas as salas com a disponibilidade dos 3 turnos num dia
 *     tags: [Salas]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: dia
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Salas com disponibilidade por turno
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalaComDisponibilidade'
 *       400:
 *         description: Data não informada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/disponibilidade", salasController.getAllComDisponibilidade); // público — precisa vir antes de /:id

/**
 * @swagger
 * /salas/{id}:
 *   get:
 *     summary: Busca uma sala pelo ID
 *     tags: [Salas]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sala encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/:id", salasController.getById); // público

/**
 * @swagger
 * /salas:
 *   post:
 *     summary: Cria uma nova sala (admin)
 *     tags: [Salas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaInput'
 *     responses:
 *       201:
 *         description: Sala criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 *       409:
 *         description: Já existe uma sala com esse nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/", autenticar, isAdmin, salasController.create);

/**
 * @swagger
 * /salas/{id}:
 *   put:
 *     summary: Atualiza uma sala (admin)
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaInput'
 *     responses:
 *       200:
 *         description: Sala atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sala'
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.put("/:id", autenticar, isAdmin, salasController.update);

/**
 * @swagger
 * /salas/{id}:
 *   delete:
 *     summary: Exclui uma sala (admin)
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sala excluída
 *       404:
 *         description: Sala não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete("/:id", autenticar, isAdmin, salasController.deleteId);

export default router;
