import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function Noticia() {
  const location = useLocation();
  const { id } = useParams();
  const cacheNoticiaKey = `noticia-${id}`;
  const cacheImgKey = `noticia-img-${id}`;

  const [noticiaData, setNoticiaData] = useState(() => {
    const cached = sessionStorage.getItem(cacheNoticiaKey);
    return cached ? JSON.parse(cached) : location.state?.noticia || null;
  });

  const [imagenUrl, setImagenUrl] = useState(() => {
    return sessionStorage.getItem(cacheImgKey) || location.state?.noticia?.imagen || null;
  });

  const [loading, setLoading] = useState(!noticiaData);
  const [error, setError] = useState(null);
  const imagenFallback = 'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp';

  useEffect(() => {
    // Obtener noticia si no está cacheada
    if (!noticiaData) {
      api.get(`/noticia?idNoticia=${id}`)
        .then(response => {
          const noticia = response.data.noticias?.[0];
          if (noticia) {
            setNoticiaData(noticia);
            sessionStorage.setItem(cacheNoticiaKey, JSON.stringify(noticia));
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener la noticia:', err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Obtener imagen si no está cacheada
    if (!imagenUrl) {
      api.get(`/Media?idEntidadMedia=${id}`)
        .then(res => {
          const url = res.data.media?.[0]?.url;
          if (url) {
            setImagenUrl(url);
            sessionStorage.setItem(cacheImgKey, url);
          }
        })
        .catch(err => {
          console.warn('No se pudo obtener la imagen de la noticia:', err);
        });
    }

    window.scrollTo(0, 0);
  }, [id, noticiaData, imagenUrl, cacheImgKey, cacheNoticiaKey]);

  if (loading) return <div>Cargando noticia...</div>;
  if (error) return <div>Hubo un error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 flex-1 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center" style={{ gap: '1cm' }}>
          <div className="flex-shrink-0">
            <img
              src={imagenUrl || imagenFallback}
              alt="noticia"
              className="w-full max-w-sm object-cover rounded-lg shadow-md aspect-[1.2]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imagenFallback;
              }}
            />
          </div>
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-3xl font-bold mb-4">{noticiaData.titulo}</h1>
            <p className="text-gray-700 leading-relaxed mb-4">{noticiaData.contenido}</p>

            {noticiaData.urlEvento && noticiaData.urlEvento.trim() !== '' && (
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
