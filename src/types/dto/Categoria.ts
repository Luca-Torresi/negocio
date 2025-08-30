// Para el GET /categoria/abm
export interface Categoria {
  idCategoria: number
  nombre: string
  color: string
  estado: boolean
  idCategoriaPadre: number | null
  productos: { nombre: string; precio: number }[]
}

// Para el POST /categoria/nueva
export interface CrearCategoriaDTO {
  nombre: string
  color: string
  idCategoriaPadre: number | null
}

// Para el PUT /categoria/modificar/{id}
export interface ModificarCategoriaDTO {
  nombre: string
  color: string
  idCategoriaPadre: number | null
}

// Interfaz para la estructura de árbol de categorías
export interface CategoriaArbol extends Categoria {
  hijos: CategoriaArbol[]
  nivel: number
}
