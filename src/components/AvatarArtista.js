// src/components/AvatarArtista.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AvatarArtista({ nombre, imagenUrl, idArtista }) {
  const [imagenCargada, setImagenCargada] = useState(false);

  const tieneImagen = !!imagenUrl;

  return (
    <div>
      <Link to={`/artistas/${idArtista}`} className="grid justify-items-center">
        <div
          className="relative rounded-full overflow-hidden
                     w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
        >
          {tieneImagen ? (
            <>
              {/* Skeleton mientras carga */}
              {!imagenCargada && (
                <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300" />
              )}

              <img
                src={imagenUrl}
                alt={`Imagen de ${nombre}`}
                loading="lazy"
                width={112}
                height={112}
                className={`block w-full h-full object-cover object-center
                           transition-opacity duration-300
                           ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImagenCargada(true)}
                onError={() => setImagenCargada(true)} // si falla, quitamos skeleton
              />
            </>
          ) : (
            // 👉 Sin imagen: círculo gris con texto
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs text-center leading-tight px-1">
                Sin imagen
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 text-center">
          <p className="font-bold text-sm sm:text-base text-center break-words max-w-[90px]">
            {nombre}
          </p>
        </div>
      </Link>
    </div>
  );
}

