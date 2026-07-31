import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import * as usuariosService from "../api/usuariosService";
import { useAuth } from "../context/AuthContext";
import "./Perfil.css";

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export function Perfil() {
  const navigate = useNavigate();
  const { usuario, token, login, logout } = useAuth();
  const [erroApi, setErroApi] = useState("");
  const [sucesso, setSucesso] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  useEffect(() => {
    usuariosService.getMe().then((resposta) => {
      reset({
        nome: resposta.data.nome,
        email: resposta.data.email,
        cpf: resposta.data.cpf,
        senha: ""
      });
    });
  }, [reset]);

  async function onSubmit(data: FormData) {
    setErroApi("");
    setSucesso("");
    try {
      const resposta = await usuariosService.updateById(usuario!.id, data);
      login(resposta.data, token!);
      setSucesso("Dados atualizados com sucesso!");
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setErroApi(msg || "Erro interno. Tente novamente.");
    }
  }

  async function excluirConta() {
    setErroApi("");
    try {
      await usuariosService.deleteById(usuario!.id);
      logout();
      navigate("/");
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setErroApi(msg || "Erro ao excluir conta.");
    }
  }

  return (
    <div className="pagina perfil">
      <h1>Meu perfil</h1>

      <div className="card perfilCard">
      {erroApi && <div className="alerta">{erroApi}</div>}
      {sucesso && <div className="sucesso">{sucesso}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="campo">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" {...register("nome", { required: "Nome é obrigatório" })} />
          {errors.nome && <span className="erro">{errors.nome.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" {...register("email", { required: "E-mail é obrigatório" })} />
          {errors.email && <span className="erro">{errors.email.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input id="cpf" {...register("cpf", { required: "CPF é obrigatório" })} />
          {errors.cpf && <span className="erro">{errors.cpf.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="senha">Nova senha</label>
          <input id="senha" type="password" placeholder="Deixe em branco pra manter a atual" {...register("senha")} />
        </div>

        <button type="submit" className="botao" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <button onClick={excluirConta} className="botaoPerigo botaoLargo botaoPerfilExcluir">
        Excluir minha conta
      </button>
      </div>
    </div>
  );
}
