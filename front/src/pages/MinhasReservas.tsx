import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import * as reservasService from "../api/reservasService";
import type { Reserva } from "../api/reservasService";
import "./MinhasReservas.css";

const STATUS_INFO: Record<string, { label: string; classe: string }> = {
  pendente: { label: "Aguardando pagamento", classe: "statusPendente" },
  confirmada: { label: "Confirmada", classe: "statusConfirmada" },
  cancelada: { label: "Cancelada", classe: "statusCancelada" }
};

export function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [erroApi, setErroApi] = useState("");

  function buscarReservas() {
    reservasService
      .getAll()
      .then((resposta) => setReservas(resposta.data))
      .catch((error) => {
        const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
        setErroApi(msg || "Erro ao buscar reservas.");
      });
  }

  useEffect(() => {
    buscarReservas();
  }, []);

  async function cancelar(id: number) {
    await reservasService.deleteById(id);
    buscarReservas();
  }

  return (
    <div className="pagina reservas">
      <h1>Minhas reservas</h1>

      {erroApi && <div className="alerta">{erroApi}</div>}

      {!erroApi && reservas.length === 0 && <p>Você ainda não tem reservas.</p>}

      <div className="lista">
        {reservas.map((reserva) => {
          const statusInfo = STATUS_INFO[reserva.status] ?? { label: reserva.status, classe: "" };

          return (
          <div key={reserva.id} className="card">
            <h2>{reserva.sala.nome}</h2>
            <p>Dia: {new Date(reserva.diaDaReserva).toLocaleDateString()}</p>
            <p>Turno: {reserva.turno}</p>
            <span className={`statusBadge ${statusInfo.classe}`}>{statusInfo.label}</span>

            <div className="acoes">
              {reserva.status === "pendente" && (
                <Link to={`/pagamento/${reserva.id}`} className="botaoPagar">
                  Pagar
                </Link>
              )}

              {reserva.status !== "cancelada" && (
                <button onClick={() => cancelar(reserva.id)} className="botaoPerigo">
                  Cancelar
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
