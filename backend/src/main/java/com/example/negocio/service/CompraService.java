package com.example.negocio.service;

import com.example.negocio.dto.compra.CompraDTO;
import com.example.negocio.dto.compra.CompraFullDTO;
import com.example.negocio.dto.compra.DetalleCompraDTO;
import com.example.negocio.entity.*;
import com.example.negocio.enums.EstadoCompra;
import com.example.negocio.enums.MetodoDePago;
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
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompraService {
    private final CompraRepository compraRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final CompraMapper compraMapper;
    private final DetalleCompraMapper detalleCompraMapper;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Compra nuevaCompra(Long idUsuario, CompraDTO dto){
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new UsuarioNoEncontradoException());
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException("No se encontró el proveedor con el ID: " + dto.getIdProveedor()));

        Compra compra = compraMapper.toEntity(dto);
        compra.setFechaHora(LocalDateTime.now());
        compra.setUsuario(usuario);
        compra.setProveedor(proveedor);
        compra.setEstadoCompra(EstadoCompra.PENDIENTE);

        BigDecimal total = BigDecimal.ZERO;

        List<DetalleCompra> detalles = new ArrayList<>();
        for(DetalleCompraDTO detalleDto :dto.getDetalles()){
            Producto producto = productoRepository.findById(detalleDto.getIdProducto()).orElseThrow(() -> new ProductoNoEncontradoException());

            DetalleCompra detalle = detalleCompraMapper.toEntity(detalleDto);
            detalle.setProducto(producto);
            detalle.setCostoUnitario(detalleDto.getCostoUnitario());
            detalle.setCompra(compra);

            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);

            BigDecimal cantidad = new BigDecimal(detalle.getCantidad());
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(cantidad);
            total = total.add(subtotal);

            detalles.add(detalle);
        }
        compra.setDetalles(detalles);
        compra.setTotal(total.setScale(0, RoundingMode.HALF_UP));

        return compraRepository.save(compra);
    }

    @Transactional
    public Compra editarCompra(Long idCompra, CompraDTO dto) {
        Compra compra = compraRepository.findById(idCompra)
                .orElseThrow(() -> new CompraNoEncontradaException());
        Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedor()).orElseThrow(() -> new ProveedorNoEncontradoException("No se encontró el proveedor con el ID: " + dto.getIdProveedor()));

        compra.setProveedor(proveedor);

        // Creamos un mapa de los detalles *existentes* para fácil acceso
        Map<Long, DetalleCompra> detallesActualesMap = compra.getDetalles().stream()
                .collect(Collectors.toMap(dc -> dc.getProducto().getIdProducto(), Function.identity()));

        // Creamos un mapa de los detalles *nuevos* (del DTO)
        Map<Long, DetalleCompraDTO> detallesNuevosMap = dto.getDetalles().stream()
                .collect(Collectors.toMap(DetalleCompraDTO::getIdProducto, Function.identity()));

        // --- Lógica de Stock y Actualización de Detalles ---
        List<DetalleCompra> detallesFinales = new ArrayList<>();
        BigDecimal nuevoTotal = BigDecimal.ZERO;

        // Iteramos sobre los NUEVOS detalles del DTO
        for (DetalleCompraDTO detalleDto : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDto.getIdProducto())
                    .orElseThrow(() -> new ProductoNoEncontradoException());

            DetalleCompra detalleExistente = detallesActualesMap.get(producto.getIdProducto());

            int cantidadNueva = detalleDto.getCantidad();
            int cantidadVieja = (detalleExistente != null) ? detalleExistente.getCantidad() : 0;
            int diferenciaCantidad = cantidadNueva - cantidadVieja;

            // Ajustamos el stock del producto
            producto.setStock(producto.getStock() + diferenciaCantidad);
            productoRepository.save(producto);

            // Creamos o actualizamos el detalle
            DetalleCompra detalleActualizado;
            if (detalleExistente != null) {
                detalleExistente.setCantidad(cantidadNueva);
                detalleExistente.setCostoUnitario(detalleDto.getCostoUnitario());
                detalleActualizado = detalleExistente;
            } else {
                detalleActualizado = detalleCompraMapper.toEntity(detalleDto);
                detalleActualizado.setProducto(producto);
                detalleActualizado.setCostoUnitario(detalleDto.getCostoUnitario());
                detalleActualizado.setCompra(compra);
            }
            detallesFinales.add(detalleActualizado);

            // Calculamos el subtotal para el nuevo total general
            BigDecimal subtotal = detalleActualizado.getCostoUnitario().multiply(BigDecimal.valueOf(detalleActualizado.getCantidad()));
            nuevoTotal = nuevoTotal.add(subtotal);

            // Quitamos el detalle del mapa de existentes para saber cuáles eliminar
            if (detalleExistente != null) {
                detallesActualesMap.remove(producto.getIdProducto());
            }
        }

        // --- Eliminamos los detalles que ya no están en el DTO ---
        if (!detallesActualesMap.isEmpty()) {
            List<DetalleCompra> detallesAEliminar = new ArrayList<>(detallesActualesMap.values());
            for (DetalleCompra detalleAEliminar : detallesAEliminar) {
                Producto producto = detalleAEliminar.getProducto();
                // Devolvemos el stock al producto
                producto.setStock(producto.getStock() - detalleAEliminar.getCantidad());
                productoRepository.save(producto);
            }
        }

        // 4. Actualizamos la lista de detalles en la compra
        compra.getDetalles().clear();
        compra.getDetalles().addAll(detallesFinales);

        compra.setTotal(nuevoTotal.setScale(0, RoundingMode.HALF_UP));

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

    public void cambiarEstadoCompra(Long idCompra){
        Compra compra = compraRepository.findById(idCompra).orElseThrow(() -> new CompraNoEncontradaException());

        System.out.println("Estado Anterior: " + compra.getEstadoCompra() + "=============================================================================");

        if(compra.getEstadoCompra() == EstadoCompra.PENDIENTE){
            compra.setEstadoCompra(EstadoCompra.PAGADO);
        } else if (compra.getEstadoCompra() == EstadoCompra.PAGADO) {
            compra.setEstadoCompra(EstadoCompra.PENDIENTE);
        }

        compraRepository.save(compra);
    }

    public List<String> listarEstadosCompra(){
        return Arrays.stream(EstadoCompra.values())
                .map(Enum::name)
                .toList();
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
        int xPositionLabels = 380;
        int xPositionValues = 500;

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
