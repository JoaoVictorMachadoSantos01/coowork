import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate("/login");
  }

  function linkAtivo({ isActive }: { isActive: boolean }) {
    return isActive ? "ativo" : "";
  }

  return (
    <header className="header">
      <NavLink to="/salas" className="marca">
        <span className="marcaPonto" />
        Coowork
      </NavLink>

      <nav>
        <NavLink to="/salas" className={linkAtivo}>Salas</NavLink>

        {usuario && <NavLink to="/minhas-reservas" className={linkAtivo}>Minhas reservas</NavLink>}
        {usuario && <NavLink to="/perfil" className={linkAtivo}>Perfil</NavLink>}
        {usuario?.isAdmin && <NavLink to="/admin/salas" className={linkAtivo}>Salas (admin)</NavLink>}
        {usuario?.isAdmin && <NavLink to="/admin/usuarios" className={linkAtivo}>Usuários (admin)</NavLink>}

        {usuario ? (
          <button onClick={sair} className="linkBotao">Sair</button>
        ) : (
          <NavLink to="/login" className={linkAtivo}>Entrar</NavLink>
        )}
      </nav>
    </header>
  );
}
