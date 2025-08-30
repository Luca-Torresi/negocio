"use client"

import type React from "react"
import { X } from "lucide-react"
import type { Compra } from "../../types/dto/Compra"
import { formatearFecha, formatearHora } from "../../utils/fechaUtils"

interface Props {
  isOpen: boolean
  onClose: () => void
  compra: Compra | null
}

export const ModalDetallesCompra: React.FC<Props> = ({ isOpen, onClose, compra }) => {
  if (!isOpen || !compra) return null

  const calcularSubtotal = (cantidad: number, costoUnitario: number) => {
    return cantidad * costoUnitario
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Detalles de Compra #{compra.idCompra}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Información General</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Compra:</span>
                  <span className="font-medium">{compra.idCompra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Proveedor:</span>
                  <span className="font-medium">{compra.proveedor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuario:</span>
                  <span className="font-medium">{compra.usuario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{formatearFecha(compra.fechaHora)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{formatearHora(compra.fechaHora)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Resumen Financiero</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad de Items:</span>
                  <span className="font-medium">{compra.detalles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de Productos:</span>
                  <span className="font-medium">
                    {compra.detalles.reduce((total, detalle) => total + detalle.cantidad, 0)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${compra.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Productos */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Productos Comprados</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Costo Unitario</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {compra.detalles.map((detalle, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{detalle.producto}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{detalle.cantidad}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${detalle.costoUnitario.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${calcularSubtotal(detalle.cantidad, detalle.costoUnitario).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-800 text-right">
                      Total General:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">${compra.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Botón de Cerrar */}
          <div className="flex justify-end pt-4">
            <button onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
