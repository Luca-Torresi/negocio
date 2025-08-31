import axios from "axios"
import type { OfertaDTO } from "../types/dto/Oferta"

const API_BASE_URL = "http://localhost:8080"

export const crearOferta = async (data: OfertaDTO): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/oferta/nueva`, data)
    return response.data
  } catch (error) {
    console.error("Error al crear oferta:", error)
    throw error
  }
}

export const modificarOferta = async (id: number, data: OfertaDTO): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/oferta/modificar/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error al modificar oferta:", error)
    throw error
  }
}

export const eliminarOferta = async (id: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/oferta/eliminar/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al eliminar oferta:", error)
    throw error
  }
}
