"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, Download } from "lucide-react"
import DatePicker from "react-datepicker"
import { descargarReporteDiario, descargarReporteMensual } from "../../api/reporteApi"
import { format } from "date-fns"
import { useEscapeKey } from "../../hooks/useEscapeKey"

interface ModalExportarReporteProps {
  isOpen: boolean
  onClose: () => void
}

const ModalExportarReporte: React.FC<ModalExportarReporteProps> = ({ isOpen, onClose }) => {
  const [tipoReporte, setTipoReporte] = useState<"diario" | "mensual">("diario")
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date())
  const [cargando, setCargando] = useState(false)

  const handleExportar = async () => {
    setCargando(true)
    try {
      // Formato de fecha para enviar a la API (siempre YYYY-MM-DD)
      const fechaParaApi = format(fechaSeleccionada, "yyyy-MM-dd")
      
      // --- INICIO DE LA CORRECCIÓN ---
      let nombreArchivo = ""

      if (tipoReporte === "diario") {
        // Formato para el nombre del archivo diario: "dd-MM-yyyy"
        const fechaFormateada = format(fechaSeleccionada, "dd-MM-yyyy")
        nombreArchivo = `VentasDiarias ${fechaFormateada}.xlsx`
        await descargarReporteDiario(fechaParaApi, nombreArchivo)

      } else { // tipoReporte === "mensual"
        // Formato para el nombre del archivo mensual: "Mes-Año"
        const anio = fechaSeleccionada.getFullYear()
        let nombreMes = fechaSeleccionada.toLocaleDateString('es-ES', { month: 'long' })
        nombreMes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)
        
        nombreArchivo = `Resumen ${nombreMes} ${anio}.xlsx`
        await descargarReporteMensual(fechaParaApi, nombreArchivo)
      }
      // --- FIN DE LA CORRECCIÓN ---

      onClose()
    } catch (error) {
      console.error("Error al exportar reporte:", error)
      alert("Error al generar el reporte. Por favor, intenta nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Exportar Reporte a Excel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={cargando}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Radio buttons para tipo de reporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoReporte"
                  value="diario"
                  checked={tipoReporte === "diario"}
                  onChange={(e) => setTipoReporte(e.target.value as "diario")}
                  className="mr-2"
                  disabled={cargando}
                />
                Reporte Diario
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoReporte"
                  value="mensual"
                  checked={tipoReporte === "mensual"}
                  onChange={(e) => setTipoReporte(e.target.value as "mensual")}
                  className="mr-2"
                  disabled={cargando}
                />
                Reporte Mensual
              </label>
            </div>
          </div>

          {/* DatePicker condicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tipoReporte === "diario" ? "Fecha" : "Mes y Año"}
            </label>
            <DatePicker
              selected={fechaSeleccionada}
              onChange={(date: Date | null) => date && setFechaSeleccionada(date)}
              showMonthYearPicker={tipoReporte === "mensual"}
              locale="es"
              dateFormat={tipoReporte === "diario" ? "dd/MM/yyyy" : "MM/yyyy"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargando}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              onClick={handleExportar}
              className="flex-1 px-4 py-2 bg-[#19754C] text-white rounded-md hover:bg-[#156541] flex items-center justify-center gap-2"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Descargar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalExportarReporte
