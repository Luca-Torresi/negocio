import type React from "react"
import { PowerOff } from "lucide-react"

export const PaginaApagado: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <PowerOff className="h-16 w-16 text-gray-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Servidor Apagado</h1>
      <p className="text-gray-600 mt-2">
        La aplicación se ha cerrado correctamente. Ya puedes cerrar esta pestaña del navegador.
      </p>
    </div>
  )
}
