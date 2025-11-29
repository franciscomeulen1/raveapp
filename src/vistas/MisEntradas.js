// src/vistas/MisEntradas.js
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import DejarResenia from '../components/DejarResenia';

/* =========================
   Config & Utils
   ========================= */
const FILTERS = [
  { code: 4, label: 'Entradas a próximos eventos' }, // Paga
  { code: 5, label: 'Entradas pendientes de pago' }, // Pendiente de pago
  { code: 2, label: 'Entradas utilizadas' },         // Controlada
  { code: 6, label: 'Entradas no utilizadas' },      // No utilizada
  { code: 3, label: 'Entradas anuladas' },           // Anulada
];

const estadoBadgeClass = (cdEstado) => {
  switch (cdEstado) {
    case 4: return 'badge-success';
    case 5: return 'badge-warning';
    case 2: return 'badge-info';
    case 6: return 'badge-secondary';
    case 3: return 'badge-error';
    default: return 'badge-ghost';
  }
};

const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);

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

// Agrupa por idCompra + numCompra + cdEstado
const groupByCompraEstado = (entradas) => {
  const map = new Map();
  entradas.forEach((e) => {
    const key = `${e.idCompra}__${e.numCompra}__${e.cdEstado}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(e);
  });
  return Array.from(map.entries()).map(([key, items]) => {
    const [idCompra, numCompra, cdEstado] = key.split('__');
    const { idEvento, idFecha, dsEstado } = items[0] || {};
    return {
      idCompra,
      numCompra: Number(numCompra),
      cdEstado: Number(cdEstado),
      dsEstado,
      idEvento,
      idFecha,
      entradas: items,
    };
  });
};

/* =========================
   Caches (módulo)
   ========================= */
const cacheEvento = new Map(); // idEvento -> evento
const cacheMedia = new Map();  // idEvento -> imagenUrl | null
const cacheFiesta = new Map(); // idFiesta -> { isActivo, dsNombre }

/* =========================
   Data helpers
   ========================= */
const getEventoCached = async (idEvento) => {
  if (cacheEvento.has(idEvento)) return cacheEvento.get(idEvento);
  const evRes = await api.get('/Evento/GetEventos', { params: { IdEvento: idEvento } });
  const ev = evRes.data?.eventos?.[0] || null;
  cacheEvento.set(idEvento, ev);
  return ev;
};

// Traer imagen; si force=true ignora cache y reconsulta /Media
const fetchImagenEvento = async (idEvento, { force = false } = {}) => {
  if (!force && cacheMedia.has(idEvento)) return cacheMedia.get(idEvento);
  try {
    const mediaRes = await api.get('/Media', { params: { idEntidadMedia: idEvento } });
    const arr = Array.isArray(mediaRes.data?.media) ? mediaRes.data.media : [];
    let img = arr.find(
      (m) => m?.url && String(m.url).trim() !== '' && (!m.mdVideo || String(m.mdVideo).trim() === '')
    );
    if (!img) img = arr.find((m) => m?.url && String(m.url).trim() !== '');
    const url = img?.url || null;
    cacheMedia.set(idEvento, url);
    return url;
  } catch {
    cacheMedia.set(idEvento, null);
    return null;
  }
};

const getFiestaInfo = async (idFiesta) => {
  if (!idFiesta) return null;
  if (cacheFiesta.has(idFiesta)) return cacheFiesta.get(idFiesta);
  try {
    const res = await api.get('/Fiesta/GetFiestas', { params: { IdFiesta: idFiesta } });
    const fiesta = Array.isArray(res.data?.fiestas) ? res.data.fiestas[0] : null;
    const info = fiesta ? { isActivo: !!fiesta.isActivo, dsNombre: fiesta.dsNombre || '' } : null;
    cacheFiesta.set(idFiesta, info);
    return info;
  } catch {
    cacheFiesta.set(idFiesta, null);
    return null;
  }
};

/* =========================
   Component
   ========================= */
export default function MisEntradas() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]); // [{... , idFiesta, hasFiesta, fiestaIsActiva, fiestaNombre, cdEstado, dsEstado, imagenUrl, _imgRefreshed }]
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]); // default: Paga (4)

  // Dropdown controlado
  const [isOpen, setIsOpen] = useState(false);
  const ddRef = useRef(null);
  const triggerRef = useRef(null);

  // Modal reseña
  const [modalOpen, setModalOpen] = useState(false);
  const [fiestaParaResena, setFiestaParaResena] = useState(null); // { idFiesta, dsNombre }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cerrar al hacer click fuera o ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target)) setIsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/Usuario/GetEntradas', {
          params: { idUsuario: user.id },
        });
        const entradas = Array.isArray(res.data) ? res.data : [];
        if (entradas.length === 0) {
          setCompras([]);
          setLoading(false);
          return;
        }

        // agrupamos como antes
        const grupos = groupByCompraEstado(entradas);

        const now = Date.now(); // 👈 referencia para "más cercano al día de hoy"

        const enriched = await Promise.all(
          grupos.map(async (g) => {
            const evento = await getEventoCached(g.idEvento);
            const imagenUrl = await fetchImagenEvento(g.idEvento, { force: false });
            const nombre = evento?.nombre || 'Evento';

            // buscamos la fecha específica de esa compra
            const fechaMatch = evento?.fechas?.find((f) => f.idFecha === g.idFecha);
            const inicio = fechaMatch?.inicio || evento?.inicioEvento;
            const fin = fechaMatch?.fin || evento?.finEvento;

            const fechaTexto =
              inicio && fin
                ? formatDateTimeRange(inicio, fin)
                : 'Fecha a confirmar';

            // 👇 calculamos timestamp para ordenar
            const inicioDate = inicio ? new Date(inicio) : null;
            const inicioTs = inicioDate ? inicioDate.getTime() : null;

            // fiesta
            const idFiesta = evento?.idFiesta ?? null;
            const hasFiesta = !!(idFiesta && String(idFiesta).trim() !== '');
            let fiestaIsActiva = false;
            let fiestaNombre = '';

            if (hasFiesta) {
              const info = await getFiestaInfo(idFiesta);
              fiestaIsActiva = !!info?.isActivo;
              fiestaNombre = info?.dsNombre || '';
            }

            return {
              idCompra: g.idCompra,
              numCompra: g.numCompra,
              idEvento: g.idEvento,
              idFecha: g.idFecha,
              cdEstado: g.cdEstado,
              dsEstado: g.dsEstado,
              idFiesta,
              hasFiesta,
              fiestaIsActiva,
              fiestaNombre,
              eventoNombre: nombre,
              fechaTexto,
              imagenUrl,
              cantidadEntradas: g.entradas?.length || 0,
              _imgRefreshed: false,

              // 👇 campos nuevos para ordenar
              inicioISO: inicio || null,
              inicioTs,
            };
          })
        );

        // 👇 ORDEN NUEVO: primero la fecha más cercana a hoy
        const ordenadas = enriched.sort((a, b) => {
          const da =
            typeof a.inicioTs === 'number'
              ? Math.abs(a.inicioTs - now)
              : Number.POSITIVE_INFINITY;
          const db =
            typeof b.inicioTs === 'number'
              ? Math.abs(b.inicioTs - now)
              : Number.POSITIVE_INFINITY;

          // primero por cercanía de fecha
          if (da !== db) return da - db;

          // si están igual de cerca, mantenemos tu criterio anterior
          return b.numCompra - a.numCompra;
        });

        setCompras(ordenadas);
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al cargar tus entradas. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);


  const isLogged = useMemo(() => Boolean(user?.id), [user?.id]);

  const comprasFiltradas = useMemo(
    () => compras.filter((c) => c.cdEstado === selectedFilter.code),
    [compras, selectedFilter]
  );

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <div className="sm:px-10 flex-grow">
        <NavBar />

        <h1 className="px-10 mb-4 mt-2 text-3xl font-bold underline underline-offset-8">
          Mis entradas:
        </h1>

        {/* Dropdown “estilo título” controlado */}
        <div className="px-10 mb-6">
          <div className="dropdown" ref={ddRef}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="text-lg sm:text-xl md:text-2xl font-semibold inline-flex items-center gap-2 select-none"
            >
              {selectedFilter.label}
              <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
                <path d="M7 10l5 5 5-5H7z"></path>
              </svg>
            </button>

            <ul
              role="listbox"
              className={`dropdown-content menu p-2 shadow bg-base-200 rounded-box w-72 mt-2 ${isOpen ? '' : 'hidden'}`}
            >
              {FILTERS.map((f) => (
                <li key={f.code}>
                  <button
                    type="button"
                    className={`text-left ${f.code === selectedFilter.code ? 'active font-semibold' : ''}`}
                    onClick={() => {
                      setSelectedFilter(f);
                      setIsOpen(false);
                      requestAnimationFrame(() => {
                        if (document.activeElement && document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                        triggerRef.current?.blur();
                      });
                    }}
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-10 pb-16">
          {!isLogged && (
            <div className="alert alert-info max-w-3xl">
              <span>Debes iniciar sesión para ver tus entradas.</span>
            </div>
          )}

          {isLogged && loading && (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando entradas...</p>
              </div>
            </div>
          )}


          {isLogged && !loading && error && (
            <div className="alert alert-error max-w-3xl">
              <span>{error}</span>
            </div>
          )}

          {isLogged && !loading && !error && comprasFiltradas.length === 0 && (
            <div className="text-sm opacity-70">
              No hay entradas para “{selectedFilter.label}”.
            </div>
          )}

          {isLogged && !loading && !error && comprasFiltradas.length > 0 && (
            <div className="space-y-6">
              {comprasFiltradas.map((c) => {
                // solo utilizadas + fiesta recurrente + fiesta activa
                const showReviewCTA = selectedFilter.code === 2 && c.hasFiesta && c.fiestaIsActiva;
                return (
                  <div
                    key={`${c.idCompra}-${c.numCompra}-${c.cdEstado}`}
                    onClick={() =>
                      navigate('/entrada-adquirida', {
                        state: {
                          idCompra: c.idCompra,
                          numCompra: c.numCompra,
                          idEvento: c.idEvento,
                          idFecha: c.idFecha,
                        },
                      })
                    }
                    className="border border-base-300 rounded-2xl bg-base-200/70 hover:bg-base-200 cursor-pointer transition-transform hover:scale-[1.01] shadow-sm hover:shadow-md"
                  >
                    {/* ====== XS (mobile): stack total ====== */}
                    <div className="block md:hidden p-5">
                      {/* Imagen */}
                      <div className="w-full rounded-2xl overflow-hidden bg-base-300 relative aspect-[3/2] mx-auto sm:aspect-[16/9] sm:max-w-[560px]">
                        {c.imagenUrl ? (
                          <img
                            src={c.imagenUrl}
                            alt={c.eventoNombre}
                            className="w-full h-full object-cover"
                            onError={async (e) => {
                              if (c._imgRefreshed) { e.currentTarget.src = ''; return; }
                              const freshUrl = await fetchImagenEvento(c.idEvento, { force: true });
                              setCompras((prev) =>
                                prev.map((item) =>
                                  item.idCompra === c.idCompra &&
                                    item.numCompra === c.numCompra &&
                                    item.cdEstado === c.cdEstado
                                    ? { ...item, imagenUrl: freshUrl || '', _imgRefreshed: true }
                                    : item
                                )
                              );
                            }}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-sm opacity-70">
                            Sin imagen
                          </div>
                        )}
                        <div className={`absolute top-2 left-2 badge ${estadoBadgeClass(c.cdEstado)} badge-md shadow`}>
                          {c.dsEstado || '—'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-4">
                        <p className="text-lg font-semibold">
                          {c.cantidadEntradas === 1 ? 'Entrada' : 'Entradas'} para el evento{' '}
                          <span className="text-purple-700">{c.eventoNombre}</span>
                        </p>
                        <p className="text-sm mt-1 opacity-80">{c.fechaTexto}</p>
                        <div className="mt-3 text-sm opacity-70 font-semibold">
                          {c.cantidadEntradas} {c.cantidadEntradas === 1 ? 'entrada' : 'entradas'}
                        </div>
                      </div>

                      {/* CTA reseña */}
                      {showReviewCTA && (
                        <div className="mt-5">
                          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4">
                            <p className="text-sm mb-3">
                              Como has asistido a un evento de una fiesta recurrente, si lo deseas, puedes dejar tu reseña.
                            </p>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFiestaParaResena({ idFiesta: c.idFiesta, dsNombre: c.fiestaNombre });
                                setModalOpen(true);
                              }}
                            >
                              Dejar reseña
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ====== MD (tablet): 2 columnas (izq: imagen+info; der: CTA) ====== */}
                    <div className="hidden md:grid lg:hidden grid-cols-2 gap-5 p-5 items-start">
                      {/* Col izquierda: imagen + info en columna */}
                      <div>
                        <div className="w-full h-44 rounded-2xl overflow-hidden bg-base-300 relative">
                          {c.imagenUrl ? (
                            <img
                              src={c.imagenUrl}
                              alt={c.eventoNombre}
                              className="w-full h-full object-cover"
                              onError={async (e) => {
                                if (c._imgRefreshed) { e.currentTarget.src = ''; return; }
                                const freshUrl = await fetchImagenEvento(c.idEvento, { force: true });
                                setCompras((prev) =>
                                  prev.map((item) =>
                                    item.idCompra === c.idCompra &&
                                      item.numCompra === c.numCompra &&
                                      item.cdEstado === c.cdEstado
                                      ? { ...item, imagenUrl: freshUrl || '', _imgRefreshed: true }
                                      : item
                                  )
                                );
                              }}
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-sm opacity-70">
                              Sin imagen
                            </div>
                          )}
                          <div className={`absolute top-2 left-2 badge ${estadoBadgeClass(c.cdEstado)} badge-md shadow`}>
                            {c.dsEstado || '—'}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-lg font-semibold">
                            {c.cantidadEntradas === 1 ? 'Entrada' : 'Entradas'} para el evento{' '}
                            <span className="text-purple-700">{c.eventoNombre}</span>
                          </p>
                          <p className="text-sm mt-1 opacity-80">{c.fechaTexto}</p>
                          <div className="mt-3 text-sm opacity-70 font-semibold">
                            {c.cantidadEntradas} {c.cantidadEntradas === 1 ? 'entrada' : 'entradas'}
                          </div>
                        </div>
                      </div>

                      {/* Col derecha: CTA */}
                      {showReviewCTA ? (
                        <div className="md:border-l md:border-base-300 md:pl-5">
                          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4">
                            <p className="text-sm mb-3">
                              Como has asistido a un evento de una fiesta recurrente, si lo deseas, puedes dejar tu reseña.
                            </p>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFiestaParaResena({ idFiesta: c.idFiesta, dsNombre: c.fiestaNombre });
                                setModalOpen(true);
                              }}
                            >
                              Dejar reseña
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div /> /* mantiene el grid alineado si no hay CTA */
                      )}
                    </div>

                    {/* ====== LG+ (desktop): 3 columnas (imagen | info | CTA) ====== */}
                    <div className="hidden lg:grid grid-cols-[16rem,1fr,22rem] gap-5 p-5 items-center">
                      {/* Imagen */}
                      <div className="w-full h-44 rounded-2xl overflow-hidden bg-base-300 relative">
                        {c.imagenUrl ? (
                          <img
                            src={c.imagenUrl}
                            alt={c.eventoNombre}
                            className="w-full h-full object-cover"
                            onError={async (e) => {
                              if (c._imgRefreshed) { e.currentTarget.src = ''; return; }
                              const freshUrl = await fetchImagenEvento(c.idEvento, { force: true });
                              setCompras((prev) =>
                                prev.map((item) =>
                                  item.idCompra === c.idCompra &&
                                    item.numCompra === c.numCompra &&
                                    item.cdEstado === c.cdEstado
                                    ? { ...item, imagenUrl: freshUrl || '', _imgRefreshed: true }
                                    : item
                                )
                              );
                            }}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-sm opacity-70">
                            Sin imagen
                          </div>
                        )}
                        <div className={`absolute top-2 left-2 badge ${estadoBadgeClass(c.cdEstado)} badge-md shadow`}>
                          {c.dsEstado || '—'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-left">
                        <p className="text-lg font-semibold">
                          {c.cantidadEntradas === 1 ? 'Entrada' : 'Entradas'} para el evento{' '}
                          <span className="text-purple-700">{c.eventoNombre}</span>
                        </p>
                        <p className="text-sm mt-1 opacity-80">{c.fechaTexto}</p>
                        <div className="mt-3 text-sm opacity-70 font-semibold">
                          {c.cantidadEntradas} {c.cantidadEntradas === 1 ? 'entrada' : 'entradas'}
                        </div>
                      </div>

                      {/* CTA */}
                      {showReviewCTA ? (
                        <div className="md:border-l md:border-base-300 md:pl-5">
                          <div className="bg-base-100/70 border border-base-300 rounded-xl p-4">
                            <p className="text-sm mb-3">
                              Como has asistido a un evento de una fiesta recurrente, si lo deseas, puedes dejar tu reseña.
                            </p>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFiestaParaResena({ idFiesta: c.idFiesta, dsNombre: c.fiestaNombre });
                                setModalOpen(true);
                              }}
                            >
                              Dejar reseña
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Modal de reseña */}
      <DejarResenia
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        idFiesta={fiestaParaResena?.idFiesta}
        fiestaNombrePreset={fiestaParaResena?.dsNombre}
        idUsuario={user?.id}
      />
    </div>
  );
}