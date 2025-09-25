"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Package, Plus, Eye, Pencil, Percent, Gift, ChevronLeft, ChevronRight, AlertTriangle, BrushCleaning, Settings } from "lucide-react"
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
import { ModalGestionarMarcas } from "../components/marcas/ModalGestionarMarcas"

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
    bajoStock: false,
    page: 0,
    size: 25,
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
  const [modalMarcasAbierto, setModalMarcasAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoAbm | null>(null)

  // Cargar productos cada vez que cambien los filtros
  useEffect(() => {
    cargarProductos()
  }, [
    filtros.nombre,
    filtros.idCategoria,
    filtros.idMarca,
    filtros.idProveedor,
    filtros.bajoStock,
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
      console.error("No fue posible cargar los productos")
    } finally {
      setCargando(false)
    }
  }

  const manejarCambioFiltro = (campo: string, valor: string | number | boolean): void => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
      page: 0,
    }))
  }

  const limpiarFiltros = (): void => {
    setFiltros({
      nombre: "",
      idCategoria: 0,
      idMarca: 0,
      idProveedor: 0,
      bajoStock: false,
      page: 0,
      size: 10,
    })
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
    setModalMarcasAbierto(false)
    setProductoSeleccionado(null)
  }

  const confirmarAccion = (): void => {
    cerrarModales()
    cargarProductos()
  }

  const recargarDatosSelect = async (): Promise<void> => {
    try {
      const [marcasData, proveedoresData] = await Promise.all([obtenerListaMarcas(), obtenerListaProveedores()])
      setMarcas(marcasData)
      setProveedores(proveedoresData)
    } catch (error) {
      console.error("Error al cargar datos de los select:", error)
    }
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
          <Package className="text-primary" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
            <p className="text-gray-600">Gestiona las productos del negocio</p>
          </div>
        </div>

        <button
          onClick={() => setModalNuevoAbierto(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>


      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="inline-grid grid-cols-[1fr_0.7fr_0.6fr_0.6fr_0.63fr_auto] gap-4 mb-2">
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
              <option value={0}>Todas</option>
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
              <option value={0}>Todos</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end mb-1">
            <button
              onClick={() => manejarCambioFiltro("bajoStock", !filtros.bajoStock)}
              className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${filtros.bajoStock
                ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              <AlertTriangle size={16} className="mr-2" />
              Solo Bajo Stock
            </button>
          </div>

          <div className="flex mt-5">
            <button
              onClick={limpiarFiltros}
              className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              title="Limpiar filtros"
            >
              <BrushCleaning size={20} />
            </button>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mes anterior
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="flex px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                      <button
                        onClick={() => setModalMarcasAbierto(true)}
                        className="pl-2 text-gray-700 hover:bg-gray-50"
                        title="Administrar Marcas"
                      >
                        <Settings size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">Compra: {producto.cantComprada} - Venta: {producto.cantVendida}</td>
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
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${!producto.marca
                        ? 'text-gray-400 italic'
                        : 'text-gray-900'
                        }`}>
                        {producto.marca || "Sin Marca"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center space-x-2">
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${producto.estado ? "bg-toggleOn focus:ring-toggleOn" : "bg-toggleOff focus:ring-toggleOff"
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
            {datosProductos && (
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
                  <div className="flex items-center space-x-4">
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
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
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

                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Página {datosProductos.number + 1} de {datosProductos.totalPages}
                      </span>

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
      <ModalNuevoProducto isOpen={modalNuevoAbierto} onClose={cerrarModales} alConfirmar={confirmarAccion} />

      <ModalEditarProducto
        isOpen={modalEditarAbierto}
        producto={productoSeleccionado}
        onClose={cerrarModales}
        alConfirmar={confirmarAccion}
      />

      <ModalDetallesProducto
        isOpen={modalDetallesAbierto}
        producto={productoSeleccionado}
        onClose={cerrarModales}
      />

      <ModalGestionarDescuento
        isOpen={modalDescuentoAbierto}
        producto={productoSeleccionado}
        onClose={cerrarModales}
        alConfirmar={confirmarAccion}
      />

      <ModalGestionarOferta
        isOpen={modalOfertaAbierto}
        producto={productoSeleccionado}
        onClose={cerrarModales}
        alConfirmar={confirmarAccion}
      />

      <ModalGestionarMarcas
        isOpen={modalMarcasAbierto}
        onClose={() => setModalMarcasAbierto(false)}
        onDataChange={recargarDatosSelect}
      />
    </div>
  )
}
