// src/components/InputMoneda.tsx

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/numberFormatUtils'; // Importamos tu función

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | null;
  onValueChange: (value: number | null) => void;
}

export const InputMoneda: React.FC<Props> = ({ value, onValueChange, ...props }) => {
  const [displayValue, setDisplayValue] = useState('');

  // Sincroniza el valor mostrado cuando el valor numérico cambia desde fuera
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setDisplayValue(formatCurrency(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 1. Limpiamos el input: quitamos todo lo que no sea un número.
    const numeroLimpio = Number(inputValue.replace(/[^0-9]/g, ''));
    
    // 2. Actualizamos el valor numérico en el estado del componente padre.
    //    Dividimos por 100 si no manejas centavos, o puedes ajustarlo.
    //    Para este caso, asumimos que no hay centavos, así que no dividimos.
    onValueChange(numeroLimpio || null);

    // 3. Actualizamos el valor visible formateado.
    setDisplayValue(formatCurrency(numeroLimpio));
  };

  const handleBlur = () => {
    // Al salir del input, nos aseguramos de que el formato sea el correcto
    setDisplayValue(formatCurrency(value));
  }

  return (
    <input
      type="text" // Usamos tipo 'text' para permitir el formato
      inputMode="decimal" // Ayuda en móviles a mostrar el teclado numérico
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
};