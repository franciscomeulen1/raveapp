// src/vistas/Artistas.js
import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import AvatarArtista from '../components/AvatarArtista';
import Buscador from "../components/Buscador";


export default function Artistas() {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState(''); // 👈 NUEVO

  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await api.get('/Artista/GetArtista?isActivo=true');
        const data = response.data.artistas || [];

        const artistasConImagenes = await Promise.all(
          data.map(async (artista) => {
            try {
              const mediaRes = await api.get(
                `/Media?idEntidadMedia=${artista.idArtista}`
              );
              const imagenUrl = mediaRes.data.media?.[0]?.url || null;

              return {
                ...artista,
                imagenUrl,
              };
            } catch (error) {
              console.warn(
                `No se pudo obtener la imagen del artista ${artista.nombre}`,
                error
              );
              return {
                ...artista,
                imagenUrl: null,
              };
            }
          })
        );

        setArtistas(artistasConImagenes);
      } catch (err) {
        console.error('Error al obtener artistas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistas();
    window.scrollTo(0, 0);
  }, []);

  // 👉 Filtrado por búsqueda (nombre del artista)
  const artistasFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return artistas;

    return artistas.filter((artista) =>
      (artista.nombre || '').toLowerCase().includes(q)
    );
  }, [artistas, busqueda]);

  // Agrupado por primera letra (usando la lista filtrada)
  const nombresAgrupados = artistasFiltrados.reduce((result, artista) => {
    const primeraLetra = /^[a-zA-Z]/.test(artista.nombre)
      ? artista.nombre[0].toUpperCase()
      : '#';
    if (!result[primeraLetra]) result[primeraLetra] = [];
    result[primeraLetra].push(artista);
    return result;
  }, {});

  const clavesOrdenadas = Object.keys(nombresAgrupados).sort((a, b) =>
    a === '#' ? -1 : a.localeCompare(b)
  );

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen text-base-content">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando artistas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen text-base-content">
        <NavBar />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="text-red-500 font-semibold">
              Hubo un error al cargar los artistas
            </p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className='sm:px-10'>
          <NavBar />
        </div>
        <div className="px-4 mb-11">
          <h1 className="px-10 mb-6 mt-1 sm:mt-2 text-3xl font-bold underline underline-offset-8">
            Artistas
          </h1>

          <Buscador
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar artistas..."
            className="max-w-3xl mx-auto mt-2 mb-4 px-2 sm:px-0"
          />

          <div className="mx-auto max-w-screen-xl px-2 sm:px-6 lg:px-12">
            {artistas.length > 0 && artistasFiltrados.length === 0 ? (
              // 👉 Hay artistas, pero ninguno coincide con la búsqueda
              <div className="py-10 text-center text-gray-500">
                No se encontraron artistas que coincidan con la búsqueda.
              </div>
            ) : (
              clavesOrdenadas.map((letra) => (
                <div key={letra}>
                  <div>
                    <p className="font-bold text-3xl mb-4">{letra}</p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 justify-items-center">
                    {nombresAgrupados[letra].map((artista) => (
                      <AvatarArtista
                        key={artista.idArtista}
                        nombre={artista.nombre}
                        imagenUrl={artista.imagenUrl}
                        idArtista={artista.idArtista}
                      />
                    ))}
                  </div>

                  <div className="divider"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

