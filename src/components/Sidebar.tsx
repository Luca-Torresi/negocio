import type React from "react"
import { NavLink } from "react-router-dom"
import { Package, ShoppingCart, ShoppingBag, Truck, ReceiptText, ChartNoAxesCombined, Tag, ScrollText, ListPlus } from "lucide-react"

interface ItemNavegacion {
  label: string
  path: string
  icon: React.ReactElement 
}

const Sidebar: React.FC = () => {
  const itemsNavegacion: ItemNavegacion[] = [
    { label: "Nueva Venta", path: "/ventas", icon: <ListPlus size={20} />},
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
        <h1 className="text-xl font-bold text-white">Sistema de Gestión</h1>
      </div>

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

      {/* Pie del sidebar */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">© 2024 Sistema de Gestión</p>
      </div>
    </div>
  )
}

export default Sidebar
