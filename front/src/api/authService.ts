import { api } from "./axios";
import type { Usuario } from "./usuariosService";

export type LoginData = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  usuario: Usuario;
  token: string;
};

export function login(data: LoginData) {
  return api.post<LoginResponse>("/auth/login", data);
}
