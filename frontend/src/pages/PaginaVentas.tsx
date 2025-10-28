"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Search, Plus, Trash2, ListPlus, ShoppingBasket, RefreshCw } from "lucide-react"
import type { ItemCatalogo, ItemVenta, VentaDTO } from "../types/dto/Venta"
import { obtenerCatalogoVenta, obtenerMetodosDePago, crearVenta } from "../api/ventaApi"
import { buscarProductoPorCodigo } from "../api/productoApi"
import { formatCurrency } from "../utils/numberFormatUtils"
import { toast } from "react-toastify"
import { InputMoneda } from "../components/InputMoneda"
import { InputPorcentaje } from "../components/InputPorcentaje"

const PaginaVentas: React.FC = () => {
  const { idVenta } = useParams<{ idVenta: string }>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputBusquedaRef = useRef<HTMLInputElement>(null)

  // Estados principales
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>([])
  const [metodosDePago, setMetodosDePago] = useState<string[]>([])
  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<string>("")
  const [descuento, setDescuento] = useState<number>(0)
  const [tipoDescuento, setTipoDescuento] = useState<"MONTO" | "PORCENTAJE">("MONTO")

  // Estados para el constructor de venta
  const [busquedaItem, setBusquedaItem] = useState<string>("")
  const [itemSeleccionado, setItemSeleccionado] = useState<ItemCatalogo | null>(null)
  const [cantidad, setCantidad] = useState<number>(1)
  const [mostrarSugerencias, setMostrarSugerencias] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  // Estados de carga y error
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string | null>("")
  const [procesandoVenta, setProcesandoVenta] = useState<boolean>(false)

  const seleccionarItem = (item: ItemCatalogo) => {
    setItemSeleccionado(item)
    setBusquedaItem(item.nombre)
    setMostrarSugerencias(false)
    setActiveIndex(-1) // Reseteamos el índice
  }

  // --- 3. INICIO DE LA LÓGICA DEL LECTOR DE CÓDIGO DE BARRAS ---
  const [codigoDeBarras, setCodigoDeBarras] = useState("")
  const timerRef = useRef<number | null>(null)

  // Lógica para añadir un item al carrito (ahora en useCallback)
  const añadirItemAlCarrito = useCallback(
    (itemToAdd: ItemCatalogo, cantidadToAdd: number): void => {
      if (!itemToAdd || cantidadToAdd <= 0) return

      const precioUnitario = calcularPrecioUnitario(itemToAdd, cantidadToAdd)
      const indiceExistente = carrito.findIndex(
        (carritoItem) => carritoItem.item.id === itemToAdd.id && carritoItem.item.tipo === itemToAdd.tipo,
      )

      if (indiceExistente >= 0) {
        setCarrito((prevCarrito) => {
          const nuevoCarrito = [...prevCarrito]
          const itemExistente = nuevoCarrito[indiceExistente]
          const nuevaCantidad = itemExistente.cantidad + cantidadToAdd
          nuevoCarrito[indiceExistente] = {
            ...itemExistente,
            cantidad: nuevaCantidad,
            precioUnitarioAplicado: calcularPrecioUnitario(itemExistente.item, nuevaCantidad),
          }
          return nuevoCarrito
        })
      } else {
        const nuevoItem: ItemVenta = {
          item: itemToAdd,
          cantidad: cantidadToAdd,
          precioUnitarioAplicado: precioUnitario,
        }
        setCarrito((prevCarrito) => [...prevCarrito, nuevoItem])
      }
    },
    [carrito],
  ) // Depende del estado 'carrito'

  // Función que se llama cuando se completa un escaneo
  const procesarCodigoDeBarras = useCallback(
    async (codigo: string) => {
      try {
        const productoEncontrado = await buscarProductoPorCodigo(codigo)
        if (productoEncontrado) {
          añadirItemAlCarrito(productoEncontrado, 1)
          setBusquedaItem("")
          toast.info(`Se agregó ${productoEncontrado.nombre} al carrito`)
        } else {
          toast.error(`El código ${codigo} no pertenece a ningún producto.`)
        }
      } catch (error) {
        console.log("Error al buscar el producto.")
      }
    },
    [añadirItemAlCarrito],
  )

  // useEffect que escucha el teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timerRef.current) clearTimeout(timerRef.current)

      if (e.key === "Enter") {
        if (codigoDeBarras.length > 5) {
          e.preventDefault()
          procesarCodigoDeBarras(codigoDeBarras)
        }
        setCodigoDeBarras("")
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setCodigoDeBarras((prevCodigo) => prevCodigo + e.key)
      }

      timerRef.current = window.setTimeout(() => {
        setCodigoDeBarras("")
      }, 100) // Aumentado a 100ms para más flexibilidad
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [codigoDeBarras, procesarCodigoDeBarras])
  // --- FIN DE LA LÓGICA DEL LECTOR ---

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async (): Promise<void> => {
      try {
        setCargando(true)
        const [catalogoData, metodosData] = await Promise.all([obtenerCatalogoVenta(), obtenerMetodosDePago()])

        setCatalogo(catalogoData)
        setMetodosDePago(metodosData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos")
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [idVenta])

  const itemsFiltrados = useMemo(() => {
    if (!busquedaItem) return []
    return catalogo.filter((item) => item.nombre.toLowerCase().includes(busquedaItem.toLowerCase()))
  }, [catalogo, busquedaItem])

  useEffect(() => {
    setActiveIndex(-1)
  }, [itemsFiltrados])

  useEffect(() => {
    // Verificamos si hay un elemento activo y si el contenedor existe
    if (activeIndex >= 0 && dropdownRef.current) {
      // Buscamos el hijo del contenedor que corresponde al índice activo
      const activeItem = dropdownRef.current.children[activeIndex] as HTMLElement

      if (activeItem) {
        // Le pedimos al navegador que mueva el scroll para que este item sea visible
        activeItem.scrollIntoView({
          block: "nearest", // Se desplazará lo mínimo necesario para que sea visible
          behavior: "smooth", // Le da una animación suave al scroll
        })
      }
    }
  }, [activeIndex]) // Se dispara solo cuando cambia el activeIndex

  // Calcular precio unitario aplicado según ofertas
  const calcularPrecioUnitario = (item: ItemCatalogo, cantidad: number): number => {
    if (item.tipo === "PRODUCTO" && item.oferta && cantidad >= item.oferta.cantidadMinima) {
      return item.oferta.nuevoPrecio
    }
    return item.precioFinal
  }

  // --- 2. AÑADIMOS LA NUEVA LÓGICA DE SELECCIÓN ---
  const añadirItem = (itemToAdd: ItemCatalogo | null, cantidadToAdd: number): void => {
    if (!itemToAdd || cantidadToAdd <= 0) return

    const precioUnitario = calcularPrecioUnitario(itemToAdd, cantidadToAdd)
    const indiceExistente = carrito.findIndex(
      (carritoItem) => carritoItem.item.id === itemToAdd.id && carritoItem.item.tipo === itemToAdd.tipo,
    )

    if (indiceExistente >= 0) {
      setCarrito((prev) =>
        prev.map((item, index) => {
          if (index === indiceExistente) {
            const nuevaCantidad = item.cantidad + cantidadToAdd
            return {
              ...item,
              cantidad: nuevaCantidad,
              precioUnitarioAplicado: calcularPrecioUnitario(item.item, nuevaCantidad),
            }
          }
          return item
        }),
      )
    } else {
      const nuevoItem: ItemVenta = {
        item: itemToAdd,
        cantidad: cantidadToAdd,
        precioUnitarioAplicado: precioUnitario,
      }
      setCarrito((prev) => [...prev, nuevoItem])
    }
  }

  // Añadir item al carrito
  const añadirManualmente = (): void => {
    if (!itemSeleccionado || cantidad <= 0) return
    añadirItem(itemSeleccionado, cantidad)

    // Limpiar selección del buscador manual
    setBusquedaItem("")
    setItemSeleccionado(null)
    setCantidad(1)
    setMostrarSugerencias(false)

    if (inputBusquedaRef.current) {
      inputBusquedaRef.current.focus()
    }
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
  const descuentoMonto = tipoDescuento === "PORCENTAJE" ? Math.round((totalGeneral * descuento) / 100) : descuento
  const totalConDescuento = Math.max(0, totalGeneral - descuentoMonto)

  // Finalizar venta
  const finalizarVenta = async (): Promise<void> => {
    if (carrito.length === 0 || !metodoPagoSeleccionado) {
      setError("Debe agregar items al carrito y seleccionar un método de pago")
      return
    }

    try {
      setProcesandoVenta(true)
      setError(null)

      const ventaDTO: VentaDTO = {
        metodoDePago: metodoPagoSeleccionado,
        descuento: descuentoMonto,
        detalles: carrito.map((item) => ({
          ...(item.item.tipo === "PRODUCTO" ? { idProducto: item.item.id } : { idPromocion: item.item.id }),
          cantidad: item.cantidad,
        })),
      }

      await crearVenta(ventaDTO)

      toast.success("¡Venta realizada con éxito!")

      setCarrito([])
      setMetodoPagoSeleccionado("")
      setDescuento(0)
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.error(err.response.data)
      } else {
        console.error("Error al procesar la venta")
      }
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
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListPlus className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Nueva Venta</h1>
            <p className="text-gray-600">Registra una nueva venta en el sistema</p>
          </div>
          {error && <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        </div>
      </div>

      {/* Layout principal: dos columnas */}
      <div className="grid grid-cols-[1.5fr_2fr] gap-6">
        {/* Columna Izquierda: Constructor de Venta */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Search className="mr-2" size={20} />
            Constructor de Venta
          </h2>

          {/* Buscador con autocompletado */}
          <div className="relative mb-4">
            <input
              ref={inputBusquedaRef}
              type="text"
              placeholder="Buscar producto o promoción..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={busquedaItem}
              onChange={(e) => {
                setBusquedaItem(e.target.value)
                setMostrarSugerencias(true)
                setItemSeleccionado(null)
              }}
              onFocus={() => setMostrarSugerencias(true)}
              onKeyDown={(e) => {
                if (itemsFiltrados.length === 0) return

                switch (e.key) {
                  case "ArrowDown":
                    e.preventDefault()
                    setActiveIndex((prev) => Math.min(prev + 1, itemsFiltrados.length - 1))
                    break

                  case "ArrowUp":
                    e.preventDefault()
                    setActiveIndex((prev) => Math.max(0, prev - 1))
                    break

                  case "Enter":
                    e.preventDefault()
                    const itemASelleccionar = activeIndex >= 0 ? itemsFiltrados[activeIndex] : itemsFiltrados[0]

                    seleccionarItem(itemASelleccionar)
                    break

                  case "Escape":
                    setMostrarSugerencias(false)
                    break
                }
              }}
            />

            {/* Sugerencias */}
            {mostrarSugerencias && busquedaItem && itemsFiltrados.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
              >
                {itemsFiltrados.slice(0, 10).map((item, index) => (
                  <div
                    key={`${item.tipo}-${item.id}`}
                    onClick={() => seleccionarItem(item)}
                    // 2. Sincronizamos el mouse con el estado activo
                    onMouseEnter={() => setActiveIndex(index)}
                    // 3. Aplicamos un estilo diferente si el item está activo
                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === activeIndex ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.nombre}</span>
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded ${item.tipo === "PRODUCTO" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                        >
                          {item.tipo}
                        </span>
                      </div>
                      <span className="font-semibold text-green-600">{formatCurrency(item.precioFinal)}</span>
                    </div>
                    {item.oferta && (
                      <div className="text-sm text-orange-600 mt-1">
                        Oferta: {item.oferta.cantidadMinima}+ unidades = {formatCurrency(item.oferta.nuevoPrecio)} c/u
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cantidad y botón añadir */}
          <div className="flex gap-3">
            <div className="grid">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={añadirManualmente}
                disabled={!itemSeleccionado}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
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
                Precio unitario: {formatCurrency(calcularPrecioUnitario(itemSeleccionado, cantidad))}
                {itemSeleccionado.oferta && cantidad >= itemSeleccionado.oferta.cantidadMinima && (
                  <span className="text-orange-600 ml-2">(Oferta aplicada)</span>
                )}
              </div>
              <div className="font-semibold text-green-600 mt-1">
                Subtotal: {formatCurrency(calcularPrecioUnitario(itemSeleccionado, cantidad) * cantidad)}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Carrito/Ticket */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShoppingBasket className="mr-2" size={20} />
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
                      <th className="text-left py-2 w-64">Item</th>
                      <th className="text-center py-2">Cant.</th>
                      <th className="text-center py-2">P. Unit.</th>
                      <th className="text-center py-2">Subtotal</th>
                      <th className="text-center py-2 w-[10px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, indice) => (
                      <tr key={indice} className="border-b border-gray-100">
                        <td className="py-3">
                          <div>
                            <div className="font-medium mb-1">{item.item.nombre}</div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${item.item.tipo === "PRODUCTO"
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
                            className="w-[60px] p-1 text-center border border-gray-300 rounded"
                          />
                        </td>
                        <td className="py-3 text-center">{formatCurrency(item.precioUnitarioAplicado)}</td>
                        <td className="py-3 text-center font-semibold">
                          {formatCurrency(item.cantidad * item.precioUnitarioAplicado)}
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
            <div className="mb-4 flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select
                  value={metodoPagoSeleccionado}
                  onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                  className="w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar método de pago</option>
                  {metodosDePago.map((metodo) => (
                    <option key={metodo} value={metodo}>
                      {metodo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {tipoDescuento === "MONTO" ? (
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento por monto ($)
                  </label>
                ) : (
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento por porcentaje (%)
                  </label>
                )}
                <div className="flex gap-2">
                  {tipoDescuento === "MONTO" ? (
                    <InputMoneda
                      value={descuento}
                      onValueChange={(nuevoValor) => {
                        const valorValidado = Math.min(nuevoValor || 0, totalGeneral)
                        setDescuento(valorValidado)
                      }}
                      className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="$ 0"
                    />
                  ) : (
                    <InputPorcentaje
                      value={descuento}
                      onValueChange={(nuevoValor) => setDescuento(nuevoValor)} // El componente ya devuelve el número validado (0-100)
                      className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                      placeholder="0 %"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setTipoDescuento(tipoDescuento === "MONTO" ? "PORCENTAJE" : "MONTO")
                      setDescuento(0)
                    }}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                    title={tipoDescuento === "MONTO" ? "Cambiar a porcentaje" : "Cambiar a monto"}
                  >
                    <RefreshCw size={20} className="text-gray-700" />
                    {/* {tipoDescuento === "MONTO" ? (
                      <DollarSign size={20} className="text-gray-700" />
                    ) : (
                      <Percent size={20} className="text-gray-700" />
                    )} */}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Subtotal:</span>
                <span className="text-lg font-semibold text-gray-700">{formatCurrency(totalGeneral)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-red-600">
                    Descuento {tipoDescuento === "PORCENTAJE" && `(${descuento}%)`}:
                  </span>
                  <span className="text-lg font-semibold text-red-600">-{formatCurrency(descuentoMonto)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-xl font-semibold">Total Final:</span>
                <span className="text-2xl font-bold text-gray-700">{formatCurrency(totalConDescuento)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={finalizarVenta}
                disabled={carrito.length === 0 || !metodoPagoSeleccionado || procesandoVenta}
                className="w-64 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {procesandoVenta ? "Procesando..." : "Finalizar Venta"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginaVentas
