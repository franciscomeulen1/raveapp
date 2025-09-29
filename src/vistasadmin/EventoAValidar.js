// EventoAValidar.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { FaMusic } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import YoutubeEvento from '../components/componentsVistaEvento/YoutubeEvento';
import SoundCloudEvento from '../components/componentsVistaEvento/SoundCloudEvento';
import FechasEvento from '../components/componentsVistaEvento/FechasEvento';
import EtiquetasEvento from '../components/componentsVistaEvento/EtiquetasEvento';
import UbicacionEvento from '../components/componentsVistaEvento/UbicacionEvento';
import ImagenEvento from '../components/componentsVistaEvento/ImagenEvento';
import ArtistasEventoValidar from '../components/componentsEventoAValidar/ArtistasEventoAValidar';

const EventoAValidar = () => {
    const { idEvento } = useParams();
    const [evento, setEvento] = useState(null);
    const [media, setMedia] = useState({ imagen: null, video: null });
    const [entradasPorFecha, setEntradasPorFecha] = useState([]);
    const [tiposEntrada, setTiposEntrada] = useState([]);
    const [generosDisponibles, setGenerosDisponibles] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validando, setValidando] = useState(false); // para el botón "Validar"

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const eventoRes = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
                const eventoData = eventoRes.data.eventos[0];
                setEvento(eventoData);

                // Obtener datos del usuario creador del evento
                const usuarioRes = await api.get(`/Usuario/GetUsuario?IdUsuario=${eventoData.usuario.idUsuario}`);
                setUsuario(usuarioRes.data.usuarios[0]);

                // Obtener medios (imagen y video)
                try {
                    const mediaRes = await api.get(`/Media?idEntidadMedia=${idEvento}`);
                    const mediaList = mediaRes.data.media;
                    const imagen = mediaList.find((m) => m.url)?.url || null;
                    const video = mediaList.find((m) => m.mdVideo)?.mdVideo || null;
                    setMedia({ imagen, video });
                } catch (err) {
                    console.warn('No hay imagen o video');
                    setMedia({ imagen: null, video: null });
                }

                // Tipos de entrada
                const tiposRes = await api.get('/Entrada/GetTiposEntrada');
                setTiposEntrada(tiposRes.data);

                // Generos
                const generosRes = await api.get('/Evento/GetGeneros');
                setGenerosDisponibles(generosRes.data);

                // Entradas por fecha
                const entradasTodas = await Promise.all(
                    eventoData.fechas.map(async (f) => {
                        const entradasRes = await api.get(`/Entrada/GetEntradasFecha?IdFecha=${f.idFecha}`);
                        return { fecha: f, entradas: entradasRes.data };
                    })
                );

                setEntradasPorFecha(entradasTodas);
                setLoading(false);
            } catch (err) {
                console.error('Error al obtener datos del evento:', err);
                setLoading(false);
            }
        };

        fetchEvento();
    }, [idEvento]);

    const getNombreTipoEntrada = (cdTipo) => {
        return tiposEntrada.find((t) => t.cdTipo === cdTipo)?.dsTipo || 'Desconocido';
    };

    const getNombreGenero = (cdGenero) => {
        return generosDisponibles.find((g) => g.cdGenero === cdGenero)?.dsGenero || cdGenero;
    };

    if (loading || !evento || !usuario) {
        return (
            <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-lg text-gray-600">Cargando evento...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const nombre = evento.nombre;
    const propietario = `${usuario.nombre} ${usuario.apellido}`;
    const correo = usuario.correo;
    const direccion = evento.domicilio.direccion;
    const localidad = evento.domicilio.provincia.nombre;
    const municipio = evento.domicilio.provincia.nombre;
    const provincia = evento.domicilio.provincia.nombre;
    const genero = evento.genero.map(getNombreGenero).join(', ');
    const artistas = evento.artistas;
    const dias = evento.fechas.map(fecha => ({
        idFecha: fecha.idFecha,
        fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
        horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    }));
    const lgbt = evento.isLgbt;
    const after = evento.isAfter;

    const actualizarArtista = (artistaActualizado) => {
        setEvento((prev) => ({
            ...prev,
            artistas: prev.artistas.map((a) =>
                a.idArtista === artistaActualizado.idArtista
                    ? { ...a, ...artistaActualizado }
                    : a
            ),
        }));
    };

    const validarEvento = async () => {
        setValidando(true);
        try {
            const payload = {
                idEvento: evento.idEvento,
                idArtistas: evento.artistas.map(artista => artista.idArtista),
                domicilio: evento.domicilio,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                genero: evento.genero,
                isAfter: evento.isAfter,
                isLgbt: evento.isLgbt,
                inicioEvento: evento.inicioEvento,
                finEvento: evento.finEvento,
                estado: 1, // ← Cambiamos de "Por Aprobar" a "Aprobado"
                fechas: evento.fechas.map(fecha => ({
                    idFecha: fecha.idFecha,
                    inicio: fecha.inicio,
                    fin: fecha.fin,
                    inicioVenta: fecha.inicioVenta,
                    finVenta: fecha.finVenta,
                    estado: fecha.estado
                })),
                idFiesta: evento.idFiesta,
                soundCloud: evento.soundCloud
            };

            await api.put('/Evento/UpdateEvento', payload);

            alert('✅ El evento ha sido aprobado correctamente.');
        } catch (error) {
            console.error('Error al aprobar el evento:', error);
            alert('❌ Ocurrió un error al aprobar el evento.');
        } finally {
            setValidando(false);
        }
    };

    const formatFechaHora = (iso) => {
        if (!iso) return { fecha: '—', hora: '—' };
        const d = new Date(iso);
        return {
            fecha: d.toLocaleDateString('es-AR'),
            hora: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />
                <h1 className="mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">Evento a validar:</h1>
                <h2 className="mx-10 sm:px-10 mb-4 sm:mb-8 mt-2 text-xl"><span className="font-bold">Nombre de evento: </span>{nombre}</h2>

                <div className="mx-10 sm:px-10 mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex items-center gap-x-2">
                        <AiOutlineUser className="size-5" />
                        <p><span className="font-bold">Propietario:</span> {propietario} ({correo})</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <FaMusic className="size-5" />
                        <p><span className="font-bold">Género:</span> {genero}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10">
                    <div className="order-2 lg:order-1">

                        <ImagenEvento imagen={media.imagen} />

                        <ArtistasEventoValidar
                            artistas={artistas}
                            onUpdateArtista={actualizarArtista}
                        />


                        <FechasEvento dias={dias} />

                        <UbicacionEvento idEvento={idEvento} direccion={direccion} localidad={localidad} municipio={municipio} provincia={provincia} />

                        <EtiquetasEvento lgbt={lgbt} after={after} />
                    </div>


                    <div className="order-3 lg:order-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Descripción del evento</h2>
                            <p className="text-gray-700 mt-2">{evento.descripcion || 'Sin descripción.'}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-purple-700 mb-2">Entradas</h3>

                            {entradasPorFecha.map(({ fecha, entradas }) => {
                                const iv = formatFechaHora(fecha.inicioVenta);
                                const fv = formatFechaHora(fecha.finVenta);

                                return (
                                    <div key={fecha.idFecha} className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Fecha: {new Date(fecha.inicio).toLocaleDateString('es-AR')}
                                        </p>

                                        {entradas.map((e, idx) => (
                                            <p key={idx} className="text-gray-700">
                                                {getNombreTipoEntrada(e.tipo.cdTipo)}:{' '}
                                                <span className="font-medium">Precio: ${e.precio}</span> -{' '}
                                                <span className="font-medium">Cantidad: {e.cantidad}</span>
                                            </p>
                                        ))}

                                        <div className="mt-1 text-sm text-gray-600">
                                            <p>
                                                <span className="font-medium">Inicio de venta de entradas:</span>{' '}
                                                {iv.fecha} - {iv.hora}
                                            </p>
                                            <p>
                                                <span className="font-medium">Fin venta de entradas:</span>{' '}
                                                {fv.fecha} - {fv.hora}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='order-4 lg:order-3'><SoundCloudEvento url={evento.soundCloud} /></div>

                    <div className='order-5 lg:order-4'><YoutubeEvento url={media.video} /></div>

                    <div className="order-6 lg:order-5">
                        <h3 className="text-lg font-medium">En caso de rechazar el evento, completar el motivo de rechazo:</h3>
                        <textarea
                            className="w-full mt-2 p-2 border border-gray-300 rounded"
                            rows="4"
                            placeholder="Motivo del rechazo..."
                        ></textarea>
                        <p className="text-sm text-gray-500 mt-2">* El motivo de rechazo se le enviará por mail al creador del evento.</p>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={validarEvento}
                                disabled={validando}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {validando ? 'Validando...' : 'Validar'}
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Rechazar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventoAValidar;