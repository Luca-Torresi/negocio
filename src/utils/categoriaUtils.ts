// src/utils/categoriaUtils.ts

import type { Categoria, CategoriaArbol } from "../types/dto/Categoria";

/**
 * Transforma una lista plana de categorías en una estructura de árbol jerárquico.
 * @param categorias La lista plana de categorías obtenida de la API.
 * @returns Un array de categorías raíz, donde cada una contiene a sus hijos anidados.
 */
export const construirArbolCategorias = (categorias: Categoria[]): CategoriaArbol[] => {
  // Usamos un Map para un acceso súper rápido a cada categoría por su ID.
  const mapa = new Map<number, CategoriaArbol>();
  const raices: CategoriaArbol[] = [];

  // 1. Primer paso: Inicializamos el mapa con todas las categorías.
  // Cada categoría se convierte en un nodo de árbol con una lista de hijos vacía.
  categorias.forEach((categoria) => {
    mapa.set(categoria.idCategoria, {
      ...categoria,
      hijos: [],
      nivel: 0, // El nivel se calculará correctamente en el siguiente paso.
    });
  });

  // 2. Segundo paso: Conectamos los hijos con sus padres para construir el árbol.
  mapa.forEach((nodo) => {
    if (nodo.idCategoriaPadre !== null && mapa.has(nodo.idCategoriaPadre)) {
      // Si el nodo tiene un padre, lo añadimos a la lista de hijos de ese padre.
      const padre = mapa.get(nodo.idCategoriaPadre)!;
      padre.hijos.push(nodo);
    } else {
      // Si el nodo no tiene padre, es una categoría raíz.
      raices.push(nodo);
    }
  });

  // 3. (Opcional pero recomendado) Hacemos una pasada final para asignar el nivel de profundidad.
  const asignarNivel = (nodos: CategoriaArbol[], nivel: number) => {
    nodos.forEach(nodo => {
      nodo.nivel = nivel;
      asignarNivel(nodo.hijos, nivel + 1);
    });
  };

  asignarNivel(raices, 0);

  return raices;
};