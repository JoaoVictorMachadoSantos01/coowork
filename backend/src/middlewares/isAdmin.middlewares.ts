import type { Request , Response , NextFunction } from "express";

import { AppError } from "../utils/AppError.js";


export  function isAdmin(req: Request, res: Response, next: NextFunction){
    
    

    if (!req.isAdmin) {

        throw new AppError("Acesso restrito a administradores", 403, "FORBIDDEN");

    }


    next()
}