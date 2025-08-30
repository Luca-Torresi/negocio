import type { Categoria, CategoriaArbol } from "../types/dto/Categoria"

// Transformar lista plana de categorías en estructura de árbol
export const transformarAArbol = (categorias: Categoria[]): CategoriaArbol[] => {
  const mapa = new Map<number, CategoriaArbol>()
  const raices: CategoriaArbol[] = []

  // Crear mapa de categorías con estructura de árbol
  categorias.forEach((categoria) => {
    mapa.set(categoria.idCategoria, {
      ...categoria,
      hijos: [],
      nivel: 0,
    })
  })

  // Construir la jerarquía
  categorias.forEach((categoria) => {
    const nodoActual = mapa.get(categoria.idCategoria)!

    if (categoria.idCategoriaPadre === null) {
      // Es una categoría raíz
      raices.push(nodoActual)
    } else {
      // Es una subcategoría
      const padre = mapa.get(categoria.idCategoriaPadre)
      if (padre) {
        nodoActual.nivel = padre.nivel + 1
        padre.hijos.push(nodoActual)
      }
    }
  })

  return raices
}

// Generar opciones para select con indentación visual
export const generarOpcionesSelect = (categorias: CategoriaArbol[]): { value: number; label: string }[] => {
  const opciones: { value: number; label: string }[] = []

  const procesarNodo = (nodo: CategoriaArbol) => {
    const indentacion = "  ".repeat(nodo.nivel)
    const prefijo = nodo.nivel > 0 ? "└ " : ""
    opciones.push({
      value: nodo.idCategoria,
      label: `${indentacion}${prefijo}${nodo.nombre}`,
    })

    nodo.hijos.forEach((hijo) => procesarNodo(hijo))
  }

  categorias.forEach((raiz) => procesarNodo(raiz))
  return opciones
}
