import axios from "axios"
import type { PaginaDeProductos, ProductoDTO, ProductoLista } from "../types/dto/Producto"

const API_BASE_URL = "http://localhost:8080"

// Obtener productos con filtros y paginación
export const obtenerProductos = async (filtros: any): Promise<PaginaDeProductos> => {
  try {
    const params = new URLSearchParams()

    if (filtros.page !== undefined) params.append("page", filtros.page.toString())
    if (filtros.size !== undefined) params.append("size", filtros.size.toString())
    if (filtros.nombre) params.append("nombre", filtros.nombre)
    if (filtros.idCategoria) params.append("idCategoria", filtros.idCategoria.toString())
    if (filtros.idMarca) params.append("idMarca", filtros.idMarca.toString())
    if (filtros.idProveedor) params.append("idProveedor", filtros.idProveedor.toString())

    const response = await axios.get(`${API_BASE_URL}/producto/abm?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener productos:", error)
    throw new Error("No se pudieron cargar los productos")
  }
}

// Crear nuevo producto
export const crearProducto = async (data: ProductoDTO): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/producto/nuevo`, data)
  } catch (error) {
    console.error("Error al crear producto:", error)
    throw new Error("No se pudo crear el producto")
  }
}

// Modificar producto existente
export const modificarProducto = async (id: number, data: ProductoDTO): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/producto/modificar/${id}`, data)
  } catch (error) {
    console.error("Error al modificar producto:", error)
    throw new Error("No se pudo modificar el producto")
  }
}

// Cambiar estado del producto
export const cambiarEstadoProducto = async (id: number): Promise<void> => {
  try {
    await axios.patch(`${API_BASE_URL}/producto/cambiarEstado/${id}`)
  } catch (error) {
    console.error("Error al cambiar estado del producto:", error)
    throw new Error("No se pudo cambiar el estado del producto")
  }
}

export const obtenerListaProductosPorProveedor = async (idProveedor: number): Promise<ProductoLista[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/producto/listaCompra/${idProveedor}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener lista de productos por proveedor:", error)
    throw new Error("No se pudo cargar la lista de productos del proveedor")
  }
}