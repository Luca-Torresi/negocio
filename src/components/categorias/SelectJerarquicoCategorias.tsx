// src/components/SelectJerarquicoCategorias.tsx

import React, { useState, useEffect, useRef } from 'react';
import type { CategoriaArbol } from '../../types/dto/Categoria';
import { CornerDownRight } from 'lucide-react';

// --- Interfaz para las props del componente ---
interface Props {
  categorias: CategoriaArbol[];
  selectedValue: number | null;
  onSelect: (id: number | null) => void;
  placeholder?: string;
}

// --- Componente recursivo para renderizar cada opción ---
const OpcionRecursiva: React.FC<{ categoria: CategoriaArbol; nivel: number; onSelect: (id: number, nombre: string) => void }> = ({ categoria, nivel, onSelect }) => {
  return (
    <>
      {/* Renderiza la opción actual */}
      <div
        onClick={() => onSelect(categoria.idCategoria, categoria.nombre)}
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        style={{ paddingLeft: `${16 + nivel * 22}px` }}
      >
        {nivel > 0 && <CornerDownRight size={14} className="mr-[8px] flex-shrink-0" />}
        <span className="truncate">{categoria.nombre}</span>
      </div>

      {categoria.hijos.map((hijo) => (
        <OpcionRecursiva key={hijo.idCategoria} categoria={hijo} nivel={nivel + 1} onSelect={onSelect} />
      ))}
    </>
  );
};


// --- Componente principal del Select Jerárquico ---
export const SelectJerarquicoCategorias: React.FC<Props> = ({ categorias, selectedValue, onSelect, placeholder = "Seleccionar categoría" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);
  const ref = useRef<HTMLDivElement>(null);

  // Encontrar la etiqueta del valor seleccionado para mostrarla en el botón
  useEffect(() => {
    if (selectedValue) {
      const encontrarLabel = (nodos: CategoriaArbol[]): string | null => {
        for (const nodo of nodos) {
          if (nodo.idCategoria === selectedValue) return nodo.nombre;
          const labelEncontrada = encontrarLabel(nodo.hijos);
          if (labelEncontrada) return labelEncontrada;
        }
        return null;
      };
      const label = encontrarLabel(categorias);
      setSelectedLabel(label || placeholder);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [selectedValue, categorias, placeholder]);

  // Hook para cerrar el dropdown si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const handleSelect = (id: number, nombre: string) => {
    onSelect(id);
    setSelectedLabel(nombre);
    setIsOpen(false);
  };

  return (
    <div className="relative w-[250px]" ref={ref}>
      {/* Botón que muestra el valor seleccionado y abre/cierra el dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="block truncate">{selectedLabel}</span>
      </button>

      {/* Panel del Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {categorias.map((categoria) => (
            <OpcionRecursiva key={categoria.idCategoria} categoria={categoria} nivel={0} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
};