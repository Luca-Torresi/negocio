// Para el detalle dentro de una Promoción
export interface DetallePromocion {
  idDetallePromocion: number
  idProducto: string
  cantidad: number
}

// Corresponde a la respuesta de GET /promocion/abm
export interface Promocion {
  idPromocion: number
  nombre: string
  descripcion: string
  precio: number
  estado: boolean
  detalles: DetallePromocion[]
}

// Para el cuerpo (body) de POST /nueva y PUT /modificar
export interface PromocionDTO {
  nombre: string
  descripcion: string
  precio: number
  detalles: DetallePromocion[]
}
