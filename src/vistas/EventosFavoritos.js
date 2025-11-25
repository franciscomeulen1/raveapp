import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardsEventos from '../components/CardsEventos';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

export default function EventosFavoritos() {
    const { user } = useContext(AuthContext);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoritos = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // 1. Traer los IDs de los eventos favoritos del usuario
                const idsRes = await api.get(`/Usuario/GetEventosFavoritos?idUsuario=${user.id}`);
                const idsFavoritos = idsRes.data.eventos; // asumo que es array de idsEvento

                if (!idsFavoritos || idsFavoritos.length === 0) {
                    setEventos([]);
                    setLoading(false);
                    return;
                }

                // 2. Traer el diccionario de géneros para decodificar los códigos
                const generosRes = await api.get('/Evento/GetGeneros');
                const generosDict = {};
                generosRes.data.forEach(gen => {
                    generosDict[gen.cdGenero] = gen.dsGenero;
                });

                // 3. Traer la data de cada evento en paralelo
                const eventosRes = await Promise.all(
                    idsFavoritos.map(id =>
                        api.get(`/Evento/GetEventos?IdEvento=${id}`)
                    )
                );

                // Aplanar y quedarnos con el primer evento de cada respuesta
                const eventosBasicos = eventosRes
                    .map(res => res.data.eventos?.[0])
                    .filter(e => e); // saca null/undefined por las dudas

                // 4. Traer las imágenes de cada evento en paralelo usando /Media?idEntidadMedia={idEvento}
                const mediaResponses = await Promise.all(
                    eventosBasicos.map(ev =>
                        api.get(`/Media?idEntidadMedia=${ev.idEvento}`)
                            .then(r => ({ idEvento: ev.idEvento, media: r.data.media }))
                            .catch(err => {
                                console.warn('No se pudo cargar Media para evento', ev.idEvento, err);
                                return { idEvento: ev.idEvento, media: [] };
                            })
                    )
                );

                // Armamos un map idEvento -> urlImagen
                const imagenPorEvento = {};
                mediaResponses.forEach(({ idEvento, media }) => {
                    // la API puede devolver una lista de medias, o una sola; asumimos lista
                    // buscamos la primera que tenga .url no vacía
                    if (Array.isArray(media)) {
                        const imgObj = media.find(m => m.url && !m.mdVideo);
                        imagenPorEvento[idEvento] = imgObj ? imgObj.url : null;
                    } else {
                        // por si el backend devuelve un objeto único
                        imagenPorEvento[idEvento] =
                            media.url && !media.mdVideo ? media.url : null;
                    }
                });

                // 5. Transformar al formato que espera <CardsEventos />
                const eventosCompletos = eventosBasicos.map(evento => ({
                    id: evento.idEvento,
                    nombreEvento: evento.nombre,
                    dias: evento.fechas.map(fecha => ({
                        fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
                        horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        entradas: fecha.entradas || []
                    })),
                    generos: evento.genero.map(
                        genId => generosDict[genId] || 'Desconocido'
                    ),
                    artistas: evento.artistas || [],
                    lgbt: evento.isLgbt,
                    after: evento.isAfter,
                    provincia: evento.domicilio?.provincia?.nombre || '',
                    municipio: evento.domicilio?.municipio?.nombre || '',
                    localidad: evento.domicilio?.localidad?.nombre || '',
                    direccion: evento.domicilio?.direccion || '',
                    descripcion: evento.descripcion || '',
                    // 👇 ahora la imagen REAL del evento desde /Media
                    imagen: imagenPorEvento[evento.idEvento] || null,
                    // En favoritos siempre es true
                    isFavorito: true,
                }));

                setEventos(eventosCompletos);
            } catch (err) {
                console.error('Error al obtener eventos favoritos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
        window.scrollTo(0, 0);
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="sm:px-10 flex-grow">
                <NavBar />
                <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
                    Eventos Favoritos:
                </h1>

                <div className="mx-3 sm:mx-9 md:mx-14 lg:mx-24">
                    {loading ? (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                                <p className="text-gray-600">Cargando tus eventos favoritos...</p>
                            </div>
                        </div>
                    ) : eventos.length === 0 ? (
                        <div className="text-center my-10">
                            <p className="text-xl font-semibold">
                                Todavía no marcaste eventos como favoritos.
                            </p>
                            <p className="text-gray-500">
                                ¡Explora la página de inicio y da like a los que te interesen!
                            </p>
                        </div>
                    ) : (
                        <CardsEventos eventos={eventos} user={user} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}


// import React, { useContext, useEffect, useState } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import CardsEventos from '../components/CardsEventos';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

// export default function EventosFavoritos() {
//     const { user } = useContext(AuthContext);
//     const [eventos, setEventos] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchFavoritos = async () => {
//             if (!user) return;

//             setLoading(true);
//             try {
//                 // Trae los IDs de los eventos favoritos
//                 const idsRes = await api.get(`/Usuario/GetEventosFavoritos?idUsuario=${user.id}`);
//                 const idsFavoritos = idsRes.data.eventos;

//                 if (idsFavoritos.length === 0) {
//                     setEventos([]);
//                     return;
//                 }

//                 const generosRes = await api.get('/Evento/GetGeneros');
//                 const generosDict = {};
//                 generosRes.data.forEach(gen => {
//                     generosDict[gen.cdGenero] = gen.dsGenero;
//                 });

//                 // Llamadas paralelas para cada evento
//                 const eventosRes = await Promise.all(
//                     idsFavoritos.map(id => api.get(`/Evento/GetEventos?IdEvento=${id}`))
//                 );

//                 const eventosCompletos = eventosRes
//                     .map(res => res.data.eventos?.[0]) // extrae el evento
//                     .filter(evento => evento) // filtra nulos
//                     .map(evento => ({
//                         id: evento.idEvento,
//                         nombreEvento: evento.nombre,
//                         dias: evento.fechas.map(fecha => ({
//                             fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
//                             horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//                             horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//                             entradas: fecha.entradas || []
//                         })),
//                         generos: evento.genero.map(genId => generosDict[genId] || 'Desconocido'),
//                         artistas: evento.artistas || [],
//                         lgbt: evento.isLgbt,
//                         after: evento.isAfter,
//                         provincia: evento.domicilio.provincia.nombre,
//                         municipio: evento.domicilio.municipio.nombre,
//                         localidad: evento.domicilio.localidad.nombre,
//                         direccion: evento.domicilio.direccion,
//                         descripcion: evento.descripcion,
//                         imagen: evento.media && evento.media.length > 0 ? evento.media[0].imagen : null,
//                         isFavorito: true,
//                     }));

//                 setEventos(eventosCompletos);
//             } catch (err) {
//                 console.error('Error al obtener eventos favoritos:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFavoritos();
//         window.scrollTo(0, 0);
//     }, [user]);

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="sm:px-10 flex-grow">
//                 <NavBar />
//                 <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
//                     Eventos Favoritos:
//                 </h1>
//                 <div className="mx-3 sm:mx-9 md:mx-14 lg:mx-24">
//                     {loading ? (
//                         <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
//                         <p className="text-gray-600">Cargando tus eventos favoritos...</p>
//                     </div>
//                 </div>
//                     ) : eventos.length === 0 ? (
//                         <div className="text-center my-10">
//                             <p className="text-xl font-semibold">Todavía no marcaste eventos como favoritos.</p>
//                             <p className="text-gray-500">¡Explora la página de inicio y da like a los que te interesen!</p>
//                         </div>
//                     ) : (
//                         <CardsEventos eventos={eventos} user={user} />
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }