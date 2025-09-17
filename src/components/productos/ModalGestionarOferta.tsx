"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import type { OfertaDTO } from "../../types/dto/Oferta"
import { crearOferta, modificarOferta, eliminarOferta } from "../../api/ofertaApi"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { InputMoneda } from "../InputMoneda"

interface Props {
  estaAbierto: boolean
  producto: ProductoAbm | null
  alCerrar: () => void
  alConfirmar: () => void
}

export const ModalGestionarOferta: React.FC<Props> = ({ estaAbierto, producto, alCerrar, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)
  const [cantidadMinima, setCantidadMinima] = useState<number>(1)
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0)

  const tieneOferta = producto?.idOferta != null;

  useEffect(() => {
    if (estaAbierto && producto) {
      setCantidadMinima(producto.cantidadMinima || 1)
      setNuevoPrecio(producto.nuevoPrecio || 0)
    }
  }, [estaAbierto, producto])

  const manejarGuardar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      const ofertaData: OfertaDTO = {
        idProducto: producto.idProducto,
        cantidadMinima: cantidadMinima,
        nuevoPrecio: nuevoPrecio,
      }

      if (tieneOferta) {
        await modificarOferta(producto.idOferta!, ofertaData)
      } else {
        await crearOferta(ofertaData)
      }
      alConfirmar()
    } catch (error) {
      console.error("Error al gestionar oferta:", error)
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (): Promise<void> => {
    if (!producto || producto.idOferta == null) return

    setCargando(true)
    try {
      await eliminarOferta(producto.idOferta)
      alConfirmar()
    } catch (error) {
      console.error("Error al eliminar oferta:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!estaAbierto || !producto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestionar Oferta: {producto.nombre}</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(producto.precio)}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Mínima</label>
              <input
                type="number"
                min="1"
                value={cantidadMinima}
                onChange={(e) => setCantidadMinima(Number.parseInt(e.target.value) || 1)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Precio</label>
              <InputMoneda
                value={nuevoPrecio}
                onValueChange={(valor) => setNuevoPrecio(valor || 0)}
                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ 0"
              />
            </div>
          </div>


          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vista Previa - Precio Final</label>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(nuevoPrecio)}</p>
            {nuevoPrecio > 0 && nuevoPrecio < producto.precio && (
              <p className="text-sm text-gray-600">
                Ahorro: {(formatCurrency(producto.precio - nuevoPrecio))} (por {cantidadMinima}+ unidades)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={alCerrar}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>

            {tieneOferta && (
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
              disabled={cargando || nuevoPrecio <= 0}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50"
            >
              {cargando
                ? tieneOferta
                  ? "Actualizando..."
                  : "Creando..."
                : tieneOferta
                  ? "Actualizar"
                  : "Crear Oferta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
