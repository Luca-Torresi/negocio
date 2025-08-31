"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import type { CompraDTO } from "../../types/dto/Compra"
import type { ProductoLista } from "../../types/dto/Producto"
import { crearCompra, modificarCompra, obtenerCompraPorId } from "../../api/compraApi"
import { obtenerListaProveedores } from "../../api/proveedorApi"
import { obtenerListaProductosPorProveedor } from "../../api/productoApi"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  idCompra: number | null // null para crear, número para editar
}

interface DetalleItem {
  idProducto: number
  nombreProducto: string
  cantidad: number
  costoUnitario: number
}

export const ModalGestionarCompra: React.FC<Props> = ({ isOpen, onClose, onSuccess, idCompra }) => {
  const [cargando, setCargando] = useState(false)
  const [proveedores, setProveedores] = useState<{ idProveedor: number; nombre: string }[]>([])
  const [productos, setProductos] = useState<ProductoLista[]>([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number>(0)
  const [detalles, setDetalles] = useState<DetalleItem[]>([])

  // Estados para añadir productos
  const [productoSeleccionado, setProductoSeleccionado] = useState<number>(0)
  const [cantidadInput, setCantidadInput] = useState<number>(1)

  const esEdicion = idCompra !== null

  useEffect(() => {
    if (isOpen) {
      cargarProveedores()
      if (esEdicion) {
        cargarDatosCompra()
      } else {
        resetearFormulario()
      }
    }
  }, [isOpen, idCompra])

  useEffect(() => {
    if (proveedorSeleccionado > 0) {
      cargarProductosProveedor()
    } else {
      setProductos([])
    }
  }, [proveedorSeleccionado])

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
      const data = await obtenerListaProductosPorProveedor(proveedorSeleccionado)
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos del proveedor:", error)
    }
  }

  const cargarDatosCompra = async () => {
    if (!idCompra) return

    try {
      setCargando(true)
      const compra = await obtenerCompraPorId(idCompra)

      // Buscar el ID del proveedor por nombre
      const proveedor = proveedores.find((p) => p.nombre === compra.proveedor)
      if (proveedor) {
        setProveedorSeleccionado(proveedor.idProveedor)
      }

      // Convertir detalles de la compra a formato del formulario
      const detallesFormateados: DetalleItem[] = compra.detalles.map((detalle: any) => ({
        idProducto: 0, // No tenemos el ID del producto en la respuesta
        nombreProducto: detalle.producto,
        cantidad: detalle.cantidad,
        costoUnitario: detalle.costoUnitario,
      }))

      setDetalles(detallesFormateados)
    } catch (error) {
      console.error("Error al cargar datos de la compra:", error)
    } finally {
      setCargando(false)
    }
  }

  const resetearFormulario = () => {
    setProveedorSeleccionado(0)
    setDetalles([])
    setProductoSeleccionado(0)
    setCantidadInput(1)
  }

  const añadirProducto = () => {
    if (productoSeleccionado === 0 || cantidadInput <= 0) return

    const producto = productos.find((p) => p.idProducto === productoSeleccionado)
    if (!producto) return

    // Verificar si el producto ya está en la lista
    const existeProducto = detalles.find((d) => d.idProducto === productoSeleccionado)
    if (existeProducto) {
      // Actualizar cantidad si ya existe
      setDetalles((prev) =>
        prev.map((d) => (d.idProducto === productoSeleccionado ? { ...d, cantidad: d.cantidad + cantidadInput } : d)),
      )
    } else {
      // Añadir nuevo producto
      const nuevoDetalle: DetalleItem = {
        idProducto: producto.idProducto,
        nombreProducto: producto.nombre,
        cantidad: cantidadInput,
        costoUnitario: producto.costo,
      }
      setDetalles((prev) => [...prev, nuevoDetalle])
    }

    // Resetear selección
    setProductoSeleccionado(0)
    setCantidadInput(1)
  }

  const eliminarProducto = (idProducto: number) => {
    setDetalles((prev) => prev.filter((d) => d.idProducto !== idProducto))
  }

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.costoUnitario, 0)
  }

  const manejarGuardar = async () => {
    if (proveedorSeleccionado === 0 || detalles.length === 0) {
      alert("Debe seleccionar un proveedor y añadir al menos un producto")
      return
    }

    setCargando(true)
    try {
      const compraData: CompraDTO = {
        idProveedor: proveedorSeleccionado,
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
        })),
      }

      if (esEdicion && idCompra) {
        await modificarCompra(idCompra, compraData)
      } else {
        await crearCompra(compraData)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al guardar compra:", error)
      alert("Error al guardar la compra")
    } finally {
      setCargando(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{esEdicion ? "Editar Compra" : "Nueva Compra"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Selección de Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
            <select
              value={proveedorSeleccionado}
              onChange={(e) => setProveedorSeleccionado(Number(e.target.value))}
              disabled={esEdicion}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value={0}>Seleccionar proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Constructor de Items */}
          {proveedorSeleccionado > 0 && !esEdicion && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Añadir Productos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <select
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Seleccionar producto</option>
                    {productos.map((producto) => (
                      <option key={producto.idProducto} value={producto.idProducto}>
                        {producto.nombre} - ${producto.costo.toFixed(2)}
                      </option>
                    ))}
                  </select>
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
                    disabled={productoSeleccionado === 0 || cantidadInput <= 0}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <Plus size={20} className="mr-2" />
                    Añadir Producto
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Detalles */}
          {detalles.length > 0 && (
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
                      {!esEdicion && (
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{detalle.nombreProducto}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{detalle.cantidad}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${detalle.costoUnitario.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 font-semibold">
                          ${(detalle.cantidad * detalle.costoUnitario).toFixed(2)}
                        </td>
                        {!esEdicion && (
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <button
                              onClick={() => eliminarProducto(detalle.idProducto)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total */}
          {detalles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">Total de la Compra:</span>
                <span className="text-2xl font-bold text-blue-600">${calcularTotal().toFixed(2)}</span>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando ? "Guardando..." : "Guardar Compra"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
