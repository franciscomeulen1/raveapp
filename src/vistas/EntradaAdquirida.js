// src/vistas/EntradaAdquirida.js
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { AiFillSound } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { BsGeoAltFill } from "react-icons/bs";
import DescargarEntradasPDF from '../components/DescargarEntradasPDF';
import iconCalendar from '../iconos/calendar.png';
import iconLocation from '../iconos/location.png';
import iconMusic from '../iconos/music.png';
import logo from '../iconos/logoRA.png';


/* =========================
   Utils
   ========================= */
const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

const formatDateTimeRange = (inicioISO, finISO) => {
    try {
        const inicio = new Date(inicioISO);
        const fin = new Date(finISO);
        const fecha = inicio.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const horaInicio = inicio.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        const horaFin = fin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        return `${capitalize(fecha)}, ${horaInicio} — ${horaFin}`;
    } catch {
        return '';
    }
};

// Obtiene nombre desde varias formas comunes
const placeName = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return (
        obj.nombre ||
        obj.dsNombre ||
        obj.dsLocalidad ||
        obj.dsMunicipio ||
        obj.dsProvincia ||
        obj.descripcion ||
        ''
    );
};

// Elige imagen de /Media
const pickMediaImageUrl = (mediaArr) => {
    const arr = Array.isArray(mediaArr) ? mediaArr : [];
    let img = arr.find(
        (m) => m?.url && String(m.url).trim() !== '' && (!m.mdVideo || String(m.mdVideo).trim() === '')
    );
    if (!img) img = arr.find((m) => m?.url && String(m.url).trim() !== '');
    return img?.url || null;
};

