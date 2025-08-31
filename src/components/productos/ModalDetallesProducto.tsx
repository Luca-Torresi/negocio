"use client"

import type React from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import { formatCurrency } from "../../utils/numberFormatUtils"

interface Props {
  estaAbierto: boolean
  producto: ProductoAbm | null
  alCerrar: () => void
}

export const ModalDetallesProducto: React.FC<Props> = ({ estaAbierto, producto, alCerrar }) => {
  if (!estaAbierto || !producto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Detalles del Producto</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <p className="text-gray-900">{producto.idProducto}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  producto.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {producto.estado ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <p className="text-gray-900">{producto.nombre}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
              <p className="text-gray-900">{formatCurrency(producto.precio)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
              <p className="text-gray-900">{formatCurrency(producto.costo)}</p>
            </div>
          </div>

          {producto.porcentaje && producto.precioConDescuento && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuento</label>
                <p className="text-green-600 font-semibold">{producto.porcentaje}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio con Descuento</label>
                <p className="text-green-600 font-semibold">${producto.precioConDescuento.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <p className="text-gray-900">{producto.stock}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Suma</label>
              <p className="text-gray-900">{producto.stockSuma}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
              <p className="text-gray-900">{producto.stockMinimo}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <p className="text-gray-900">{producto.categoria}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <p className="text-gray-900">{producto.marca}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <p className="text-gray-900">{producto.proveedor}</p>
            </div>
          </div> 
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={alCerrar} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
