"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Gasto, GastoDTO } from "../../types/dto/Gasto"
import { modificarGasto } from "../../api/gastoApi"

interface ModalEditarGastoProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  gasto: Gasto | null
  tiposDeGasto: string[]
}

export const ModalEditarGasto: React.FC<ModalEditarGastoProps> = ({
  isOpen,
  onClose,
  onSuccess,
  gasto,
  tiposDeGasto,
}) => {
  const [formData, setFormData] = useState<GastoDTO>({
    tipoGasto: "",
    descripcion: "",
    monto: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del gasto cuando se abre el modal
  useEffect(() => {
    if (gasto && isOpen) {
      setFormData({
        tipoGasto: gasto.tipoGasto,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
      })
    }
  }, [gasto, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gasto) return

    setIsLoading(true)
    setError(null)

    try {
      await modificarGasto(gasto.idGasto, formData)
      onSuccess()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  if (!isOpen || !gasto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Editar Gasto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Gasto</label>
            <select
              name="tipoGasto"
              value={formData.tipoGasto}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              {tiposDeGasto.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del gasto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
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
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
