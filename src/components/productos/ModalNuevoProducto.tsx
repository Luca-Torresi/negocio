"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoDTO, CategoriaLista, MarcaLista, ProveedorLista } from "../../types/dto/Producto"
import { crearProducto } from "../../api/productoApi"
import { obtenerListaCategorias } from "../../api/categoriaApi"
import { obtenerListaMarcas } from "../../api/marcaApi"
import { obtenerListaProveedores } from "../../api/proveedorApi"

interface Props {
  estaAbierto: boolean
  alCerrar: () => void
  alConfirmar: () => void
}

export const ModalNuevoProducto: React.FC<Props> = ({ estaAbierto, alCerrar, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)
  const [categorias, setCategorias] = useState<CategoriaLista[]>([])
  const [marcas, setMarcas] = useState<MarcaLista[]>([])
  const [proveedores, setProveedores] = useState<ProveedorLista[]>([])
  const [formulario, setFormulario] = useState<ProductoDTO>({
    nombre: "",
    precio: 0,
    costo: 0,
    stock: 0,
    stockMinimo: 0,
    idMarca: 0,
    idCategoria: 0,
    idProveedor: 0,
  })

  useEffect(() => {
    if (estaAbierto) {
      cargarDatosSelect()
    }
  }, [estaAbierto])

  const cargarDatosSelect = async (): Promise<void> => {
    try {
      const [categoriasData, marcasData, proveedoresData] = await Promise.all([
        obtenerListaCategorias(),
        obtenerListaMarcas(),
        obtenerListaProveedores(),
      ])
      setCategorias(categoriasData)
      setMarcas(marcasData)
      setProveedores(proveedoresData)
    } catch (error) {
      console.error("Error al cargar datos de los select:", error)
    }
  }

  const manejarCambio = (campo: keyof ProductoDTO, valor: string | number): void => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const manejarEnvio = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setCargando(true)

    try {
      await crearProducto(formulario)
      alConfirmar()
      setFormulario({
        nombre: "",
        precio: 0,
        costo: 0,
        stock: 0,
        stockMinimo: 0,
        idMarca: 0,
        idCategoria: 0,
        idProveedor: 0,
      })
    } catch (error) {
      console.error("Error al crear producto:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!estaAbierto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Nuevo Producto</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={formulario.nombre}
              onChange={(e) => manejarCambio("nombre", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <input
                type="number"
                step="0.01"
                value={formulario.precio}
                onChange={(e) => manejarCambio("precio", Number.parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo *</label>
              <input
                type="number"
                step="0.01"
                value={formulario.costo}
                onChange={(e) => manejarCambio("costo", Number.parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                value={formulario.stock}
                onChange={(e) => manejarCambio("stock", Number.parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo *</label>
              <input
                type="number"
                value={formulario.stockMinimo}
                onChange={(e) => manejarCambio("stockMinimo", Number.parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              value={formulario.idCategoria}
              onChange={(e) => manejarCambio("idCategoria", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <select
              value={formulario.idMarca}
              onChange={(e) => manejarCambio("idMarca", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Seleccionar marca</option>
              {marcas.map((marca) => (
                <option key={marca.idMarca} value={marca.idMarca}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor *</label>
            <select
              value={formulario.idProveedor}
              onChange={(e) => manejarCambio("idProveedor", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Seleccionar proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={alCerrar}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {cargando ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
