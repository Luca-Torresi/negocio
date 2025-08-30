"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import type { DescuentoDTO } from "../../types/dto/Descuento"
import { crearOModificarDescuento, eliminarDescuento } from "../../api/descuentoApi"

interface Props {
  estaAbierto: boolean
  producto: ProductoAbm | null
  alCerrar: () => void
  alConfirmar: () => void
}

export const ModalGestionarDescuento: React.FC<Props> = ({ estaAbierto, producto, alCerrar, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)
  const [porcentaje, setPorcentaje] = useState<number>(0)
  const [precioCalculado, setPrecioCalculado] = useState<number>(0)

  useEffect(() => {
    if (estaAbierto && producto) {
      const porcentajeInicial = producto.porcentaje || 0
      setPorcentaje(porcentajeInicial)
      calcularPrecio(porcentajeInicial, producto.precio)
    }
  }, [estaAbierto, producto])

  const calcularPrecio = (porcentajeDescuento: number, precioOriginal: number): void => {
    const precio = precioOriginal * (1 - porcentajeDescuento / 100)
    setPrecioCalculado(precio)
  }

  const manejarCambioPorcentaje = (valor: number): void => {
    setPorcentaje(valor)
    if (producto) {
      calcularPrecio(valor, producto.precio)
    }
  }

  const manejarCrearOModificar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      const descuentoData: DescuentoDTO = {
        idProducto: producto.idProducto,
        porcentaje: porcentaje,
      }
      await crearOModificarDescuento(descuentoData)
      alConfirmar()
    } catch (error) {
      console.error("Error al gestionar descuento:", error)
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      await eliminarDescuento(producto.idProducto)
      alConfirmar()
    } catch (error) {
      console.error("Error al eliminar descuento:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!estaAbierto || !producto) return null

  const tieneDescuento = producto.porcentaje !== null && producto.porcentaje > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestionar descuento para: {producto.nombre}</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <p className="text-lg font-semibold text-gray-900">${producto.precio.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Descuento (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={porcentaje}
              onChange={(e) => manejarCambioPorcentaje(Number.parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vista Previa - Precio Final</label>
            <p className="text-2xl font-bold text-green-600">${precioCalculado.toFixed(2)}</p>
            {porcentaje > 0 && (
              <p className="text-sm text-gray-600">Ahorro: ${(producto.precio - precioCalculado).toFixed(2)}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={alCerrar}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>

            {tieneDescuento && (
              <button
                onClick={manejarEliminar}
                disabled={cargando}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cargando ? "Eliminando..." : "Eliminar Descuento"}
              </button>
            )}

            <button
              onClick={manejarCrearOModificar}
              disabled={cargando || porcentaje <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando
                ? tieneDescuento
                  ? "Actualizando..."
                  : "Creando..."
                : tieneDescuento
                  ? "Actualizar Descuento"
                  : "Crear Descuento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
