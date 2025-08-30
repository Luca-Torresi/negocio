"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Proveedor, ProveedorDTO } from "../../types/dto/Proveedor"

interface ModalEditarProveedorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: number, data: ProveedorDTO) => void
  proveedor: Proveedor | null
}

export const ModalEditarProveedor: React.FC<ModalEditarProveedorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  proveedor,
}) => {
  const [formData, setFormData] = useState<ProveedorDTO>({
    nombre: "",
    telefono: "",
    email: "",
  })

  useEffect(() => {
    if (proveedor) {
      setFormData({
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        email: proveedor.email,
      })
    }
  }, [proveedor])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (proveedor && formData.nombre.trim() && formData.telefono.trim() && formData.email.trim()) {
      onConfirm(proveedor.idProveedor, formData)
    }
  }

  if (!isOpen || !proveedor) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Editar Proveedor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
