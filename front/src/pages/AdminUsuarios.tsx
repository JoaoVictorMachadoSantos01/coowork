import { useEffect, useState } from "react";
import * as usuariosService from "../api/usuariosService";
import type { Usuario } from "../api/usuariosService";
import "./AdminUsuarios.css";

export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  function buscarUsuarios() {
    usuariosService.getAll().then((resposta) => setUsuarios(resposta.data));
  }

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function excluir(id: number) {
    await usuariosService.deleteById(id);
    buscarUsuarios();
  }

  return (
    <div className="pagina adminUsuarios">
      <h1>Usuários cadastrados</h1>

      <div className="lista">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="card">
            <h2>
              {usuario.nome}
              {usuario.isAdmin && <span className="badge">admin</span>}
            </h2>
            <p>{usuario.email}</p>
            <p>CPF: {usuario.cpf}</p>

            {!usuario.isAdmin && (
              <button onClick={() => excluir(usuario.id)} className="botaoPerigo">
                Excluir
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
