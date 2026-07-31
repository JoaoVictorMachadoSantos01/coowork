import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import { isAdmin } from "../middlewares/isAdmin.middlewares.js";
import { autenticar } from "../middlewares/auth.middlewares.js";

//define todas as rotas que vinherem do front com o /api/usuarios

const router = Router();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Usuários]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoUsuarioInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: E-mail ou CPF já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post("/", usuarioController.create); //cria os usuarios #public

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários (admin)
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Acesso restrito a administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/", autenticar, isAdmin, usuarioController.getAll); //busca todos os user # apenas adms logaddos

/**
 * @swagger
 * /usuarios/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Dados do usuário logado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.get("/me", autenticar, usuarioController.getMe); // pro user conseguir ver o proprio pewrfil , o id e passado pelo middlewares de autenicacao

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID (admin)
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get("/:id", autenticar, isAdmin, usuarioController.getById); // busca um user pelo id # apenas adms logaddos

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário (o próprio usuário ou um admin)
 *     tags: [Usuários]
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
 *             $ref: '#/components/schemas/AtualizarUsuarioInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       403:
 *         description: Acesso restrito a administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.put("/:id", autenticar, usuarioController.update); // atualiza dados de um user pelo id # apenas adms logaddos

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário (o próprio usuário ou um admin)
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído
 *       403:
 *         description: Acesso restrito a administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete("/:id", autenticar, usuarioController.deleteId); // deleta um user pelo id # usuario por lei tem o direito de deletar a propria conta ent ele so precisa estar logado

export default router;
