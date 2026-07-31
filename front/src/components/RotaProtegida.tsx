import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
  apenasAdmin?: boolean;
};

export function RotaProtegida({ children, apenasAdmin = false }: Props) {
  const { token, usuario } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (apenasAdmin && !usuario?.isAdmin) {
    return <Navigate to="/salas" replace />;
  }

  return <>{children}</>;
}
