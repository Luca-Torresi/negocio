"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Search, Plus, Trash2, ShoppingCart } from "lucide-react"
import type { ItemCatalogo, ItemVenta, VentaDTO } from "../types/dto/Venta"
import {
  obtenerCatalogoVenta,
  obtenerMetodosDePago,
  crearVenta,
  modificarVenta,
  obtenerVentaPorId,
} from "../api/ventaApi"

const PaginaVentas: React.FC = () => {
  const { idVenta } = useParams<{ idVenta: string }>()
  const navigate = useNavigate()
  const modoEdicion = Boolean(idVenta)

  // Estados principales
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>([])
  const [metodosDePago, setMetodosDePago] = useState<string[]>([])
  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<string>("")

  // Estados para el constructor de venta
  const [busquedaItem, setBusquedaItem] = useState<string>("")
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemCatalogo | null>(null)
  const [cantidad, setCantidad] = useState<number>(1)
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false)

  // Estados de carga y error
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [procesandoVenta, setProcesandoVenta] = useState<boolean>(false)

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async (): Promise<void> => {
      try {
        setCargando(true)
        const [catalogoData, metodosData] = await Promise.all([obtenerCatalogoVenta(), obtenerMetodosDePago()])

        setCatalogo(catalogoData)
        setMetodosDePago(metodosData)

        // Si estamos en modo edición, cargar la venta
        if (modoEdicion && idVenta) {
          await cargarVentaParaEdicion(Number.parseInt(idVenta))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [idVenta, modoEdicion])

  // Cargar venta existente para edición
  const cargarVentaParaEdicion = async (id: number): Promise<void> => {
    try {
      const venta = await obtenerVentaPorId(id)
      setMetodoPagoSeleccionado(venta.metodoDePago)

      // Convertir detalles de venta a items del carrito
      const itemsCarrito: ItemVenta[] = venta.detalles.map((detalle) => {
        const itemCatalogo = catalogo.find((item) => item.nombre === detalle.nombreItem)

        if (!itemCatalogo) {
          throw new Error(`Item no encontrado en catálogo: ${detalle.nombreItem}`)
        }

        return {
          item: itemCatalogo,
          cantidad: detalle.cantidad,
          precioUnitarioAplicado: detalle.precioUnitario,
        }
      })

      setCarrito(itemsCarrito)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar venta")
    }
  }

  // Filtrar catálogo según búsqueda
  const itemsFiltrados = catalogo.filter((item) => item.nombre.toLowerCase().includes(busquedaItem.toLowerCase()))

  // Calcular precio unitario aplicado según ofertas
  const calcularPrecioUnitario = (item: ItemCatalogo, cantidad: number): number => {
    if (item.tipo === "PRODUCTO" && item.oferta && cantidad >= item.oferta.cantidadMinima) {
      return item.oferta.nuevoPrecio
    }
    return item.precioFinal
  }

  // Añadir item al carrito
  const añadirAlCarrito = (): void => {
    if (!itemSeleccionado || cantidad <= 0) return

    const precioUnitario = calcularPrecioUnitario(itemSeleccionado, cantidad)

    // Verificar si el item ya existe en el carrito
    const indiceExistente = carrito.findIndex(
      (carritoItem) => carritoItem.item.id === itemSeleccionado.id && carritoItem.item.tipo === itemSeleccionado.tipo,
    )

    if (indiceExistente >= 0) {
      // Actualizar cantidad del item existente
      const nuevoCarrito = [...carrito]
      const nuevaCantidad = nuevoCarrito[indiceExistente].cantidad + cantidad
      nuevoCarrito[indiceExistente] = {
        ...nuevoCarrito[indiceExistente],
        cantidad: nuevaCantidad,
        precioUnitarioAplicado: calcularPrecioUnitario(itemSeleccionado, nuevaCantidad),
      }
      setCarrito(nuevoCarrito)
    } else {
      // Añadir nuevo item
      const nuevoItem: ItemVenta = {
        item: itemSeleccionado,
        cantidad,
        precioUnitarioAplicado: precioUnitario,
      }
      setCarrito([...carrito, nuevoItem])
    }

    // Limpiar selección
    setBusquedaItem("")
    setItemSeleccionado(null)
    setCantidad(1)
    setMostrarSugerencias(false)
  }

  // Modificar cantidad en el carrito
  const modificarCantidadCarrito = (indice: number, nuevaCantidad: number): void => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(indice)
      return
    }

    const nuevoCarrito = [...carrito]
    const item = nuevoCarrito[indice]
    nuevoCarrito[indice] = {
      ...item,
      cantidad: nuevaCantidad,
      precioUnitarioAplicado: calcularPrecioUnitario(item.item, nuevaCantidad),
    }
    setCarrito(nuevoCarrito)
  }

  // Eliminar item del carrito
  const eliminarDelCarrito = (indice: number): void => {
    setCarrito(carrito.filter((_, i) => i !== indice))
  }

  // Calcular total general
  const totalGeneral = carrito.reduce((total, item) => total + item.cantidad * item.precioUnitarioAplicado, 0)

  // Finalizar venta
  const finalizarVenta = async (): Promise<void> => {
    if (carrito.length === 0 || !metodoPagoSeleccionado) {
      setError("Debe agregar items al carrito y seleccionar un método de pago")
      return
    }

    try {
      setProcesandoVenta(true)

      const ventaDTO: VentaDTO = {
        metodoDePago: metodoPagoSeleccionado,
        detalles: carrito.map((item) => ({
          ...(item.item.tipo === "PRODUCTO" ? { idProducto: item.item.id } : { idPromocion: item.item.id }),
          cantidad: item.cantidad,
        })),
      }

      if (modoEdicion && idVenta) {
        await modificarVenta(Number.parseInt(idVenta), ventaDTO)
        alert("Venta modificada exitosamente")
      } else {
        await crearVenta(ventaDTO)
        alert("Venta creada exitosamente")
      }

      navigate("/ventas/historial")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar venta")
    } finally {
      setProcesandoVenta(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando terminal de venta...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{modoEdicion ? "Modificar Venta" : "Terminal de Venta"}</h1>
          {error && <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        </div>

        {/* Layout principal: dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda: Constructor de Venta */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="mr-2" size={20} />
              Constructor de Venta
            </h2>

            {/* Buscador con autocompletado */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar producto o promoción..."
                value={busquedaItem}
                onChange={(e) => {
                  setBusquedaItem(e.target.value)
                  setMostrarSugerencias(true)
                  setItemSeleccionado(null)
                }}
                onFocus={() => setMostrarSugerencias(true)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Sugerencias */}
              {mostrarSugerencias && busquedaItem && itemsFiltrados.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {itemsFiltrados.slice(0, 10).map((item) => (
                    <div
                      key={`${item.tipo}-${item.id}`}
                      onClick={() => {
                        setItemSeleccionado(item)
                        setBusquedaItem(item.nombre)
                        setMostrarSugerencias(false)
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.nombre}</span>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded ${
                              item.tipo === "PRODUCTO" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.tipo}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">${item.precioFinal.toFixed(2)}</span>
                      </div>
                      {item.oferta && (
                        <div className="text-sm text-orange-600 mt-1">
                          Oferta: {item.oferta.cantidadMinima}+ unidades = ${item.oferta.nuevoPrecio.toFixed(2)} c/u
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cantidad y botón añadir */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={añadirAlCarrito}
                  disabled={!itemSeleccionado}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Añadir
                </button>
              </div>
            </div>

            {/* Vista previa del item seleccionado */}
            {itemSeleccionado && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{itemSeleccionado.nombre}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Precio unitario: ${calcularPrecioUnitario(itemSeleccionado, cantidad).toFixed(2)}
                  {itemSeleccionado.oferta && cantidad >= itemSeleccionado.oferta.cantidadMinima && (
                    <span className="text-orange-600 ml-2">(Oferta aplicada)</span>
                  )}
                </div>
                <div className="font-semibold text-green-600 mt-1">
                  Subtotal: ${(calcularPrecioUnitario(itemSeleccionado, cantidad) * cantidad).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Carrito/Ticket */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              Ticket Actual
            </h2>

            {/* Tabla de items */}
            <div className="mb-6">
              {carrito.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No hay items en el carrito</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">Cant.</th>
                        <th className="text-right py-2">P. Unit.</th>
                        <th className="text-right py-2">Subtotal</th>
                        <th className="text-center py-2">Acc.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map((item, indice) => (
                        <tr key={indice} className="border-b border-gray-100">
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{item.item.nombre}</div>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  item.item.tipo === "PRODUCTO"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.item.tipo}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) => modificarCantidadCarrito(indice, Number.parseInt(e.target.value) || 1)}
                              className="w-16 p-1 text-center border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 text-right">${item.precioUnitarioAplicado.toFixed(2)}</td>
                          <td className="py-3 text-right font-semibold">
                            ${(item.cantidad * item.precioUnitarioAplicado).toFixed(2)}
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => eliminarDelCarrito(indice)}
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

            {/* Total y método de pago */}
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select
                  value={metodoPagoSeleccionado}
                  onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar método de pago</option>
                  {metodosDePago.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total General:</span>
                <span className="text-2xl font-bold text-green-600">${totalGeneral.toFixed(2)}</span>
              </div>

              <button
                onClick={finalizarVenta}
                disabled={carrito.length === 0 || !metodoPagoSeleccionado || procesandoVenta}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {procesandoVenta ? "Procesando..." : modoEdicion ? "Modificar Venta" : "Finalizar Venta"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaVentas
