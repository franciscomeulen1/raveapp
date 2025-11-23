// src/components/CardNoticia.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function CardNoticia({
  id,
  titulo,
  imagen,
  contenido,
  urlEvento,
  fechaPublicado,
}) {
  const imagenFallback =
    'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp';

  const formatearFecha = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const fechaFormateada = formatearFecha(fechaPublicado);

  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 mx-auto my-5">
      <Link
        to={`/noticias/${id}`}
        state={{ noticia: { id, titulo, contenido, urlEvento, imagen, fechaPublicado } }}
        className="block w-full"
      >
        {/* Imagen */}
        <div className="w-full overflow-hidden bg-gray-100 aspect-[1.2]">
          <img
            src={imagen || imagenFallback}
            alt={`Imagen de noticia: ${titulo}`}
            loading="lazy"
            width={400}
            height={300}
            className="block w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imagenFallback;
            }}
          />
        </div>

        {/* Fecha de publicación */}
        {fechaFormateada && (
          <div className="px-4 pt-3 pb-1 flex items-center gap-2 text-xs sm:text-sm text-gray-400">
            {/* Icono de reloj (inline SVG) */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 flex-shrink-0"
              aria-hidden="true"
            >
              <path
                d="M12 4a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0-2a10 10 0 1 1-10 10A10.011 10.011 0 0 1 12 2Zm.75 5v4.19l2.25 2.25-1.5 1.5L11 12.31V7h1.75Z"
                fill="currentColor"
              />
            </svg>
            <span>{fechaFormateada}</span>
          </div>
        )}

        {/* Título */}
        <div className="px-4 pb-4 pt-1">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
            {titulo}
          </h2>
        </div>
      </Link>
    </div>
  );
}
