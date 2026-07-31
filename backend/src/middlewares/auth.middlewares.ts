import type { Request , Response , NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";




interface TokenPayload {
  userId: number;
  isAdmin: boolean;
}

export function autenticar(req: Request, res: Response, next: NextFunction){

const { authorization } = req.headers

if (!authorization){

    throw new AppError("Token nao fornecido" , 401 , "TOKEN_NOT_FOUND")
}




    const token = authorization.split(" ")[1] //separa o meu token 

    if (!token){
        throw new AppError("Token nao fornecido" , 401 , "TOKEN_NOT_FOUND")
    }

    
try {
   const { userId , isAdmin } = jwt.verify(token , process.env.JWT_SECRET!) as TokenPayload
    
    req.userId = userId
    req.isAdmin = isAdmin

    next()
} catch (error) {
    throw new AppError("Token invalido" , 401 , "TOKEN_INVALID")
}
    

}