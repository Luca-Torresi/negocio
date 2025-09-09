import apiClient from "./interceptors/apiClient"
import type { PaginaDeProductos, ProductoDTO, ProductoLista, ProductoVenta } from "../types/dto/Producto"

// Obtener productos con filtros y paginación
export const obtenerProductos = async (filtros: any): Promise<PaginaDeProductos> => {
    const params = new URLSearchParams()

    if (filtros.page !== undefined) params.append("page", filtros.page.toString())
    if (filtros.size !== undefined) params.append("size", filtros.size.toString())
    if (filtros.nombre) params.append("nombre", filtros.nombre)
    if (filtros.idCategoria) params.append("idCategoria", filtros.idCategoria.toString())
    if (filtros.idMarca) params.append("idMarca", filtros.idMarca.toString())
    if (filtros.idProveedor) params.append("idProveedor", filtros.idProveedor.toString())

    const response = await apiClient.get(`/producto/abm?${params.toString()}`)
    return response.data
}

// Crear nuevo producto
export const crearProducto = async (data: ProductoDTO): Promise<void> => {
  await apiClient.post(`/producto/nuevo`, data)
}

// Modificar producto existente
export const modificarProducto = async (id: number, data: ProductoDTO): Promise<void> => {
  await apiClient.put(`/producto/modificar/${id}`, data)
}

// Cambiar estado del producto
export const cambiarEstadoProducto = async (id: number): Promise<void> => {
  await apiClient.patch(`/producto/cambiarEstado/${id}`)
}

export const obtenerListaProductosPorProveedor = async (idProveedor: number): Promise<ProductoLista[]> => {
  const response = await apiClient.get(`/producto/listaCompra/${idProveedor}`)
  return response.data
}

export const obtenerListaProductosVenta = async (): Promise<ProductoVenta[]> => {
  const response = await apiClient.get(`/producto/listaVenta`)
  return response.data
}
