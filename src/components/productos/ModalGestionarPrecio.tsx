"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoAbm } from "../../types/dto/Producto"
import type { DescuentoDTO } from "../../types/dto/Descuento"
import type { OfertaDTO } from "../../types/dto/Oferta"
import { crearOModificarDescuento, eliminarDescuento } from "../../api/descuentoApi"
import { crearOferta, modificarOferta, eliminarOferta } from "../../api/ofertaApi"

interface Props {
  estaAbierto: boolean
  producto: ProductoAbm | null
  alCerrar: () => void
  alConfirmar: () => void
}

export const ModalGestionarPrecio: React.FC<Props> = ({ estaAbierto, producto, alCerrar, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)
  const [tipoRegla, setTipoRegla] = useState<"porcentaje" | "cantidad">("porcentaje")
  const [porcentaje, setPorcentaje] = useState<number>(0)
  const [cantidadMinima, setCantidadMinima] = useState<number>(1)
  const [nuevoPrecio, setNuevoPrecio] = useState<number>(0)
  const [precioCalculado, setPrecioCalculado] = useState<number>(0)

  useEffect(() => {
    if (estaAbierto && producto) {
      const tieneDescuento = producto.porcentaje !== null && producto.porcentaje > 0
      const tieneOferta = producto.cantidadMinima !== null && producto.nuevoPrecio !== null

      if (tieneOferta) {
        setTipoRegla("cantidad")
        setCantidadMinima(producto.cantidadMinima || 1)
        setNuevoPrecio(producto.nuevoPrecio || 0)
        setPrecioCalculado(producto.nuevoPrecio || 0)
      } else {
        setTipoRegla("porcentaje")
        const porcentajeInicial = producto.porcentaje || 0
        setPorcentaje(porcentajeInicial)
        calcularPrecio(porcentajeInicial, producto.precio)
      }
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

  const manejarCambioNuevoPrecio = (valor: number): void => {
    setNuevoPrecio(valor)
    setPrecioCalculado(valor)
  }

  const manejarGuardar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      if (tipoRegla === "porcentaje") {
        const descuentoData: DescuentoDTO = {
          idProducto: producto.idProducto,
          porcentaje: porcentaje,
        }
        await crearOModificarDescuento(descuentoData)
      } else {
        const ofertaData: OfertaDTO = {
          idProducto: producto.idProducto,
          cantidadMinima: cantidadMinima,
          nuevoPrecio: nuevoPrecio,
        }

        const tieneOferta = producto.cantidadMinima !== null && producto.nuevoPrecio !== null
        if (tieneOferta) {
          await modificarOferta(producto.idProducto, ofertaData)
        } else {
          await crearOferta(ofertaData)
        }
      }
      alConfirmar()
    } catch (error) {
      console.error("Error al gestionar precio especial:", error)
    } finally {
      setCargando(false)
    }
  }

  const manejarEliminar = async (): Promise<void> => {
    if (!producto) return

    setCargando(true)
    try {
      if (tipoRegla === "porcentaje") {
        await eliminarDescuento(producto.idProducto)
      } else {
        await eliminarOferta(producto.idProducto)
      }
      alConfirmar()
    } catch (error) {
      console.error("Error al eliminar precio especial:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!estaAbierto || !producto) return null

  const tieneDescuento = producto.porcentaje !== null && producto.porcentaje > 0
  const tieneOferta = producto.cantidadMinima !== null && producto.nuevoPrecio !== null
  const tieneReglaActiva = tieneDescuento || tieneOferta

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Gestionar precio especial: {producto.nombre}</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setTipoRegla("porcentaje")}
            className={`px-4 py-2 font-medium ${
              tipoRegla === "porcentaje"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Descuento por Porcentaje
          </button>
          <button
            onClick={() => setTipoRegla("cantidad")}
            className={`px-4 py-2 font-medium ${
              tipoRegla === "cantidad"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Oferta por Cantidad
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
            <p className="text-lg font-semibold text-gray-900">${producto.precio.toFixed(2)}</p>
          </div>

          {tipoRegla === "porcentaje" ? (
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
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Mínima</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadMinima}
                  onChange={(e) => setCantidadMinima(Number.parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={nuevoPrecio}
                  onChange={(e) => manejarCambioNuevoPrecio(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vista Previa - Precio Final</label>
            <p className="text-2xl font-bold text-green-600">${precioCalculado.toFixed(2)}</p>
            {tipoRegla === "porcentaje" && porcentaje > 0 && (
              <p className="text-sm text-gray-600">Ahorro: ${(producto.precio - precioCalculado).toFixed(2)}</p>
            )}
            {tipoRegla === "cantidad" && nuevoPrecio > 0 && nuevoPrecio < producto.precio && (
              <p className="text-sm text-gray-600">
                Ahorro: ${(producto.precio - nuevoPrecio).toFixed(2)} (por {cantidadMinima}+ unidades)
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

            {tieneReglaActiva && (
              <button
                onClick={manejarEliminar}
                disabled={cargando}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cargando ? "Eliminando..." : tipoRegla === "porcentaje" ? "Eliminar Descuento" : "Eliminar Oferta"}
              </button>
            )}

            <button
              onClick={manejarGuardar}
              disabled={cargando || (tipoRegla === "porcentaje" ? porcentaje <= 0 : nuevoPrecio <= 0)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando
                ? tieneReglaActiva
                  ? "Actualizando..."
                  : "Creando..."
                : tieneReglaActiva
                  ? tipoRegla === "porcentaje"
                    ? "Actualizar Descuento"
                    : "Actualizar Oferta"
                  : tipoRegla === "porcentaje"
                    ? "Crear Descuento"
                    : "Crear Oferta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
