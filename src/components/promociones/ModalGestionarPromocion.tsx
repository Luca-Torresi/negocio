"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { crearPromocion, modificarPromocion } from "../../api/promocionApi"
import { obtenerListaProductosVenta } from "../../api/productoApi"
import type { PromocionDTO, Promocion } from "../../types/dto/Promocion"
import type { ProductoVenta } from "../../types/dto/Producto"

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
  const [precio, setPrecio] = useState("")
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoVenta[]>([])
  const [detalles, setDetalles] = useState<DetalleFormulario[]>([])

  // Estados para el constructor de items
  const [productoSeleccionado, setProductoSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState("")

  const [cargando, setCargando] = useState(false)
  const [precioSugerido, setPrecioSugerido] = useState(0)

  // Cargar productos disponibles al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarProductosDisponibles()
    }
  }, [isOpen])

  // Cargar datos para edición
  useEffect(() => {
    if (promocionParaEditar) {
      setNombre(promocionParaEditar.nombre)
      setDescripcion(promocionParaEditar.descripcion)
      setPrecio(promocionParaEditar.precio.toString())

      // Convertir detalles de la promoción a formato del formulario
      const detallesFormulario = promocionParaEditar.detalles.map((detalle) => ({
        idProducto: 0, // Se actualizará cuando se carguen los productos
        nombreProducto: detalle.producto,
        cantidad: detalle.cantidad,
        precio: 0, // Se actualizará cuando se carguen los productos
      }))
      setDetalles(detallesFormulario)
    } else {
      limpiarFormulario()
    }
  }, [promocionParaEditar])

  // Calcular precio sugerido cuando cambian los detalles
  useEffect(() => {
    const total = detalles.reduce((sum, detalle) => sum + detalle.precio * detalle.cantidad, 0)
    setPrecioSugerido(total)
  }, [detalles])

  const cargarProductosDisponibles = async (): Promise<void> => {
    try {
      const productos = await obtenerListaProductosVenta()
      setProductosDisponibles(productos)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    }
  }

  const limpiarFormulario = (): void => {
    setNombre("")
    setDescripcion("")
    setPrecio("")
    setDetalles([])
    setProductoSeleccionado("")
    setCantidad("")
    setPrecioSugerido(0)
  }

  const agregarProducto = (): void => {
    if (!productoSeleccionado || !cantidad || Number.parseInt(cantidad) <= 0) {
      return
    }

    const producto = productosDisponibles.find((p) => p.idProducto.toString() === productoSeleccionado)
    if (!producto) return

    // Verificar si el producto ya está en la lista
    const yaExiste = detalles.some((d) => d.idProducto === producto.idProducto)
    if (yaExiste) {
      alert("Este producto ya está agregado a la promoción")
      return
    }

    const nuevoDetalle: DetalleFormulario = {
      idProducto: producto.idProducto,
      nombreProducto: producto.nombre,
      cantidad: Number.parseInt(cantidad),
      precio: producto.precio,
    }

    setDetalles([...detalles, nuevoDetalle])
    setProductoSeleccionado("")
    setCantidad("")
  }

  const eliminarProducto = (idProducto: number): void => {
    setDetalles(detalles.filter((d) => d.idProducto !== idProducto))
  }

  const manejarSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!nombre.trim() || !descripcion.trim() || !precio || detalles.length === 0) {
      alert("Por favor completa todos los campos y agrega al menos un producto")
      return
    }

    setCargando(true)

    try {
      const promocionDTO: PromocionDTO = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number.parseFloat(precio),
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
        })),
      }

      if (promocionParaEditar) {
        await modificarPromocion(promocionParaEditar.idPromocion, promocionDTO)
      } else {
        await crearPromocion(promocionDTO)
      }

      onSuccess()
      onClose()
      limpiarFormulario()
    } catch (error) {
      console.error("Error al guardar promoción:", error)
      alert("Error al guardar la promoción")
    } finally {
      setCargando(false)
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
            />
          </div>

          {/* Constructor de items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos del Combo</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar producto...</option>
                  {productosDisponibles.map((producto) => (
                    <option key={producto.idProducto} value={producto.idProducto.toString()}>
                      {producto.nombre} - ${producto.precio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Añadir
                </button>
              </div>
            </div>

            {/* Precio sugerido */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Sugerido (suma de productos)
              </label>
              <input
                type="text"
                value={`$${precioSugerido.toFixed(2)}`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
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
                        <td className="border border-gray-300 px-4 py-2">${detalle.precio.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          ${(detalle.precio * detalle.cantidad).toFixed(2)}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? "Guardando..." : "Guardar Promoción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
