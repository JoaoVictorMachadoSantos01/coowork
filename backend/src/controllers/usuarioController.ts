import type { Request, Response, NextFunction } from "express";
import * as usuarioService from "../services/usuarioServicer.js";

import { AppError } from "../utils/AppError.js";

// cria um novo user

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome, email, senha, cpf } = req.body;

    if (!nome || typeof nome !== "string") {
      throw new AppError("Nome é obrigatório.", 400, "NOME_OBRIGATORIO");
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new AppError("E-mail inválido.", 400, "EMAIL_INVALIDO");
    }

    if (!senha || typeof senha !== "string" || senha.length < 6) {
      throw new AppError("Senha deve ter pelo menos 6 caracteres.", 400, "SENHA_INVALIDA");
    }

    if (!cpf || typeof cpf !== "string") {
      throw new AppError("CPF é obrigatório.", 400, "CPF_OBRIGATORIO");
    }

    const novoUsuario = await usuarioService.create(req.body);

    return res.status(201).json(novoUsuario);
  } catch (error) {
    next(error);
  }
}

// lista all user - admin

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await usuarioService.getAll();
    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId!; // quando chamar /me ele pega o id do token e passa no service de getbyid que ja existia
    const usuarios = await usuarioService.getById(id);
    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

//lista os user pelo id
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const usuario = await usuarioService.getById(id);
    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}

// atualiza os dados de um user pelo id d
export async function update(req: Request, res: Response, next: NextFunction) {
  try {


    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    if (!req.isAdmin && req.userId !== id){

       throw new AppError("Acesso restrito a administradores", 403, "FORBIDDEN");
    }

    const usuarioAtualizado = await usuarioService.updateById(id, req.body);
    return res.json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function deleteId(req: Request,res: Response,next: NextFunction,) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }
    
    if (!req.isAdmin && req.userId !== id){

       throw new AppError("Acesso restrito a administradores", 403, "FORBIDDEN");
    }


    const userdeletado = await usuarioService.deleteUser(id);
    return res.json(userdeletado);
  } catch (error) {
    next(error);
  }
}
