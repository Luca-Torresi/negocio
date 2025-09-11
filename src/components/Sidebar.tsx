"use client"

import type React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Package,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ReceiptText,
  ChartNoAxesCombined,
  Tag,
  ScrollText,
  ListPlus,
  CircleUserRound,
  LogOut,
} from "lucide-react"
import { useUsuarioStore } from "../store/usuarioStore"

interface ItemNavegacion {
  label: string
  path: string
  icon: React.ReactElement
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const usuario = useUsuarioStore((state) => state.usuario)
  const clearUsuario = useUsuarioStore((state) => state.clearUsuario)

  const handleLogout = () => {
    clearUsuario()
    navigate("/seleccionar-usuario")
  }

  const itemsNavegacion: ItemNavegacion[] = [
    { label: "Nueva Venta", path: "/ventas", icon: <ListPlus size={20} /> },
    { label: "Historial", path: "/historial", icon: <ScrollText size={20} /> },
    { label: "Categorías", path: "/categorias", icon: <Tag size={20} /> },
    { label: "Productos", path: "/productos", icon: <Package size={20} /> },
    { label: "Compras", path: "/compras", icon: <ShoppingCart size={20} /> },
    { label: "Proveedores", path: "/proveedores", icon: <Truck size={20} /> },
    { label: "Gastos", path: "/gastos", icon: <ReceiptText size={20} /> },
    { label: "Reportes", path: "/reportes", icon: <ChartNoAxesCombined size={20} /> },
    { label: "Promociones", path: "/promociones", icon: <ShoppingBag size={20} /> },
  ]

  return (
    <div className="h-screen w-64 bg-gray-800 text-gray-200 fixed left-0 top-0 flex flex-col">
      {/* Logo/Nombre de la aplicación */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-medium italic text-white">"Pañalera Pepa"</h1>
      </div>

      {/* User profile section */}
      {usuario && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <CircleUserRound size={32} className="text-gray-300" />
            <div>
              <p className="text-sm font-medium text-white">{usuario.nombre}</p>
              <p className="text-xs text-gray-400">Usuario activo</p>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {itemsNavegacion.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-700 hover:text-white ${
                    isActive ? "bg-gray-700 text-white border-r-2 border-blue-500" : "text-gray-300"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with logout button */}
      <div className="border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-base font-medium text-red-500 hover:underline decoration-2"
        >
          <LogOut size={20} className="mr-2" />
          Cerrar Sesión
        </button>
        <div className="p-4">
          <p className="text-xs text-gray-400 text-center">© 2024 Sistema de Gestión</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
