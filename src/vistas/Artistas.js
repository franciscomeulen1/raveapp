import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import AvatarArtista from '../components/AvatarArtista';
import { useNavigate } from "react-router-dom";

export default function Artistas() {
    const [artistas, setArtistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await api.get('/Artista/GetArtista?isActivo=true');
                const data = response.data.artistas;

                // Para cada artista, buscar su imagen
                const artistasConImagenes = await Promise.all(
                    data.map(async (artista, index) => {
                        try {
                            const mediaRes = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
                            const imagenUrl = mediaRes.data.media?.[0]?.url || null;

                            return {
                                ...artista,
                                likes: 100 + index,
                                imagenUrl
                            };
                        } catch (error) {
                            console.warn(`No se pudo obtener la imagen del artista ${artista.nombre}`, error);
                            return {
                                ...artista,
                                likes: 100 + index,
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

    if (loading) return <div>Cargando artistas...</div>;
    if (error) return <div>Hubo un error: {error}</div>;

    const nombresAgrupados = artistas.reduce((result, artista) => {
        const primeraLetra = /^[a-zA-Z]/.test(artista.nombre) ? artista.nombre[0].toUpperCase() : '#';
        if (!result[primeraLetra]) result[primeraLetra] = [];
        result[primeraLetra].push(artista);
        return result;
    }, {});

    const clavesOrdenadas = Object.keys(nombresAgrupados).sort((a, b) => (a === '#' ? -1 : a.localeCompare(b)));

    const handleCardClick = (idArtista, artista) => {
        navigate(`/artistas/${idArtista}`, { state: { artista } });
    };

    return (
        <div>
            <div className="sm:px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Artistas</h1>
                <div className='mx-28'>
                    {clavesOrdenadas.map(letra => (
                        <div key={letra}>
                            <div><p className='font-bold text-3xl mb-4'>{letra}</p></div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-28 gap-y-8 justify-items-center">
                                {nombresAgrupados[letra].map(artista => (
                                    <AvatarArtista
                                        key={artista.idArtista}
                                        nombre={artista.nombre}
                                        imagenUrl={artista.imagenUrl}
                                        onClick={() => handleCardClick(artista.idArtista, artista)}
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


// import React, { useState, useEffect } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import AvatarArtista from '../components/AvatarArtista';
// import { useNavigate } from "react-router-dom";

// export default function Artistas() {
//     const [artistas, setArtistas] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         api.get('/Artista/GetArtista?isActivo=true')
//             .then(response => {
//                 const data = response.data.artistas;

//                 const artistasConLikes = data.map((artista, index) => ({
//                     ...artista,
//                     likes: 100 + index
//                 }));

//                 setArtistas(artistasConLikes);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error('Error al obtener artistas:', err);
//                 setError(err.message);
//                 setLoading(false);
//             });

//         window.scrollTo(0, 0);
//     }, []);

//     if (loading) return <div>Cargando artistas...</div>;
//     if (error) return <div>Hubo un error: {error}</div>;

//     const nombresAgrupados = artistas.reduce((result, artista) => {
//         const primeraLetra = /^[a-zA-Z]/.test(artista.nombre) ? artista.nombre[0].toUpperCase() : '#';
//         if (!result[primeraLetra]) result[primeraLetra] = [];
//         result[primeraLetra].push(artista);
//         return result;
//     }, {});

//     const clavesOrdenadas = Object.keys(nombresAgrupados).sort((a, b) => (a === '#' ? -1 : a.localeCompare(b)));

//     const handleCardClick = (idArtista, artista) => {
//         navigate(`/artistas/${idArtista}`, { state: { artista } });
//     };

//     return (
//         <div>
//             <div className="sm:px-10 mb-11">
//                 <NavBar />
//                 <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Artistas</h1>
//                 <div className='mx-28'>
//                     {clavesOrdenadas.map(letra => (
//                         <div key={letra}>
//                             <div><p className='font-bold text-3xl mb-4'>{letra}</p></div>
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-28 gap-y-8 justify-items-center">
//                                 {nombresAgrupados[letra].map(artista => (
//                                     <AvatarArtista
//                                         key={artista.idArtista}
//                                         nombre={artista.nombre}
//                                         onClick={() => handleCardClick(artista.idArtista, artista)}
//                                     />
//                                 ))}
//                             </div>
//                             <div className="divider"></div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }