import React, { useState } from 'react';
import jsPDF from 'jspdf';

/* =========================
   Helpers
   ========================= */
async function urlToDataURL(url) {
    const res = await fetch(url, { cache: 'no-store' });
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function getUserDisplayName(user) {
    if (!user) return 'Usuario';
    const first =
        user.nombre ??
        user.firstName ??
        user.given_name ??
        user.name?.split(' ')?.[0] ??
        user.displayName?.split(' ')?.[0] ??
        '';
    const last =
        user.apellido ??
        user.lastName ??
        user.family_name ??
        (user.name ? user.name.split(' ').slice(1).join(' ') : '') ??
        '';
    const full = [first, last].filter(Boolean).join(' ').trim();
    return full || user.correo || user.email || 'Usuario';
}

function getArtistsString(evento) {
    const arr = Array.isArray(evento?.artistas) ? evento.artistas : [];
    const names = arr.map(a => (typeof a === 'string' ? a : a?.nombre)).filter(Boolean);
    return names.length ? names.join(' - ') : '';
}

function safeFilename(str, fallback = 'entradas') {
    return (str || fallback).replace(/[\\/:*?"<>|]/g, '');
}

/** Dibuja una marca de agua en patrón (tile) sobre la página actual */
function drawTiledWatermark(doc, text, opts = {}) {
    if (!text) return;
    const {
        angle = 30,                  // grados
        fontSize = 48,               // tamaño del texto
        colorRGB = [230, 230, 230],  // gris claro
        gapX = 70,                   // separación horizontal entre repeticiones (mm)
        gapY = 90,                   // separación vertical entre repeticiones (mm)
        font = 'helvetica',
        fontStyle = 'bold',
    } = opts;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont(font, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...colorRGB);

    // empezamos un poco antes del borde y cubrimos de punta a punta
    for (let y = -gapY / 2; y < pageHeight + gapY; y += gapY) {
        for (let x = -gapX; x < pageWidth + gapX; x += gapX) {
            doc.text(text, x, y, { angle });
        }
    }

    // reset color para el contenido siguiente
    doc.setTextColor(0, 0, 0);
}

/* =========================
   Componente
   ========================= */
export default function DescargarEntradasPDF({
    entradas = [],
    user,
    evento,
    fechaTexto = '',
    ubicacionFormateada = '',
    idCompra,
    numCompra,
    icons = {},
    logoUrl,
    watermarkText = 'RaveApp',
    // 👇 opciones nuevas para el patrón de marca de agua
    watermarkOptions = { angle: 30, fontSize: 48, colorRGB: [230, 230, 230], gapX: 70, gapY: 90 },
    className = '',
}) {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!entradas.length) return;
        try {
            setDownloading(true);

            // Recursos opcionales
            let iconCal = null, iconLoc = null, iconMus = null, logoDataUrl = null;
            try {
                if (icons.calendarUrl) iconCal = icons.calendarUrl.startsWith('data:') ? icons.calendarUrl : await urlToDataURL(icons.calendarUrl);
                if (icons.locationUrl) iconLoc = icons.locationUrl.startsWith('data:') ? icons.locationUrl : await urlToDataURL(icons.locationUrl);
                if (icons.musicUrl) iconMus = icons.musicUrl.startsWith('data:') ? icons.musicUrl : await urlToDataURL(icons.musicUrl);
                if (logoUrl) logoDataUrl = logoUrl.startsWith('data:') ? logoUrl : await urlToDataURL(logoUrl);
            } catch { }

            const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            let y = 22;

            // ===== Watermark en PATRÓN (page 1) =====
            drawTiledWatermark(doc, watermarkText, watermarkOptions);

            // Logo
            if (logoDataUrl) {
                const logoW = 22, logoH = 22;
                doc.addImage(logoDataUrl, 'PNG', pageWidth - margin - logoW, margin - 4, logoW, logoH);
            }

            // Encabezado
            const nombreUsuario = getUserDisplayName(user);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`${nombreUsuario}, aquí tienes tus entradas QR`, margin, y);
            y += 12;

            // "Evento: " + nombre (violeta + negrita)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            const prefix = 'Evento: ';
            const prefixWidth = doc.getTextWidth(prefix);
            const nameWidth = pageWidth - margin * 2 - prefixWidth;

            doc.setTextColor(0, 0, 0);
            doc.text(prefix, margin, y);

            const eventName = evento?.nombre || '—';
            const nameLines = doc.splitTextToSize(eventName, nameWidth);

            doc.setTextColor(107, 33, 168); // purple-700
            doc.setFont('helvetica', 'bold');
            if (nameLines.length) {
                doc.text(nameLines[0], margin + prefixWidth, y);
            }
            for (let i = 1; i < nameLines.length; i++) {
                y += 6;
                doc.text(nameLines[i], margin, y);
            }
            // reset
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');

            y += 8;

            // ===== Líneas con iconos alineados =====
            const iconSize = 5;
            const wrapStep = 6;
            const blockGap = 9;

            const drawIconLine = (iconDataUrl, label, value) => {
                if (!value) return;

                // alineación vertical precisa del icono con 1ra línea
                const fsPt = doc.getFontSize();
                const fsMm = fsPt * 0.352778;
                const textTopFromBaseline = fsMm * 0.75;
                const iconTop = y - textTopFromBaseline + (fsMm - iconSize) / 2;

                const xIcon = margin;
                let textX = margin;

                if (iconDataUrl) {
                    doc.addImage(iconDataUrl, 'PNG', xIcon, iconTop, iconSize, iconSize);
                    textX = margin + iconSize + 2;
                }

                const line = `${label} ${value}`;
                const wrapped = doc.splitTextToSize(line, pageWidth - textX - margin);

                wrapped.forEach((ln, idx) => {
                    doc.text(ln, textX, y);
                    if (idx < wrapped.length - 1) y += wrapStep;
                });

                y += blockGap;
            };

            drawIconLine(iconCal, 'Fecha y hora:', fechaTexto);
            drawIconLine(iconLoc, 'Dirección:', ubicacionFormateada);
            drawIconLine(iconMus, 'Artistas:', getArtistsString(evento));

            // Separador
            doc.setDrawColor(180);
            doc.line(margin, y, pageWidth - margin, y);
            y += 12;

            // ===== QRs =====
            const qrSize = 60;
            const textGap = 6;
            const qrBlockGap = 16;

            for (let i = 0; i < entradas.length; i++) {
                const ent = entradas[i];

                // Si no entra en la página actual, abrir nueva página y volver a dibujar watermark
                if (y + qrSize + qrBlockGap > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                    drawTiledWatermark(doc, watermarkText, watermarkOptions); // 🔁 watermark en nuevas páginas
                }

                let qrDataUrl = '';
                try {
                    const qrUrl =
                        ent.qrUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            JSON.stringify({ idEntrada: ent.idEntrada || ent.id || i + 1 })
                        )}`;
                    qrDataUrl = await urlToDataURL(qrUrl);
                } catch { }

                const x = (pageWidth - qrSize) / 2;

                if (qrDataUrl) {
                    doc.addImage(qrDataUrl, 'PNG', x, y, qrSize, qrSize);
                } else {
                    doc.setDrawColor(0);
                    doc.rect(x, y, qrSize, qrSize);
                    doc.text('QR', pageWidth / 2, y + qrSize / 2, { align: 'center' });
                }
                y += qrSize + textGap;

                const tipo = ent.dsTipo || ent.tipo || '—';
                const precio = typeof ent.precio === 'number' ? `$${ent.precio}` : (ent.precio || '—');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(`Tipo: ${tipo}`, pageWidth / 2, y, { align: 'center' });
                y += 5;

                doc.setFont('helvetica', 'normal');
                doc.text(`Precio: ${precio}`, pageWidth / 2, y, { align: 'center' });
                y += qrBlockGap;
            }

            const filename = `Entradas_${safeFilename(evento?.nombre, 'entradas')}_Compra${idCompra ?? ''}_N${numCompra ?? ''}.pdf`
                .replace(/_Compraundefined_Nundefined/, '');
            doc.save(filename);
        } catch (e) {
            console.error(e);
            alert('Hubo un problema al generar el PDF. Intenta nuevamente.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            type="button"
            className={`btn btn-secondary rounded-full ${downloading ? 'btn-disabled' : ''} ${className}`}
            onClick={handleDownloadPDF}
            disabled={downloading || !entradas.length}
            aria-busy={downloading}
            aria-label="Descargar PDF de entradas"
            title="Descargar PDF de entradas"
        >
            {downloading ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
    );
}
