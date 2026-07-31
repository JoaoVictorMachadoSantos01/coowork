import { api } from "./axios";

export type Reserva = {
  id: number;
  diaDaReserva: string;
  turno: string;
  status: string;
  expireAt: string | null;
  sala: { nome: string; preco: number; capacidade: number };
};

export type NovaReservaData = {
  idDaSala: number;
  diaDaReserva: string;
  turno: string;
};

export function getAll() {
  return api.get<Reserva[]>("/reservas");
}

export function getById(id: number) {
  return api.get<Reserva>(`/reservas/${id}`);
}

export function create(data: NovaReservaData) {
  return api.post<Reserva>("/reservas", data);
}

export function confirmar(id: number) {
  return api.post<Reserva>(`/reservas/${id}/confirmar`);
}

export function deleteById(id: number) {
  return api.delete(`/reservas/${id}`);
}
