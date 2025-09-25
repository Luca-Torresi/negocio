package com.example.negocio.service;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.entity.*;
import com.example.negocio.exception.CompraNoEncontradaException;
import com.example.negocio.exception.ProductoNoEncontradoException;
import com.example.negocio.exception.ProveedorNoEncontradoException;
import com.example.negocio.exception.UsuarioNoEncontradoException;
import com.example.negocio.mapper.CompraMapper;
import com.example.negocio.mapper.DetalleCompraMapper;
import com.example.negocio.repository.*;
import com.example.negocio.specification.CompraSpecification;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {
    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final CompraMapper compraMapper;
    private final DetalleCompraMapper detalleCompraMapper;
    private final UsuarioRepository usuarioRepository;

    public Compra nuevaCompra(Long idUsuario, CompraDTO dto){
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNoEncontradoException());
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException("No se encontró el proveedor con el ID: " + dto.getIdProveedor()));

        Compra compra = compraMapper.toEntity(dto);
        compra.setFechaHora(LocalDateTime.now());
        compra.setUsuario(usuario);
        compra.setProveedor(proveedor);

        BigDecimal total = BigDecimal.ZERO;

        List<DetalleCompra> detalles = new ArrayList<>();
        for(DetalleCompraDTO detalleDto :dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetalleCompra detalle = detalleCompraMapper.toEntity(detalleDto);
            detalle.setProducto(producto);
            detalle.setCostoUnitario(producto.getCosto());
            detalle.setCompra(compra);

            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);

            BigDecimal cantidad = new BigDecimal(detalle.getCantidad());
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(cantidad);
            total = total.add(subtotal);

            detalles.add(detalle);
        }
        compra.setDetalles(detalles);

        if (dto.getDescuento() != null && dto.getDescuento() > 0) {
            BigDecimal descuentoPorcentaje = new BigDecimal(dto.getDescuento());
            BigDecimal cien = new BigDecimal("100");

            BigDecimal multiplicador = BigDecimal.ONE.subtract(descuentoPorcentaje.divide(cien));

            total = total.multiply(multiplicador);
        }

        compra.setTotal(total);

        return compraRepository.save(compra);
    }

    public Page<CompraFullDTO> obtenerCompras(Integer page, Integer size, LocalDate fechaInicio, LocalDate fechaFin, Long idProveedor, Long idUsuario){
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaHora").descending());
        Specification<Compra> spec = CompraSpecification.porFechaInicio(fechaInicio)
                .and(CompraSpecification.porFechaFin(fechaFin))
                .and(CompraSpecification.porProveedor(idProveedor))
                .and(CompraSpecification.conUsuario(idUsuario));

        return compraRepository.findAll(spec, pageable)
                .map(compraMapper::toFullDto);
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream generarComprobantePdf(Long idCompra) throws IOException {
        Compra compra = compraRepository.findById(idCompra).orElseThrow(() -> new CompraNoEncontradaException());

        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Fuentes que usaremos
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            // --- Título y Datos de la Compra ---
            escribirTexto(contentStream, fontBold, 18, 50, 780, "Comprobante de Compra #" + compra.getIdCompra());
            escribirTexto(contentStream, fontRegular, 12, 50, 750, "Fecha: " + compra.getFechaHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            escribirTexto(contentStream, fontRegular, 12, 50, 735, "Hora: " + compra.getFechaHora().format(DateTimeFormatter.ofPattern("HH:mm")));
            escribirTexto(contentStream, fontRegular, 12, 50, 720, "Proveedor: " + compra.getProveedor().getNombre());
            escribirTexto(contentStream, fontRegular, 12, 50, 705, "Usuario: " + compra.getUsuario().getNombre());

            // --- Tabla de Detalles ---
            Integer yPosition = drawTable(contentStream, compra, fontBold, fontRegular);

            // --- Resumen de Totales ---
            drawSummary(contentStream, compra, fontBold, fontRegular, yPosition);

            contentStream.close();
            document.save(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // --- MÉTODOS DE AYUDA PARA "DIBUJAR" EL PDF ---
    private Integer drawTable(PDPageContentStream stream, Compra compra, PDType1Font bold, PDType1Font regular) throws IOException {
        Integer yPosition = 670;
        // Encabezados
        escribirTexto(stream, bold, 12, 50, yPosition, "Producto");
        escribirTexto(stream, bold, 12, 300, yPosition, "Cantidad");
        escribirTexto(stream, bold, 12, 380, yPosition, "Costo Unitario");
        escribirTexto(stream, bold, 12, 500, yPosition, "Subtotal");

        yPosition -= 20;

        for (DetalleCompra detalle : compra.getDetalles()) {
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad()));
            escribirTexto(stream, regular, 11, 50, yPosition, detalle.getProducto().getNombre());
            escribirTexto(stream, regular, 11, 300, yPosition, String.valueOf(detalle.getCantidad()));
            escribirTexto(stream, regular, 11, 380, yPosition, "$" + detalle.getCostoUnitario().toString());
            escribirTexto(stream, regular, 11, 500, yPosition, "$" + subtotal.toString());
            yPosition -= 15;
        }

        return yPosition - 20;
    }

    // --- MÉTODO drawSummary() COMPLETO ---
    private void drawSummary(PDPageContentStream stream, Compra compra, PDType1Font bold, PDType1Font regular, Integer yPosition) throws IOException {
        // 1. Calculamos el subtotal (la suma de los detalles sin el descuento final)
        BigDecimal subtotal = compra.getDetalles().stream()
                .map(detalle -> detalle.getCostoUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int xPositionLabels = 380;
        int xPositionValues = 500;

        // Fila de Subtotal
        escribirTexto(stream, regular, 12, xPositionLabels, yPosition, "Subtotal:");
        escribirTexto(stream, regular, 12, xPositionValues, yPosition, "$" + subtotal.toString());
        yPosition -= 20;

        // Fila de Descuento (solo si existe)
        if (compra.getDescuento() != null && compra.getDescuento() > 0) {
            escribirTexto(stream, regular, 12, xPositionLabels, yPosition, "Descuento (" + compra.getDescuento() + "%):");
            BigDecimal montoDescuento = subtotal.subtract(compra.getTotal());
            escribirTexto(stream, regular, 12, xPositionValues, yPosition, "-$" + montoDescuento.toString());
            yPosition -= 20;
        }

        // Fila de Total Final
        escribirTexto(stream, bold, 14, xPositionLabels, yPosition, "TOTAL:");
        escribirTexto(stream, bold, 14, xPositionValues, yPosition, "$" + compra.getTotal().toString());
    }

    // Pequeño helper para no repetir el código de escribir texto
    private void escribirTexto(PDPageContentStream stream, PDType1Font font, float fontSize, float x, float y, String text) throws IOException {
        stream.beginText();
        stream.setFont(font, fontSize);
        stream.newLineAtOffset(x, y);
        stream.showText(text);
        stream.endText();
    }
}
