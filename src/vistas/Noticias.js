// src/vistas/Noticias.js
import React, { useState, useEffect, useMemo } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';
import Buscador from "../components/Buscador";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noNoticias, setNoNoticias] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState(''); // 👈 NUEVO estado para el buscador

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await api.get('/noticia');
        const noticiasCrudas = response?.data?.noticias || [];

        if (!Array.isArray(noticiasCrudas) || noticiasCrudas.length === 0) {
          setNoNoticias(true);
          setNoticias([]);
          setLoading(false);
          return;
        }

        const noticiasConImagen = await Promise.all(
          noticiasCrudas.map(async (item) => {
            const id = item.idNoticia;
            let imagenUrl = null;

            try {
              const resMedia = await api.get(`/Media?idEntidadMedia=${id}`);
              const media = resMedia?.data?.media || [];
              if (media.length > 0 && media[0].url) {
                imagenUrl = media[0].url;
              }
            } catch (e) {
              if (e.response?.status !== 404) {
                console.warn('Error al obtener imagen para noticia:', id, e);
              }
            }

            return {
              id,
              titulo: item.titulo,
              contenido: item.contenido,
              urlEvento: item.urlEvento,
              imagen: imagenUrl,
              fechaPublicado: item.dtPublicado, // 👈 ya lo tenías agregado
            };
          })
        );

        setNoticias(noticiasConImagen);
        setNoNoticias(noticiasConImagen.length === 0);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNoNoticias(true);
          setNoticias([]);
          setLoading(false);
          return;
        }
        console.error('Error al obtener noticias:', err);
        setError('Ocurrió un error inesperado al cargar las noticias. Intenta más tarde.');
        setLoading(false);
      }
    };

    fetchNoticias();
    window.scrollTo(0, 0);
  }, []);

  // 👇 Filtrado de noticias según la búsqueda (título o contenido)
  const noticiasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return noticias;
    return noticias.filter((n) => {
      const titulo = n.titulo?.toLowerCase() || '';
      const contenido = n.contenido?.toLowerCase() || '';
      return titulo.includes(q) || contenido.includes(q);
    });
  }, [busqueda, noticias]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-16 h-16 mb-4">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
          <path d="M3 5a2 2 0 0 1 2-2h11a1 1 0 1 1 0 2H5v12a1 1 0 0 0 1 1h13V7a1 1 0 1 1 2 0v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5z" />
          <rect x="7" y="7" width="7" height="2" rx="1" />
          <rect x="7" y="11" width="10" height="2" rx="1" />
          <rect x="7" y="15" width="10" height="2" rx="1" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">No hay noticias por ahora</h2>
      <p className="text-gray-500 max-w-prose">
        Por el momento, no hay noticias para mostrar. Próximamente estaremos subiendo las últimas novedades.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando noticias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Hubo un problema</h2>
            <p className="mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 sm:px-10 mb-11 flex-1">
        <NavBar />
        <div className="flex-grow mb-11">
          <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>

          {noNoticias || noticias.length === 0 ? (
            // 👉 No hay noticias en la API
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <EmptyState />
              </div>
            </div>
          ) : (
            <>
              {/* 🔍 Buscador responsive */}
              <Buscador
                value={busqueda}
                onChange={setBusqueda}
                placeholder="Buscar noticias..."
                className="max-w-3xl mx-auto mb-6 px-2 sm:px-0"
              />

              {/* Resultado del filtrado */}
              {noticiasFiltradas.length === 0 ? (
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="rounded-3xl border border-gray-100 bg-white shadow-sm py-10 text-center text-gray-500">
                    No se encontraron noticias que coincidan con la búsqueda.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 sm:px-12">
                  {noticiasFiltradas.map((noticia) => (
                    <CardNoticia
                      key={noticia.id}
                      id={noticia.id}
                      titulo={noticia.titulo}
                      contenido={noticia.contenido}
                      urlEvento={noticia.urlEvento}
                      imagen={noticia.imagen}
                      fechaPublicado={noticia.fechaPublicado}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
