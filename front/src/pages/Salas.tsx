import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import * as salasService from "../api/salasService";
import * as reservasService from "../api/reservasService";
import type { SalaComDisponibilidade } from "../api/salasService";
import { useAuth } from "../context/AuthContext";
import "./Salas.css";

const TURNOS = [
  { valor: "manha", label: "Manhã", horario: "08h – 12h" },
  { valor: "tarde", label: "Tarde", horario: "13h – 18h" },
  { valor: "noite", label: "Noite", horario: "19h – 22h" }
];

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export function Salas() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [dia, setDia] = useState(hoje());
  const [turnoFiltro, setTurnoFiltro] = useState("todos");
  const [salas, setSalas] = useState<SalaComDisponibilidade[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [selecao, setSelecao] = useState<{ salaId: number; turno: string } | null>(null);

  function buscar() {
    salasService.getAllComDisponibilidade(dia).then((resposta) => {
        setSalas(resposta.data);
        setMensagem("");
      })
      .catch((error) => {
        const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
        setMensagem(msg || "Erro ao buscar salas.");
      });
  }

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só busca de novo quando clicar em "Buscar"
  }, []);

  function selecionarTurno(idDaSala: number, turno: string) {
    setMensagem("");
    // clicar de novo no mesmo turno desmarca a seleção
    setSelecao((atual) =>
      atual?.salaId === idDaSala && atual?.turno === turno ? null : { salaId: idDaSala, turno }
    );
  }

  async function irParaPagamento(idDaSala: number, turno: string) {
    setMensagem("");
    try {
      const resposta = await reservasService.create({ idDaSala, diaDaReserva: dia, turno });
      navigate(`/pagamento/${resposta.data.id}`);
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setMensagem(msg || "Erro ao reservar. Tente novamente.");
      setSelecao(null);
      buscar();
    }
  }

  const turnosVisiveis = turnoFiltro === "todos" ? TURNOS : TURNOS.filter((t) => t.valor === turnoFiltro);

  return (
    <div className="pagina salas">
      <h1>Salas disponíveis</h1>

      <div className="filtros">
        <div className="campoFiltro">
          <label>Data</label>
          <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
        </div>

        <div className="campoFiltro">
          <label>Turno</label>
          <div className="toggleGroup">
            <button
              className={turnoFiltro === "todos" ? "ativo" : ""}
              onClick={() => setTurnoFiltro("todos")}
            >
              Todos
            </button>
            {TURNOS.map((t) => (
              <button
                key={t.valor}
                className={turnoFiltro === t.valor ? "ativo" : ""}
                onClick={() => setTurnoFiltro(t.valor)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button className="botaoBuscar" onClick={buscar}>Buscar</button>
      </div>

      {mensagem && <div className="alerta">{mensagem}</div>}
      {!usuario && <p className="aviso">Entre na sua conta pra poder reservar.</p>}

      <div className="lista">
        {salas.map((sala) => (
          <div key={sala.id} className="card">
            <div className="cardTopo">
              <h2>{sala.nome}</h2>
              <span className="preco">
                {formatoPreco.format(sala.preco)}
                <br />
                <small>por turno</small>
              </span>
            </div>

            <p className="capacidade">👤 até {sala.capacidade} pessoas</p>
            {sala.descricao && <p className="descricao">{sala.descricao}</p>}

            <div className="slots">
              {turnosVisiveis.map((t) => {
                const livre = sala.disponibilidade[t.valor];
                const podeReservar = livre && usuario;
                const selecionado = selecao?.salaId === sala.id && selecao?.turno === t.valor;

                return (
                  <button
                    key={t.valor}
                    className={`slot ${livre ? "slotLivre" : "slotOcupado"} ${selecionado ? "slotSelecionado" : ""}`}
                    disabled={!podeReservar}
                    onClick={() => selecionarTurno(sala.id, t.valor)}
                  >
                    <strong>{t.label}</strong>
                    <span>{t.horario}</span>
                    <span>{livre ? "LIVRE" : "OCUPADA"}</span>
                  </button>
                );
              })}
            </div>

            {selecao?.salaId === sala.id && (
              <div className="rodapeReserva">
                <span>
                  {TURNOS.find((t) => t.valor === selecao.turno)?.label} · {formatoPreco.format(sala.preco)}
                </span>
                <button className="botaoIrPagamento" onClick={() => irParaPagamento(sala.id, selecao.turno)}>
                  Ir para pagamento
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
