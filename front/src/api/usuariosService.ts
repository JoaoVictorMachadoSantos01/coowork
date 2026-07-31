import { api } from "./axios";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  isAdmin: boolean;
};

export type NovoUsuarioData = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export type AtualizarUsuarioData = {
  nome: string;
  email: string;
  cpf: string;
  senha?: string;
};

export function getAll() {
  return api.get<Usuario[]>("/usuarios");
}

export function getMe() {
  return api.get<Usuario>("/usuarios/me");
}

export function create(data: NovoUsuarioData) {
  return api.post<Usuario>("/usuarios", data);
}

export function updateById(id: number, data: AtualizarUsuarioData) {
  return api.put<Usuario>(`/usuarios/${id}`, data);
}

export function deleteById(id: number) {
  return api.delete(`/usuarios/${id}`);
}
