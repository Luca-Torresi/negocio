"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ModificarCategoriaDTO, CategoriaArbol, Categoria } from "../../types/dto/Categoria"
import { generarOpcionesSelect } from "../../utils/categoriaUtils"

interface ModalEditarCategoriaProps {
  isOpen: boolean
  onClose: () => void
  onConfirmar: (id: number, data: ModificarCategoriaDTO) => void
  categoria: Categoria | null
  categorias: CategoriaArbol[]
}

export const ModalEditarCategoria: React.FC<ModalEditarCategoriaProps> = ({
  isOpen,
  onClose,
  onConfirmar,
  categoria,
  categorias,
}) => {
  const [formData, setFormData] = useState<ModificarCategoriaDTO>({
    nombre: "",
    color: "#3B82F6",
    idCategoriaPadre: null,
  })

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        color: categoria.color,
        idCategoriaPadre: categoria.idCategoriaPadre,
      })
    }
  }, [categoria])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoria) {
      onConfirmar(categoria.idCategoria, formData)
    }
  }

  const opcionesSelect = generarOpcionesSelect(categorias).filter((opcion) => opcion.value !== categoria?.idCategoria)

  if (!isOpen || !categoria) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría Padre</label>
            <select
              value={formData.idCategoriaPadre || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idCategoriaPadre: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin categoría padre</option>
              {opcionesSelect.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
