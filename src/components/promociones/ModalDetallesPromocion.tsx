"use client"

import type React from "react"
import { X } from "lucide-react"
import type { Promocion } from "../../types/dto/Promocion"
import { formatCurrency } from "../../utils/numberFormatUtils"

interface Props {
  isOpen: boolean
  onClose: () => void
  promocion: Promocion | null
}

export const ModalDetallesPromocion: React.FC<Props> = ({ isOpen, onClose, promocion }) => {
  if (!isOpen || !promocion) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Detalles de la Promoción</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <p className="text-gray-900">{promocion.nombre}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción:</label>
            <p className="text-gray-900">{promocion.descripcion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio:</label>
            <p className="text-gray-900">{formatCurrency(promocion.precio)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado:</label>
            <p className={`${promocion.estado ? "text-green-600" : "text-red-600"}`}>
              {promocion.estado ? "Activa" : "Inactiva"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos incluidos:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {promocion.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{detalle.producto}</td>
                    <td className="border border-gray-300 px-4 py-2">{detalle.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
