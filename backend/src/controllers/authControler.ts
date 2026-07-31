import type { Request, Response, NextFunction } from "express";
import * as authServicer from "../services/authServicer.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, senha } = req.body;
    const resultado = await authServicer.login(email, senha);
    return res.status(200).json(resultado);
    
  } catch (error) {
    next(error);
  }
}