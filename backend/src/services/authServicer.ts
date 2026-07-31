import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function login(email: string, senha:string) {
    

    const usuario = await prisma.usuario.findUnique({where : {email}})

    if (!usuario) {

        throw new AppError("Credenciais invalidas" , 401 , "INVALID_CREDENTIALS")
    }

     const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

     if (!senhaCorreta) {
    throw new AppError("Credenciais inválidas", 401, "INVALID_CREDENTIALS");
  }


  const token = jwt.sign(

    {userId : usuario.id, isAdmin: usuario.isAdmin} ,
    process.env.JWT_SECRET!,
    {expiresIn : "7d" }
  )


  return{
    token,
    usuario : {
        id : usuario.id,
        nome : usuario.nome,
        cpf : usuario.cpf,
        email : usuario.email,
        isAdmin: usuario.isAdmin
    }
  }

  
}

   