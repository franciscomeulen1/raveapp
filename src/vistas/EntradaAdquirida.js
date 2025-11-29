// src/vistas/EntradaAdquirida.js
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { AiFillSound } from 'react-icons/ai';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsGeoAltFill } from 'react-icons/bs';
import DescargarEntradasPDF from '../components/DescargarEntradasPDF';
import iconCalendar from '../iconos/calendar.png';
import iconLocation from '../iconos/location.png';
import iconMusic from '../iconos/music.png';
import logo from '../iconos/logoRA.png';

// 👇 NUEVO: import del modal
import BotonDeArrepentimiento from '../components/BotonDeArrepentimiento';

/* =========================
   Utils
   ========================= */

// Capitaliza solo primera letra
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// "Jueves, 11 de diciembre..., 23:59 — 07:00"
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

    const horaInicio = inicio.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const horaFin = fin.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${capitalize(fecha)}, ${horaInicio} — ${horaFin}`;
  } catch {
    return '';
  }
};

// Devuelve string de localidad/municipio/provincia desde estructuras variadas
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

// Busca una imagen válida dentro del array de /Media
const pickMediaImageUrl = (mediaArr) => {
  const arr = Array.isArray(mediaArr) ? mediaArr : [];
  let img = arr.find(
    (m) =>
      m?.url &&
      m.url.trim() !== '' &&
      (!m.mdVideo || m.mdVideo.trim() === '')
  );
  if (!img) img = arr.find((m) => m?.url && m.url.trim() !== '');
  return img?.url || null;
};

// Trae una imagen remota y la convierte en dataURL base64, devolviendo { dataUrl, format }
async function fetchImageAsDataURL(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const blob = await res.blob();

    const mime = blob.type || '';
    let format = 'PNG';
    if (mime.toLowerCase().includes('jpeg') || mime.toLowerCase().includes('jpg')) {
      format = 'JPEG';
    } else if (mime.toLowerCase().includes('png')) {
      format = 'PNG';
    } else if (mime.toLowerCase().includes('webp')) {
      // algunas builds de jsPDF no soportan webp,
      // lo forzamos como JPEG para mayor compatibilidad
      format = 'JPEG';
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // "data:image/...;base64,AAAA"
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return { dataUrl, format };
  } catch (e) {
    console.error('No se pudo convertir QR a base64:', e);
    return { dataUrl: null, format: null };
  }
}

export default function EntradaAdquirida() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  // IDs pueden llegar por state o por query params
  const stateIds = location.state || {};
  const idCompra = stateIds?.idCompra || searchParams.get('idCompra') || null;
  const numCompra =
    stateIds?.numCompra || Number(searchParams.get('numCompra')) || null;
  const idEvento =
    stateIds?.idEvento || searchParams.get('idEvento') || null;
  const idFecha = stateIds?.idFecha || searchParams.get('idFecha') || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [evento, setEvento] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [entradasCompra, setEntradasCompra] = useState([]);

  // 👇 NUEVO: para abrir/cerrar el modal
  const [showArrepentimiento, setShowArrepentimiento] = useState(false);

  // 👇 NUEVO: fecha de compra (solo fecha visible)
  const fechaCompra = useMemo(() => {
    if (!entradasCompra.length) return '';
    const dt = entradasCompra[0]?.dtInsert;
    if (!dt) return '';
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [entradasCompra]);

  // 👇 NUEVO: ISO sin formatear (la que viene en la entrada) para mandarla al mail
  const fechaCompraISO = useMemo(() => {
    if (!entradasCompra.length) return null;
    return entradasCompra[0]?.dtInsert || null;
  }, [entradasCompra]);

  // 👇 banderas por estado
  const allAnuladas = useMemo(() => {
    if (!entradasCompra.length) return false;
    return entradasCompra.every((e) => Number(e.cdEstado) === 3);
  }, [entradasCompra]);

  const allControladas = useMemo(() => {
    if (!entradasCompra.length) return false;
    return entradasCompra.every((e) => Number(e.cdEstado) === 2);
  }, [entradasCompra]);

  const allPendientePago = useMemo(() => {
    if (!entradasCompra.length) return false;
    return entradasCompra.every((e) => Number(e.cdEstado) === 5);
  }, [entradasCompra]);

  const allNoUtilizadas = useMemo(() => {
    if (!entradasCompra.length) return false;
    return entradasCompra.every((e) => Number(e.cdEstado) === 6);
  }, [entradasCompra]);

  // 👇 NUEVO: todas las entradas PAGA (cdEstado === 4)
  const allPagas = useMemo(() => {
    if (!entradasCompra.length) return false;
    return entradasCompra.every((e) => Number(e.cdEstado) === 4);
  }, [entradasCompra]);

  // 👇 si está en cualquiera de estos estados, no se puede descargar PDF
  const disableDownload =
    allAnuladas || allControladas || allPendientePago || allNoUtilizadas;

  // "Entrada a: NombreEvento" / "Entradas a: NombreEvento"
  const titulo = useMemo(() => {
    const nombreEvento = evento?.nombre || 'Evento';
    const cant = entradasCompra.length;
    return `${cant === 1 ? 'Entrada' : 'Entradas'} a: ${nombreEvento}`;
  }, [evento?.nombre, entradasCompra.length]);

  // Texto de fecha y hora
  const fechaTexto = useMemo(() => {
    if (!evento) return '';
    const fechaMatch = evento?.fechas?.find(
      (f) => String(f.idFecha) === String(idFecha)
    );
    const inicio = fechaMatch?.inicio || evento?.inicioEvento;
    const fin = fechaMatch?.fin || evento?.finEvento;
    return inicio && fin
      ? formatDateTimeRange(inicio, fin)
      : 'Fecha a confirmar';
  }, [evento, idFecha]);

  // Dirección legible
  const ubicacionFormateada = useMemo(() => {
    if (!evento?.domicilio) return '';
    const d = evento.domicilio;
    const direccion = d.direccion || '';
    const localidad = placeName(d.localidad);
    const municipio = placeName(d.municipio);
    const provincia = placeName(d.provincia);

    const partes = [];
    if (localidad && localidad !== municipio && localidad !== provincia)
      partes.push(localidad);
    if (municipio && municipio !== provincia && municipio !== localidad)
      partes.push(municipio);
    if (provincia) partes.push(provincia);

    return [direccion, partes.join(', ')].filter(Boolean).join(', ');
  }, [evento]);

  // Lista de artistas "A - B - C"
  const artistasStr = useMemo(() => {
    const arts = Array.isArray(evento?.artistas) ? evento.artistas : [];
    const nombres = arts
      .map((a) => (typeof a === 'string' ? a : a?.nombre))
      .filter(Boolean);
    return nombres.length ? nombres.join(' - ') : '—';
  }, [evento]);

  const descripcionEvento = useMemo(
    () => evento?.descripcion || '',
    [evento]
  );

  // scroll arriba al montar
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
        setError(
          'Faltan datos de la compra. Vuelve a Mis Entradas y selecciona la compra nuevamente.'
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // 1. Todas las entradas del usuario
        const entRes = await api.get('/Usuario/GetEntradas', {
          params: { idUsuario: user.id },
        });
        const allEntradas = Array.isArray(entRes.data)
          ? entRes.data
          : [];

        // 2. Filtrar solo esta compra/evento/fecha
        const entradasDeEstaCompra = allEntradas.filter(
          (e) =>
            String(e.idCompra) === String(idCompra) &&
            Number(e.numCompra) === Number(numCompra) &&
            String(e.idEvento) === String(idEvento) &&
            String(e.idFecha) === String(idFecha)
        );

        // 3. Para cada entrada filtrada, busco su QR en /Media
        const entradasConQr = await Promise.all(
          entradasDeEstaCompra.map(async (entradaOriginal) => {
            const esAnulada = Number(entradaOriginal.cdEstado) === 3;
            if (esAnulada) {
              return {
                ...entradaOriginal,
                qrUrl: null,
                qrDataUrl: null,
                qrFormat: 'PNG',
              };
            }

            try {
              const idEntradaReal =
                entradaOriginal.idEntrada ||
                entradaOriginal.id;

              const qrResp = await api.get('/Media', {
                params: { idEntidadMedia: idEntradaReal },
              });

              const qrMediaArr = qrResp.data?.media || [];
              const qrObj = qrMediaArr.find(
                (m) =>
                  m?.url &&
                  m.url.trim() !== ''
              );

              const qrUrlReal = qrObj ? qrObj.url : null;

              let qrDataUrl = null;
              let qrFormat = 'PNG';

              if (qrUrlReal) {
                const { dataUrl, format } =
                  await fetchImageAsDataURL(qrUrlReal);
                qrDataUrl = dataUrl;
                qrFormat = format || 'PNG';
              }

              return {
                ...entradaOriginal,
                qrUrl: qrUrlReal || null,
                qrDataUrl: qrDataUrl || null,
                qrFormat,
              };
            } catch (errQr) {
              console.error(
                'Error cargando QR de entrada',
                entradaOriginal.idEntrada,
                errQr
              );
              return {
                ...entradaOriginal,
                qrUrl: null,
                qrDataUrl: null,
                qrFormat: 'PNG',
              };
            }
          })
        );

        setEntradasCompra(entradasConQr);

        // 4. Info del evento
        const evRes = await api.get('/Evento/GetEventos', {
          params: { IdEvento: idEvento },
        });
        const ev = evRes.data?.eventos?.[0] || null;
        setEvento(ev);

        // 5. Imagen del evento
        const mediaRes = await api.get('/Media', {
          params: { idEntidadMedia: idEvento },
        });
        setImagenUrl(pickMediaImageUrl(mediaRes.data?.media));
      } catch (err) {
        console.error(err);
        setError(
          'Ocurrió un error al cargar la compra. Intenta más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id, idCompra, numCompra, idEvento, idFecha]);

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
    <div className="px-4 sm:px-10 mb-14 flex-1">
      <NavBar />

        <h1 className="mb-4 mt-4 text-xl sm:text-2xl font-bold">
          {titulo}
        </h1>

        {/* 👇 Mensajes de estado */}
        {!loading && !error && allAnuladas && (
          <p className="mb-4 font-bold text-red-600 text-lg">
            {entradasCompra.length === 1
              ? 'ENTRADA ANULADA'
              : 'ENTRADAS ANULADS'}
          </p>
        )}

        {!loading && !error && !allAnuladas && allControladas && (
          <p className="mb-4 font-bold text-green-600 text-lg">
            {entradasCompra.length === 1
              ? 'ENTRADA UTILIZADA'
              : 'ENTRADAS UTILIZADAS'}
          </p>
        )}

        {!loading && !error && !allAnuladas && !allControladas && allPendientePago && (
          <p className="mb-4 font-bold text-pink-600 text-lg">
            {entradasCompra.length === 1
              ? 'ENTRADA PENDIENTE DE PAGO'
              : 'ENTRADAS PENDIENTES DE PAGO'}
          </p>
        )}

        {!loading && !error && !allAnuladas && !allControladas && !allPendientePago && allNoUtilizadas && (
          <p className="mb-4 font-bold text-purple-600 text-lg">
            {entradasCompra.length === 1
              ? 'ENTRADA NO UTILIZADA'
              : 'ENTRADAS NO UTILIZADAS'}
          </p>
        )}

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
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl">
              {/* Imagen evento */}
              <div className="md:col-span-2">
                <div className="rounded-2xl p-2">
                  {imagenUrl ? (
                    <div
                         className="
                           w-full
                           max-w-md        /* ← igual que tu versión original */
                           aspect-[1.4]    /* relación un poco más cuadrada que 1.4, para flyers medianos */
                           bg-gray-100
                           rounded-xl
                           overflow-hidden
                           flex items-center justify-center
                         "
                       >
                    <img
                      src={imagenUrl}
                      alt={evento?.nombre || 'Imagen del evento'}
                      className="
                                 block
                                 w-full h-full
                                 object-cover object-center
                                 rounded-xl
                               "
                      width={448}
                      height={320} 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '';
                      }}
                    />
                    </div>
                  ) : (
                    <div className="w-full h-48 grid place-items-center opacity-70">
                      Sin imagen
                    </div>
                  )}
                </div>
              </div>

              {/* Datos */}
              <div className="md:col-span-2 flex flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="mt-1 size-5 opacity-80" />
                  <div>
                    <div className="text-sm opacity-70 font-semibold">
                      Fecha y hora
                    </div>
                    <div className="text-base">
                      {fechaTexto || '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BsGeoAltFill className="mt-1 size-5 opacity-80" />
                  <div>
                    <div className="text-sm opacity-70 font-semibold">
                      Dirección
                    </div>
                    <div className="text-base font-semibold">
                      {ubicacionFormateada || '—'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AiFillSound className="mt-1 size-6 opacity-80" />
                  <div>
                    <div className="text-sm opacity-70 font-semibold">
                      Artistas
                    </div>
                    <div className="text-base">
                      {artistasStr}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-base leading-relaxed whitespace-pre-line">
                    {descripcionEvento || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 2: QRs */}
            <div className="rounded-2xl bg-base-200/70 p-5">
              {/* fecha de compra */}
              {fechaCompra && (
                <p className="text-sm mb-3 text-base-content/70">
                  <span className="font-semibold">Fecha de compra:</span> {fechaCompra}
                </p>
              )}

              <h2 className="text-xl font-bold mb-4">
                Tus códigos QR
              </h2>

              {entradasCompra.length === 0 && (
                <div className="text-sm opacity-70">
                  No se encontraron entradas para esta compra.
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {entradasCompra.map((ent) => {
                  const qrDisponible =
                    ent.qrUrl &&
                    ent.qrUrl.trim() !== '';
                  const esAnulada = Number(ent.cdEstado) === 3;

                  return (
                    <div
                      key={`${ent.idCompra}-${ent.numCompra}-${ent.idEntrada || ent.id}-${ent.cdEstado || 'e'}`}
                      className="border border-base-300 rounded-2xl bg-base-100 p-4 flex flex-col items-center"
                    >
                      {esAnulada ? (
                        <div className="w-48 h-48 rounded-xl mb-3 bg-base-200 grid place-items-center text-xs text-center opacity-70 p-2">
                          QR no disponible<br />Entrada anulada
                        </div>
                      ) : qrDisponible ? (
                        <img
                          src={ent.qrUrl}
                          alt="Código QR"
                          className="w-48 h-48 rounded-xl mb-3 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-48 h-48 rounded-xl mb-3 bg-base-200 grid place-items-center text-xs text-center opacity-70 p-2">
                          QR no disponible
                        </div>
                      )}

                      <div className="text-xs opacity-70 text-center">
                        <div>
                          <span className="font-semibold">
                            Tipo:
                          </span>{' '}
                          {ent.dsTipo ||
                            ent.tipo ||
                            '—'}
                        </div>
                        <div>
                          <span className="font-semibold">
                            Precio:
                          </span>{' '}
                          {typeof ent.precio === 'number'
                            ? `$${ent.precio}`
                            : ent.precio || '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
                {/* 🟣 izquierda: los 3 botones que ya tenías */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* 👇 Descargar (o deshabilitado) */}
                  {disableDownload ? (
                    <button
                      type="button"
                      className="btn btn-disabled rounded-full cursor-not-allowed"
                      disabled
                    >
                      Descargar entrada
                    </button>
                  ) : (
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
                        angle: 30,
                        fontSize: 50,
                        colorRGB: [235, 235, 235],
                        gapX: 70,
                        gapY: 85,
                      }}
                    />
                  )}

                  <button
                    type="button"
                    className="btn bg-cyan-600 rounded-full"
                    onClick={() => {
                      const q = encodeURIComponent(
                        ubicacionFormateada || evento?.nombre || 'Evento'
                      );
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${q}&hl=es&gl=AR`,
                        '_blank'
                      );
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

                {/* 🟣 derecha: botón de arrepentimiento, con el comportamiento responsive que pediste */}
                {allPagas && (
                  <div className="flex w-full sm:justify-end xl:justify-end xl:ml-auto">
                    <button
                      type="button"
                      onClick={() => setShowArrepentimiento(true)}
                      className="btn btn-outline w-full sm:w-auto"
                    >
                      Botón de arrepentimiento
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Modal de botón de arrepentimiento */}
      <BotonDeArrepentimiento
        open={showArrepentimiento}
        onClose={() => setShowArrepentimiento(false)}
        idCompra={idCompra}
        idUsuario={user?.id}
        evento={evento}
        fechaCompraISO={fechaCompraISO}
        idFecha={idFecha}
      />

      <Footer />
    </div>
  );
}