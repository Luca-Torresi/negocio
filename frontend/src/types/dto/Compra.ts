export interface DetalleCompra {
  producto: string
  cantidad: number
  costoUnitario: number
}

// Corresponde al objeto 'content' de la respuesta paginada
export interface Compra {
  idCompra: number
  total: number
  descuento?: number | null
  fechaHora: string
  proveedor: string
  usuario: string
  detalles: DetalleCompra[]
}

export interface PaginaDeCompras {
  content: Compra[]
  totalPages: number
  totalElements: number
  number: number 
  size: number
}

export interface CompraDTO {
  idProveedor: number
  descuento?: number | null
  detalles: {
    idProducto: number
    cantidad: number
  }[]
}
