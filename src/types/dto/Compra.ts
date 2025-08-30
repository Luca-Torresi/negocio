// Para el detalle dentro de una Compra
export interface DetalleCompra {
  producto: string
  cantidad: number
  costoUnitario: number
}

// Corresponde al objeto 'content' de la respuesta paginada
export interface Compra {
  idCompra: number
  total: number
  fechaHora: string
  proveedor: string
  usuario: string
  detalles: DetalleCompra[]
}

// Para la respuesta completa de la API GET /compra/obtener
export interface PaginaDeCompras {
  content: Compra[]
  totalPages: number
  totalElements: number
  number: number // Página actual
  size: number
}

// Para el cuerpo (body) de POST /nueva y PUT /modificar
export interface CompraDTO {
  idProveedor: number
  detalles: {
    idProducto: number
    cantidad: number
  }[]
}
