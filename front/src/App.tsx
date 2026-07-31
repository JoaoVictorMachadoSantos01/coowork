import { Routes, Route } from 'react-router-dom'
import { Cadastro } from './pages/Cadastro'
import { Login } from './pages/Login'
import { Salas } from './pages/Salas'
import { MinhasReservas } from './pages/MinhasReservas'
import { PagamentoReserva } from './pages/PagamentoReserva'
import { AdminSalas } from './pages/AdminSalas'
import { Perfil } from './pages/Perfil'
import { AdminUsuarios } from './pages/AdminUsuarios'
import { Header } from './components/Header'
import { RotaProtegida } from './components/RotaProtegida'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/salas" element={<Salas />} />
          <Route
            path="/minhas-reservas"
            element={
              <RotaProtegida>
                <MinhasReservas />
              </RotaProtegida>
            }
          />
          <Route
            path="/pagamento/:id"
            element={
              <RotaProtegida>
                <PagamentoReserva />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/salas"
            element={
              <RotaProtegida apenasAdmin>
                <AdminSalas />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <RotaProtegida apenasAdmin>
                <AdminUsuarios />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}

export default App
