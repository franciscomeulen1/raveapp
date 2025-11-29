import React, { useEffect, useRef, useState } from 'react';
import api from '../componenteapi/api';

const idsCarousel = ['idCarousel1', 'idCarousel2', 'idCarousel3', 'idCarousel4'];

export default function Carousel() {
  const carouselRef = useRef(null);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const fetchImagenes = async () => {
      const nuevasImagenes = [];

      for (const id of idsCarousel) {
        try {
          const res = await api.get(`/Media?idEntidadMedia=${id}`);
          const url = res.data?.media?.[0]?.url || null;
          nuevasImagenes.push({ id, url });
        } catch {
          nuevasImagenes.push({ id, url: null });
        }
      }

      setImagenes(nuevasImagenes);
    };

    fetchImagenes();
  }, []);

  const goToSlide = (index) => {
    const slide = document.getElementById(`slide${index}`);
    if (slide && carouselRef.current) {
        carouselRef.current.scrollLeft = slide.offsetLeft;
    }
  };

  // Si no hay ninguna imagen válida
  if (imagenes.every(img => !img.url)) {
    return (
      <div className="h-48 flex items-center justify-center bg-base-200 text-gray-500 rounded-md mx-auto lg:w-5/6 mb-6">
        No hay imágenes cargadas en el carrusel.
      </div>
    );
  }

  return (
    <div>
      <div
  ref={carouselRef}
  className="
    carousel
    w-full lg:w-5/6
    h-44          /* 👈 volvemos a tu altura original */
    mx-auto mb-6
    rounded-md overflow-hidden
    bg-gray-200
  "
  style={{
    overflowX: 'scroll',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth'
  }}
>

        {imagenes.map((img, index) => {
          // Para la primera imagen NO usamos lazy (queremos que aparezca YA).
          // Para las demás sí usamos lazy (no cargar las 4 imágenes gigantes al toque).
          const isFirst = index === 0;

          return (
            <div
              key={img.id}
              id={`slide${index}`}
              className="
                carousel-item
                relative
                w-full
                flex-shrink-0
                h-full
                scroll-snap-align-start
              "
              style={{ scrollSnapAlign: 'start' }}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={`carousel-${index + 1}`}
                  loading={isFirst ? 'eager' : 'lazy'}  // 👈 prioridad visual
                  width={1280}                          // pista de layout (tamaño grande razonable)
                  height={720}                          // 16:9 aprox
                  className="
                    block
                    w-full h-full
                    object-cover object-center
                  "
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.replaceWith(
                      (() => {
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className =
                          'w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm';
                        fallbackDiv.textContent = 'Imagen no disponible';
                        return fallbackDiv;
                      })()
                    );
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-sm">
                  Imagen no disponible
                </div>
              )}

              {/* Flechas */}
              <div className="absolute flex justify-between items-center left-0 right-0 top-1/2 -translate-y-1/2 px-3 sm:px-4">
                <button
                  className="btn btn-circle btn-sm sm:btn-md shadow-md bg-black/60 text-white border-none hover:bg-black/80"
                  onClick={() => goToSlide((index - 1 + imagenes.length) % imagenes.length)}
                >
                  ❮
                </button>
                <button
                  className="btn btn-circle btn-sm sm:btn-md shadow-md bg-black/60 text-white border-none hover:bg-black/80"
                  onClick={() => goToSlide((index + 1) % imagenes.length)}
                >
                  ❯
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}