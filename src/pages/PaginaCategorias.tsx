"use client"

import React, { useState, useEffect } from "react"
import type { Categoria, CrearCategoriaDTO, ModificarCategoriaDTO, CategoriaArbol } from "../types/dto/Categoria"
import { obtenerCategorias, crearCategoria, modificarCategoria, cambiarEstadoCategoria } from "../api/categoriaApi"
import { construirArbolCategorias } from "../utils/categoriaUtils"
import { ModalNuevaCategoria } from "../components/categorias/ModalNuevaCategoria"
import { ModalEditarCategoria } from "../components/categorias/ModalEditarCategoria"
import { ModalDetallesCategoria } from "../components/categorias/ModalDetallesCategoria"
import { ChevronDown, ChevronRight, Eye, Pencil, Tag, Plus, BrushCleaning } from "lucide-react"

type FiltroEstado = "todas" | "activas" | "inactivas"

const PaginaCategorias: React.FC = () => {
  // Estados principales
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de filtros
  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas")

  // Estados de modales
  const [modalNueva, setModalNueva] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalDetalles, setModalDetalles] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null)

  // Estado de expansión de categorías
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<number, boolean>>({})

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias()
  }, [])

  // Transformar a árbol cuando cambian las categorías
  useEffect(() => {
    // Expandir todas las categorías por defecto
    const expandidas: Record<number, boolean> = {}
    categorias.forEach((cat) => {
      if (cat.idCategoriaPadre === null) {
        expandidas[cat.idCategoria] = true
      }
    })
    setCategoriasExpandidas(expandidas)
  }, [categorias])

  const cargarCategorias = async () => {
    try {
      setCargando(true)
      setError(null)
      const data = await obtenerCategorias()
      setCategorias(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setCargando(false)
    }
  }

  const handleCrearCategoria = async (data: CrearCategoriaDTO) => {
    try {
      await crearCategoria(data)
      setModalNueva(false)
      await cargarCategorias()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoría")
    }
  }

  const handleModificarCategoria = async (id: number, data: ModificarCategoriaDTO) => {
    try {
      await modificarCategoria(id, data)
      setModalEditar(false)
      setCategoriaSeleccionada(null)
      await cargarCategorias()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al modificar categoría")
    }
  }

  const handleCambiarEstado = async (id: number) => {
    try {
      await cambiarEstadoCategoria(id)
      await cargarCategorias()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado")
    }
  }

  const toggleExpansion = (idCategoria: number) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [idCategoria]: !prev[idCategoria],
    }))
  }

  // Filtrar categorías
  const categoriasFiltradas = categorias.filter((categoria) => {
    const cumpleNombre = categoria.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    const cumpleEstado =
      filtroEstado === "todas" ||
      (filtroEstado === "activas" && categoria.estado) ||
      (filtroEstado === "inactivas" && !categoria.estado)

    return cumpleNombre && cumpleEstado
  })

  // Renderizar fila de categoría recursivamente
  const renderizarCategoria = (categoria: CategoriaArbol): React.ReactNode => {
    const tieneHijos = categoria.hijos.length > 0
    const estaExpandida = categoriasExpandidas[categoria.idCategoria]

    return (
      <React.Fragment key={categoria.idCategoria}>
        <tr className="border-b hover:bg-gray-50">
          <td className="px-4 py-3">{categoria.idCategoria}</td>
          <td className="px-4 py-3">
            {tieneHijos && (
              <button
                onClick={() => toggleExpansion(categoria.idCategoria)}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                {estaExpandida ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            )}
          </td>
          <td className="px-4 py-3" style={{ paddingLeft: `${16 + categoria.nivel * 40}px` }}>
            <div className="flex items-center">
              {categoria.nombre}
            </div>
          </td>
          <td className="px-4 py-3">{categoria.descripcion}</td>
          <td className="px-4 py-3 text-center">{categoria.productos.length}</td>
          <td className="px-4 py-3">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => {
                  setCategoriaSeleccionada(categoria)
                  setModalDetalles(true)
                }}
                className="text-black"
                title="Ver detalles"
              >
                <Eye size={18} />
              </button>

              <button
                onClick={() => {
                  setCategoriaSeleccionada(categoria)
                  setModalEditar(true)
                }}
                className="text-black"
                title="Editar"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => handleCambiarEstado(categoria.idCategoria)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${categoria.estado
                  ? "bg-green-500 focus:ring-green-500"
                  : "bg-red-400 focus:ring-red-400"
                  }`}
                title={categoria.estado ? "Desactivar" : "Activar"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${categoria.estado ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </td>
        </tr>
        {tieneHijos && estaExpandida && categoria.hijos.map((hijo) => renderizarCategoria(hijo))}
      </React.Fragment>
    )
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando categorías...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
            <p className="text-gray-600">Gestiona las categorías del negocio</p>
          </div>
        </div>
        <button
          onClick={() => setModalNueva(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-6 gap-4 mb-2">

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Buscar por nombre</label>
            <input
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Escriba el nombre de la categoría..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Filtrar por estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="activas">Activas</option>
              <option value="inactivas">Inactivas</option>
            </select>
          </div>

          <div className="flex mt-6">
            <button
              onClick={() => {
                setFiltroNombre("")
                setFiltroEstado("todas")
              }}
              className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <BrushCleaning size={20} />              
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Tabla de Categorías */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700"></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cant. Productos</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>{construirArbolCategorias(categoriasFiltradas).map((categoria) => renderizarCategoria(categoria))}</tbody>
        </table>

        {categoriasFiltradas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron categorías que coincidan con los filtros
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalNuevaCategoria
        isOpen={modalNueva}
        onClose={() => setModalNueva(false)}
        onConfirmar={handleCrearCategoria}
      />

      <ModalEditarCategoria
        isOpen={modalEditar}
        onClose={() => {
          setModalEditar(false)
          setCategoriaSeleccionada(null)
        }}
        onConfirmar={handleModificarCategoria}
        categoria={categoriaSeleccionada}
      />

      <ModalDetallesCategoria
        isOpen={modalDetalles}
        onClose={() => {
          setModalDetalles(false)
          setCategoriaSeleccionada(null)
        }}
        categoria={categoriaSeleccionada}
      />
    </div >
  )
}

export default PaginaCategorias;