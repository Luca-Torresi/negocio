// src/App.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useUsuarioStore } from './store/usuarioStore';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const usuario = useUsuarioStore((state) => state.usuario);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/seleccionar-usuario');
    }
  }, [usuario, navigate]);

  // Si hay un usuario, no renderiza nada hasta que el useEffect decida.
  // Esto previene que se muestre brevemente contenido protegido.
  if (!usuario) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto ml-64">
        <Outlet />
      </main>

      <ToastContainer
        position="bottom-right"
        theme='colored'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;