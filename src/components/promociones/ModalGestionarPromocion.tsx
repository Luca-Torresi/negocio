"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { crearPromocion, modificarPromocion } from "../../api/promocionApi"
import { obtenerListaProductosVenta } from "../../api/productoApi"
import type { PromocionDTO, Promocion } from "../../types/dto/Promocion"
import type { ProductoVenta } from "../../types/dto/Producto"
import { InputMoneda } from "../InputMoneda"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { useEscapeKey } from "../../hooks/useEscapeKey"
import { toast } from "react-toastify"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  promocionParaEditar?: Promocion | null
}

interface DetalleFormulario {
  idProducto: number
  nombreProducto: string
  cantidad: number
  precio: number
}

export const ModalGestionarPromocion: React.FC<Props> = ({ isOpen, onClose, onSuccess, promocionParaEditar }) => {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState<number | null>(null)
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoVenta[]>([])
  const [detalles, setDetalles] = useState<DetalleFormulario[]>([])

  const [busquedaProducto, setBusquedaProducto] = useState<string>("")
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoVenta | null>(null)
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false)
  const [cantidad, setCantidad] = useState<number>(1)

  const [cargando, setCargando] = useState(false)
  const [precioSugerido, setPrecioSugerido] = useState(0)

  // Cargar productos disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarProductosDisponibles()
    }
  }, [isOpen])

  useEffect(() => {
    if (promocionParaEditar && productosDisponibles.length > 0) {
      setNombre(promocionParaEditar.nombre)
      setDescripcion(promocionParaEditar.descripcion)
      setPrecio(promocionParaEditar.precio)

      // Convertir detalles de la promoción a formato del formulario usando los productos disponibles
      const detallesFormulario = promocionParaEditar.detalles.map((detalle) => {
        // Buscar el producto en la lista de productos disponibles por ID
        const productoEncontrado = productosDisponibles.find((p) => p.idProducto === Number(detalle.idProducto))

        return {
          idProducto: Number(detalle.idProducto),
          nombreProducto: productoEncontrado?.nombre || `Producto ID: ${detalle.idProducto}`,
          cantidad: detalle.cantidad,
          precio: productoEncontrado?.precio || 0,
        }
      })
      setDetalles(detallesFormulario)
    } else if (!promocionParaEditar) {
      limpiarFormulario()
    }
  }, [promocionParaEditar, productosDisponibles])

  // Calcular precio sugerido cuando cambian los detalles
  useEffect(() => {
    const total = detalles.reduce((sum, detalle) => sum + detalle.precio * detalle.cantidad, 0)
    setPrecioSugerido(total)
  }, [detalles])

  const productosFiltrados = productosDisponibles.filter((producto) =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()),
  )

  const cargarProductosDisponibles = async (): Promise<void> => {
    try {
      const productos = await obtenerListaProductosVenta()
      setProductosDisponibles(productos)
    } catch (error) {
      toast.error("Error al cargar productos")
    }
  }

  const limpiarFormulario = (): void => {
    setNombre("")
    setDescripcion("")
    setPrecio(0)
    setDetalles([])
    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidad(1)
    setPrecioSugerido(0)
  }

  const agregarProducto = (): void => {
    if (!productoSeleccionado || cantidad <= 0) {
      return
    }

    // Verificar si el producto ya está en la lista
    const yaExiste = detalles.some((d) => d.idProducto === productoSeleccionado.idProducto)
    if (yaExiste) {
      toast.info("Este producto ya está agregado a la promoción")
      return
    }

    const nuevoDetalle: DetalleFormulario = {
      idProducto: productoSeleccionado.idProducto,
      nombreProducto: productoSeleccionado.nombre,
      cantidad: cantidad,
      precio: productoSeleccionado.precio,
    }

    setDetalles([...detalles, nuevoDetalle])

    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidad(1)
  }

  const eliminarProducto = (idProducto: number): void => {
    setDetalles(detalles.filter((d) => d.idProducto !== idProducto))
  }

  const manejarSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!nombre.trim() || !precio || detalles.length === 0) {
      toast.info("Por favor completa todos los campos y agrega al menos un producto")
      return
    }

    setCargando(true)

    try {
      const promocionDTO: PromocionDTO = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precio,
        detalles: detalles.map((d) => ({
          idDetallePromocion: 0, // Se asigna en el backend
          idProducto: d.idProducto.toString(), // Convertir a string según el tipo
          cantidad: d.cantidad,
        })),
      }

      if (promocionParaEditar) {
        await modificarPromocion(promocionParaEditar.idPromocion, promocionDTO)
        toast.success("Promoción modificada con éxito!")
      } else {
        await crearPromocion(promocionDTO)
        toast.success("Promoción creada con éxito!")
      }

      onSuccess()
      onClose()
      limpiarFormulario()
    } catch (error) {      
      toast.error("Error al guardar la promoción")
    } finally {
      setCargando(false)
    }
  }

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {promocionParaEditar ? "Editar Promoción" : "Nueva Promoción"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={manejarSubmit} className="space-y-6">
          {/* Campos principales */}
          <div className="inline-grid grid-cols-[2fr_0.7fr] gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escriba el nombre aquí"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
              <InputMoneda
                value={precio}
                onValueChange={(nuevoValor) => setPrecio(nuevoValor || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ 0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Constructor de items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos del Combo</h3>

            <div className="inline-grid grid-cols-[2fr_0.5fr_0.9fr] gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={busquedaProducto}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value)
                    setMostrarSugerencias(true)
                    setProductoSeleccionado(null)
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Sugerencias */}
                {mostrarSugerencias && busquedaProducto && productosFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {productosFiltrados.slice(0, 10).map((producto) => (
                      <div
                        key={producto.idProducto}
                        onClick={() => {
                          setProductoSeleccionado(producto)
                          setBusquedaProducto(producto.nombre)
                          setMostrarSugerencias(false)
                        }}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{producto.nombre}</span>
                          <span className="font-semibold text-green-600">{formatCurrency(producto.precio)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={agregarProducto}
                  disabled={!productoSeleccionado}
                  className="w-full bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Añadir Producto
                </button>
              </div>
            </div>

            {/* Vista previa del producto seleccionado */}
            {productoSeleccionado && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{productoSeleccionado.nombre}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  Precio unitario: {formatCurrency(productoSeleccionado.precio)}
                </div>
                <div className="font-semibold text-green-600 mt-1">
                  Subtotal: {formatCurrency(productoSeleccionado.precio * cantidad)}
                </div>
              </div>
            )}

            {/* Precio sugerido */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Sugerido (suma de productos)
              </label>
              <input
                type="text"
                value={`${formatCurrency(precioSugerido)}`}
                readOnly
                className="w-1/5 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>

            {/* Tabla de detalles */}
            {detalles.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Precio Unit.</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Subtotal</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((detalle) => (
                      <tr key={detalle.idProducto}>
                        <td className="border border-gray-300 px-4 py-2">{detalle.nombreProducto}</td>
                        <td className="border border-gray-300 px-4 py-2">{detalle.cantidad}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatCurrency(detalle.precio)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {formatCurrency(detalle.precio * detalle.cantidad)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => eliminarProducto(detalle.idProducto)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || detalles.length === 0}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? "Guardando..." : "Guardar Promoción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
