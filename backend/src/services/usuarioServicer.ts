import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";

export async function create(data: Prisma.UsuarioCreateInput) {
  const { nome, email, senha, cpf } = data;

  // validar de o email ja estar cadastrado

  const emailExiste = await prisma.usuario.findUnique({
    //busca no banco

    where: { email },
  });

  if (emailExiste) {
    throw new AppError("email ja cadastrado", 409, "EMAIL_ALREADY_EXISTS"); //http 409: conflict
  }

  //validar se o cpf ja estar cadastrado

  const cpfExiste = await prisma.usuario.findUnique({
    where: { cpf },
  });

  if (cpfExiste) {
    throw new AppError("cpf ja cadastrado", 409, "CPF_ALREADY_EXISTS"); //http 409: conflict
  }

  // CRIA O USUARIO CASO TENHA PASSADO PELOS IF ACIMA  // e_adm por padrao e false
  const senhaHash = await bcrypt.hash(senha, 10 ); // passa a senha num hash


  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash, cpf, isAdmin: false },
  });

  const { senha: _senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

export async function getAll() {
  // lista todos os usuarios vai ser usada pelo adm
  const usuarios = await prisma.usuario.findMany();
  return usuarios.map(({ senha: _senha, ...usuario }) => usuario);
}

export async function getById(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new AppError(
      "Usuário não encontrado.",
      404,
      "USUARIO_NAO_ENCONTRADO",
    );

    throw error;
  }

  const { senha: _senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

export async function updateById(id: number, data: Prisma.UsuarioCreateInput) {
  const { nome, email, senha, cpf } = data;
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new AppError(
      "Usuário não encontrado.",
      404,
      "USUARIO_NAO_ENCONTRADO",
    );

    throw error;
  }

  if (email && email !== usuario.email) {
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    if (emailExistente) {
      const error = new AppError(
        "E-mail já em uso por outro usuário.",
        409,
        "EMAIL_ALREADY_EXISTS",
      );

      throw error;
    }
  }

  if (cpf && cpf !== usuario.cpf) {
    const cpfExistente = await prisma.usuario.findUnique({
      where: { cpf },
    });
    if (cpfExistente) {
      const error = new AppError(
        "cpf já em uso por outro usuário.",
        409,
        "EMAIL_ALREADY_EXISTS",
      );

      throw error;
    }
  }

  // depois de todas as validações:
  const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;

  const usuarioAtualizado = await prisma.usuario.update({
    where: { id },
    data: { nome, email, senha: senhaHash, cpf },
  });

  const { senha: _senha, ...usuarioSemSenha } = usuarioAtualizado;
  return usuarioSemSenha;
}

export async function deleteUser(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new AppError("usuario nao existe.", 404, "USER_NOT_FOUND");

    throw error;
  }

  if (usuario.isAdmin) {
    const error = new AppError("nao pode deletar um adm.", 405, "IS_AMDIN");

    throw error;
  }

  await prisma.usuario.delete({
    where: { id },
  });

  return { success: true, message: "Usuário deletado com sucesso." };
}
