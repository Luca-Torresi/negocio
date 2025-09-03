import axios from "axios"
import type { DescuentoDTO } from "../types/dto/Descuento"

const API_BASE_URL = "http://localhost:8080"

export const crearDescuento = async (data: DescuentoDTO): Promise<any> => {
  try {
    await axios.post(`${API_BASE_URL}/descuento/nuevo`, data)
  } catch (error) {
    console.error("Error al crear descuento:", error)
    throw new Error("No se pudo gestionar el descuento")
  }
}

export const modificarDescuento = async (id: number, data: DescuentoDTO): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/descuento/modificar/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error al modificar descuento:", error)
    throw error
  }
}

// Eliminar descuento
export const eliminarDescuento = async (idDescuento: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/descuento/eliminar/${idDescuento}`)
  } catch (error) {
    console.error("Error al eliminar descuento:", error)
    throw new Error("No se pudo eliminar el descuento")
  }
}
