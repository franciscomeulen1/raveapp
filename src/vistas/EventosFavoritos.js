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
                // Trae los IDs de los eventos favoritos
                const idsRes = await api.get(`/Usuario/GetEventosFavoritos?idUsuario=${user.id}`);
                const idsFavoritos = idsRes.data.eventos;

                if (idsFavoritos.length === 0) {
                    setEventos([]);
                    return;
                }

                const generosRes = await api.get('/Evento/GetGeneros');
                const generosDict = {};
                generosRes.data.forEach(gen => {
                    generosDict[gen.cdGenero] = gen.dsGenero;
                });

                // Llamadas paralelas para cada evento
                const eventosRes = await Promise.all(
                    idsFavoritos.map(id => api.get(`/Evento/GetEventos?IdEvento=${id}`))
                );

                const eventosCompletos = eventosRes
                    .map(res => res.data.eventos?.[0]) // extrae el evento
                    .filter(evento => evento) // filtra nulos
                    .map(evento => ({
                        id: evento.idEvento,
                        nombreEvento: evento.nombre,
                        dias: evento.fechas.map(fecha => ({
                            fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
                            horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                            horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                            entradas: fecha.entradas || []
                        })),
                        generos: evento.genero.map(genId => generosDict[genId] || 'Desconocido'),
                        artistas: evento.artistas || [],
                        lgbt: evento.isLgbt,
                        after: evento.isAfter,
                        provincia: evento.domicilio.provincia.nombre,
                        municipio: evento.domicilio.municipio.nombre,
                        localidad: evento.domicilio.localidad.nombre,
                        direccion: evento.domicilio.direccion,
                        descripcion: evento.descripcion,
                        imagen: evento.media && evento.media.length > 0 ? evento.media[0].imagen : null,
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
                            <p className="text-xl font-semibold">Todavía no marcaste eventos como favoritos.</p>
                            <p className="text-gray-500">¡Explora la página de inicio y da like a los que te interesen!</p>
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



// import React from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import Cards from '../components/CardsEventos';

// export default function EventosFavoritos() {
//     window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

//     // Simulación de eventos favoritos hardcodeados (en producción vendrían de un backend o estado global del usuario)
//     const eventos = [
//         {
//             id: 1,
//             nombreEvento: "Nombre de evento 1",
//             dias: [
//                 {
//                     fecha: "10/05/2025",
//                     horaInicio: "23:50hs",
//                     horaFin: "07:00hs",
//                     entradas: [
//                         { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "General", precio: 5000, stock: 900 },
//                         { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "Vip", precio: 7000, stock: 400 }
//                     ]
//                 }
//             ],
//             generos: ["Tech-House", "Techno"],
//             artistas: ["Dich Brothers", "La Cintia", "Luana"],
//             lgbt: true,
//             after: false,
//             provincia: "Buenos Aires",
//             municipio: "Tres de Febrero",
//             localidad: "Villa Bosch",
//             direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//             descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//         },
//         {
//             id: 3,
//             nombreEvento: "Nombre de evento 3",
//             dias: [
//                 {
//                     fecha: "16/10/2025",
//                     horaInicio: "20:00hs",
//                     horaFin: "02:00hs",
//                     entradas: [
//                         { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "General", precio: 5000, stock: 900 },
//                         { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "Vip", precio: 7000, stock: 400 }
//                     ]
//                 },
//                 {
//                     fecha: "17/10/2025",
//                     horaInicio: "20:00hs",
//                     horaFin: "02:00hs",
//                     entradas: [
//                         { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "General", precio: 5000, stock: 900 },
//                         { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//                         { tipo: "Vip", precio: 7000, stock: 400 }
//                     ]
//                 }
//             ],
//             generos: ["Tech-House", "Techno"],
//             artistas: ["Juan Solis", "Kilah"],
//             lgbt: false,
//             after: true,
//             provincia: "Ciudad Autónoma de Buenos Aires",
//             municipio: "",
//             localidad: "",
//             direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//             descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//         },
//         // Agrega aquí más eventos favoritos según tu lógica real
//     ];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className='sm:px-10 flex-grow'>
//                 <NavBar />
//                 <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Eventos Favoritos:</h1>
//                 <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
//                     <Cards eventos={eventos} />
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }