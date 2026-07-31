import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../api/usuariosService";

type AuthContextType = {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // le do localStorage na primeira renderização, pra não deslogar quando o usuário dá F5
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  function login(usuario: Usuario, token: string) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    setUsuario(usuario);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook fica junto do provider por simplicidade
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return contexto;
}
