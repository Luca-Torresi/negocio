import apiClient from "./interceptors/apiClient"
import type { MarcaLista } from "../types/dto/Producto"

// Obtener lista de marcas para filtros
export const obtenerListaMarcas = async (): Promise<MarcaLista[]> => {
  const response = await apiClient.get(`/marca/lista`)
  return response.data
}
