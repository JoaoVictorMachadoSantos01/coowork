import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { isAxiosError } from "axios";
import * as usuariosService from "../api/usuariosService";

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
};

export function Cadastro() {
  const navigate = useNavigate();
  const [erroApi, setErroApi] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const senha = watch("senha");

  async function onSubmit(data: FormData) {
    setErroApi("");
    try {
      await usuariosService.create({
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        senha: data.senha
      });
      navigate("/login");
    } catch (error) {
      const msg = isAxiosError(error) ? error.response?.data?.message : undefined;
      setErroApi(msg || "Erro interno. Tente novamente.");
    }
  }

  return (
    <div className="pagina paginaAuth">
      <div className="authCard card">
      <h1>Criar conta</h1>
      <p className="subtitulo">Preencha seus dados para se cadastrar.</p>

      {erroApi && <div className="alerta">{erroApi}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="campo">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" {...register("nome", { required: "Nome é obrigatório" })} />
          {errors.nome && <span className="erro">{errors.nome.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            {...register("email", {
              required: "E-mail é obrigatório",
              pattern: { value: /^\S+@\S+$/, message: "E-mail inválido" }
            })}
          />
          {errors.email && <span className="erro">{errors.email.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input id="cpf" {...register("cpf", { required: "CPF é obrigatório" })} />
          {errors.cpf && <span className="erro">{errors.cpf.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            {...register("senha", {
              required: "Senha é obrigatória",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
          />
          {errors.senha && <span className="erro">{errors.senha.message}</span>}
        </div>

        <div className="campo">
          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            {...register("confirmarSenha", {
              required: "Confirme a senha",
              validate: (valor) => valor === senha || "As senhas não coincidem"
            })}
          />
          {errors.confirmarSenha && <span className="erro">{errors.confirmarSenha.message}</span>}
        </div>

        <button type="submit" className="botao botaoLargo" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p className="rodape">
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
      </div>
    </div>
  );
}
