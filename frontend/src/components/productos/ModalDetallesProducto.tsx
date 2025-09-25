"use client"

import type React from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { useEscapeKey } from "../../hooks/useEscapeKey"

interface Props {
  isOpen: boolean
  producto: ProductoAbm | null
  onClose: () => void
}

export const ModalDetallesProducto: React.FC<Props> = ({ isOpen, producto, onClose }) => {
  useEscapeKey(onClose, isOpen);

  if (!isOpen || !producto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Detalles del Producto</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
              <p className="text-gray-900 font-medium">{producto.nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
              <span
                className={`inline-block px-2 py-1 text-xs rounded ${producto.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
              >
                {producto.estado ? "Activo" : "Inactivo"}
              </span>
            </div>
            {producto.codigoDeBarras && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Código de Barras</label>
                <p className="text-gray-900 font-medium">{producto.codigoDeBarras}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Costo</label>
              <p className="text-gray-900">{formatCurrency(producto.costo)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Precio</label>
              <p className="text-gray-900 font-semibold">{formatCurrency(producto.precio)}</p>
            </div>
          </div>

          {producto.porcentaje && producto.precioConDescuento && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Descuento</label>
                <p className="text-blue-600 font-medium">-{producto.porcentaje}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Precio con Descuento</label>
                <p className="text-green-600 font-semibold">{formatCurrency(producto.precioConDescuento)}</p>
              </div>
            </div>
          )}

          {producto.cantidadMinima && producto.nuevoPrecio && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad Mínima</label>
                <p className="text-blue-600 font-medium">{producto.cantidadMinima} unidades</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Precio por Cantidad</label>
                <p className="text-green-600 font-semibold">{formatCurrency(producto.nuevoPrecio)}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Stock Actual</label>
              <p
                className={`font-semibold ${producto.stock <= producto.stockMinimo ? "text-red-600" : "text-gray-900"}`}
              >
                {producto.stock}
                {producto.stock <= producto.stockMinimo && (
                  <span className="text-xs text-red-500 block">Stock bajo</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Stock Mínimo</label>
              <p className="text-gray-900">{producto.stockMinimo}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
              <p className="text-gray-900">{producto.categoria}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Marca</label>
              <p className="text-gray-900">{producto.marca}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Proveedor</label>
              <p className="text-gray-900">{producto.proveedor}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
