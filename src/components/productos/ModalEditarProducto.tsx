"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { ProductoDTO, ProductoAbm, MarcaLista, ProveedorLista } from "../../types/dto/Producto"
import { modificarProducto } from "../../api/productoApi"
import { useCategoriaStore } from "../../store/categoriaStore"
import { obtenerListaMarcas } from "../../api/marcaApi"
import { obtenerListaProveedores } from "../../api/proveedorApi"
import { SelectJerarquicoCategorias } from "../categorias/SelectJerarquicoCategorias"
import { InputMoneda } from "../InputMoneda"

interface Props {
  estaAbierto: boolean
  producto: ProductoAbm | null
  alCerrar: () => void
  alConfirmar: () => void
}

export const ModalEditarProducto: React.FC<Props> = ({ estaAbierto, producto, alCerrar, alConfirmar }) => {
  const [cargando, setCargando] = useState(false)

  // Obtiene las categorías del store de Zustand
  const { categoriasArbol, cargarCategorias } = useCategoriaStore()

  const [marcas, setMarcas] = useState<MarcaLista[]>([])
  const [proveedores, setProveedores] = useState<ProveedorLista[]>([])
  const [formulario, setFormulario] = useState<ProductoDTO>({
    nombre: "",
    codigoDeBarras: "",
    precio: 0,
    costo: 0,
    stock: 0,
    stockMinimo: 0,
    idMarca: 0,
    idCategoria: 0,
    idProveedor: 0,
  })

  // Carga los datos de los selects y rellena el formulario cuando el modal se abre
  useEffect(() => {
    const inicializarModal = async () => {
      if (estaAbierto && producto) {
        try {
          // Carga los datos de los selects
          await cargarCategorias()
          const [marcasData, proveedoresData] = await Promise.all([obtenerListaMarcas(), obtenerListaProveedores()])
          setMarcas(marcasData)
          setProveedores(proveedoresData)

          // Rellena el formulario con los datos del producto
          // (Asumiendo que ProductoAbm ahora incluye los IDs)
          setFormulario({
            nombre: producto.nombre,
            codigoDeBarras: producto.codigoDeBarras,
            precio: producto.precio,
            costo: producto.costo,
            stock: producto.stock,
            stockMinimo: producto.stockMinimo,
            idMarca: marcasData.find((m) => m.nombre === producto.marca)?.idMarca ?? 0,
            idCategoria: producto.idCategoria, // <-- Obtenido directamente
            idProveedor: proveedoresData.find((p) => p.nombre === producto.proveedor)?.idProveedor ?? 0,
          })
        } catch (error) {
          console.error("Error al inicializar modal de edición:", error)
        }
      }
    }
    inicializarModal()
  }, [estaAbierto, producto])

  const manejarCambio = (campo: keyof ProductoDTO, valor: string | number | null): void => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const manejarEnvio = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!producto) return

    setCargando(true)
    try {
      await modificarProducto(producto.idProducto, formulario)
      alConfirmar()
    } catch (error) {
      console.error("Error al modificar producto:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!estaAbierto || !producto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Editar Producto</h2>
          <button onClick={alCerrar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4">
          {/* ... otros campos del formulario (nombre, precio, etc.) ... */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
            <input
              type="text"
              value={formulario.codigoDeBarras}
              onChange={(e) => manejarCambio("codigoDeBarras", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el código de barras"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <InputMoneda
                value={formulario.precio}
                onValueChange={(nuevoValor) => manejarCambio("precio", nuevoValor || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ 0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo *</label>
              <InputMoneda
                value={formulario.costo}
                onValueChange={(nuevoValor) => manejarCambio("costo", nuevoValor || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$ 0"
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
                min="0"
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
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <SelectJerarquicoCategorias
              categorias={categoriasArbol}
              selectedValue={formulario.idCategoria === 0 ? null : formulario.idCategoria}
              onSelect={(id) => manejarCambio("idCategoria", id ?? 0)}
              placeholder="Seleccionar categoría"
            />
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
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
