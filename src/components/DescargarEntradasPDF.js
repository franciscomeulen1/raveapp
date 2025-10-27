import React, { useState } from 'react';
import jsPDF from 'jspdf';

/* =========================
   Helpers
   ========================= */

// Convierte una imagen pública a dataURL base64 (fallback en caso de que no tengamos qrDataUrl)
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
    const names = arr
        .map((a) => (typeof a === 'string' ? a : a?.nombre))
        .filter(Boolean);
    return names.length ? names.join(' - ') : '';
}

function safeFilename(str, fallback = 'entradas') {
    return (str || fallback).replace(/[\\/:*?"<>|]/g, '');
}

/** Dibuja marca de agua repetida en la página actual */
function drawTiledWatermark(doc, text, opts = {}) {
    if (!text) return;
    const {
        angle = 30,
        fontSize = 48,
        colorRGB = [230, 230, 230],
        gapX = 70,
        gapY = 90,
        font = 'helvetica',
        fontStyle = 'bold',
    } = opts;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont(font, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...colorRGB);

    for (let y = -gapY / 2; y < pageHeight + gapY; y += gapY) {
        for (let x = -gapX; x < pageWidth + gapX; x += gapX) {
            doc.text(text, x, y, { angle });
        }
    }

    // reset para contenido real
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
    watermarkOptions = {
        angle: 30,
        fontSize: 48,
        colorRGB: [230, 230, 230],
        gapX: 70,
        gapY: 90,
    },
    className = '',
}) {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!entradas.length) return;

        try {
            setDownloading(true);

            // Prepara íconos / logo como base64
            let iconCal = null,
                iconLoc = null,
                iconMus = null,
                logoDataUrl = null;
            try {
                if (icons.calendarUrl)
                    iconCal = icons.calendarUrl.startsWith('data:')
                        ? icons.calendarUrl
                        : await urlToDataURL(icons.calendarUrl);

                if (icons.locationUrl)
                    iconLoc = icons.locationUrl.startsWith('data:')
                        ? icons.locationUrl
                        : await urlToDataURL(icons.locationUrl);

                if (icons.musicUrl)
                    iconMus = icons.musicUrl.startsWith('data:')
                        ? icons.musicUrl
                        : await urlToDataURL(icons.musicUrl);

                if (logoUrl)
                    logoDataUrl = logoUrl.startsWith('data:')
                        ? logoUrl
                        : await urlToDataURL(logoUrl);
            } catch {
                // si un icono falla, seguimos igual sin romper el PDF
            }

            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const qrSize = 60;
            const textGap = 6;
            const qrBlockGap = 16;

            let y = 22;

            // Marca de agua inicial
            drawTiledWatermark(doc, watermarkText, watermarkOptions);

            // Logo RaveApp arriba a la derecha
            if (logoDataUrl) {
                const logoW = 22,
                    logoH = 22;
                doc.addImage(
                    logoDataUrl,
                    'PNG',
                    pageWidth - margin - logoW,
                    margin - 4,
                    logoW,
                    logoH
                );
            }

            // Encabezado
            const nombreUsuario = getUserDisplayName(user);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(
                `${nombreUsuario}, aquí tienes tus entradas QR`,
                margin,
                y
            );
            y += 12;

            // "Evento: ...."
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);

            const prefix = 'Evento: ';
            const prefixWidth = doc.getTextWidth(prefix);
            const nameWidth = pageWidth - margin * 2 - prefixWidth;

            doc.setTextColor(0, 0, 0);
            doc.text(prefix, margin, y);

            const eventName = evento?.nombre || '—';
            const nameLines = doc.splitTextToSize(eventName, nameWidth);

            doc.setTextColor(107, 33, 168); // violeta
            doc.setFont('helvetica', 'bold');
            if (nameLines.length) {
                doc.text(nameLines[0], margin + prefixWidth, y);
            }
            for (let i = 1; i < nameLines.length; i++) {
                y += 6;
                doc.text(nameLines[i], margin, y);
            }

            // reset estilo texto normal
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');

            y += 8;

            // Helper para dibujar líneas con ícono
            const iconSize = 5;
            const wrapStep = 6;
            const blockGap = 9;

            const drawIconLine = (iconDataUrl, label, value) => {
                if (!value) return;

                const fsPt = doc.getFontSize();
                const fsMm = fsPt * 0.352778;
                const textTopFromBaseline = fsMm * 0.75;
                const iconTop =
                    y - textTopFromBaseline + (fsMm - iconSize) / 2;

                let textX = margin;

                if (iconDataUrl) {
                    doc.addImage(
                        iconDataUrl,
                        'PNG',
                        margin,
                        iconTop,
                        iconSize,
                        iconSize
                    );
                    textX = margin + iconSize + 2;
                }

                const line = `${label} ${value}`;
                const wrapped = doc.splitTextToSize(
                    line,
                    pageWidth - textX - margin
                );

                wrapped.forEach((ln, idx) => {
                    doc.text(ln, textX, y);
                    if (idx < wrapped.length - 1) y += wrapStep;
                });

                y += blockGap;
            };

            drawIconLine(iconCal, 'Fecha y hora:', fechaTexto);
            drawIconLine(iconLoc, 'Dirección:', ubicacionFormateada);
            drawIconLine(iconMus, 'Artistas:', getArtistsString(evento));

            // Separador horizontal
            doc.setDrawColor(180);
            doc.line(margin, y, pageWidth - margin, y);
            y += 12;

            // Sección QRs
            for (let i = 0; i < entradas.length; i++) {
                const ent = entradas[i];

                // page break si no entra
                if (y + qrSize + qrBlockGap > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                    drawTiledWatermark(doc, watermarkText, watermarkOptions);
                }

                // QR oficial (idealmente ya en base64)
                let qrDataUrlFinal = ent.qrDataUrl || '';
                let qrFormatFinal = ent.qrFormat || 'PNG';

                // fallback: lo convertimos ahora desde la URL
                if (!qrDataUrlFinal && ent.qrUrl) {
                    try {
                        const fetched = await urlToDataURL(ent.qrUrl);
                        qrDataUrlFinal = fetched || '';
                        if (
                            qrDataUrlFinal.startsWith('data:image/jpeg') ||
                            qrDataUrlFinal.startsWith('data:image/jpg')
                        ) {
                            qrFormatFinal = 'JPEG';
                        } else if (
                            qrDataUrlFinal.startsWith('data:image/png')
                        ) {
                            qrFormatFinal = 'PNG';
                        } else {
                            qrFormatFinal = 'PNG';
                        }
                    } catch (e) {
                        console.warn(
                            'No pude inlinear el QR real en PDF:',
                            e
                        );
                    }
                }

                const x = (pageWidth - qrSize) / 2;

                if (qrDataUrlFinal) {
                    doc.addImage(
                        qrDataUrlFinal,
                        qrFormatFinal,
                        x,
                        y,
                        qrSize,
                        qrSize
                    );
                } else {
                    // Sin QR -> placeholder amigable
                    doc.setDrawColor(0);
                    doc.rect(x, y, qrSize, qrSize);
                    doc.text(
                        'QR no disponible',
                        pageWidth / 2,
                        y + qrSize / 2,
                        { align: 'center' }
                    );
                }

                y += qrSize + textGap;

                const tipo = ent.dsTipo || ent.tipo || '—';
                const precio =
                    typeof ent.precio === 'number'
                        ? `$${ent.precio}`
                        : ent.precio || '—';

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(`Tipo: ${tipo}`, pageWidth / 2, y, {
                    align: 'center',
                });
                y += 5;

                doc.setFont('helvetica', 'normal');
                doc.text(`Precio: ${precio}`, pageWidth / 2, y, {
                    align: 'center',
                });
                y += qrBlockGap;
            }

            // Nombre de archivo
            const filename = `Entradas_${safeFilename(
                evento?.nombre,
                'entradas'
            )}_Compra${idCompra ?? ''}_N${numCompra ?? ''}`
                .replace(/_Compraundefined_Nundefined$/, '')
                .replace(/_Compra_N$/, '');

            doc.save(filename + '.pdf');
        } catch (e) {
            console.error(e);
            alert(
                'Hubo un problema al generar el PDF. Intenta nuevamente.'
            );
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            type="button"
            className={`btn btn-secondary rounded-full ${downloading ? 'btn-disabled' : ''
                } ${className}`}
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