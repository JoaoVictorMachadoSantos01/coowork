import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as salasService from "../api/salasService";
import type { Sala, SalaFormData } from "../api/salasService";
import "./AdminSalas.css";

type FormData = SalaFormData;

export function AdminSalas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  useEffect(() => {
    buscarSalas();
  }, []);

  function buscarSalas() {
    salasService.getAll().then((resposta) => setSalas(resposta.data));
  }

  async function onSubmit(data: FormData) {
    if (idEmEdicao) {
      await salasService.updateById(idEmEdicao, data);
    } else {
      await salasService.create(data);
    }

    cancelarEdicao();
    buscarSalas();
  }

  function editar(sala: Sala) {
    setIdEmEdicao(sala.id);
    reset({
      nome: sala.nome,
      preco: sala.preco,
      capacidade: sala.capacidade,
      descricao: sala.descricao ?? ""
    });
  }

  function cancelarEdicao() {
    setIdEmEdicao(null);
    reset({ nome: "", preco: 0, capacidade: 0, descricao: "" });
  }

  async function excluir(id: number) {
    await salasService.deleteById(id);
    buscarSalas();
  }

  return (
    <div className="pagina adminSalas">
      <h1>Gerenciar salas</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="formSala card">
        <h2>{idEmEdicao ? "Editar sala" : "Nova sala"}</h2>

        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" {...register("nome", { required: "Nome é obrigatório" })} />
          {errors.nome && <span className="erro">{errors.nome.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            {...register("preco", { required: "Preço é obrigatório", valueAsNumber: true })}
          />
          {errors.preco && <span className="erro">{errors.preco.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="capacidade">Capacidade</label>
          <input
            id="capacidade"
            type="number"
            {...register("capacidade", { required: "Capacidade é obrigatória", valueAsNumber: true })}
          />
          {errors.capacidade && <span className="erro">{errors.capacidade.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <input id="descricao" {...register("descricao")} />
        </div>

        <div className="acoes">
          <button type="submit" className="botao" disabled={isSubmitting}>
            {idEmEdicao ? "Salvar alterações" : "Criar sala"}
          </button>

          {idEmEdicao && (
            <button type="button" className="botaoSecundario" onClick={cancelarEdicao}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="lista">
        {salas.map((sala) => (
          <div key={sala.id} className="card">
            <h2>{sala.nome}</h2>
            <p>R$ {sala.preco} — {sala.capacidade} pessoas</p>
            <div className="acoes">
              <button onClick={() => editar(sala)} className="botaoSecundario">Editar</button>
              <button onClick={() => excluir(sala.id)} className="botaoPerigo">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
