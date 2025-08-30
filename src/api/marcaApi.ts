import axios from "axios"
import type { MarcaLista } from "../types/dto/Producto"

const API_BASE_URL = "http://localhost:8080"

// Obtener lista de marcas para filtros
export const obtenerListaMarcas = async (): Promise<MarcaLista[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/marca/lista`)
    return response.data
  } catch (error) {
    console.error("Error al obtener marcas:", error)
    throw new Error("No se pudieron cargar las marcas")
  }
}
