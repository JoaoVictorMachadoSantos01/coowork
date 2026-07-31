import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import * as reservasService from "../api/reservasService";
import type { Reserva } from "../api/reservasService";
import "./PagamentoReserva.css";

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarTempo(segundos: number) {
  const minutos = Math.floor(segundos / 60).toString().padStart(2, "0");
  const restoSegundos = Math.floor(segundos % 60).toString().padStart(2, "0");
  return `${minutos}:${restoSegundos}`;
}

export function PagamentoReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [erro, setErro] = useState("");
  const [segundosRestantes, setSegundosRestantes] = useState<number | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    reservasService
      .getById(Number(id))
      .then((resposta) => setReserva(resposta.data))
      .catch((error) => {
        const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
        setErro(msg || "Não foi possível carregar essa reserva.");
      });
  }, [id]);

  // conta a partir do expireAt que o backend manda — o backend é quem decide
  // de verdade se expirou (expirarPendentes), isso aqui é só o relógio na tela.
  useEffect(() => {
    if (!reserva?.expireAt || reserva.status !== "pendente") return;

    const expiraEm = new Date(reserva.expireAt).getTime();

    function atualizar() {
      setSegundosRestantes(Math.max(0, Math.round((expiraEm - Date.now()) / 1000)));
    }

    atualizar();
    const intervalo = setInterval(atualizar, 1000);
    return () => clearInterval(intervalo);
  }, [reserva]);

  // quando o relógio zera, busca a reserva de novo — o backend já vai ter
  // marcado como "cancelada" e a tela troca pra mensagem de expirada
  useEffect(() => {
    if (segundosRestantes !== 0) return;
    reservasService.getById(Number(id)).then((resposta) => setReserva(resposta.data));
  }, [segundosRestantes, id]);

  async function confirmarPagamento(event: FormEvent) {
    event.preventDefault();
    setConfirmando(true);
    setErro("");
    try {
      await reservasService.confirmar(Number(id));
      navigate("/minhas-reservas");
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setErro(msg || "Não foi possível confirmar o pagamento.");
      setConfirmando(false);
    }
  }

  async function cancelar() {
    await reservasService.deleteById(Number(id));
    navigate("/salas");
  }

  if (erro && !reserva) {
    return (
      <div className="pagina pagamento">
        <div className="alerta">{erro}</div>
        <Link to="/salas">Voltar pra salas</Link>
      </div>
    );
  }

  if (!reserva) {
    return <div className="pagina pagamento">Carregando...</div>;
  }

  if (reserva.status === "confirmada") {
    return (
      <div className="pagina pagamento">
        <p>Essa reserva já foi confirmada.</p>
        <Link to="/minhas-reservas">Ver minhas reservas</Link>
      </div>
    );
  }

  if (reserva.status === "cancelada") {
    return (
      <div className="pagina pagamento">
        <p>O tempo para pagamento acabou e essa reserva foi cancelada. A sala está livre de novo.</p>
        <Link to="/salas">Escolher outro horário</Link>
      </div>
    );
  }

  const tempoEsgotado = segundosRestantes === 0;
  const tempoFormatado = segundosRestantes !== null ? formatarTempo(segundosRestantes) : "--:--";

  return (
    <div className="pagina pagamento">
      <div className="topoPagamento">
        <span className="migalha">CoWork / Pagamento</span>
        <button type="button" className="linkCancelar" onClick={cancelar}>
          ✕ Cancelar
        </button>
      </div>

      <div className="barraTempo">
        <span>⏱ Conclua o pagamento antes que o tempo expire</span>
        <strong>{tempoFormatado}</strong>
      </div>

      {erro && <div className="alerta">{erro}</div>}

      <div className="conteudoPagamento">
        <form className="formCartao card" onSubmit={confirmarPagamento}>
          <h2>Dados do cartão</h2>

          <div className="campo">
            <label>Número do cartão</label>
            <input placeholder="0000 0000 0000 0000" required disabled={tempoEsgotado} />
          </div>

          <div className="campo">
            <label>Nome no cartão</label>
            <input placeholder="Como aparece no cartão" required disabled={tempoEsgotado} />
          </div>

          <div className="linha2">
            <div className="campo">
              <label>Validade</label>
              <input placeholder="MM/AA" required disabled={tempoEsgotado} />
            </div>
            <div className="campo">
              <label>CVV</label>
              <input placeholder="000" required disabled={tempoEsgotado} />
            </div>
          </div>

          <button type="submit" className="botaoConfirmar" disabled={confirmando || tempoEsgotado}>
            {tempoEsgotado
              ? "Tempo esgotado"
              : confirmando
              ? "Confirmando..."
              : `Confirmar pagamento — ${formatoPreco.format(reserva.sala.preco)}`}
          </button>

          <p className="avisoDemo">🛡 Ambiente de demonstração — nenhum dado é processado</p>
        </form>

        <div className="resumo card">
          <h3>RESUMO</h3>

          <div className="resumoSala">
            <strong>{reserva.sala.nome}</strong>
            <span>até {reserva.sala.capacidade} pessoas</span>
          </div>

          <div className="resumoLinha">
            <span>Data</span>
            <strong>{new Date(reserva.diaDaReserva).toLocaleDateString("pt-BR")}</strong>
          </div>

          <div className="resumoLinha">
            <span>Turno</span>
            <strong>{capitalizar(reserva.turno)}</strong>
          </div>

          <div className="resumoLinha total">
            <span>Total</span>
            <strong>{formatoPreco.format(reserva.sala.preco)}</strong>
          </div>

          <div className="avisoReserva">
            <strong>⏳ Reserva temporária</strong>
            <p>Sua reserva expira em {tempoFormatado}. Conclua o pagamento para garantir o espaço.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
