import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function Noticia() {
  const location = useLocation();
  const { id } = useParams();

  // Cacheamos SOLO el contenido textual de la noticia, no la imagen
  const cacheNoticiaKey = `noticia-${id}`;

  // Estado de la noticia (titulo / contenido / urlEvento)
  const [noticiaData, setNoticiaData] = useState(() => {
    const cached = sessionStorage.getItem(cacheNoticiaKey);
    return cached
      ? JSON.parse(cached)
      : location.state?.noticia || null;
  });

  // Imagen: empezamos con fallback (para que el <img> pueda renderizarse YA)
  const imagenFallback =
    'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp';
  const [imagenUrl, setImagenUrl] = useState(location.state?.noticia?.imagen || null);

  const [loadingNoticia, setLoadingNoticia] = useState(!noticiaData);
  const [error, setError] = useState(null);

  // 1. Traer noticia si no la teníamos
  useEffect(() => {
    if (!noticiaData) {
      api
        .get(`/noticia?idNoticia=${id}`)
        .then((response) => {
          const noticia = response.data.noticias?.[0];
          if (noticia) {
            setNoticiaData(noticia);
            sessionStorage.setItem(cacheNoticiaKey, JSON.stringify(noticia));
          } else {
            setError('No se encontró la noticia.');
          }
        })
        .catch((err) => {
          console.error('Error al obtener la noticia:', err);
          setError('Hubo un problema al cargar la noticia.');
        })
        .finally(() => {
          setLoadingNoticia(false);
        });
    } else {
      setLoadingNoticia(false);
    }

    window.scrollTo(0, 0);
  }, [id, noticiaData, cacheNoticiaKey]);

  // 2. Traer SIEMPRE la imagen desde la API (sin cachearla)
  useEffect(() => {
    let isMounted = true;

    api
      .get(`/Media?idEntidadMedia=${id}`)
      .then((res) => {
        if (!isMounted) return;
        const url = res.data.media?.[0]?.url;
        if (url) {
          setImagenUrl(url);
        }
      })
      .catch((err) => {
        console.warn('No se pudo obtener la imagen de la noticia:', err);
        // si falla, nos quedamos con lo que ya tengamos (imagenUrl o fallback)
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Pantallas de loading / error
  if (loadingNoticia) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-1 items-center justify-center text-center p-10 text-gray-600">
          <div>
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p>Cargando noticia...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !noticiaData) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-1 items-center justify-center text-center p-10">
          <div>
            <p className="text-red-500 font-semibold">
              Hubo un error al cargar la noticia.
            </p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render normal
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex-1 flex items-start justify-center px-4 sm:px-10 pt-4 sm:pt-6 md:pt-20">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 max-w-6xl w-full">

          {/* Imagen optimizada (sin spinner bloqueante) */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <div
              className="
                w-full
                max-w-md md:max-w-lg lg:max-w-xl
                aspect-[1.2]
                rounded-lg shadow-md overflow-hidden
                bg-gray-100
                flex items-center justify-center
              "
            >
              <img
                src={imagenUrl || imagenFallback}
                alt={`Imagen de noticia: ${noticiaData.titulo}`}
                width={576}   // pista de layout (coincide aprox con lg:max-w-xl)
                height={480}  // 576 / 1.2 ≈ 480
                className="
                  block
                  w-full h-full
                  object-cover object-center
                "
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imagenFallback;
                }}
              />
            </div>
          </div>

          {/* Texto */}
          <div className="w-full text-center md:text-left">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
              {noticiaData.titulo}
            </h1>

            <p className="text-gray-700 leading-relaxed mb-4">
              {noticiaData.contenido}
            </p>

            {noticiaData.urlEvento &&
              noticiaData.urlEvento.trim() !== '' && (
                <a
                  href={noticiaData.urlEvento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-pink-600 transition"
                >
                  Ir a evento
                </a>
              )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
