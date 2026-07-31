import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { isAxiosError } from "axios";
import * as authService from "../api/authService";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

type FormData = {
  email: string;
  senha: string;
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [erroApi, setErroApi] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  function preencherLoginRapido(tipo: "admin" | "usuario") {
    setValue("email", tipo === "admin" ? "admin@coowork.com" : "usuario@coowork.com");
    setValue("senha", "senha123");
  }

  async function onSubmit(data: FormData) {
    setErroApi("");
    try {
      const resposta = await authService.login(data);
      login(resposta.data.usuario, resposta.data.token);
      navigate("/salas");
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setErroApi(msg || "Erro interno. Tente novamente.");
    }
  }

  return (
    <div className="pagina paginaAuth">
      <div className="authCard card">
        <h1>Entrar</h1>
        <p className="subtitulo">Acesse sua conta.</p>

        {erroApi && <div className="alerta">{erroApi}</div>}

        <div className="loginRapido">
          <span>Login rápido:</span>
          <button type="button" onClick={() => preencherLoginRapido("admin")}>
            Admin
          </button>
          <button type="button" onClick={() => preencherLoginRapido("usuario")}>
            Usuário
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" {...register("email", { required: "E-mail é obrigatório" })} />
            {errors.email && <span className="erro">{errors.email.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              {...register("senha", { required: "Senha é obrigatória" })}
            />
            {errors.senha && <span className="erro">{errors.senha.message}</span>}
          </div>

          <button type="submit" className="botao botaoLargo" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="rodape">
          Não tem conta? <Link to="/">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
