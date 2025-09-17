import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import PaginaCategorias from './pages/PaginaCategorias.tsx';
import PaginaGastos from './pages/PaginaGastos.tsx';
import PaginaProveedores from './pages/PaginaProveedores.tsx';
import { PaginaProductos } from './pages/PaginaProductos.tsx';
import PaginaCompras from './pages/PaginaCompras.tsx';
import { PaginaPromociones } from './pages/PaginaPromociones.tsx';
import PaginaVentas from './pages/PaginaVentas.tsx';
import PaginaHistorial from './pages/PaginaHistorial.tsx';
import PaginaEstadisticas from './pages/PaginaEstadisticas.tsx';
import PaginaInicioSesion from './pages/PaginaInicioSesion.tsx';
import { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';

registerLocale('es', es);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/ventas" replace /> 
      },
      {
        path: 'categorias',
        element: <PaginaCategorias />,
      },
      {
        path: 'gastos',
        element: <PaginaGastos />,
      },
      {
        path: 'proveedores',
        element: <PaginaProveedores />,
      },
      {
        path: 'productos',
        element: <PaginaProductos />,
      },
      {
        path: 'compras',
        element: <PaginaCompras />,
      },
      {
        path: 'promociones',
        element: <PaginaPromociones />,
      },
      {
        path: 'ventas',
        element: <PaginaVentas />,
      },
      {
        path: 'historial',
        element: <PaginaHistorial />,
      },
      {
        path: 'estadisticas',
        element: <PaginaEstadisticas />,
      },
    ],
  },
  {
    path: '/seleccionar-usuario',
    element: <PaginaInicioSesion />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);