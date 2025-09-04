"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Package, Plus, Eye, Pencil, Percent, Gift, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import type { PaginaDeProductos, ProductoAbm, MarcaLista, ProveedorLista } from "../types/dto/Producto"
import { obtenerProductos, cambiarEstadoProducto } from "../api/productoApi"
import { useCategoriaStore } from "../store/categoriaStore"
import { SelectJerarquicoCategorias } from "../components/categorias/SelectJerarquicoCategorias"
import { obtenerListaMarcas } from "../api/marcaApi"
import { obtenerListaProveedores } from "../api/proveedorApi"
import { ModalNuevoProducto } from "../components/productos/ModalNuevoProducto"
import { ModalEditarProducto } from "../components/productos/ModalEditarProducto"
import { ModalDetallesProducto } from "../components/productos/ModalDetallesProducto"
import { formatCurrency } from "../utils/numberFormatUtils"
import { ModalGestionarDescuento } from "../components/productos/ModalGestionarDescuento"
import { ModalGestionarOferta } from "../components/productos/ModalGestionarOferta"

export const PaginaProductos: React.FC = () => {
  const [datosProductos, setDatosProductos] = useState<PaginaDeProductos | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    nombre: "",
    idCategoria: 0,
    idMarca: 0,
    idProveedor: 0,
    page: 0,
    size: 10,
  })

  // Estados para las listas de los select
  const [marcas, setMarcas] = useState<MarcaLista[]>([])
  const [proveedores, setProveedores] = useState<ProveedorLista[]>([])

  const categoriasArbol = useCategoriaStore((state) => state.categoriasArbol);
  const cargarCategorias = useCategoriaStore((state) => state.cargarCategorias);

  // Estados para los modales
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false)
  const [modalDescuentoAbierto, setModalDescuentoAbierto] = useState(false)
  const [modalOfertaAbierto, setModalOfertaAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoAbm | null>(null)

  // Cargar productos cada vez que cambien los filtros
  useEffect(() => {
    cargarProductos()
  }, [
    filtros.nombre,
    filtros.idCategoria,
    filtros.idMarca,
    filtros.idProveedor,
    filtros.page,
    filtros.size
  ]);

  useEffect(() => {
    const cargarDatosSelect = async (): Promise<void> => {
      try {
        await cargarCategorias()

        const [marcasData, proveedoresData] = await Promise.all([obtenerListaMarcas(), obtenerListaProveedores()])
        setMarcas(marcasData)
        setProveedores(proveedoresData)
      } catch (error) {
        console.error("Error al cargar datos de los select:", error)
      }
    }

    cargarDatosSelect()
  }, []) // Removido cargarCategorias de las dependencias para evitar bucle infinito

  const cargarProductos = async (): Promise<void> => {
    setCargando(true)
    setError(null)

    try {
      const datos = await obtenerProductos(filtros)
      setDatosProductos(datos)
    } catch (error) {
      setError("Error al cargar los productos")
      console.error("Error:", error)
    } finally {
      setCargando(false)
    }
  }

  const manejarCambioFiltro = (campo: string, valor: string | number): void => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      page: 0, // Resetear a la primera página cuando cambian los filtros
    }))
  }

  const manejarCambioPagina = (nuevaPagina: number): void => {
    setFiltros((prev) => ({
      ...prev,
      page: nuevaPagina,
    }))
  }

  const manejarCambioTamano = (nuevoTamano: number): void => {
    setFiltros((prev) => ({
      ...prev,
      size: nuevoTamano,
      page: 0,
    }))
  }

  const manejarCambiarEstado = async (id: number): Promise<void> => {
    try {
      await cambiarEstadoProducto(id)
      cargarProductos()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  const abrirModalEditar = (producto: ProductoAbm): void => {
    setProductoSeleccionado(producto)
    setModalEditarAbierto(true)
  }

  const abrirModalDetalles = (producto: ProductoAbm): void => {
    setProductoSeleccionado(producto)
    setModalDetallesAbierto(true)
  }

  const abrirModalDescuento = (producto: ProductoAbm): void => {
    setProductoSeleccionado(producto)
    setModalDescuentoAbierto(true)
  }

  const abrirModalOferta = (producto: ProductoAbm): void => {
    setProductoSeleccionado(producto)
    setModalOfertaAbierto(true)
  }

  const cerrarModales = (): void => {
    setModalNuevoAbierto(false)
    setModalEditarAbierto(false)
    setModalDetallesAbierto(false)
    setModalDescuentoAbierto(false)
    setModalOfertaAbierto(false)
    setProductoSeleccionado(null)
  }

  const confirmarAccion = (): void => {
    cerrarModales()
    cargarProductos()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={cargarProductos} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
            <p className="text-gray-600">Gestiona las productos del negocio</p>
          </div>
        </div>
        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <input
              type="text"
              value={filtros.nombre}
              onChange={(e) => manejarCambioFiltro("nombre", e.target.value)}
              placeholder="Escribir nombre..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <SelectJerarquicoCategorias
              categorias={categoriasArbol}
              selectedValue={filtros.idCategoria === 0 ? null : filtros.idCategoria}
              onSelect={(id) => manejarCambioFiltro("idCategoria", id ?? 0)}
              placeholder="Todas las categorías"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <select
              value={filtros.idMarca}
              onChange={(e) => manejarCambioFiltro("idMarca", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Todas las marcas</option>
              {marcas.map((marca) => (
                <option key={marca.idMarca} value={marca.idMarca}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
            <select
              value={filtros.idProveedor}
              onChange={(e) => manejarCambioFiltro("idProveedor", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Todos los proveedores</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Suma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datosProductos?.content.map((producto) => (
                    <tr key={producto.idProducto} className="hover:bg-opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.idProducto}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{producto.categoria}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {producto.precioConDescuento ? (
                          <div>
                            <div className="line-through text-gray-500">{formatCurrency(producto.precio)}</div>
                            <div className="text-gray-900 font-semibold text-lg">
                              {formatCurrency(producto.precioConDescuento)}
                            </div>
                          </div>
                        ) : (
                          <div className="font-semibold">{formatCurrency(producto.precio)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.stockSuma}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">                       
                        <span
                          className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${producto.stock <= producto.stockMinimo
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {producto.stock <= producto.stockMinimo && (
                            <AlertTriangle size={16} className="mr-1.5" />
                          )}
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.marca}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => abrirModalDetalles(producto)}
                            className="text-black"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button onClick={() => abrirModalEditar(producto)} className="text-black" title="Editar">
                            <Pencil size={18} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => abrirModalDescuento(producto)}
                              className="text-black"
                              title="Descuento %"
                            >
                              <Percent size={18} />
                            </button>
                            {producto.porcentaje && producto.porcentaje > 0 && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="relative">
                            <button
                              onClick={() => abrirModalOferta(producto)}
                              className="text-black"
                              title="Oferta por Cantidad"
                            >
                              <Gift size={18} />
                            </button>
                            {producto.cantidadMinima && producto.nuevoPrecio && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          <button
                            onClick={() => manejarCambiarEstado(producto.idProducto)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${producto.estado ? "bg-green-500 focus:ring-green-500" : "bg-red-400 focus:ring-red-400"
                              }`}
                            title={producto.estado ? "Desactivar" : "Activar"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${producto.estado ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {datosProductos && datosProductos.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => manejarCambioPagina(datosProductos.number - 1)}
                    disabled={datosProductos.number === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => manejarCambioPagina(datosProductos.number + 1)}
                    disabled={datosProductos.number >= datosProductos.totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{datosProductos.number * datosProductos.size + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min((datosProductos.number + 1) * datosProductos.size, datosProductos.totalElements)}
                      </span>{" "}
                      de <span className="font-medium">{datosProductos.totalElements}</span> resultados
                    </p>
                    <select
                      value={filtros.size}
                      onChange={(e) => manejarCambioTamano(Number.parseInt(e.target.value))}
                      className="ml-4 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={5}>5 por página</option>
                      <option value={10}>10 por página</option>
                      <option value={25}>25 por página</option>
                      <option value={50}>50 por página</option>
                    </select>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => manejarCambioPagina(datosProductos.number - 1)}
                        disabled={datosProductos.number === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {Array.from({ length: datosProductos.totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => manejarCambioPagina(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${i === datosProductos.number
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => manejarCambioPagina(datosProductos.number + 1)}
                        disabled={datosProductos.number >= datosProductos.totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <ModalNuevoProducto estaAbierto={modalNuevoAbierto} alCerrar={cerrarModales} alConfirmar={confirmarAccion} />

      <ModalEditarProducto
        estaAbierto={modalEditarAbierto}
        producto={productoSeleccionado}
        alCerrar={cerrarModales}
        alConfirmar={confirmarAccion}
      />

      <ModalDetallesProducto
        estaAbierto={modalDetallesAbierto}
        producto={productoSeleccionado}
        alCerrar={cerrarModales}
      />

      <ModalGestionarDescuento
        estaAbierto={modalDescuentoAbierto}
        producto={productoSeleccionado}
        alCerrar={cerrarModales}
        alConfirmar={confirmarAccion}
      />

      <ModalGestionarOferta
        estaAbierto={modalOfertaAbierto}
        producto={productoSeleccionado}
        alCerrar={cerrarModales}
        alConfirmar={confirmarAccion}
      />
    </div>
  )
}
