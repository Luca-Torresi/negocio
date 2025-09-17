package com.example.negocio.service;

import com.example.negocio.dto.estadistica.*;
import com.example.negocio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class EstadisticaService {
    private final VentaRepository ventaRepository;
    private final GastoRepository gastoRepository;
    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final DetalleVentaRepository detalleVentaRepository;

    public List<List<Object>> obtenerIngresosVsEgresos(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusMonths(1).atStartOfDay();

        List<ResultadoMensualDTO> ingresos = ventaRepository.findIngresosMensuales(inicio, fin);
        List<ResultadoMensualDTO> egresosCompras = compraRepository.findEgresosPorComprasMensuales(inicio, fin);
        List<ResultadoMensualDTO> egresosGastos = gastoRepository.findEgresosPorGastosMensuales(inicio, fin);

        Map<String, IngresosVsEgresosDTO> datosAgrupados = new TreeMap<>();

        ingresos.forEach(ingreso -> {
            datosAgrupados.put(ingreso.getMes(), new IngresosVsEgresosDTO(ingreso.getMes(), ingreso.getTotal(), BigDecimal.ZERO));
        });

        egresosCompras.forEach(egreso -> {
            datosAgrupados.computeIfAbsent(egreso.getMes(), mes -> new IngresosVsEgresosDTO(mes, BigDecimal.ZERO, BigDecimal.ZERO))
                    .setEgresos(datosAgrupados.get(egreso.getMes()).getEgresos().add(egreso.getTotal()));
        });

        egresosGastos.forEach(egreso -> {
            datosAgrupados.computeIfAbsent(egreso.getMes(), mes -> new IngresosVsEgresosDTO(mes, BigDecimal.ZERO, BigDecimal.ZERO))
                    .setEgresos(datosAgrupados.get(egreso.getMes()).getEgresos().add(egreso.getTotal()));
        });

        List<List<Object>> resultadoFinal = new ArrayList<>();
        resultadoFinal.add(List.of("Mes", "Ingresos", "Egresos"));

        datosAgrupados.values().forEach(dato -> {
            resultadoFinal.add(List.of(dato.getMes(), dato.getIngresos(), dato.getEgresos()));
        });

        return resultadoFinal;
    }

    public List<List<Object>> obtenerVentasPorMetodoDePago(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();

        List<GraficoDeConteoDTO> datos = ventaRepository.findVentasPorMetodoDePago(inicio, fin);

        List<List<Object>> resultados = new ArrayList<>();
        resultados.add(List.of("Metodo de Pago", "Ventas"));
        datos.forEach(dato -> {
            resultados.add(List.of(dato.getEtiqueta(),dato.getValor()));
        });

        return resultados;
    }

    public List<List<Object>> obtenerProductosMasRentables(Integer page, LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();
        Integer offset = page * 7;

        List<GraficoGeneralDTO> datos = detalleVentaRepository.findTopProductosMasRentables(offset, inicio, fin);

        List<List<Object>> resultadoParaGrafico = new ArrayList<>();
        resultadoParaGrafico.add(List.of("Producto", "Ganancia"));

        datos.forEach(dato -> {
            resultadoParaGrafico.add(List.of(dato.getEtiqueta(), dato.getValor()));
        });

        return resultadoParaGrafico;
    }

    public List<List<Object>> obtenerVolumenVentas(LocalDate fechaInicio, LocalDate fechaFin, Long idProducto) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();

        List<VolumenVentasDTO> datos;

        if (idProducto == null || idProducto == 0) {
            datos = detalleVentaRepository.findVolumenVentasMensualTotal(inicio, fin);
        } else {
            datos = detalleVentaRepository.findVolumenVentasMensualPorProducto(inicio, fin, idProducto);
        }

        List<List<Object>> resultadoParaGrafico = new ArrayList<>();
        String nombreEncabezado = (datos.isEmpty()) ? "Cantidad Vendida" : datos.get(0).getNombre();
        resultadoParaGrafico.add(List.of("Mes", nombreEncabezado));

        datos.forEach(dato -> {
            resultadoParaGrafico.add(List.of(dato.getMes(), dato.getCantidad()));
        });

        return resultadoParaGrafico;
    }

    public List<List<Object>> obtenerVentasPorHora(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();

        List<VentasPorHoraDTO> datos = ventaRepository.findVentasPorHora(inicio, fin);

        List<List<Object>> resultadoParaGrafico = new ArrayList<>();
        resultadoParaGrafico.add(List.of("Hora del día", "Cantidad de ventas"));

        datos.forEach(dato -> {
            resultadoParaGrafico.add(List.of(dato.getHora(), dato.getCantidad()));
        });

        return resultadoParaGrafico;
    }

    public List<List<Object>> obtenerGraficoVentasPorCategoria(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();

        List<GraficoGeneralDTO> datosCompletos = detalleVentaRepository.findVentasPorCategoria(inicio, fin);

        List<List<Object>> resultadoParaGrafico = new ArrayList<>();
        resultadoParaGrafico.add(List.of("Categoría", "Total Vendido"));

        if (datosCompletos.size() > 4) {
            List<GraficoGeneralDTO> top3 = datosCompletos.subList(0, 4);
            top3.forEach(dato -> resultadoParaGrafico.add(List.of(dato.getEtiqueta(), dato.getValor())));

            BigDecimal sumaOtras = datosCompletos.subList(4, datosCompletos.size()).stream()
                    .map(GraficoGeneralDTO::getValor)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            resultadoParaGrafico.add(List.of("Otras", sumaOtras));

        } else {
            datosCompletos.forEach(dato -> resultadoParaGrafico.add(List.of(dato.getEtiqueta(), dato.getValor())));
        }

        return resultadoParaGrafico;
    }

    public List<KpiDTO> obtenerKpis() {
        BigDecimal totalRecaudado = ventaRepository.findTotalRecaudadoMesActual();
        BigDecimal totalGastos = gastoRepository.findTotalGastosMesActual();
        BigDecimal totalCompras = compraRepository.findTotalComprasMesActual();
        Long cantidadVentas = ventaRepository.countVentasMesActual();
        BigDecimal ticketPromedio = ventaRepository.findTicketPromedioMesActual();
        Long productosStockBajo = productoRepository.countProductosConStockBajo();

        List<KpiDTO> kpis = new ArrayList<>();
        kpis.add(new KpiDTO("Recaudado este Mes", totalRecaudado));
        kpis.add(new KpiDTO("Gastos fijos del Mes", totalGastos));
        kpis.add(new KpiDTO("Compras del Mes", totalCompras));
        kpis.add(new KpiDTO("Ventas de este Mes", cantidadVentas));
        kpis.add(new KpiDTO("Ticket Promedio", ticketPromedio));
        kpis.add(new KpiDTO("Productos Bajo Stock", productosStockBajo));

        return kpis;
    }
}
