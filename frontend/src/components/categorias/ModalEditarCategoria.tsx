"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ModificarCategoriaDTO, Categoria, CategoriaArbol } from "../../types/dto/Categoria"
import { useCategoriaStore } from "../../store/categoriaStore"
import { SelectJerarquicoCategorias } from "./SelectJerarquicoCategorias"
import { useEscapeKey } from "../../hooks/useEscapeKey"

interface ModalEditarCategoriaProps {
  isOpen: boolean
  onClose: () => void
  onConfirmar: (id: number, data: ModificarCategoriaDTO) => void
  categoria: Categoria | null
}

export const ModalEditarCategoria: React.FC<ModalEditarCategoriaProps> = ({
  isOpen,
  onClose,
  onConfirmar,
  categoria,
}) => {
  const { categoriasArbol } = useCategoriaStore()

  const [formData, setFormData] = useState<ModificarCategoriaDTO>({
    nombre: "",
    descripcion: "",
    idCategoriaPadre: null,
  })

  // useEffect para rellenar el formulario cuando se abre el modal con una categoría
  useEffect(() => {
    if (categoria && isOpen) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        idCategoriaPadre: categoria.idCategoriaPadre,
      })
    }
  }, [categoria, isOpen])  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoria) {
      onConfirmar(categoria.idCategoria, formData)
    }
  }

  // Lógica para filtrar la categoría actual y sus descendientes de las opciones de "Categoría Padre"
  const filtrarJerarquia = (nodos: CategoriaArbol[], idAExcluir: number): CategoriaArbol[] => {
    return nodos
      .filter(nodo => nodo.idCategoria !== idAExcluir)
      .map(nodo => ({
        ...nodo,
        hijos: filtrarJerarquia(nodo.hijos, idAExcluir),
      }));
  };

  const categoriasParaSelect = categoria ? filtrarJerarquia(categoriasArbol, categoria.idCategoria) : categoriasArbol;

  useEscapeKey(onClose, isOpen);

  if (!isOpen || !categoria) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Categoría: {categoria.nombre}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría Padre</label>
            <SelectJerarquicoCategorias
              categorias={categoriasParaSelect}
              selectedValue={formData.idCategoriaPadre}
              onSelect={(id) => setFormData({ ...formData, idCategoriaPadre: id })}
              placeholder="Sin categoría padre"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
