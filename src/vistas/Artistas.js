import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import AvatarArtista from '../components/AvatarArtista';

export default function Artistas() {
    const [artistas, setArtistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await api.get('/Artista/GetArtista?isActivo=true');
                const data = response.data.artistas;

                const artistasConImagenes = await Promise.all(
                    data.map(async (artista) => {
                        try {
                            const mediaRes = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
                            const imagenUrl = mediaRes.data.media?.[0]?.url || null;

                            return {
                                ...artista,
                                imagenUrl
                            };
                        } catch (error) {
                            console.warn(`No se pudo obtener la imagen del artista ${artista.nombre}`, error);
                            return {
                                ...artista,
                                imagenUrl: null
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
    
    // Loading state con spinner bonito centrado en la pantalla
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
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

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
                <NavBar />
                <div className="flex flex-1 items-center justify-center px-4 py-20">
                    <div className="text-center">
                        <p className="text-red-500 font-semibold">Hubo un error al cargar los artistas</p>
                        <p className="text-sm text-gray-500 mt-2">{error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const nombresAgrupados = artistas.reduce((result, artista) => {
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

    return (
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
            <div className="px-4 sm:px-10 mb-11 flex-1">
                <NavBar />
                <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
                    Artistas
                </h1>

                <div className="mx-auto max-w-screen-xl px-2 sm:px-6 lg:px-12">
                    {clavesOrdenadas.map((letra) => (
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
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}