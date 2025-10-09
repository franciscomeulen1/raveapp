// src/vistas/MisEntradas.js
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

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
const cacheMedia  = new Map(); // idEvento -> imagenUrl | null

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

/* =========================
   Component
   ========================= */
export default function MisEntradas() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]); // [{... , cdEstado, dsEstado, imagenUrl, _imgRefreshed }]
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]); // default: Paga (4)

  // Dropdown controlado
  const [isOpen, setIsOpen] = useState(false);
  const ddRef = useRef(null);
  const triggerRef = useRef(null);

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
        const grupos = groupByCompraEstado(entradas);

        const enriched = await Promise.all(
          grupos.map(async (g) => {
            const evento = await getEventoCached(g.idEvento);
            const imagenUrl = await fetchImagenEvento(g.idEvento, { force: false });
            const nombre = evento?.nombre || 'Evento';
            const fechaMatch = evento?.fechas?.find((f) => f.idFecha === g.idFecha);
            const inicio = fechaMatch?.inicio || evento?.inicioEvento;
            const fin = fechaMatch?.fin || evento?.finEvento;
            const fechaTexto = inicio && fin ? formatDateTimeRange(inicio, fin) : 'Fecha a confirmar';

            return {
              idCompra: g.idCompra,
              numCompra: g.numCompra,
              idEvento: g.idEvento,
              idFecha: g.idFecha,
              cdEstado: g.cdEstado,
              dsEstado: g.dsEstado,
              eventoNombre: nombre,
              fechaTexto,
              imagenUrl,
              cantidadEntradas: g.entradas?.length || 0,
              _imgRefreshed: false,
            };
          })
        );

        const ordenadas = enriched.sort((a, b) => b.numCompra - a.numCompra);
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
                      setIsOpen(false);                // cerrar
                      // quitar foco para evitar que DaisyUI lo muestre por :focus-within
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
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-base-200 rounded-2xl" />
              ))}
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
              {comprasFiltradas.map((c) => (
                <div
                  key={`${c.idCompra}-${c.numCompra}-${c.cdEstado}`}
                  onClick={() => navigate('/entrada-adquirida')}
                  className="flex flex-col md:flex-row items-center border border-base-300 rounded-2xl bg-base-200/70 hover:bg-base-200 cursor-pointer transition-transform hover:scale-[1.01] shadow-sm hover:shadow-md"
                >
                  {/* Imagen izquierda */}
                  <div className="w-full md:w-64 h-48 md:h-44 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden bg-base-300 relative">
                    {c.imagenUrl ? (
                      <img
                        src={c.imagenUrl}
                        alt={c.eventoNombre}
                        className="w-full h-full object-cover"
                        onError={async (e) => {
                          if (c._imgRefreshed) {
                            e.currentTarget.src = '';
                            return;
                          }
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

                    {/* Badge de estado */}
                    <div className={`absolute top-2 left-2 badge ${estadoBadgeClass(c.cdEstado)} badge-md shadow`}>
                      {c.dsEstado || '—'}
                    </div>
                  </div>

                  {/* Texto derecha */}
                  <div className="flex-1 p-5 text-center md:text-left">
                    <p className="text-lg font-semibold">
                      {c.cantidadEntradas === 1 ? 'Entrada' : 'Entradas'} para el evento <span className="text-purple-700">{c.eventoNombre}</span>
                    </p>
                    <p className="text-sm mt-1 opacity-80">{c.fechaTexto}</p>

                    <div className="mt-3 text-sm opacity-70 font-semibold">
                      {c.cantidadEntradas} {c.cantidadEntradas === 1 ? 'entrada' : 'entradas'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}




// // src/vistas/MisEntradas.js
// import React, { useEffect, useMemo, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

// /* =========================
//    Utils
//    ========================= */
// const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);

// const formatDateTimeRange = (inicioISO, finISO) => {
//   try {
//     const inicio = new Date(inicioISO);
//     const fin = new Date(finISO);
//     const fecha = inicio.toLocaleDateString('es-AR', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     const horaInicio = inicio.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
//     const horaFin = fin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
//     return `${capitalize(fecha)}, ${horaInicio} — ${horaFin}`;
//   } catch {
//     return '';
//   }
// };

// const groupByCompra = (entradas) => {
//   const map = new Map();
//   entradas.forEach((e) => {
//     const key = `${e.idCompra}__${e.numCompra}`;
//     if (!map.has(key)) map.set(key, []);
//     map.get(key).push(e);
//   });
//   return Array.from(map.entries()).map(([key, items]) => {
//     const [idCompra, numCompra] = key.split('__');
//     const { idEvento, idFecha } = items[0] || {};
//     return { idCompra, numCompra: Number(numCompra), idEvento, idFecha, entradas: items };
//   });
// };

// /* =========================
//    Caches (módulo)
//    ========================= */
// const cacheEvento = new Map(); // idEvento -> evento
// const cacheMedia = new Map();  // idEvento -> imagenUrl | null

// /* =========================
//    Data helpers
//    ========================= */
// const getEventoCached = async (idEvento) => {
//   if (cacheEvento.has(idEvento)) return cacheEvento.get(idEvento);
//   const evRes = await api.get('/Evento/GetEventos', { params: { IdEvento: idEvento } });
//   const ev = evRes.data?.eventos?.[0] || null;
//   cacheEvento.set(idEvento, ev);
//   return ev;
// };

// // Traer imagen; si force=true ignora cache y reconsulta /Media
// const fetchImagenEvento = async (idEvento, { force = false } = {}) => {
//   if (!force && cacheMedia.has(idEvento)) return cacheMedia.get(idEvento);
//   try {
//     const mediaRes = await api.get('/Media', { params: { idEntidadMedia: idEvento } });
//     const arr = Array.isArray(mediaRes.data?.media) ? mediaRes.data.media : [];
//     // Preferir item con url no vacío y mdVideo vacío/null
//     let img = arr.find(
//       (m) => m?.url && String(m.url).trim() !== '' && (!m.mdVideo || String(m.mdVideo).trim() === '')
//     );
//     if (!img) img = arr.find((m) => m?.url && String(m.url).trim() !== '');
//     const url = img?.url || null;
//     cacheMedia.set(idEvento, url);
//     return url;
//   } catch {
//     cacheMedia.set(idEvento, null);
//     return null;
//   }
// };

// /* =========================
//    Component
//    ========================= */
// export default function MisEntradas() {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [compras, setCompras] = useState([]); // [{ idCompra, numCompra, idEvento, idFecha, eventoNombre, fechaTexto, imagenUrl, cantidadEntradas, _imgRefreshed }]
//   const [error, setError] = useState('');

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       setError('');
//       try {
//         // 1) Entradas del usuario
//         const res = await api.get('/Usuario/GetEntradas', {
//           params: { idUsuario: user.id },
//         });
//         const entradas = Array.isArray(res.data) ? res.data : [];
//         if (entradas.length === 0) {
//           setCompras([]);
//           setLoading(false);
//           return;
//         }

//         // 2) Agrupar por compra
//         const grupos = groupByCompra(entradas);

//         // 3) Enriquecer
//         const enriched = await Promise.all(
//           grupos.map(async (g) => {
//             const evento = await getEventoCached(g.idEvento);
//             const imagenUrl = await fetchImagenEvento(g.idEvento, { force: false });
//             const nombre = evento?.nombre || 'Evento';
//             const fechaMatch = evento?.fechas?.find((f) => f.idFecha === g.idFecha);
//             const inicio = fechaMatch?.inicio || evento?.inicioEvento;
//             const fin = fechaMatch?.fin || evento?.finEvento;
//             const fechaTexto = inicio && fin ? formatDateTimeRange(inicio, fin) : 'Fecha a confirmar';

//             return {
//               idCompra: g.idCompra,
//               numCompra: g.numCompra,
//               idEvento: g.idEvento,
//               idFecha: g.idFecha,
//               eventoNombre: nombre,
//               fechaTexto,
//               imagenUrl,
//               cantidadEntradas: g.entradas?.length || 0,
//               _imgRefreshed: false, // flag de reintento (por card)
//             };
//           })
//         );

//         const ordenadas = enriched.sort((a, b) => b.numCompra - a.numCompra);
//         setCompras(ordenadas);
//       } catch (err) {
//         console.error(err);
//         setError('Ocurrió un error al cargar tus entradas. Intenta más tarde.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user?.id]);

//   const isLogged = useMemo(() => Boolean(user?.id), [user?.id]);

//   return (
//     <div className="flex flex-col min-h-screen bg-base-100">
//       <div className="sm:px-10 flex-grow">
//         <NavBar />
//         <h1 className="px-10 mb-6 mt-2 text-3xl font-bold underline underline-offset-8">
//           Mis entradas:
//         </h1>

//         <div className="px-10 pb-16">
//           {!isLogged && (
//             <div className="alert alert-info max-w-3xl">
//               <span>Debes iniciar sesión para ver tus entradas.</span>
//             </div>
//           )}

//           {isLogged && loading && (
//             <div className="animate-pulse space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="h-28 bg-base-200 rounded-2xl" />
//               ))}
//             </div>
//           )}

//           {isLogged && !loading && error && (
//             <div className="alert alert-error max-w-3xl">
//               <span>{error}</span>
//             </div>
//           )}

//           {isLogged && !loading && !error && compras.length === 0 && (
//             <div className="text-sm opacity-70">Aún no tienes entradas compradas.</div>
//           )}

//           {isLogged && !loading && !error && compras.length > 0 && (
//             <div className="space-y-6">
//               {compras.map((c) => (
//                 <div
//                   key={`${c.idCompra}-${c.numCompra}`}
//                   onClick={() => navigate('/entrada-adquirida')}
//                   className="flex flex-col md:flex-row items-center border border-base-300 rounded-2xl bg-base-200/70 hover:bg-base-200 cursor-pointer transition-transform hover:scale-[1.01] shadow-sm hover:shadow-md"
//                 >
//                   {/* Imagen izquierda */}
//                   <div className="w-full md:w-64 h-48 md:h-44 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden bg-base-300">
//                     {c.imagenUrl ? (
//                       <img
//                         src={c.imagenUrl}
//                         alt={c.eventoNombre}
//                         className="w-full h-full object-cover"
//                         onError={async (e) => {
//                           // Evitar loop: si ya reintentamos, mostrar placeholder
//                           if (c._imgRefreshed) {
//                             e.currentTarget.src = '';
//                             return;
//                           }
//                           // Reintento: forzar /Media sin cache
//                           const freshUrl = await fetchImagenEvento(c.idEvento, { force: true });
//                           setCompras((prev) =>
//                             prev.map((item) =>
//                               item.idCompra === c.idCompra && item.numCompra === c.numCompra
//                                 ? { ...item, imagenUrl: freshUrl || '', _imgRefreshed: true }
//                                 : item
//                             )
//                           );
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full grid place-items-center text-sm opacity-70">
//                         Sin imagen
//                       </div>
//                     )}
//                   </div>

//                   {/* Texto derecha */}
//                   <div className="flex-1 p-5 text-center md:text-left">
//                     <p className="text-lg font-semibold">
//                       Entrada/s para el evento <span className="text-primary">{c.eventoNombre}</span>
//                     </p>
//                     <p className="text-sm mt-1 opacity-80">{c.fechaTexto}</p>

//                     {/* ↓↓↓ QUITAMOS el “Compra #X”. Dejamos solo la cantidad de entradas. */}
//                     <div className="mt-3 text-xs opacity-70">
//                       {c.cantidadEntradas} {c.cantidadEntradas === 1 ? 'entrada' : 'entradas'} {/* ← cambiado */}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }