package com.example.negocio.service;

import com.example.negocio.dto.reporte.ReporteMetodoDePagoDTO;
import com.example.negocio.dto.reporte.ReporteProductosDTO;
import com.example.negocio.dto.reporte.ReporteVentasDTO;
import com.example.negocio.repository.DetalleVentaRepository;
import com.example.negocio.repository.ProductoRepository;
import com.example.negocio.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ProductoRepository productoRepository;

    public ByteArrayInputStream generarExcelVentasDiario(LocalDate fecha) throws IOException {
        LocalDateTime inicioDelDia = fecha.atStartOfDay();
        LocalDateTime finDelDia = fecha.plusDays(1).atStartOfDay();

        List<ReporteVentasDTO> datosDetallados = detalleVentaRepository.findDatosParaReporteVentas(inicioDelDia, finDelDia);

        BigDecimal totalRecaudadoReal = ventaRepository.findRecaudadoVentasDiarias(inicioDelDia, finDelDia);

        BigDecimal sumaProductosRegistrados = datosDetallados.stream()
                .map(dto -> dto.getPrecio().multiply(BigDecimal.valueOf(dto.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalAdicionalesDiario = ventaRepository.sumMontoAdicionalPorFechas(inicioDelDia, finDelDia);

        BigDecimal totalTeorico = sumaProductosRegistrados.add(totalAdicionalesDiario);

        BigDecimal totalDescuentos = totalTeorico.subtract(totalRecaudadoReal);

        List<ReporteMetodoDePagoDTO> desglosePagos = ventaRepository.obtenerTotalesPorMetodoPago(inicioDelDia, finDelDia);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet();

            // --- 1. CREACIÓN DE ESTILOS ---
            DataFormat currencyFormat = workbook.createDataFormat();

            // Estilo para encabezados
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);

            CellStyle headerStyleLeft = workbook.createCellStyle();
            headerStyleLeft.setFont(headerFont);

            CellStyle headerStyleCentered = workbook.createCellStyle();
            headerStyleCentered.cloneStyleFrom(headerStyleLeft);
            headerStyleCentered.setAlignment(HorizontalAlignment.CENTER);

            CellStyle headerStyleRight = workbook.createCellStyle();
            headerStyleRight.cloneStyleFrom(headerStyleLeft);
            headerStyleRight.setAlignment(HorizontalAlignment.RIGHT);

            // Estilo para filas de datos
            CellStyle dataRowStyle = workbook.createCellStyle();

            // Estilo para celdas de moneda
            CellStyle currencyCellStyle = workbook.createCellStyle();
            currencyCellStyle.setDataFormat(currencyFormat.getFormat("$ #,##0"));

            CellStyle negativeCurrencyCellStyle = workbook.createCellStyle();
            negativeCurrencyCellStyle.setDataFormat(currencyFormat.getFormat("- $ #,##0"));

            // Estilo de celdas de cantidad
            CellStyle quantityStyle = workbook.createCellStyle();
            quantityStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle totalLabelStyle = workbook.createCellStyle();
            totalLabelStyle.setFont(headerFont);

            // --- 2. CREACIÓN DE FILAS Y CELDAS ---
            // Fila de Encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Producto", "Cantidad Vendida", "Subtotal"};
            headerRow.createCell(0).setCellValue(headers[0]);
            headerRow.createCell(1).setCellValue(headers[1]);
            headerRow.createCell(2).setCellValue(headers[2]);
            headerRow.getCell(0).setCellStyle(headerStyleLeft);
            headerRow.getCell(1).setCellStyle(headerStyleCentered);
            headerRow.getCell(2).setCellStyle(headerStyleRight);

            // Filas de Datos
            int rowIdx = 1;
            for (ReporteVentasDTO dto : datosDetallados) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(dto.getProducto());
                Cell quantityCell = row.createCell(1);
                quantityCell.setCellValue(dto.getCantidad());
                quantityCell.setCellStyle(quantityStyle);
                Cell subtotalCell = row.createCell(2);
                subtotalCell.setCellValue(dto.getPrecio().multiply(BigDecimal.valueOf(dto.getCantidad())).doubleValue());
                subtotalCell.setCellStyle(currencyCellStyle);
                // Aplicamos el estilo de fila
                row.getCell(0).setCellStyle(dataRowStyle);
            }

            // Fila Otros (Permanecen en la tabla principal)
            Row totalAdicionalesRow = sheet.createRow(rowIdx++);
            Cell otrosCell = totalAdicionalesRow.createCell(0);
            otrosCell.setCellValue("Otros");
            otrosCell.setCellStyle(dataRowStyle);
            Cell cantidadCell = totalAdicionalesRow.createCell(1);
            cantidadCell.setCellValue("-");
            cantidadCell.setCellStyle(quantityStyle);
            Cell totalAdicionalesCell = totalAdicionalesRow.createCell(2);
            totalAdicionalesCell.setCellValue(totalAdicionalesDiario.doubleValue());
            totalAdicionalesCell.setCellStyle(currencyCellStyle);

            // --- SECCIÓN DERECHA: Resúmenes y Desglose ---
            int colResumen = 4; // Columna F (0 based -> 5)

            Row rowResumenDiario = sheet.getRow(1); 
            Cell resumenDiarioCell = rowResumenDiario.createCell(colResumen);
            resumenDiarioCell.setCellValue("Resumen diario");
            resumenDiarioCell.setCellStyle(totalLabelStyle);

            // Fila de Total Teórico
            // Aprovechamos las filas existentes, comenzando desde la fila 1 (row index 1)
            Row totalTeoricoRow = sheet.getRow(2);
            if (totalTeoricoRow == null) totalTeoricoRow = sheet.createRow(2);
            
            Cell totalTeoricoLabel = totalTeoricoRow.createCell(colResumen);
            totalTeoricoLabel.setCellValue("Total teórico:");
            
            Cell totalTeoricoCell = totalTeoricoRow.createCell(colResumen + 1);
            totalTeoricoCell.setCellValue(totalTeorico.doubleValue());
            totalTeoricoCell.setCellStyle(currencyCellStyle);

            // Fila de Descuentos
            Row descuentosRow = sheet.getRow(3);
            if (descuentosRow == null) descuentosRow = sheet.createRow(3);

            Cell descuentosLabelCell = descuentosRow.createCell(colResumen);
            descuentosLabelCell.setCellValue("Descuentos, ofertas y promociones:");

            Cell totalDescuentosCell = descuentosRow.createCell(colResumen + 1);
            totalDescuentosCell.setCellValue(totalDescuentos.doubleValue());
            totalDescuentosCell.setCellStyle(negativeCurrencyCellStyle);

            // Fila de Total Recaudado
            Row totalRealRow = sheet.getRow(4);
            if (totalRealRow == null) totalRealRow = sheet.createRow(4);

            Cell totalRealLabelCell = totalRealRow.createCell(colResumen);
            totalRealLabelCell.setCellValue("Total recaudado:");

            Cell totalRealCell = totalRealRow.createCell(colResumen + 1);
            totalRealCell.setCellValue(totalRecaudadoReal.doubleValue());
            totalRealCell.setCellStyle(currencyCellStyle);
            
            // --- Tabla de Métodos de Pago (Debajo de los resúmenes de la derecha) ---
            int rowIdxPagos = 6; // Dejamos una fila de espacio (fila 4 vacía)

            Row headerPagos = sheet.getRow(rowIdxPagos);
            if (headerPagos == null) headerPagos = sheet.createRow(rowIdxPagos);
            
            rowIdxPagos++;

            Cell metodosDePagoCell = headerPagos.createCell(colResumen);
            metodosDePagoCell.setCellValue("Método de pago");
            metodosDePagoCell.setCellStyle(totalLabelStyle);
            
            Cell metodosMontoCell = headerPagos.createCell(colResumen + 1);
            metodosMontoCell.setCellValue("Monto");
            metodosMontoCell.setCellStyle(headerStyleRight);

            // --- Llenar los datos de pagos ---
            for (ReporteMetodoDePagoDTO item : desglosePagos) {
                Row row = sheet.getRow(rowIdxPagos);
                if (row == null) row = sheet.createRow(rowIdxPagos);
                
                // Columna Nombre
                row.createCell(colResumen).setCellValue(item.getMetodoDePago().toString());

                // Columna Monto
                Cell cellMonto = row.createCell(colResumen + 1);
                cellMonto.setCellValue(item.getTotal().doubleValue());
                cellMonto.setCellStyle(currencyCellStyle);
                
                rowIdxPagos++;
            }
            
            // Autoajustar columnas del resumen
            sheet.autoSizeColumn(colResumen);
            sheet.autoSizeColumn(colResumen + 1);
            sheet.setColumnWidth(colResumen, sheet.getColumnWidth(colResumen) + 512);
            sheet.setColumnWidth(colResumen + 1, sheet.getColumnWidth(colResumen + 1) + 512);

            // Autoajustar el ancho de las columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 512);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generarExcelMensual(LocalDate fecha) throws IOException {
        LocalDate primerDiaDelMes = fecha.withDayOfMonth(1);

        LocalDateTime inicioDelMes = primerDiaDelMes.atStartOfDay();
        LocalDateTime finDelMes = primerDiaDelMes.plusMonths(1).atStartOfDay();

        // --- OBTENCIÓN DE DATOS ---
        List<ReporteVentasDTO> datosDetallados = detalleVentaRepository.findDatosParaReporteVentas(inicioDelMes, finDelMes);
        List<ReporteProductosDTO> datosInventario = productoRepository.findDatosParaReportesMensuales(); // <-- Usaremos este nombre
        BigDecimal totalRecaudadoReal = ventaRepository.findRecaudadoVentasDiarias(inicioDelMes, finDelMes);
        BigDecimal totalAdicionalesMensual = ventaRepository.sumMontoAdicionalPorFechas(inicioDelMes, finDelMes);
        List<ReporteMetodoDePagoDTO> desglosePagos = ventaRepository.obtenerTotalesPorMetodoPago(inicioDelMes, finDelMes);

        // --- CÁLCULOS PARA RESÚMENES ---
        BigDecimal gananciaTotalReal = detalleVentaRepository.findGananciaNetaVentasEnRango(inicioDelMes, finDelMes);
        BigDecimal totalValorInventario = datosInventario.stream()
                .map(p -> p.getCosto().multiply(BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPosiblesVentas = datosInventario.stream()
                .map(p -> p.getPrecio().multiply(BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // <-- 1. AÑADIMOS LA CREACIÓN DEL MAPA AQUÍ
        Map<String, ReporteProductosDTO> mapaProductos = datosInventario.stream()
                .collect(Collectors.toMap(ReporteProductosDTO::getProducto, dto -> dto));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // --- ESTILOS (reutilizables para ambas hojas) ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            CellStyle headerLeftStyle = workbook.createCellStyle();
            headerLeftStyle.setFont(headerFont);

            CellStyle headerCenterStyle = workbook.createCellStyle();
            headerCenterStyle.cloneStyleFrom(headerLeftStyle);
            headerCenterStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle headerRightStyle = workbook.createCellStyle();
            headerRightStyle.cloneStyleFrom(headerLeftStyle);
            headerRightStyle.setAlignment(HorizontalAlignment.RIGHT);

            CellStyle quantityStyle = workbook.createCellStyle();
            quantityStyle.setAlignment(HorizontalAlignment.CENTER);

            DataFormat currencyFormat = workbook.createDataFormat();
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(currencyFormat.getFormat("$ #,##0"));

            // ======================================================
            // --- HOJA 1: VENTAS DEL MES ---
            // ======================================================
            Sheet sheetVentas = workbook.createSheet("Ventas del Mes");
            // Encabezados de la tabla de ventas
            Row headerVentas = sheetVentas.createRow(0);
            String[] headersVentas = {"Producto", "Precio", "Cantidad Vendida", "Subtotal", "Ganancia"};

            headerVentas.createCell(0).setCellValue(headersVentas[0]);
            headerVentas.getCell(0).setCellStyle(headerLeftStyle);
            headerVentas.createCell(1).setCellValue(headersVentas[1]);
            headerVentas.getCell(1).setCellStyle(headerRightStyle);
            headerVentas.createCell(2).setCellValue(headersVentas[2]);
            headerVentas.getCell(2).setCellStyle(headerCenterStyle);
            headerVentas.createCell(3).setCellValue(headersVentas[3]);
            headerVentas.getCell(3).setCellStyle(headerRightStyle);
            headerVentas.createCell(4).setCellValue(headersVentas[4]);
            headerVentas.getCell(4).setCellStyle(headerRightStyle);

            // Filas de datos de ventas
            int rowIdxVentas = 1;
            for (ReporteVentasDTO ventaDto : datosDetallados) {
                Row row = sheetVentas.createRow(rowIdxVentas++);

                // Ahora 'mapaProductos' existe y podemos usarlo
                ReporteProductosDTO productoInfo = mapaProductos.get(ventaDto.getProducto());
                BigDecimal costo = (productoInfo != null) ? productoInfo.getCosto() : BigDecimal.ZERO;

                // Calculamos los valores teóricos
                BigDecimal subtotal = ventaDto.getPrecio().multiply(BigDecimal.valueOf(ventaDto.getCantidad()));
                BigDecimal ganancia = (ventaDto.getPrecio().subtract(costo)).multiply(BigDecimal.valueOf(ventaDto.getCantidad()));

                row.createCell(0).setCellValue(ventaDto.getProducto());

                Cell precioCell = row.createCell(1);
                precioCell.setCellValue(ventaDto.getPrecio().doubleValue());
                precioCell.setCellStyle(currencyStyle);

                Cell cantidadCell = row.createCell(2);
                cantidadCell.setCellValue(ventaDto.getCantidad());
                cantidadCell.setCellStyle(quantityStyle);

                Cell subtotalCell = row.createCell(3);
                subtotalCell.setCellValue(subtotal.doubleValue());
                subtotalCell.setCellStyle(currencyStyle);

                Cell gananciaCell = row.createCell(4);
                gananciaCell.setCellValue(ganancia.doubleValue());
                gananciaCell.setCellStyle(currencyStyle);
            }

            Row totalAdicionalesMensualRow = sheetVentas.createRow(rowIdxVentas++);
            Cell otrosMensual = totalAdicionalesMensualRow.createCell(0);
            otrosMensual.setCellValue("Otros");
            totalAdicionalesMensualRow.createCell(1).setCellValue("-");
            totalAdicionalesMensualRow.getCell(1).setCellStyle(quantityStyle);
            totalAdicionalesMensualRow.createCell(2).setCellValue("-");
            totalAdicionalesMensualRow.getCell(2).setCellStyle(quantityStyle);
            totalAdicionalesMensualRow.createCell(3).setCellValue("-");
            totalAdicionalesMensualRow.getCell(3).setCellStyle(quantityStyle);
            Cell totalAdicionalesMensualCell = totalAdicionalesMensualRow.createCell(4);
            totalAdicionalesMensualCell.setCellValue(totalAdicionalesMensual.doubleValue());
            totalAdicionalesMensualCell.setCellStyle(currencyStyle);

            // Auto-ajuste de columnas para la hoja de ventas
            for (int i = 0; i < headersVentas.length; i++) {
                sheetVentas.autoSizeColumn(i);
                sheetVentas.setColumnWidth(i, sheetVentas.getColumnWidth(i) + 512);
            }

            // --- AÑADIR RESUMEN A LA DERECHA DE LA TABLA DE VENTAS ---
            int colResumenVentas = 6; // Columna F (A=0, B=1, etc.), dejando un espacio

            Row filaTituloVentas = sheetVentas.getRow(1); // Usamos la segunda fila para alinear
            if (filaTituloVentas == null) filaTituloVentas = sheetVentas.createRow(1);
            filaTituloVentas.createCell(colResumenVentas).setCellValue("Resumen del Mes");
            filaTituloVentas.getCell(colResumenVentas).setCellStyle(headerLeftStyle);

            Row filaRecaudado = sheetVentas.getRow(2);
            if (filaRecaudado == null) filaRecaudado = sheetVentas.createRow(2);
            filaRecaudado.createCell(colResumenVentas).setCellValue("Total Recaudado:");
            Cell celdaRecaudado = filaRecaudado.createCell(colResumenVentas + 1);
            celdaRecaudado.setCellValue(totalRecaudadoReal.doubleValue());
            celdaRecaudado.setCellStyle(currencyStyle);

            Row filaGanancia = sheetVentas.getRow(3);
            if (filaGanancia == null) filaGanancia = sheetVentas.createRow(3);
            filaGanancia.createCell(colResumenVentas).setCellValue("Ganancia Total:");
            Cell celdaGanancia = filaGanancia.createCell(colResumenVentas + 1);
            celdaGanancia.setCellValue(gananciaTotalReal.doubleValue());
            celdaGanancia.setCellStyle(currencyStyle);

            sheetVentas.autoSizeColumn(6);
            sheetVentas.autoSizeColumn(7);
            sheetVentas.setColumnWidth(6, sheetVentas.getColumnWidth(6) + 512);
            sheetVentas.setColumnWidth(7, sheetVentas.getColumnWidth(7) + 512);

            // --- AÑADIR DESGLOSE POR MÉTODO DE PAGO (Mensual) ---
            int rowIdxPagosMensual = 5; // Dejamos espacio tras el resumen (Filas 1,2,3 ocupadas, 4 libre)
            
            Row headerPagosMensual = sheetVentas.getRow(rowIdxPagosMensual);
            if (headerPagosMensual == null) headerPagosMensual = sheetVentas.createRow(rowIdxPagosMensual);
            
            rowIdxPagosMensual++;

            headerPagosMensual.createCell(colResumenVentas).setCellValue("Método de Pago");
            headerPagosMensual.getCell(colResumenVentas).setCellStyle(headerLeftStyle);
            
            headerPagosMensual.createCell(colResumenVentas + 1).setCellValue("Monto");
            headerPagosMensual.getCell(colResumenVentas + 1).setCellStyle(headerRightStyle);
            
             for (ReporteMetodoDePagoDTO item : desglosePagos) {
                Row row = sheetVentas.getRow(rowIdxPagosMensual);
                if (row == null) row = sheetVentas.createRow(rowIdxPagosMensual);
                
                row.createCell(colResumenVentas).setCellValue(item.getMetodoDePago().toString());
                
                Cell cellMonto = row.createCell(colResumenVentas + 1);
                cellMonto.setCellValue(item.getTotal().doubleValue());
                cellMonto.setCellStyle(currencyStyle);
                
                rowIdxPagosMensual++;
            }

            // ======================================================
            // --- HOJA 2: ESTADO DE INVENTARIO ---
            // ======================================================
            Sheet sheetInventario = workbook.createSheet("Estado de Inventario");
            // Encabezados de la tabla de inventario
            Row headerInventario = sheetInventario.createRow(0);
            String[] headersInventario = {"Producto", "Stock Actual", "Costo", "En Stock", "En Posibles Ventas"};

            headerInventario.createCell(0).setCellValue(headersInventario[0]);
            headerInventario.getCell(0).setCellStyle(headerLeftStyle);
            headerInventario.createCell(1).setCellValue(headersInventario[1]);
            headerInventario.getCell(1).setCellStyle(headerCenterStyle);
            headerInventario.createCell(2).setCellValue(headersInventario[2]);
            headerInventario.getCell(2).setCellStyle(headerRightStyle);
            headerInventario.createCell(3).setCellValue(headersInventario[3]);
            headerInventario.getCell(3).setCellStyle(headerRightStyle);
            headerInventario.createCell(4).setCellValue(headersInventario[4]);
            headerInventario.getCell(4).setCellStyle(headerRightStyle);

            // Filas de datos de inventario
            int rowIdxInventario = 1;
            // <-- 2. CORREGIMOS EL NOMBRE DE LA VARIABLE AQUÍ
            for (ReporteProductosDTO productoDto : datosInventario) {
                Row row = sheetInventario.createRow(rowIdxInventario++);

                // Calculamos los valores
                BigDecimal enStockValorizado = productoDto.getCosto().multiply(BigDecimal.valueOf(productoDto.getStock()));
                BigDecimal posiblesVentasValorizado = productoDto.getPrecio().multiply(BigDecimal.valueOf(productoDto.getStock()));

                row.createCell(0).setCellValue(productoDto.getProducto());

                Cell stockCell = row.createCell(1);
                stockCell.setCellValue(productoDto.getStock());
                stockCell.setCellStyle(quantityStyle);

                Cell costoCell = row.createCell(2);
                costoCell.setCellValue(productoDto.getCosto().doubleValue());
                costoCell.setCellStyle(currencyStyle);

                Cell enStockCell = row.createCell(3);
                enStockCell.setCellValue(enStockValorizado.doubleValue());
                enStockCell.setCellStyle(currencyStyle);

                Cell posiblesVentasCell = row.createCell(4);
                posiblesVentasCell.setCellValue(posiblesVentasValorizado.doubleValue());
                posiblesVentasCell.setCellStyle(currencyStyle);
            }

            // Auto-ajuste de columnas para la hoja de inventario
            for (int i = 0; i < headersInventario.length; i++) {
                sheetInventario.autoSizeColumn(i);
                sheetInventario.setColumnWidth(i, sheetInventario.getColumnWidth(i) + 512);
            }

            // --- AÑADIR RESUMEN A LA DERECHA DE LA TABLA DE INVENTARIO ---
            int colResumenInventario = 6; // Columna G

            Row filaTituloInventario = sheetInventario.getRow(1);
            if (filaTituloInventario == null) filaTituloInventario = sheetInventario.createRow(1);
            filaTituloInventario.createCell(colResumenInventario).setCellValue("Resumen de Inventario");
            filaTituloInventario.getCell(colResumenInventario).setCellStyle(headerLeftStyle);

            Row filaValorStock = sheetInventario.getRow(2);
            if (filaValorStock == null) filaValorStock = sheetInventario.createRow(2);
            filaValorStock.createCell(colResumenInventario).setCellValue("En Stock:");
            Cell celdaValorStock = filaValorStock.createCell(colResumenInventario + 1);
            celdaValorStock.setCellValue(totalValorInventario.doubleValue());
            celdaValorStock.setCellStyle(currencyStyle);

            Row filaValorVenta = sheetInventario.getRow(3);
            if (filaValorVenta == null) filaValorVenta = sheetInventario.createRow(3);
            filaValorVenta.createCell(colResumenInventario).setCellValue("En Posibles Ventas:");
            Cell celdaValorVenta = filaValorVenta.createCell(colResumenInventario + 1);
            celdaValorVenta.setCellValue(totalPosiblesVentas.doubleValue());
            celdaValorVenta.setCellStyle(currencyStyle);

            sheetInventario.autoSizeColumn(6);
            sheetInventario.autoSizeColumn(7);
            sheetInventario.setColumnWidth(6, sheetInventario.getColumnWidth(6) + 512);
            sheetInventario.setColumnWidth(7, sheetInventario.getColumnWidth(7) + 512);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Falló al generar el archivo Excel: " + e.getMessage());
        }
    }

}
