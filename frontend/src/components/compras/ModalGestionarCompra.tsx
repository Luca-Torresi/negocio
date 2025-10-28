"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import type { CompraDTO, Compra } from "../../types/dto/Compra"
import type { ProductoLista } from "../../types/dto/Producto"
import { crearCompra, modificarCompra } from "../../api/compraApi"
import { obtenerListaProveedores } from "../../api/proveedorApi"
import { obtenerListaProductosCompra } from "../../api/productoApi"
import { formatCurrency } from "../../utils/numberFormatUtils"
import { useEscapeKey } from "../../hooks/useEscapeKey"
import { toast } from "react-toastify"
import { useAutocompleteNav } from "../../hooks/useAutocompleteNav"
import { InputPorcentaje } from "../InputPorcentaje"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  compraParaEditar?: Compra | null
}

interface DetalleItem {
  idProducto: number
  nombreProducto: string
  cantidad: number
  costoUnitarioOriginal: number
  descuentoIndividual: number
}

export const ModalGestionarCompra: React.FC<Props> = ({ isOpen, onClose, onSuccess, compraParaEditar }) => {
  const esEdicion = !!compraParaEditar

  const [cargando, setCargando] = useState(false)
  const [proveedores, setProveedores] = useState<{ idProveedor: number; nombre: string }[]>([])
  const [productos, setProductos] = useState<ProductoLista[]>([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number>(0)

  const [tipoDescuento, setTipoDescuento] = useState<"GLOBAL" | "INDIVIDUAL">("GLOBAL")
  const [descuentoGlobal, setDescuentoGlobal] = useState<number>(0)

  const [detalles, setDetalles] = useState<DetalleItem[]>([])
  const [busquedaProducto, setBusquedaProducto] = useState<string>("")
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoLista | null>(null)
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false)
  const [cantidadInput, setCantidadInput] = useState<number>(1)
  const [descuentoIndividualInput, setDescuentoIndividualInput] = useState<number | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputBusquedaRef = useRef<HTMLInputElement>(null)

  const productosFiltrados = useMemo(() => {
    if (!busquedaProducto) return []
    return productos.filter((p) => p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()))
  }, [productos, busquedaProducto])

  const seleccionarProducto = (producto: ProductoLista) => {
    setProductoSeleccionado(producto)
    setBusquedaProducto(producto.nombre)
    setMostrarSugerencias(false)
  }

  const { activeIndex, setActiveIndex, onKeyDown } = useAutocompleteNav(productosFiltrados.length, (index) =>
    seleccionarProducto(productosFiltrados[index]),
  )

  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const activeItem = dropdownRef.current.children[activeIndex] as HTMLElement
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [activeIndex])

  useEffect(() => {
    if (isOpen) {
      cargarProveedores()
      cargarProductosProveedor()
      resetearFormulario()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !compraParaEditar || !proveedores || proveedores.length === 0) {
      return
    }

    cargarDatosParaEditar()
  }, [isOpen, compraParaEditar, proveedores])

  const cargarDatosParaEditar = async () => {
    if (!compraParaEditar) return

    const proveedor = proveedores.find((p) => p.nombre === compraParaEditar.proveedor)
    if (proveedor) {
      setProveedorSeleccionado(proveedor.idProveedor)
    }

    const detallesFormateados: DetalleItem[] = compraParaEditar.detalles.map((detalle) => ({
      idProducto: detalle.idProducto,
      nombreProducto: detalle.producto,
      cantidad: detalle.cantidad,
      costoUnitarioOriginal: detalle.costoUnitario,
      descuentoIndividual: 0,
    }))

    setDetalles(detallesFormateados)
  }

  const cargarProveedores = async () => {
    try {
      const data = await obtenerListaProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error al cargar proveedores")
    }
  }

  const cargarProductosProveedor = async () => {
    try {
      const data = await obtenerListaProductosCompra()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar los productos")
    }
  }

  const resetearFormulario = () => {
    setProveedorSeleccionado(0)
    setDetalles([])
    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidadInput(1)
    setTipoDescuento("GLOBAL")
    setDescuentoGlobal(0)
    setDescuentoIndividualInput(null)
  }

  const calcularCostoUnitarioFinal = (
    costoOriginal: number,
    descuento: number,
  ): number => {
    return Math.round(costoOriginal * (1 - descuento / 100))
  }

  const añadirProducto = () => {
    if (!productoSeleccionado || cantidadInput <= 0) return

    const existeProducto = detalles.find((d) => d.idProducto === productoSeleccionado.idProducto)
    if (existeProducto) {
      toast.warning(`El producto ${productoSeleccionado.nombre} ya se encuentra cargado en la compra.`)
      return
    } else {
      const nuevoDetalle: DetalleItem = {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombre,
        cantidad: cantidadInput,
        costoUnitarioOriginal: productoSeleccionado.costo,
        descuentoIndividual: descuentoIndividualInput || 0,
      }
      setDetalles((prev) => [...prev, nuevoDetalle])
    }

    setBusquedaProducto("")
    setProductoSeleccionado(null)
    setMostrarSugerencias(false)
    setCantidadInput(1)
    setDescuentoIndividualInput(null)

    if (inputBusquedaRef.current) {
      inputBusquedaRef.current.focus()
    }
  }

  const eliminarProducto = (idProducto: number) => {
    setDetalles((prev) => prev.filter((d) => d.idProducto !== idProducto))
  }

  const modificarCantidadDetalle = (idProducto: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return

    setDetalles((prev) =>
      prev.map((detalle) => (detalle.idProducto === idProducto ? { ...detalle, cantidad: nuevaCantidad } : detalle)),
    )
  }

  const modificarDescuentoIndividual = (idProducto: number, nuevoDescuento: number) => {
    setDetalles((prev) =>
      prev.map((detalle) =>
        detalle.idProducto === idProducto ? { ...detalle, descuentoIndividual: nuevoDescuento } : detalle,
      ),
    )
  }

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      const costoFinal = calcularCostoUnitarioFinal(
        detalle.costoUnitarioOriginal,
        tipoDescuento === "GLOBAL" ? descuentoGlobal : detalle.descuentoIndividual,
      )
      return total + detalle.cantidad * costoFinal
    }, 0)
  }

  const cambiarTipoDescuento = (nuevoTipo: "GLOBAL" | "INDIVIDUAL") => {
    setTipoDescuento(nuevoTipo)

    // Clear discounts when switching types
    if (nuevoTipo === "GLOBAL") {
      // Clear individual discounts
      setDetalles((prev) => prev.map((detalle) => ({ ...detalle, descuentoIndividual: 0 })))
      setDescuentoIndividualInput(null)
    } else {
      // Clear global discount
      setDescuentoGlobal(0)
    }
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
        detalles: detalles.map((d) => ({
          idProducto: d.idProducto,
          cantidad: d.cantidad,
          costoUnitario: calcularCostoUnitarioFinal(
            d.costoUnitarioOriginal,
            tipoDescuento === "GLOBAL" ? descuentoGlobal : d.descuentoIndividual,
          ),
        })),
      }

      if (esEdicion && compraParaEditar) {
        await modificarCompra(compraParaEditar.idCompra, compraData)
        toast.success("¡Compra actualizada con éxito!")
      } else {
        await crearCompra(compraData)
        toast.success("¡Compra guardada con éxito!")
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al guardar la compra")
      toast.error("Error al guardar la compra")
    } finally {
      setCargando(false)
    }
  }

  useEscapeKey(onClose, isOpen)

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
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor *</label>
              <select
                value={proveedorSeleccionado}
                onChange={(e) => setProveedorSeleccionado(Number(e.target.value))}
                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Descuento</label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tipoDescuento"
                  value="GLOBAL"
                  checked={tipoDescuento === "GLOBAL"}
                  onChange={() => cambiarTipoDescuento("GLOBAL")}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Descuento Global (%)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tipoDescuento"
                  value="INDIVIDUAL"
                  checked={tipoDescuento === "INDIVIDUAL"}
                  onChange={() => cambiarTipoDescuento("INDIVIDUAL")}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Descuento Individual (%)</span>
              </label>
            </div>

            {tipoDescuento === "GLOBAL" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento aplicado al total de la compra (%)
                </label>
                <InputPorcentaje
                  value={descuentoGlobal}
                  onValueChange={(nuevoValor) => setDescuentoGlobal(nuevoValor)}
                  className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 %"
                />
                <p className="text-xs text-gray-500 mt-1">Ingrese un porcentaje de descuento (0-100)</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Añadir Productos</h3>

            <div
              className={`inline-grid ${tipoDescuento === "INDIVIDUAL" ? "grid-cols-[2fr_0.5fr_0.5fr_0.9fr]" : "grid-cols-[2fr_0.5fr_0.9fr]"} gap-3 items-end`}
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <input
                  ref={inputBusquedaRef}
                  type="text"
                  placeholder="Buscar producto..."
                  value={busquedaProducto}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value)
                    setMostrarSugerencias(true)
                    setProductoSeleccionado(null)
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  onKeyDown={onKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {mostrarSugerencias && busquedaProducto && productosFiltrados.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {productosFiltrados.slice(0, 10).map((producto, index) => (
                      <div
                        key={producto.idProducto}
                        onClick={() => seleccionarProducto(producto)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"}`}
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

              {tipoDescuento === "INDIVIDUAL" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                  <InputPorcentaje
                    value={descuentoIndividualInput ?? 0}
                    onValueChange={(nuevoValor) => setDescuentoIndividualInput(nuevoValor)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0 %"
                  />
                </div>
              )}

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

            {productoSeleccionado && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-900">{productoSeleccionado.nombre}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  Costo unitario: {formatCurrency(productoSeleccionado.costo)}
                </div>
                {tipoDescuento === "INDIVIDUAL" && descuentoIndividualInput && descuentoIndividualInput > 0 && (
                  <div className="text-sm text-red-600 mt-1">Descuento: {descuentoIndividualInput}%</div>
                )}
                <div className="font-semibold text-green-600 mt-1">
                  Subtotal:{" "}
                  {formatCurrency(
                    calcularCostoUnitarioFinal(
                      productoSeleccionado.costo,
                      tipoDescuento === "GLOBAL" ? descuentoGlobal : descuentoIndividualInput || 0,
                    ) * cantidadInput,
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Productos de la Compra</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cantidad</th>
                    {tipoDescuento === "INDIVIDUAL" && (
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descuento</th>
                    )}
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Costo Unitario</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detalles.map((detalle, index) => {
                    const costoFinal = calcularCostoUnitarioFinal(
                      detalle.costoUnitarioOriginal,
                      tipoDescuento === "GLOBAL" ? descuentoGlobal : detalle.descuentoIndividual,
                    )
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{detalle.nombreProducto}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <input
                            type="number"
                            min="1"
                            value={detalle.cantidad}
                            onChange={(e) =>
                              modificarCantidadDetalle(detalle.idProducto, Number.parseInt(e.target.value) || 1)
                            }
                            className="w-[70px] p-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        {tipoDescuento === "INDIVIDUAL" && (
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <InputPorcentaje
                              value={detalle.descuentoIndividual}
                              onValueChange={(nuevoValor) =>
                                modificarDescuentoIndividual(detalle.idProducto, nuevoValor || 0)
                              }
                              className="w-[70px] p-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0 %"
                            />
                          </td>
                        )}
                        <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(costoFinal)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 font-semibold">
                          {formatCurrency(detalle.cantidad * costoFinal)}
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {detalles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">Total Final:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(calcularTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {cargando ? "Guardando..." : esEdicion ? "Actualizar Compra" : "Guardar Compra"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
