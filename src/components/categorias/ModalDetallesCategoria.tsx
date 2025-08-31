"use client"

import type React from "react"
import type { Categoria } from "../../types/dto/Categoria"

interface ModalDetallesCategoriaProps {
  isOpen: boolean
  onClose: () => void
  categoria: Categoria | null
}

export const ModalDetallesCategoria: React.FC<ModalDetallesCategoriaProps> = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalles de Categoría</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">ID</label>
            <p className="text-lg">{categoria.idCategoria}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre</label>
            <p className="text-lg">{categoria.nombre}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Color</label>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded border" style={{ backgroundColor: categoria.color }}></div>
              <span>{categoria.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Estado</label>
            <span
              className={`px-2 py-1 rounded text-sm ${
                categoria.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {categoria.estado ? "Activa" : "Inactiva"}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Categoría Padre</label>
            <p className="text-lg">{categoria.idCategoriaPadre || "Sin categoría padre"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Productos ({categoria.productos.length})</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
              {categoria.productos.length > 0 ? (
                categoria.productos.map((producto, index) => (
                  <div key={index} className="flex justify-between py-1 border-b last:border-b-0">
                    <span>{producto.nombre}</span>
                    <span className="font-medium">${producto.precio.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay productos en esta categoría</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