// Crea un QR genérico
const buildQRUrl = (entrada) => {
    const payload = encodeURIComponent(
        JSON.stringify({
            idEntrada: entrada.idEntrada || entrada?.id || 's/e',
            idCompra: entrada.idCompra,
            numCompra: entrada.numCompra,
            idEvento: entrada.idEvento,
            idFecha: entrada.idFecha,
        })
    );
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payload}`;
};

/* =========================
   Componente
   ========================= */
export default function EntradaAdquirida() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);

    const stateIds = location.state || {};
    const idCompra = stateIds?.idCompra || searchParams.get('idCompra') || null;
    const numCompra = stateIds?.numCompra || Number(searchParams.get('numCompra')) || null;
    const idEvento = stateIds?.idEvento || searchParams.get('idEvento') || null;
    const idFecha = stateIds?.idFecha || searchParams.get('idFecha') || null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [evento, setEvento] = useState(null);
    const [imagenUrl, setImagenUrl] = useState(null);
    const [entradasCompra, setEntradasCompra] = useState([]);

    const titulo = useMemo(() => {
        const nombre = evento?.nombre || 'Evento';
        const cant = entradasCompra.length;
        return `${cant === 1 ? 'Entrada' : 'Entradas'} a: ${nombre}`;
    }, [evento?.nombre, entradasCompra.length]);

    const fechaTexto = useMemo(() => {
        if (!evento) return '';
        const fechaMatch = evento?.fechas?.find((f) => String(f.idFecha) === String(idFecha));
        const inicio = fechaMatch?.inicio || evento?.inicioEvento;
        const fin = fechaMatch?.fin || evento?.finEvento;
        return inicio && fin ? formatDateTimeRange(inicio, fin) : 'Fecha a confirmar';
    }, [evento, idFecha]);

    // Dirección formateada con localidad/municipio/provincia
    const ubicacionFormateada = useMemo(() => {
        if (!evento?.domicilio) return '';
        const d = evento.domicilio;
        const direccion = d.direccion || '';
        const localidad = placeName(d.localidad);
        const municipio = placeName(d.municipio);
        const provincia = placeName(d.provincia);

        const partes = [];
        if (localidad && localidad !== municipio && localidad !== provincia) partes.push(localidad);
        if (municipio && municipio !== provincia && municipio !== localidad) partes.push(municipio);
        if (provincia) partes.push(provincia);

        return [direccion, partes.join(', ')].filter(Boolean).join(', ');
    }, [evento]);

    const artistasStr = useMemo(() => {
        const arts = Array.isArray(evento?.artistas) ? evento.artistas : [];
        const nombres = arts.map(a => (typeof a === 'string' ? a : a?.nombre)).filter(Boolean);
        return nombres.length ? nombres.join(' - ') : '—';
    }, [evento]);

    const descripcionEvento = useMemo(() => evento?.descripcion || '', [evento]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) {
                setError('Debes iniciar sesión para ver esta compra.');
                setLoading(false);
                return;
            }
            if (!idCompra || !numCompra || !idEvento || !idFecha) {
                setError('Faltan datos de la compra. Vuelve a Mis Entradas y selecciona la compra nuevamente.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const entRes = await api.get('/Usuario/GetEntradas', { params: { idUsuario: user.id } });
                const all = Array.isArray(entRes.data) ? entRes.data : [];
                const filtered = all.filter((e) =>
                    String(e.idCompra) === String(idCompra) &&
                    Number(e.numCompra) === Number(numCompra) &&
                    String(e.idEvento) === String(idEvento) &&
                    String(e.idFecha) === String(idFecha)
                );

                setEntradasCompra(
                    filtered.map((e) => ({
                        ...e,
                        qrUrl: buildQRUrl({
                            ...e,
                            idCompra,
                            numCompra,
                            idEvento,
                            idFecha
                        }),
                    }))
                );

                const evRes = await api.get('/Evento/GetEventos', { params: { IdEvento: idEvento } });
                const ev = evRes.data?.eventos?.[0] || null;
                setEvento(ev);

                const mediaRes = await api.get('/Media', { params: { idEntidadMedia: idEvento } });
                setImagenUrl(pickMediaImageUrl(mediaRes.data?.media));
            } catch (err) {
                console.error(err);
                setError('Ocurrió un error al cargar la compra. Intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, idCompra, numCompra, idEvento, idFecha]);

    return (
        <div className="flex flex-col min-h-screen bg-base-100">
            <NavBar />

            <div className="flex-grow px-6 sm:px-10 md:px-16 mb-14">
                <h1 className="mb-4 mt-4 text-3xl font-bold">{titulo}</h1>

                {loading && (
                    <div className="animate-pulse space-y-4">
                        <div className="h-64 bg-base-200 rounded-2xl" />
                        <div className="h-40 bg-base-200 rounded-2xl" />
                    </div>
                )}

                {!loading && error && (
                    <div className="alert alert-error max-w-3xl">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-8">
                        {/* Fila 1: Imagen + Datos */}
                        <div className="grid md:grid-cols-5 gap-6">
                            {/* Imagen más pequeña en pantallas grandes */}
                            {/* Imagen — mantiene proporción, no se estira */}
                            <div className="md:col-span-2">
                                <div className="rounded-2xl bg-base-200 p-2">
                                    {imagenUrl ? (
                                        <img
                                            src={imagenUrl}
                                            alt={evento?.nombre || 'Imagen del evento'}
                                            className="w-full h-auto max-h-72 md:max-h-80 lg:max-h-64 xl:max-h-60 object-contain rounded-xl"
                                            onError={(e) => { e.currentTarget.src = ''; }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 grid place-items-center opacity-70">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Datos */}
                            <div className="md:col-span-3 flex flex-col justify-center gap-4">
                                <div className="flex items-start gap-3">
                                    <FaCalendarAlt className="mt-1 size-5 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-70 font-semibold">Fecha y hora</div>
                                        <div className="text-base">{fechaTexto || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-start gap-3">
                                        <BsGeoAltFill className="mt-1 size-5 opacity-80" />
                                        <div>
                                            <div className="text-sm opacity-70 font-semibold">Dirección</div>
                                            <div className="text-base font-semibold">{ubicacionFormateada || '—'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <AiFillSound className="mt-1 size-6 opacity-80" />
                                    <div>
                                        <div className="text-sm opacity-70 font-semibold">Artistas</div>
                                        <div className="text-base">{artistasStr}</div>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="flex items-start gap-3">
                                    <div>
                                        <div className="text-base leading-relaxed whitespace-pre-line">
                                            {descripcionEvento || '—'}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Fila 2: QRs */}
                        <div className="rounded-2xl bg-base-200/70 p-5">
                            <h2 className="text-xl font-bold mb-4">Tus códigos QR</h2>

                            {entradasCompra.length === 0 && (
                                <div className="text-sm opacity-70">No se encontraron entradas para esta compra.</div>
                            )}

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {entradasCompra.map((ent) => (
                                    <div
                                        key={`${ent.idCompra}-${ent.numCompra}-${ent.idEntrada || ent.id}-${ent.cdEstado || 'e'}`}
                                        className="border border-base-300 rounded-2xl bg-base-100 p-4 flex flex-col items-center"
                                    >
                                        <img src={ent.qrUrl} alt="Código QR" className="w-48 h-48 rounded-xl mb-3" />
                                        <div className="text-xs opacity-70 text-center">
                                            <div><span className="font-semibold">Tipo:</span> {ent.dsTipo || ent.tipo || '—'}</div>
                                            <div><span className="font-semibold">Precio:</span> {typeof ent.precio === 'number' ? `$${ent.precio}` : (ent.precio || '—')}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <DescargarEntradasPDF
                                    entradas={entradasCompra}
                                    user={user}
                                    evento={evento}
                                    fechaTexto={fechaTexto}
                                    ubicacionFormateada={ubicacionFormateada}
                                    idCompra={idCompra}
                                    numCompra={numCompra}
                                    icons={{
                                        calendarUrl: iconCalendar,
                                        locationUrl: iconLocation,
                                        musicUrl: iconMusic,
                                    }}
                                    logoUrl={logo}
                                    watermarkText="RaveApp"
                                    watermarkOptions={{
                                        angle: 30,          // inclinación
                                        fontSize: 50,       // tamaño del texto
                                        colorRGB: [235, 235, 235], // más clarito
                                        gapX: 70,           // distancia horizontal entre repeticiones
                                        gapY: 85,           // distancia vertical
                                    }}
                                />

                                <button
                                    type="button"
                                    className="btn bg-cyan-600 rounded-full"
                                    onClick={() => {
                                        const q = encodeURIComponent(ubicacionFormateada || (evento?.nombre || 'Evento'));
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                                    }}
                                >
                                    Cómo llegar
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-ghost rounded-full"
                                    onClick={() => navigate(-1)}
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
