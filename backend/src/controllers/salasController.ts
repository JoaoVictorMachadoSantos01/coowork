import type { Request, Response, NextFunction } from "express";
import * as salasService from "../services/salasService.js";
import type {FiltroSala} from "../services/salasService.js"
import { AppError } from "../utils/AppError.js";


export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome, preco, capacidade } = req.body;

    if (!nome || typeof nome !== "string") {
      throw new AppError("Nome é obrigatório.", 400, "NOME_OBRIGATORIO");
    }

    if (typeof preco !== "number" || Number.isNaN(preco)) {
      throw new AppError("Preço é obrigatório.", 400, "PRECO_OBRIGATORIO");
    }

    if (!Number.isInteger(capacidade)) {
      throw new AppError("Capacidade é obrigatória.", 400, "CAPACIDADE_OBRIGATORIA");
    }

    const novaSala = await salasService.create(req.body);

    return res.status(201).json(novaSala);
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const salas = await salasService.getAll(req.query as FiltroSala);
    return res.json(salas);
  } catch (error) {
    next(error);
  }
}

export async function getAllComDisponibilidade(req: Request, res: Response, next: NextFunction) {
  try {
    const { dia } = req.query;

    if (!dia || typeof dia !== "string") {
      throw new AppError("Data é obrigatória.", 400, "DIA_OBRIGATORIO");
    }

    const salas = await salasService.getAllComDisponibilidade(dia);
    return res.json(salas);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const sala = await salasService.getById(id);
    return res.json(sala);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const salaAtualizado = await salasService.updateById(id, req.body);
    return res.json(salaAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function deleteId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const saladeletada = await salasService.deleteSala(id);
    return res.json(saladeletada);
  } catch (error) {
    next(error);
  }
}
