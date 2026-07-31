import type { Request , Response, NextFunction } from "express";
import * as reservaService from "../services/reservaServicer.js"
import { AppError } from "../utils/AppError.js";
import prisma from "../lib/prisma.js";

export async function create(req: Request , res : Response , next : NextFunction) {
    
try{
    const novaReserva = await reservaService.create(req.body, req.userId!)

    return res.status(201).json(novaReserva)
}

catch(error){
    next(error)
}
    

}


export async function getAll(req: Request , res : Response , next : NextFunction) {
    
try{
    const todasReservas = await reservaService.getAll(req.userId!, req.isAdmin!)

    return res.json(todasReservas)
}

catch(error){
    next(error)
}
    


}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const reserva = await reservaService.getById(id, req.userId!, req.isAdmin!);
    return res.json(reserva);
  } catch (error) {
    next(error);
  }
}


export async function confirmar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const reserva = await reservaService.confirmar(id, req.userId!, req.isAdmin!);
    return res.json(reserva);
  } catch (error) {
    next(error);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new AppError("ID inválido.", 400, "ID_INVALIDO");
    }

    const reserva = await reservaService.cancelar(id, req.userId!, req.isAdmin!);
    return res.json(reserva);
  } catch (error) {
    next(error);
  }
}