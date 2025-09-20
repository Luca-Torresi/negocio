"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import type { DescuentoDTO } from "../../types/dto/Descuento"
import { crearDescuento, modificarDescuento, eliminarDescuento } from "../../api/descuentoApi"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { useEscapeKey } from "../../hooks/useEscapeKey"
import { toast } from "react-toastify"

interface Props {
  isOpen: boolean
  producto: ProductoAbm | null
  onClose: () => void
  alConfirmar: () => void
}

export const ModalGestionarDescuento: React.FC<Props> = ({ isOpen, producto, onClose, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)
  const [porcentaje, setPorcentaje] = useState<number>(0)
  const [precioCalculado, setPrecioCalculado] = useState<number>(0)

  const tieneDescuento = producto?.idDescuento != null;

  useEffect(() => {
    if (isOpen && producto) {
      const porcentajeInicial = producto.porcentaje || 0
      setPorcentaje(porcentajeInicial)
      if (producto.precio) {
        const precioCalc = producto.precio * (1 - porcentajeInicial / 100)
        setPrecioCalculado(precioCalc)
      }
    }
  }, [isOpen, producto])

  const manejarCambioPorcentaje = (valor: number): void => {
    const valorValidado = Math.max(0, Math.min(100, valor));
    setPorcentaje(valorValidado)
    if (producto) {
      const precioCalc = producto.precio * (1 - valorValidado / 100)
      setPrecioCalculado(precioCalc)
    }
  }

  const manejarGuardar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      const descuentoData: DescuentoDTO = {
        idProducto: producto.idProducto,
        porcentaje: porcentaje,
      }
      if (tieneDescuento) {
        await modificarDescuento(producto.idDescuento!, descuentoData)
        toast.success("Descuento modificado con éxito")
      } else {
        await crearDescuento(descuentoData)
        toast.success("Descuento aplicado con éxito")
      }
      alConfirmar()
    } catch (error) {
      toast.error("No fue posible crear o modificar el descuento")
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (): Promise<void> => {
    if (!tieneDescuento || !producto?.idDescuento) {
      console.error("Intento de eliminar un descuento sin ID.")
      return;
    }

    setCargando(true)
    try {
      await eliminarDescuento(producto.idDescuento)
      toast.success("Descuento eliminado correctamente")
      alConfirmar()
    } catch (error) {
      toast.error("Error al eliminar descuento")
    } finally {
      setCargando(false)
    }
  }

  useEscapeKey(onClose, isOpen);

  if (!isOpen || !producto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestionar Descuento: {producto.nombre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(producto.precio)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Descuento (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={porcentaje}
              onChange={(e) => manejarCambioPorcentaje(Number.parseFloat(e.target.value) || 0)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vista Previa - Precio Final</label>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(precioCalculado)}</p>
            {porcentaje > 0 && (
              <p className="text-sm text-gray-600">Ahorro: {(formatCurrency(producto.precio - precioCalculado))}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>

            {tieneDescuento && (
              <button
                onClick={manejarEliminar}
                disabled={cargando}
                className="px-4 py-2 bg-tertiary text-white rounded-md hover:bg-tertiary-dark disabled:opacity-50"
              >
                {cargando ? "Eliminando..." : "Eliminar"}
              </button>
            )}

            <button
              onClick={manejarGuardar}
              disabled={cargando || porcentaje <= 0}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50"
            >
              {cargando
                ? tieneDescuento
                  ? "Actualizando..."
                  : "Creando..."
                : tieneDescuento
                  ? "Actualizar"
                  : "Crear Descuento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
