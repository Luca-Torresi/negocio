package com.example.negocio.service;

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
        BigDecimal totalTeorico = datosDetallados.stream()
                .map(dto -> dto.getPrecio().multiply(BigDecimal.valueOf(dto.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDescuentos = totalTeorico.subtract(totalRecaudadoReal);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet();

            // --- 1. CREACIÓN DE ESTILOS ---
            DataFormat currencyFormat = workbook.createDataFormat();

            // Estilo para encabezados
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);

            CellStyle headerStyleLeft = workbook.createCellStyle();
            headerStyleLeft.setFont(headerFont);
            headerStyleLeft.setBorderBottom(BorderStyle.THIN);

            CellStyle headerStyleCentered = workbook.createCellStyle();
            headerStyleCentered.cloneStyleFrom(headerStyleLeft);
            headerStyleCentered.setAlignment(HorizontalAlignment.CENTER);
            headerStyleCentered.setBorderLeft(BorderStyle.THIN);
            headerStyleCentered.setBorderRight(BorderStyle.THIN);

            CellStyle headerStyleRight = workbook.createCellStyle();
            headerStyleRight.cloneStyleFrom(headerStyleLeft);
            headerStyleRight.setAlignment(HorizontalAlignment.RIGHT);

            // Estilo para filas de datos
            CellStyle dataRowStyle = workbook.createCellStyle();
            dataRowStyle.setBorderBottom(BorderStyle.THIN);

            // Estilo para celdas de moneda
            CellStyle currencyCellStyle = workbook.createCellStyle();
            currencyCellStyle.setDataFormat(currencyFormat.getFormat("$#,##0"));
            currencyCellStyle.setBorderBottom(BorderStyle.THIN);

            // Estilo de celdas de cantidad
            CellStyle quantityStyle = workbook.createCellStyle();
            quantityStyle.setAlignment(HorizontalAlignment.CENTER);
            quantityStyle.setBorderBottom(BorderStyle.THIN);
            quantityStyle.setBorderLeft(BorderStyle.THIN);
            quantityStyle.setBorderRight(BorderStyle.THIN);

            // Estilos con colores de fondo
            CellStyle finalNumberStyle = workbook.createCellStyle();
            finalNumberStyle.cloneStyleFrom(currencyCellStyle);
            //finalNumberStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            //finalNumberStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            finalNumberStyle.setBorderLeft(BorderStyle.THIN);
            finalNumberStyle.setBorderRight(BorderStyle.THIN);
            finalNumberStyle.setBorderTop(BorderStyle.THIN);

            CellStyle descuentosLabelStyle = workbook.createCellStyle();
            descuentosLabelStyle.setBorderTop(BorderStyle.THIN);
            descuentosLabelStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle totalLabelStyle = workbook.createCellStyle();
            totalLabelStyle.setFont(headerFont);
            totalLabelStyle.setBorderBottom(BorderStyle.THIN);
            totalLabelStyle.setBorderTop(BorderStyle.THIN);
            totalLabelStyle.setBorderLeft(BorderStyle.THIN);

            // --- 2. CREACIÓN DE FILAS Y CELDAS ---
            // Fila de Encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Producto", "Cantidad", "Subtotal"};
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

            // Fila de Total Teórico (sin título, fondo amarillo)
            Row totalTeoricoRow = sheet.createRow(rowIdx++);
            Cell totalTeoricoCell = totalTeoricoRow.createCell(2);
            totalTeoricoCell.setCellValue(totalTeorico.doubleValue());
            totalTeoricoCell.setCellStyle(finalNumberStyle);

            rowIdx++;

            // Fila de Descuentos (fondo rojo)
            Row descuentosRow = sheet.createRow(rowIdx++);
            Cell descuentosLabelCell = descuentosRow.createCell(1);
            descuentosLabelCell.setCellValue("Descuentos, Ofertas y Promociones");
            descuentosLabelCell.setCellStyle(descuentosLabelStyle);
            Cell totalDescuentosCell = descuentosRow.createCell(2);
            totalDescuentosCell.setCellValue(totalDescuentos.doubleValue());
            totalDescuentosCell.setCellStyle(finalNumberStyle);

            // Fila de Total Recaudado (fondo verde)
            Row totalRealRow = sheet.createRow(rowIdx++);
            Cell totalRealLabelCell = totalRealRow.createCell(1);
            totalRealLabelCell.setCellValue("TOTAL RECAUDADO");
            totalRealLabelCell.setCellStyle(totalLabelStyle);
            Cell totalRealCell = totalRealRow.createCell(2);
            totalRealCell.setCellValue(totalRecaudadoReal.doubleValue());
            totalRealCell.setCellStyle(finalNumberStyle);

            // --- 3. APLICACIÓN DE BORDES LATERALES PARA EL CUADRO ---
            for (int i = 0; i <= rowIdx - 5; i++) {
                Row row = sheet.getRow(i);
                if (row == null) row = sheet.createRow(i);

                // Borde izquierdo
                Cell firstCell = row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                CellStyle newFirstStyle = workbook.createCellStyle();
                newFirstStyle.cloneStyleFrom(firstCell.getCellStyle());
                newFirstStyle.setBorderLeft(BorderStyle.THIN);
                firstCell.setCellStyle(newFirstStyle);

                // Borde derecho
                Cell lastCell = row.getCell(headers.length - 1, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                CellStyle newLastStyle = workbook.createCellStyle();
                newLastStyle.cloneStyleFrom(lastCell.getCellStyle());
                newLastStyle.setBorderRight(BorderStyle.THIN);
                lastCell.setCellStyle(newLastStyle);
            }
            // Borde superior para la fila de encabezado
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.getCell(i);
                CellStyle newStyle = workbook.createCellStyle();
                newStyle.cloneStyleFrom(cell.getCellStyle());
                newStyle.setBorderTop(BorderStyle.THIN);
                cell.setCellStyle(newStyle);
            }

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
        LocalDateTime inicioDelMes = fecha.atStartOfDay();
        LocalDateTime finDelMes = inicioDelMes.plusMonths(1);

        // --- OBTENCIÓN DE DATOS ---
        List<ReporteVentasDTO> datosDetallados = detalleVentaRepository.findDatosParaReporteVentas(inicioDelMes, finDelMes);
        List<ReporteProductosDTO> datosInventario = productoRepository.findDatosParaReportesMensuales(); // <-- Usaremos este nombre
        BigDecimal totalRecaudadoReal = ventaRepository.findRecaudadoVentasDiarias(inicioDelMes, finDelMes);
        BigDecimal costoTotalVentas = detalleVentaRepository.findCostoTotalDeVentasEnRango(inicioDelMes, finDelMes);

        // --- CÁLCULOS PARA RESÚMENES ---
        BigDecimal gananciaTotalReal = totalRecaudadoReal.subtract(costoTotalVentas);
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
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle quantityStyle = workbook.createCellStyle();
            quantityStyle.setAlignment(HorizontalAlignment.CENTER);

            DataFormat currencyFormat = workbook.createDataFormat();
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(currencyFormat.getFormat("$#,##0"));

            // ======================================================
            // --- HOJA 1: VENTAS DEL MES ---
            // ======================================================
            Sheet sheetVentas = workbook.createSheet("Ventas del Mes");
            // Encabezados de la tabla de ventas
            Row headerVentas = sheetVentas.createRow(0);
            String[] headersVentas = {"Producto", "Precio", "Cantidad Vendida", "Subtotal", "Ganancia"};
            for (int i = 0; i < headersVentas.length; i++) {
                headerVentas.createCell(i).setCellValue(headersVentas[i]);
                headerVentas.getCell(i).setCellStyle(headerStyle);
            }

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
            filaTituloVentas.getCell(colResumenVentas).setCellStyle(headerStyle);

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

            // ======================================================
            // --- HOJA 2: ESTADO DE INVENTARIO ---
            // ======================================================
            Sheet sheetInventario = workbook.createSheet("Estado de Inventario");
            // Encabezados de la tabla de inventario
            Row headerInventario = sheetInventario.createRow(0);
            String[] headersInventario = {"Producto", "Stock Actual", "Costo", "En Stock ($)", "En Posibles Ventas ($)"};
            for (int i = 0; i < headersInventario.length; i++) {
                headerInventario.createCell(i).setCellValue(headersInventario[i]);
                headerInventario.getCell(i).setCellStyle(headerStyle);
            }

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
            filaTituloInventario.getCell(colResumenInventario).setCellStyle(headerStyle);

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
