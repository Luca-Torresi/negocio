// Item del catálogo unificado que recibimos de la API
export interface ItemCatalogo {
  tipo: "PRODUCTO" | "PROMOCION"
  id: number
  nombre: string
  precioFinal: number // Precio con descuento de % ya aplicado
  oferta?: {
    // El nombre 'oferta' coincide con tu nuevo JSON
    cantidadMinima: number
    nuevoPrecio: number
  } | null
}

// Item en el carrito de la venta actual
export interface ItemVenta {
  item: ItemCatalogo
  cantidad: number
  precioUnitarioAplicado: number
}

// DTO para enviar al backend al crear/modificar una venta
export interface VentaDTO {
  metodoDePago: string 
  descuento: number
  detalles: {
    idProducto?: number
    idPromocion?: number
    cantidad: number
  }[]
}

// Respuesta de venta individual para el historial
export interface VentaHistorial {
  idVenta: number
  total: number
  descuento: number
  metodoDePago: string
  usuario: string
  fechaHora: string  
  detalles: DetalleVentaHistorial[]
}

// Detalle de venta para el historial
export interface DetalleVentaHistorial {  
  nombre: string
  cantidad: number
  precioUnitario: number  
}

// Respuesta paginada de ventas
export interface PaginaDeVentas {
  content: VentaHistorial[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

