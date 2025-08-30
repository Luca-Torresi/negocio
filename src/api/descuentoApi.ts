import axios from "axios"
import type { DescuentoDTO } from "../types/dto/Descuento"

const API_BASE_URL = "http://localhost:8080"

// Crear o modificar descuento
export const crearOModificarDescuento = async (data: DescuentoDTO): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/descuento/nuevo`, data)
  } catch (error) {
    console.error("Error al gestionar descuento:", error)
    throw new Error("No se pudo gestionar el descuento")
  }
}

// Eliminar descuento
export const eliminarDescuento = async (idProducto: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/descuento/eliminar/${idProducto}`)
  } catch (error) {
    console.error("Error al eliminar descuento:", error)
    throw new Error("No se pudo eliminar el descuento")
  }
}
