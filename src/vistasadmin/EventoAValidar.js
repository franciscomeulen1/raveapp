// EventoAValidar.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const { idEvento } = useParams();

    const [evento, setEvento] = useState(null);
    const [media, setMedia] = useState({ imagen: null, video: null });
    const [entradasPorFecha, setEntradasPorFecha] = useState([]);
    const [tiposEntrada, setTiposEntrada] = useState([]);
    const [generosDisponibles, setGenerosDisponibles] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const [loading, setLoading] = useState(true);

    // estados de acción/UI
    const [validando, setValidando] = useState(false);
    const [rechazando, setRechazando] = useState(false);

    // textarea motivo rechazo
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [errorMotivo, setErrorMotivo] = useState('');

    // modal genérico
    const [showModal, setShowModal] = useState(false);
    const [modalTitulo, setModalTitulo] = useState('');
    const [modalMensaje, setModalMensaje] = useState('');
    const [modalRedirectOnClose, setModalRedirectOnClose] = useState(false);
    const [modalTipo, setModalTipo] = useState(''); // 'aprobado' | 'rechazado' | 'error'

    // NUEVO: flag para estado inválido (no "Por aprobar")
    const [estadoInvalido, setEstadoInvalido] = useState(false);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const eventoRes = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
                const eventoData = eventoRes.data.eventos[0];

                // --- VALIDAR ESTADO DEL EVENTO ---
                // Solo se debe permitir continuar si cdEstado === 0 ("Por aprobar")
                if (eventoData?.cdEstado !== 0) {
                    setEstadoInvalido(true);
                    setLoading(false);
                    return; // cortamos acá, no seguimos cargando datos
                }

                setEvento(eventoData);

                // Datos del usuario creador
                const usuarioRes = await api.get(`/Usuario/GetUsuario?IdUsuario=${eventoData.usuario.idUsuario}`);
                setUsuario(usuarioRes.data.usuarios[0]);

                // Media (img/video)
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

                // Géneros
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

    // -------- MODAL helpers --------
    const abrirModal = ({ titulo, mensaje, tipo = 'aprobado', redirect = false }) => {
        setModalTitulo(titulo);
        setModalMensaje(mensaje);
        setModalTipo(tipo);
        setShowModal(true);
        setModalRedirectOnClose(redirect);
    };

    const cerrarModal = () => {
        setShowModal(false);
        if (modalRedirectOnClose) {
            navigate('/eventosavalidar');
        }
    };

    // -------- VALIDAR EVENTO (APROBAR) --------
    const validarEvento = async () => {
        if (!evento || !usuario) return;

        if (!usuario.correo) {
            abrirModal({
                titulo: 'Error',
                mensaje: 'El usuario no tiene correo cargado. No se pudo enviar la notificación.',
                tipo: 'error',
                redirect: false,
            });
            return;
        }

        setValidando(true);
        try {
            const payload = {
                idEvento: evento.idEvento,
                idArtistas: evento.artistas.map((artista) => artista.idArtista),
                domicilio: evento.domicilio,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                genero: evento.genero,
                isAfter: evento.isAfter,
                isLgbt: evento.isLgbt,
                inicioEvento: evento.inicioEvento,
                finEvento: evento.finEvento,
                estado: 1, // Aprobado
                fechas: evento.fechas.map((fecha) => ({
                    idFecha: fecha.idFecha,
                    inicio: fecha.inicio,
                    fin: fecha.fin,
                    inicioVenta: fecha.inicioVenta,
                    finVenta: fecha.finVenta,
                    estado: 1,
                })),
                idFiesta: evento.idFiesta,
                soundCloud: evento.soundCloud,
            };

            const emailPayload = {
                to: usuario.correo,
                titulo: `Evento aprobado: ${evento.nombre}`,
                cuerpo: 'A partir de la fecha y hora que hayas elegido para que comience la venta de entradas, el evento puede tardar algunos minutos en aparecer en RaveApp.',
                botonUrl: `http://raveapp.com.ar/evento/${evento.idEvento}`,
                botonTexto: 'Ver evento',
            };

            console.log('Enviando mail de aprobación con payload:', emailPayload);

            let envioMailOk = true;
            try {
                await api.post('/Email/EnvioMailGenerico', emailPayload);
            } catch (errMail) {
                console.warn('Fallo envío de mail de aprobación', errMail);
                envioMailOk = false;
            }

            if (!envioMailOk) {
                abrirModal({
                    titulo: 'Error al enviar mail',
                    mensaje: 'El evento fue procesado, pero no se pudo notificar al organizador por mail.',
                    tipo: 'aprobado',
                    redirect: false,
                });
                setValidando(false);
                return;
            }

            await api.put('/Evento/UpdateEvento', payload);

            abrirModal({
                titulo: 'Evento aprobado',
                mensaje: '✅ El evento ha sido aprobado correctamente.',
                tipo: 'aprobado',
                redirect: true,
            });
        } catch (error) {
            console.error('Error al aprobar el evento:', error);
            abrirModal({
                titulo: 'Error',
                mensaje: '❌ Ocurrió un error al aprobar el evento.',
                tipo: 'error',
                redirect: false,
            });
        } finally {
            setValidando(false);
        }
    };

    // -------- RECHAZAR EVENTO --------
    const rechazarEvento = async () => {
        if (!evento || !usuario) return;

        if (!motivoRechazo.trim()) {
            setErrorMotivo('Debes indicar el motivo del rechazo.');
            return;
        }
        setErrorMotivo('');

        if (!usuario.correo) {
            abrirModal({
                titulo: 'Error',
                mensaje: 'El usuario no tiene correo cargado. No se pudo enviar la notificación de rechazo.',
                tipo: 'error',
                redirect: false,
            });
            return;
        }

        setRechazando(true);
        try {
            const emailPayload = {
                to: usuario.correo,
                titulo: `Evento rechazado: ${evento.nombre}`,
                cuerpo: `Motivo de rechazo: ${motivoRechazo}`,
                botonUrl: '',
                botonTexto: '',
            };

            console.log('Enviando mail de rechazo con payload:', emailPayload);

            let envioMailOk = true;
            try {
                await api.post('/Email/EnvioMailGenerico', emailPayload);
            } catch (errMail) {
                console.warn('Fallo envío de mail de rechazo', errMail);
                envioMailOk = false;
            }

            if (!envioMailOk) {
                abrirModal({
                    titulo: 'Error al enviar mail',
                    mensaje: 'No se pudo notificar al organizador por mail. El evento NO fue marcado como rechazado.',
                    tipo: 'error',
                    redirect: false,
                });
                setRechazando(false);
                return;
            }

            const payload = {
                idEvento: evento.idEvento,
                idArtistas: evento.artistas.map((artista) => artista.idArtista),
                domicilio: evento.domicilio,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                genero: evento.genero,
                isAfter: evento.isAfter,
                isLgbt: evento.isLgbt,
                inicioEvento: evento.inicioEvento,
                finEvento: evento.finEvento,
                estado: 6, // Rechazado
                fechas: evento.fechas.map((fecha) => ({
                    idFecha: fecha.idFecha,
                    inicio: fecha.inicio,
                    fin: fecha.fin,
                    inicioVenta: fecha.inicioVenta,
                    finVenta: fecha.finVenta,
                    estado: 6,
                })),
                idFiesta: evento.idFiesta,
                soundCloud: evento.soundCloud,
            };

            await api.put('/Evento/UpdateEvento', payload);

            abrirModal({
                titulo: 'Evento rechazado',
                mensaje: '🚫 El evento ha sido rechazado.',
                tipo: 'rechazado',
                redirect: true,
            });
        } catch (error) {
            console.error('Error al rechazar el evento:', error);
            abrirModal({
                titulo: 'Error',
                mensaje: '❌ Ocurrió un error al rechazar el evento.',
                tipo: 'error',
                redirect: false,
            });
        } finally {
            setRechazando(false);
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

    // --- RENDERIZADO ---

    // 1) Todavía cargando
    if (loading) {
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

    // 2) Evento con estado distinto de "Por aprobar"
    if (estadoInvalido) {
        return (
            <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        El evento al cual quieres acceder, no se encuentra en estado "Por aprobar".
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Solo es posible validar eventos que estén actualmente en estado <span className="font-semibold">Por aprobar</span>.
                    </p>
                </main>
                <Footer />
            </div>
        );
    }

    // 3) Algún problema cargando datos
    if (!evento || !usuario) {
        return (
            <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-lg text-red-600">
                        Ocurrió un problema al cargar la información del evento.
                    </p>
                </main>
                <Footer />
            </div>
        );
    }

    // Datos derivados para render
    const nombre = evento.nombre;
    const propietario = `${usuario.nombre} ${usuario.apellido}`;
    const correo = usuario.correo;
    const direccion = evento.domicilio.direccion;
    const localidad = evento.domicilio.provincia.nombre;
    const municipio = evento.domicilio.provincia.nombre;
    const provincia = evento.domicilio.provincia.nombre;
    const genero = evento.genero.map(getNombreGenero).join(', ');
    const artistas = evento.artistas;
    const dias = evento.fechas.map((fecha) => ({
        idFecha: fecha.idFecha,
        fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
        horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    }));
    const lgbt = evento.isLgbt;
    const after = evento.isAfter;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />
                <h1 className="mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
                    Evento a validar:
                </h1>
                <h2 className="mx-10 sm:px-10 mb-4 sm:mb-8 mt-2 text-xl">
                    <span className="font-bold">Nombre de evento: </span>
                    {nombre}
                </h2>

                <div className="mx-10 sm:px-10 mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex items-center gap-x-2">
                        <AiOutlineUser className="size-5" />
                        <p>
                            <span className="font-bold">Propietario:</span> {propietario} ({correo})
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <FaMusic className="size-5" />
                        <p>
                            <span className="font-bold">Género:</span> {genero}
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10">
                    {/* Columna izquierda */}
                    <div className="order-2 lg:order-1">
                        <ImagenEvento imagen={media.imagen} />

                        <ArtistasEventoValidar
                            artistas={artistas}
                            onUpdateArtista={actualizarArtista}
                        />

                        <FechasEvento dias={dias} />

                        <UbicacionEvento
                            idEvento={idEvento}
                            direccion={direccion}
                            localidad={localidad}
                            municipio={municipio}
                            provincia={provincia}
                        />

                        <EtiquetasEvento lgbt={lgbt} after={after} />
                    </div>

                    {/* Columna derecha */}
                    <div className="order-3 lg:order-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Descripción del evento</h2>
                            <p className="text-gray-700 mt-2">
                                {evento.descripcion || 'Sin descripción.'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-purple-700 mb-2">Entradas</h3>

                            {entradasPorFecha.map(({ fecha, entradas }) => {
                                const iv = formatFechaHora(fecha.inicioVenta);
                                const fv = formatFechaHora(fecha.finVenta);

                                return (
                                    <div key={fecha.idFecha} className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Fecha:{' '}
                                            {new Date(fecha.inicio).toLocaleDateString('es-AR')}
                                        </p>

                                        {entradas.map((e, idx) => (
                                            <p key={idx} className="text-gray-700">
                                                {getNombreTipoEntrada(e.tipo.cdTipo)}:{' '}
                                                <span className="font-medium">
                                                    Precio: ${e.precio}
                                                </span>{' '}
                                                -{' '}
                                                <span className="font-medium">
                                                    Cantidad: {e.cantidad}
                                                </span>
                                            </p>
                                        ))}

                                        <div className="mt-1 text-sm text-gray-600">
                                            <p>
                                                <span className="font-medium">
                                                    Inicio de venta de entradas:
                                                </span>{' '}
                                                {iv.fecha} - {iv.hora}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Fin venta de entradas:
                                                </span>{' '}
                                                {fv.fecha} - {fv.hora}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="order-4 lg:order-3">
                        <SoundCloudEvento url={evento.soundCloud} />
                    </div>

                    <div className="order-5 lg:order-4">
                        <YoutubeEvento url={media.video} />
                    </div>

                    {/* Bloque de rechazo + botones */}
                    <div className="order-6 lg:order-5">
                        <h3 className="text-lg font-medium">
                            En caso de rechazar el evento, completar el motivo de rechazo:
                        </h3>
                        <textarea
                            className={`w-full mt-2 p-2 border rounded ${errorMotivo ? 'border-red-500' : 'border-gray-300'
                                }`}
                            rows="4"
                            placeholder="Motivo del rechazo..."
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                        ></textarea>
                        {errorMotivo && (
                            <p className="text-sm text-red-600 mt-1">{errorMotivo}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            * El motivo de rechazo se le enviará por mail al creador del
                            evento.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                onClick={validarEvento}
                                disabled={validando || rechazando}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                {validando ? 'Validando...' : 'Validar'}
                            </button>

                            <button
                                onClick={rechazarEvento}
                                disabled={rechazando || validando}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                            >
                                {rechazando ? 'Rechazando...' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL RESULTADO */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <h2
                            className={`text-xl font-bold mb-2 ${modalTipo === 'aprobado'
                                    ? 'text-green-600'
                                    : modalTipo === 'rechazado'
                                        ? 'text-red-600'
                                        : 'text-red-700'
                                }`}
                        >
                            {modalTitulo}
                        </h2>
                        <p className="text-gray-700 mb-6 whitespace-pre-line">
                            {modalMensaje}
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                                onClick={cerrarModal}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default EventoAValidar;


// // EventoAValidar.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { FaMusic } from 'react-icons/fa';
// import { AiOutlineUser } from 'react-icons/ai';
// import YoutubeEvento from '../components/componentsVistaEvento/YoutubeEvento';
// import SoundCloudEvento from '../components/componentsVistaEvento/SoundCloudEvento';
// import FechasEvento from '../components/componentsVistaEvento/FechasEvento';
// import EtiquetasEvento from '../components/componentsVistaEvento/EtiquetasEvento';
// import UbicacionEvento from '../components/componentsVistaEvento/UbicacionEvento';
// import ImagenEvento from '../components/componentsVistaEvento/ImagenEvento';
// import ArtistasEventoValidar from '../components/componentsEventoAValidar/ArtistasEventoAValidar';

// const EventoAValidar = () => {
//     const navigate = useNavigate();
//     const { idEvento } = useParams();

//     const [evento, setEvento] = useState(null);
//     const [media, setMedia] = useState({ imagen: null, video: null });
//     const [entradasPorFecha, setEntradasPorFecha] = useState([]);
//     const [tiposEntrada, setTiposEntrada] = useState([]);
//     const [generosDisponibles, setGenerosDisponibles] = useState([]);
//     const [usuario, setUsuario] = useState(null);

//     const [loading, setLoading] = useState(true);

//     // estados de acción/UI
//     const [validando, setValidando] = useState(false);
//     const [rechazando, setRechazando] = useState(false);

//     // textarea motivo rechazo
//     const [motivoRechazo, setMotivoRechazo] = useState('');
//     const [errorMotivo, setErrorMotivo] = useState('');

//     // modal genérico
//     const [showModal, setShowModal] = useState(false);
//     const [modalTitulo, setModalTitulo] = useState('');
//     const [modalMensaje, setModalMensaje] = useState('');
//     // const [modalIsError, setModalIsError] = useState(false);
//     const [modalRedirectOnClose, setModalRedirectOnClose] = useState(false);
//     const [modalTipo, setModalTipo] = useState(''); // 'aprobado' | 'rechazado' | 'error'


//     useEffect(() => {
//         const fetchEvento = async () => {
//             try {
//                 const eventoRes = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
//                 const eventoData = eventoRes.data.eventos[0];
//                 setEvento(eventoData);

//                 // Datos del usuario creador
//                 const usuarioRes = await api.get(`/Usuario/GetUsuario?IdUsuario=${eventoData.usuario.idUsuario}`);
//                 setUsuario(usuarioRes.data.usuarios[0]);

//                 // Media (img/video)
//                 try {
//                     const mediaRes = await api.get(`/Media?idEntidadMedia=${idEvento}`);
//                     const mediaList = mediaRes.data.media;
//                     const imagen = mediaList.find((m) => m.url)?.url || null;
//                     const video = mediaList.find((m) => m.mdVideo)?.mdVideo || null;
//                     setMedia({ imagen, video });
//                 } catch (err) {
//                     console.warn('No hay imagen o video');
//                     setMedia({ imagen: null, video: null });
//                 }

//                 // Tipos de entrada
//                 const tiposRes = await api.get('/Entrada/GetTiposEntrada');
//                 setTiposEntrada(tiposRes.data);

//                 // Géneros
//                 const generosRes = await api.get('/Evento/GetGeneros');
//                 setGenerosDisponibles(generosRes.data);

//                 // Entradas por fecha
//                 const entradasTodas = await Promise.all(
//                     eventoData.fechas.map(async (f) => {
//                         const entradasRes = await api.get(`/Entrada/GetEntradasFecha?IdFecha=${f.idFecha}`);
//                         return { fecha: f, entradas: entradasRes.data };
//                     })
//                 );

//                 setEntradasPorFecha(entradasTodas);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error al obtener datos del evento:', err);
//                 setLoading(false);
//             }
//         };

//         fetchEvento();
//     }, [idEvento]);

//     const getNombreTipoEntrada = (cdTipo) => {
//         return tiposEntrada.find((t) => t.cdTipo === cdTipo)?.dsTipo || 'Desconocido';
//     };

//     const getNombreGenero = (cdGenero) => {
//         return generosDisponibles.find((g) => g.cdGenero === cdGenero)?.dsGenero || cdGenero;
//     };

//     const actualizarArtista = (artistaActualizado) => {
//         setEvento((prev) => ({
//             ...prev,
//             artistas: prev.artistas.map((a) =>
//                 a.idArtista === artistaActualizado.idArtista
//                     ? { ...a, ...artistaActualizado }
//                     : a
//             ),
//         }));
//     };

//     // -------- MODAL helpers --------
//     const abrirModal = ({ titulo, mensaje, tipo = 'aprobado', redirect = false }) => {
//         setModalTitulo(titulo);
//         setModalMensaje(mensaje);
//         setModalTipo(tipo); // ← guardamos el tipo
//         setShowModal(true);
//         setModalRedirectOnClose(redirect);
//     };


//     const cerrarModal = () => {
//         setShowModal(false);
//         if (modalRedirectOnClose) {
//             navigate('/eventosavalidar');
//         }
//     };

//     // -------- VALIDAR EVENTO (APROBAR) --------
//     const validarEvento = async () => {
//         if (!evento || !usuario) return;

//         // sanity check de correo
//         if (!usuario.correo) {
//             abrirModal({
//                 titulo: 'Error',
//                 mensaje: 'El usuario no tiene correo cargado. No se pudo enviar la notificación.',
//                 tipo: 'error',
//                 redirect: false,
//             });
//             return;
//         }

//         setValidando(true);
//         try {
//             // 1) preparamos payload de aprobación
//             const payload = {
//                 idEvento: evento.idEvento,
//                 idArtistas: evento.artistas.map((artista) => artista.idArtista),
//                 domicilio: evento.domicilio,
//                 nombre: evento.nombre,
//                 descripcion: evento.descripcion,
//                 genero: evento.genero,
//                 isAfter: evento.isAfter,
//                 isLgbt: evento.isLgbt,
//                 inicioEvento: evento.inicioEvento,
//                 finEvento: evento.finEvento,
//                 estado: 1, // Aprobado
//                 fechas: evento.fechas.map((fecha) => ({
//                     idFecha: fecha.idFecha,
//                     inicio: fecha.inicio,
//                     fin: fecha.fin,
//                     inicioVenta: fecha.inicioVenta,
//                     finVenta: fecha.finVenta,
//                     estado: 1,
//                 })),
//                 idFiesta: evento.idFiesta,
//                 soundCloud: evento.soundCloud,
//             };

//             // 2) armamos el mail
//             const emailPayload = {
//                 to: usuario.correo,
//                 titulo: `Evento aprobado: ${evento.nombre}`,
//                 cuerpo: "El evento puede tardar algunos minutos en aparecer en RaveApp.",
//                 botonUrl: `http://raveapp.com.ar/evento/${evento.idEvento}`,
//                 botonTexto: "Ver evento",
//             };

//             console.log('Enviando mail de aprobación con payload:', emailPayload);

//             // 3) enviamos mail primero
//             let envioMailOk = true;
//             try {
//                 await api.post('/Email/EnvioMailGenerico', emailPayload);
//             } catch (errMail) {
//                 console.warn('Fallo envío de mail de aprobación', errMail);
//                 envioMailOk = false;
//             }

//             if (!envioMailOk) {
//                 abrirModal({
//                     titulo: 'Error al enviar mail',
//                     mensaje: 'El evento fue procesado, pero no se pudo notificar al organizador por mail.',
//                     tipo: 'aprobado',
//                     redirect: false,
//                 });
//                 setValidando(false);
//                 return;
//             }

//             // 4) si el mail salió bien, recién ahí aprobamos el evento
//             await api.put('/Evento/UpdateEvento', payload);

//             // 5) Modal ok + redirect
//             abrirModal({
//                 titulo: 'Evento aprobado',
//                 mensaje: '✅ El evento ha sido aprobado correctamente.',
//                 tipo: 'aprobado',
//                 redirect: true,
//             });
//         } catch (error) {
//             console.error('Error al aprobar el evento:', error);
//             abrirModal({
//                 titulo: 'Error',
//                 mensaje: '❌ Ocurrió un error al aprobar el evento.',
//                 tipo: 'error',
//                 redirect: false,
//             });
//         } finally {
//             setValidando(false);
//         }
//     };


//     // -------- RECHAZAR EVENTO --------
//     const rechazarEvento = async () => {
//         if (!evento || !usuario) return;

//         // 1) validar motivo obligatorio
//         if (!motivoRechazo.trim()) {
//             setErrorMotivo('Debes indicar el motivo del rechazo.');
//             return;
//         }
//         setErrorMotivo('');

//         // sanity check de correo
//         if (!usuario.correo) {
//             abrirModal({
//                 titulo: 'Error',
//                 mensaje: 'El usuario no tiene correo cargado. No se pudo enviar la notificación de rechazo.',
//                 tipo: 'error',
//                 redirect: false,
//             });
//             return;
//         }

//         setRechazando(true);
//         try {
//             // 2) armamos email rechazo
//             const emailPayload = {
//                 to: usuario.correo,
//                 titulo: `Evento rechazado: ${evento.nombre}`,
//                 cuerpo: `Motivo de rechazo: ${motivoRechazo}`,
//                 botonUrl: "",
//                 botonTexto: "",
//             };

//             console.log('Enviando mail de rechazo con payload:', emailPayload);

//             // 3) intentamos enviar el mail primero
//             let envioMailOk = true;
//             try {
//                 await api.post('/Email/EnvioMailGenerico', emailPayload);
//             } catch (errMail) {
//                 console.warn('Fallo envío de mail de rechazo', errMail);
//                 envioMailOk = false;
//             }

//             if (!envioMailOk) {
//                 abrirModal({
//                     titulo: 'Error al enviar mail',
//                     mensaje: 'No se pudo notificar al organizador por mail. El evento NO fue marcado como rechazado.',
//                     tipo: 'error',
//                     redirect: false,
//                 });
//                 setRechazando(false);
//                 return;
//             }

//             // 4) si el mail salió bien, recién ahí actualizamos el evento a rechazado (6)
//             const payload = {
//                 idEvento: evento.idEvento,
//                 idArtistas: evento.artistas.map((artista) => artista.idArtista),
//                 domicilio: evento.domicilio,
//                 nombre: evento.nombre,
//                 descripcion: evento.descripcion,
//                 genero: evento.genero,
//                 isAfter: evento.isAfter,
//                 isLgbt: evento.isLgbt,
//                 inicioEvento: evento.inicioEvento,
//                 finEvento: evento.finEvento,
//                 estado: 6, // Rechazado
//                 fechas: evento.fechas.map((fecha) => ({
//                     idFecha: fecha.idFecha,
//                     inicio: fecha.inicio,
//                     fin: fecha.fin,
//                     inicioVenta: fecha.inicioVenta,
//                     finVenta: fecha.finVenta,
//                     estado: 6,
//                 })),
//                 idFiesta: evento.idFiesta,
//                 soundCloud: evento.soundCloud,
//             };

//             await api.put('/Evento/UpdateEvento', payload);

//             // 5) Modal ok + redirect
//             abrirModal({
//                 titulo: 'Evento rechazado',
//                 mensaje: '🚫 El evento ha sido rechazado.',
//                 tipo: 'rechazado',
//                 redirect: true,
//             });
//         } catch (error) {
//             console.error('Error al rechazar el evento:', error);
//             abrirModal({
//                 titulo: 'Error',
//                 mensaje: '❌ Ocurrió un error al rechazar el evento.',
//                 tipo: 'error',
//                 redirect: false,
//             });
//         } finally {
//             setRechazando(false);
//         }
//     };


//     const formatFechaHora = (iso) => {
//         if (!iso) return { fecha: '—', hora: '—' };
//         const d = new Date(iso);
//         return {
//             fecha: d.toLocaleDateString('es-AR'),
//             hora: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//         };
//     };

//     if (loading || !evento || !usuario) {
//         return (
//             <div className="flex flex-col min-h-screen">
//                 <NavBar />
//                 <main className="flex-1 flex items-center justify-center">
//                     <p className="text-lg text-gray-600">Cargando evento...</p>
//                 </main>
//                 <Footer />
//             </div>
//         );
//     }

//     // Datos derivados para render
//     const nombre = evento.nombre;
//     const propietario = `${usuario.nombre} ${usuario.apellido}`;
//     const correo = usuario.correo;
//     const direccion = evento.domicilio.direccion;
//     // Nota: en tu código original localidad/municipio/provincia usaban el mismo valor
//     const localidad = evento.domicilio.provincia.nombre;
//     const municipio = evento.domicilio.provincia.nombre;
//     const provincia = evento.domicilio.provincia.nombre;
//     const genero = evento.genero.map(getNombreGenero).join(', ');
//     const artistas = evento.artistas;
//     const dias = evento.fechas.map((fecha) => ({
//         idFecha: fecha.idFecha,
//         fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
//         horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//         horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//     }));
//     const lgbt = evento.isLgbt;
//     const after = evento.isAfter;

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1 sm:px-10 mb-11">
//                 <NavBar />
//                 <h1 className="mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">Evento a validar:</h1>
//                 <h2 className="mx-10 sm:px-10 mb-4 sm:mb-8 mt-2 text-xl">
//                     <span className="font-bold">Nombre de evento: </span>
//                     {nombre}
//                 </h2>

//                 <div className="mx-10 sm:px-10 mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
//                     <div className="flex items-center gap-x-2">
//                         <AiOutlineUser className="size-5" />
//                         <p>
//                             <span className="font-bold">Propietario:</span> {propietario} ({correo})
//                         </p>
//                     </div>
//                     <div className="flex items-center gap-x-2">
//                         <FaMusic className="size-5" />
//                         <p>
//                             <span className="font-bold">Género:</span> {genero}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10">
//                     {/* Columna izquierda */}
//                     <div className="order-2 lg:order-1">
//                         <ImagenEvento imagen={media.imagen} />

//                         <ArtistasEventoValidar
//                             artistas={artistas}
//                             onUpdateArtista={actualizarArtista}
//                         />

//                         <FechasEvento dias={dias} />

//                         <UbicacionEvento
//                             idEvento={idEvento}
//                             direccion={direccion}
//                             localidad={localidad}
//                             municipio={municipio}
//                             provincia={provincia}
//                         />

//                         <EtiquetasEvento lgbt={lgbt} after={after} />
//                     </div>

//                     {/* Columna derecha */}
//                     <div className="order-3 lg:order-2">
//                         <div className="mb-6">
//                             <h2 className="text-xl font-semibold">Descripción del evento</h2>
//                             <p className="text-gray-700 mt-2">
//                                 {evento.descripcion || 'Sin descripción.'}
//                             </p>
//                         </div>

//                         <div>
//                             <h3 className="text-xl font-semibold text-purple-700 mb-2">Entradas</h3>

//                             {entradasPorFecha.map(({ fecha, entradas }) => {
//                                 const iv = formatFechaHora(fecha.inicioVenta);
//                                 const fv = formatFechaHora(fecha.finVenta);

//                                 return (
//                                     <div key={fecha.idFecha} className="mb-4">
//                                         <p className="text-sm text-gray-500 mb-1">
//                                             Fecha:{' '}
//                                             {new Date(fecha.inicio).toLocaleDateString('es-AR')}
//                                         </p>

//                                         {entradas.map((e, idx) => (
//                                             <p key={idx} className="text-gray-700">
//                                                 {getNombreTipoEntrada(e.tipo.cdTipo)}:{' '}
//                                                 <span className="font-medium">
//                                                     Precio: ${e.precio}
//                                                 </span>{' '}
//                                                 -{' '}
//                                                 <span className="font-medium">
//                                                     Cantidad: {e.cantidad}
//                                                 </span>
//                                             </p>
//                                         ))}

//                                         <div className="mt-1 text-sm text-gray-600">
//                                             <p>
//                                                 <span className="font-medium">
//                                                     Inicio de venta de entradas:
//                                                 </span>{' '}
//                                                 {iv.fecha} - {iv.hora}
//                                             </p>
//                                             <p>
//                                                 <span className="font-medium">
//                                                     Fin venta de entradas:
//                                                 </span>{' '}
//                                                 {fv.fecha} - {fv.hora}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     <div className="order-4 lg:order-3">
//                         <SoundCloudEvento url={evento.soundCloud} />
//                     </div>

//                     <div className="order-5 lg:order-4">
//                         <YoutubeEvento url={media.video} />
//                     </div>

//                     {/* Bloque de rechazo + botones */}
//                     <div className="order-6 lg:order-5">
//                         <h3 className="text-lg font-medium">
//                             En caso de rechazar el evento, completar el motivo de rechazo:
//                         </h3>
//                         <textarea
//                             className={`w-full mt-2 p-2 border rounded ${errorMotivo ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                             rows="4"
//                             placeholder="Motivo del rechazo..."
//                             value={motivoRechazo}
//                             onChange={(e) => setMotivoRechazo(e.target.value)}
//                         ></textarea>
//                         {errorMotivo && (
//                             <p className="text-sm text-red-600 mt-1">{errorMotivo}</p>
//                         )}
//                         <p className="text-sm text-gray-500 mt-2">
//                             * El motivo de rechazo se le enviará por mail al creador del
//                             evento.
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-4 mt-4">
//                             <button
//                                 onClick={validarEvento}
//                                 disabled={validando || rechazando}
//                                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//                             >
//                                 {validando ? 'Validando...' : 'Validar'}
//                             </button>

//                             <button
//                                 onClick={rechazarEvento}
//                                 disabled={rechazando || validando}
//                                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
//                             >
//                                 {rechazando ? 'Rechazando...' : 'Rechazar'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* MODAL RESULTADO */}
//             {showModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
//                     <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
//                         <h2
//                             className={`text-xl font-bold mb-2 ${modalTipo === 'aprobado'
//                                     ? 'text-green-600'
//                                     : modalTipo === 'rechazado'
//                                         ? 'text-red-600'
//                                         : 'text-red-700'
//                                 }`}
//                         >
//                             {modalTitulo}
//                         </h2>
//                         <p className="text-gray-700 mb-6 whitespace-pre-line">
//                             {modalMensaje}
//                         </p>
//                         <div className="flex justify-end">
//                             <button
//                                 className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
//                                 onClick={cerrarModal}
//                             >
//                                 Ok
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };

// export default EventoAValidar;