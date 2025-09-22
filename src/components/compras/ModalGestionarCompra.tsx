"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import type { CompraDTO } from "../../types/dto/Compra"
import type { ProductoLista } from "../../types/dto/Producto"
import { crearCompra } from "../../api/compraApi"
import { obtenerListaProveedores } from "../../api/proveedorApi"
import { obtenerListaProductosCompra } from "../../api/productoApi"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { useEscapeKey } from "../../hooks/useEscapeKey"
import { toast } from "react-toastify"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface DetalleItem {
  idProducto: number
  nombreProducto: string
  cantidad: number
  costoUnitario: number
}

export const ModalGestionarCompra: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [cargando, setCargando] = useState(false)
  const [proveedores, setProveedores] = useState<{ idProveedor: number; nombre: string }[]>([])
  const [productos, setProductos] = useState<ProductoLista[]>([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number>(0)
  const [descuento, setDescuento] = useState<number>(0)
  const [detalles, setDetalles] = useState<DetalleItem[]>([])

  const [busquedaProducto, setBusquedaProducto] = useState<string>("")
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoLista | null>(null)
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false)
  const [cantidadInput, setCantidadInput] = useState<number>(1)

  useEffect(() => {
    if (isOpen) {
      cargarProveedores()
      cargarProductosProveedor()
      resetearFormulario()
    }
  }, [isOpen])

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()),
  )

  const cargarProveedores = async () => {
    try {
      const data = await obtenerListaProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores:", error)
    }
  }

  const cargarProductosProveedor = async () => {
    try {
      const data = await obtenerListaProductosCompra()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos del proveedor:", error)
    }
  }

  const resetearFormulario = () => {
    setProveedorSeleccionado(0)
    setDetalles([])
    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidadInput(1)
    setDescuento(0)
  }

  const añadirProducto = () => {
    if (!productoSeleccionado || cantidadInput <= 0) return

    // Verificar si el producto ya está en la lista
    const existeProducto = detalles.find((d) => d.idProducto === productoSeleccionado.idProducto)
    if (existeProducto) {
      // Actualizar cantidad si ya existe
      setDetalles((prev) =>
        prev.map((d) =>
          d.idProducto === productoSeleccionado.idProducto ? { ...d, cantidad: d.cantidad + cantidadInput } : d,
        ),
      )
    } else {
      // Añadir nuevo producto
      const nuevoDetalle: DetalleItem = {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombre,
        cantidad: cantidadInput,
        costoUnitario: productoSeleccionado.costo,
      }
      setDetalles((prev) => [...prev, nuevoDetalle])
    }

    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidadInput(1)
  }

  const eliminarProducto = (idProducto: number) => {
    setDetalles((prev) => prev.filter((d) => d.idProducto !== idProducto))
  }

  const calcularTotal = () => {
    const subtotal = detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.costoUnitario, 0)
    return subtotal * (1 - descuento / 100)
  }

  const manejarGuardar = async () => {
    if (proveedorSeleccionado === 0 || detalles.length === 0) {
      toast.info("Debe seleccionar un proveedor y añadir al menos un producto")
      return
    }

    setCargando(true)
    try {
      const compraData: CompraDTO = {
        idProveedor: proveedorSeleccionado,
        descuento: descuento > 0 ? descuento : null,
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
        })),
      }

      await crearCompra(compraData)

      toast.success('¡Compra guardada con éxito!');

      onSuccess()
      onClose()
    } catch (error) {
      toast.error("Error al guardar la compra")
    } finally {
      setCargando(false)
    }
  }

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Nueva Compra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Selección de Proveedor */}
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
              <select
                value={proveedorSeleccionado}
                onChange={(e) => setProveedorSeleccionado(Number(e.target.value))}
                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value={0}>Seleccionar proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Descuento Input Field */}
            <div className="rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (%) - Opcional</label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-32 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Ingrese un porcentaje de descuento (0-100)</p>
            </div>
          </div>

          {/* Constructor de Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Añadir Productos</h3>

            <div className="inline-grid grid-cols-[2fr_0.5fr_0.9fr] gap-4 items-end">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
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
                          <span className="font-semibold text-green-600">{formatCurrency(producto.costo)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  onClick={añadirProducto}
                  disabled={!productoSeleccionado || cantidadInput <= 0}
                  className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50"
                >
                  <Plus size={20} className="mr-2" />
                  Añadir Producto
                </button>
              </div>
            </div>

            {/* Vista previa del producto seleccionado */}
            {productoSeleccionado && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-900">{productoSeleccionado.nombre}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  Costo unitario: {formatCurrency(productoSeleccionado.costo)}
                </div>
                <div className="font-semibold text-green-600 mt-1">
                  Subtotal: {formatCurrency(productoSeleccionado.costo * cantidadInput)}
                </div>
              </div>
            )}
          </div>

          {/* Tabla de Detalles */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Productos de la Compra</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Costo Unitario</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{detalle.nombreProducto}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{detalle.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(detalle.costoUnitario)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-semibold">
                        {formatCurrency(detalle.cantidad * detalle.costoUnitario)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <button
                          onClick={() => eliminarProducto(detalle.idProducto)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          {detalles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-700">Subtotal:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {formatCurrency(detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.costoUnitario, 0))}
                  </span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-700">Descuento ({descuento}%):</span>
                    <span className="text-lg font-semibold text-red-600">
                      -
                      {formatCurrency(
                        detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.costoUnitario, 0) *
                        (descuento / 100)
                      )}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">Total Final:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(calcularTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Confirmación */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={manejarGuardar}
              disabled={cargando || proveedorSeleccionado === 0 || detalles.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar Compra"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
