import { api } from "./axios";

export type Sala = {
  id: number;
  nome: string;
  preco: number;
  capacidade: number;
  descricao: string | null;
};

export type SalaComDisponibilidade = Sala & {
  disponibilidade: Record<string, boolean>; // { manha: true, tarde: false, noite: true }
};

export type SalaFormData = {
  nome: string;
  preco: number;
  capacidade: number;
  descricao: string;
};

export function getAll() {
  return api.get<Sala[]>("/salas");
}

export function getAllComDisponibilidade(dia: string) {
  return api.get<SalaComDisponibilidade[]>("/salas/disponibilidade", { params: { dia } });
}

export function create(data: SalaFormData) {
  return api.post<Sala>("/salas", data);
}

export function updateById(id: number, data: SalaFormData) {
  return api.put<Sala>(`/salas/${id}`, data);
}

export function deleteById(id: number) {
  return api.delete(`/salas/${id}`);
}
