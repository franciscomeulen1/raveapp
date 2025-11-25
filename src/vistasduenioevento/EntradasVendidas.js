// src/vistas/EntradasVendidas.js
import React, { useEffect, useMemo, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const EntradasVendidas = () => {
  const { eventoId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [evento, setEvento] = useState(null);
  const [reporte, setReporte] = useState([]); // array plano del endpoint
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const formattedTime = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

  // 👉 Hoist & reuse: función para cargar evento + reporte
  const fetchAll = useCallback(async () => {
    // intentar obtener id del usuario logueado con fallback de nombre de campo
    const idUsuarioOrg = user?.id ?? user?.idUsuario ?? user?.idUsuarioOrg ?? null;

    try {
      setLoading(true);
      setErr('');

      if (!eventoId) {
        throw new Error('Falta el id del evento.');
      }
      if (!idUsuarioOrg) {
        throw new Error('No se pudo determinar el usuario organizador logueado.');
      }

      // 1) Traer evento (para nombre + fechas)
      const evRes = await api.get('/Evento/GetEventos', { params: { IdEvento: eventoId } });
      const ev = evRes?.data?.eventos?.[0] || null;
      setEvento(ev);

      // 2) Traer reporte con ambos params requeridos
      const repRes = await api.get('/Reporte/ReporteVentasEvento', {
        params: { idEvento: eventoId, idUsuarioOrg }
      });
      setReporte(repRes?.data || []);
    } catch (e) {
      console.error(e);
      // Axios error 404 -> acceso denegado por no ser dueño del evento
      const status = e?.response?.status;
      if (status === 404) {
        setErr('Acceso denegado. Solo puedes ver el reporte de ventas de tus propios eventos');
        setReporte([]);
      } else {
        setErr('No se pudo cargar el reporte de ventas.');
      }
    } finally {
      setLoading(false);
    }
  }, [eventoId, user]);

  useEffect(() => {
    if (eventoId && user) fetchAll();
  }, [eventoId, user, fetchAll]);

  const formatFechaInicio = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  // Indexar fechas del evento por idFecha para mostrar el título correcto
  const fechasById = useMemo(() => {
    const map = new Map();
    (evento?.fechas || []).forEach(f => map.set(f.idFecha, f));
    return map;
  }, [evento]);

  // Agrupar reporte por idFecha y ordenar por numFecha
  const grupos = useMemo(() => {
    const byFecha = new Map();
    for (const r of reporte) {
      if (!byFecha.has(r.idFecha)) {
        byFecha.set(r.idFecha, { idFecha: r.idFecha, numFecha: r.numFecha, filas: [], total: null });
      }
      if (r.entrada === 'TOTAL') {
        byFecha.get(r.idFecha).total = r;
      } else {
        byFecha.get(r.idFecha).filas.push(r);
      }
    }
    // Orden por numFecha asc
    return Array.from(byFecha.values()).sort((a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0));
  }, [reporte]);

  // Totales globales (sumatoria de los bloques TOTAL)
  const totalesEvento = useMemo(() => {
    const tVendidas = grupos.reduce((acc, g) => acc + (g.total?.cantidadVendida || 0), 0);
    const tRecaudado = grupos.reduce((acc, g) => acc + (g.total?.montoSubTotal || 0), 0);
    return { tVendidas, tRecaudado };
  }, [grupos]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          <div className="container mx-auto px-4">
            <h1 className="mb-4 mt-2 text-xl md:text-2xl font-bold underline underline-offset-8">
              {loading ? 'Cargando reporte...' : `Reporte de ventas de evento: ${evento?.nombre || '—'}`}
            </h1>

            {/* Línea de info + botón Actualizar */}
            <div className="flex items-center gap-3 mb-4">
              <p className="font-semibold text-sky-700">
                Información al {formattedDate} a las {formattedTime} hs
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchAll}
                disabled={loading || !user}
                title="Volver a consultar los datos"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar'
                )}
              </button>
            </div>

            {err && (
              <div className="alert alert-error mb-4">
                <span>{err}</span>
              </div>
            )}

            {!loading && !err && grupos.length === 0 && (
              <p className="text-gray-600">No hay datos de ventas para este evento.</p>
            )}

            {/* ===== Sección por fecha ===== */}
            {grupos.map((g) => {
              const fEvento = fechasById.get(g.idFecha);
              const tituloFecha = fEvento ? formatFechaInicio(fEvento.inicio) : `Fecha ${g.numFecha}`;
              const totalVendidasFecha = g.total?.cantidadVendida || 0;
              const totalRecaudadoFecha = g.total?.montoSubTotal || 0;

              return (
                <section key={g.idFecha} className="mb-10">
                  <h2 className="text-lg md:text-xl font-bold mb-3">
                    {`Reporte de ventas de la fecha ${tituloFecha}`}
                  </h2>

                  {/* ===== Mobile (cards) ===== */}
                  <div className="mt-4 space-y-3 md:hidden">
                    {g.filas.map((item, idx) => (
                      <div key={`${g.idFecha}-card-${idx}`} className="rounded-xl border p-4 shadow-sm">
                        <div className="font-semibold text-lg">{item.entrada}</div>
                        <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                          <span className="text-gray-600">Cantidad inicial</span>
                          <span className="text-right">{item.stockInicial.toLocaleString('es-AR')}</span>

                          <span className="text-gray-600">Cantidad vendida</span>
                          <span className="text-right">{item.cantidadVendida.toLocaleString('es-AR')}</span>

                          <span className="text-gray-600">Precio</span>
                          <span className="text-right">${item.precioEntrada.toLocaleString('es-AR')}</span>

                          <span className="text-gray-600">Total recaudado</span>
                          <span className="text-right">${item.montoSubTotal.toLocaleString('es-AR')}</span>

                          <span className="text-gray-600">Aún en stock</span>
                          <span className="text-right">{item.stockActual.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ===== Desktop/Tablet (tabla) ===== */}
                  <div className="mt-4 overflow-x-auto rounded-xl border shadow-sm hidden md:block">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-base-200">
                          <th className="px-4 py-3 text-left">Tipo de entrada</th>
                          <th className="px-4 py-3 text-right">Cantidad inicial</th>
                          <th className="px-4 py-3 text-right">Cantidad vendida</th>
                          <th className="px-4 py-3 text-right">Precio</th>
                          <th className="px-4 py-3 text-right">Total recaudado</th>
                          <th className="px-4 py-3 text-right">Aún en stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.filas.map((item, idx) => (
                          <tr key={`${g.idFecha}-row-${idx}`} className="hover">
                            <td className="border-t px-4 py-3">{item.entrada}</td>
                            <td className="border-t px-4 py-3 text-right">{item.stockInicial.toLocaleString('es-AR')}</td>
                            <td className="border-t px-4 py-3 text-right">{item.cantidadVendida.toLocaleString('es-AR')}</td>
                            <td className="border-t px-4 py-3 text-right">${item.precioEntrada.toLocaleString('es-AR')}</td>
                            <td className="border-t px-4 py-3 text-right">${item.montoSubTotal.toLocaleString('es-AR')}</td>
                            <td className="border-t px-4 py-3 text-right">{item.stockActual.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totales por fecha */}
                  <div className="mt-6 font-bold text-md sm:text-lg">
                    <p>
                      Total de entradas vendidas:{' '}
                      <span className="text-purple-950 text-lg sm:text-xl">
                        {totalVendidasFecha.toLocaleString('es-AR')}
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 font-bold text-md sm:text-lg">
                    <p>
                      Total recaudado al momento:{' '}
                      <span className="text-green-800 text-lg sm:text-xl">
                        ${totalRecaudadoFecha.toLocaleString('es-AR')}
                      </span>
                    </p>
                  </div>
                </section>
              );
            })}

            {/* ===== Totales globales del evento ===== */}
            {grupos.length > 1 && !err && (
              <div className="mt-10 border-t pt-6">
                <h3 className="text-2xl font-extrabold mb-3">Totales del evento</h3>

                <div className="font-bold text-md sm:text-lg">
                  <p>
                    Total de entradas vendidas del evento:{' '}
                    <span className="text-purple-950 text-lg sm:text-xl">
                      {totalesEvento.tVendidas.toLocaleString('es-AR')}
                    </span>
                  </p>
                </div>

                <div className="mt-2 font-bold text-md sm:text-lg">
                  <p>
                    Total recaudado al momento del evento:{' '}
                    <span className="text-green-800 text-lg sm:text-xl">
                      ${totalesEvento.tRecaudado.toLocaleString('es-AR')}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <button className="btn btn-info mt-8" onClick={() => navigate('/mis-eventos-creados')}>
              Volver
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EntradasVendidas;


// // src/vistas/EntradasVendidas.js
// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';

// const EntradasVendidas = () => {
//   const { eventoId } = useParams();
//   const navigate = useNavigate();

//   const [evento, setEvento] = useState(null);
//   const [reporte, setReporte] = useState([]); // array plano del endpoint
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState('');

//   const now = new Date();
//   const formattedDate = now.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
//   const formattedTime = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

//   // 👉 Hoist & reuse: función para cargar evento + reporte
//   const fetchAll = useCallback(async () => {
//     try {
//       setLoading(true);
//       setErr('');
//       // 1) Traer evento (para nombre + fechas)
//       const evRes = await api.get('/Evento/GetEventos', { params: { IdEvento: eventoId } });
//       const ev = evRes?.data?.eventos?.[0] || null;
//       setEvento(ev);

//       // 2) Traer reporte
//       const repRes = await api.get('/Reporte/ReporteVentasEvento', { params: { idEvento: eventoId } });
//       setReporte(repRes?.data || []);
//     } catch (e) {
//       console.error(e);
//       setErr('No se pudo cargar el reporte de ventas.');
//     } finally {
//       setLoading(false);
//     }
//   }, [eventoId]);

//   useEffect(() => {
//     if (eventoId) fetchAll();
//   }, [eventoId, fetchAll]);

//   const formatFechaInicio = (iso) => {
//     try {
//       const d = new Date(iso);
//       return d.toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return iso;
//     }
//   };

//   // Indexar fechas del evento por idFecha para mostrar el título correcto
//   const fechasById = useMemo(() => {
//     const map = new Map();
//     (evento?.fechas || []).forEach(f => map.set(f.idFecha, f));
//     return map;
//   }, [evento]);

//   // Agrupar reporte por idFecha y ordenar por numFecha
//   const grupos = useMemo(() => {
//     const byFecha = new Map();
//     for (const r of reporte) {
//       if (!byFecha.has(r.idFecha)) {
//         byFecha.set(r.idFecha, { idFecha: r.idFecha, numFecha: r.numFecha, filas: [], total: null });
//       }
//       if (r.entrada === 'TOTAL') {
//         byFecha.get(r.idFecha).total = r;
//       } else {
//         byFecha.get(r.idFecha).filas.push(r);
//       }
//     }
//     // Orden por numFecha asc
//     return Array.from(byFecha.values()).sort((a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0));
//   }, [reporte]);

//   // Totales globales (sumatoria de los bloques TOTAL)
//   const totalesEvento = useMemo(() => {
//     const tVendidas = grupos.reduce((acc, g) => acc + (g.total?.cantidadVendida || 0), 0);
//     const tRecaudado = grupos.reduce((acc, g) => acc + (g.total?.montoSubTotal || 0), 0);
//     return { tVendidas, tRecaudado };
//   }, [grupos]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-1">
//         <div className="sm:px-10 mb-11">
//           <NavBar />
//           <div className="container mx-auto px-4">
//             <h1 className="mb-4 mt-2 text-xl md:text-2xl font-bold underline underline-offset-8">
//               {loading ? 'Cargando reporte...' : `Reporte de ventas de evento: ${evento?.nombre || '—'}`}
//             </h1>

//             {/* Línea de info + botón Actualizar */}
//             <div className="flex items-center gap-3 mb-4">
//               <p className="font-semibold text-sky-700">
//                 Información al {formattedDate} a las {formattedTime} hs
//               </p>
//               <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={fetchAll}
//                 disabled={loading}
//                 title="Volver a consultar los datos"
//               >
//                 {loading ? (
//                   <>
//                     <span className="loading loading-spinner loading-xs mr-2" />
//                     Actualizando...
//                   </>
//                 ) : (
//                   'Actualizar'
//                 )}
//               </button>
//             </div>

//             {err && (
//               <div className="alert alert-error mb-4">
//                 <span>{err}</span>
//               </div>
//             )}

//             {!loading && grupos.length === 0 && (
//               <p className="text-gray-600">No hay datos de ventas para este evento.</p>
//             )}

//             {/* ===== Sección por fecha ===== */}
//             {grupos.map((g) => {
//               const fEvento = fechasById.get(g.idFecha);
//               const tituloFecha = fEvento ? formatFechaInicio(fEvento.inicio) : `Fecha ${g.numFecha}`;
//               const totalVendidasFecha = g.total?.cantidadVendida || 0;
//               const totalRecaudadoFecha = g.total?.montoSubTotal || 0;

//               return (
//                 <section key={g.idFecha} className="mb-10">
//                   <h2 className="text-lg md:text-xl font-bold mb-3">
//                     {`Reporte de ventas de la fecha ${tituloFecha}`}
//                   </h2>

//                   {/* ===== Mobile (cards) ===== */}
//                   <div className="mt-4 space-y-3 md:hidden">
//                     {g.filas.map((item, idx) => (
//                       <div key={`${g.idFecha}-card-${idx}`} className="rounded-xl border p-4 shadow-sm">
//                         <div className="font-semibold text-lg">{item.entrada}</div>
//                         <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
//                           <span className="text-gray-600">Cantidad inicial</span>
//                           <span className="text-right">{item.stockInicial.toLocaleString('es-AR')}</span>

//                           <span className="text-gray-600">Cantidad vendida</span>
//                           <span className="text-right">{item.cantidadVendida.toLocaleString('es-AR')}</span>

//                           <span className="text-gray-600">Precio</span>
//                           <span className="text-right">${item.precioEntrada.toLocaleString('es-AR')}</span>

//                           <span className="text-gray-600">Total recaudado</span>
//                           <span className="text-right">${item.montoSubTotal.toLocaleString('es-AR')}</span>

//                           <span className="text-gray-600">Aún en stock</span>
//                           <span className="text-right">{item.stockActual.toLocaleString('es-AR')}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* ===== Desktop/Tablet (tabla) ===== */}
//                   <div className="mt-4 overflow-x-auto rounded-xl border shadow-sm hidden md:block">
//                     <table className="table w-full">
//                       <thead>
//                         <tr className="bg-base-200">
//                           <th className="px-4 py-3 text-left">Tipo de entrada</th>
//                           <th className="px-4 py-3 text-right">Cantidad inicial</th>
//                           <th className="px-4 py-3 text-right">Cantidad vendida</th>
//                           <th className="px-4 py-3 text-right">Precio</th>
//                           <th className="px-4 py-3 text-right">Total recaudado</th>
//                           <th className="px-4 py-3 text-right">Aún en stock</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {g.filas.map((item, idx) => (
//                           <tr key={`${g.idFecha}-row-${idx}`} className="hover">
//                             <td className="border-t px-4 py-3">{item.entrada}</td>
//                             <td className="border-t px-4 py-3 text-right">{item.stockInicial.toLocaleString('es-AR')}</td>
//                             <td className="border-t px-4 py-3 text-right">{item.cantidadVendida.toLocaleString('es-AR')}</td>
//                             <td className="border-t px-4 py-3 text-right">${item.precioEntrada.toLocaleString('es-AR')}</td>
//                             <td className="border-t px-4 py-3 text-right">${item.montoSubTotal.toLocaleString('es-AR')}</td>
//                             <td className="border-t px-4 py-3 text-right">{item.stockActual.toLocaleString('es-AR')}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Totales por fecha */}
//                   <div className="mt-6 font-bold text-md sm:text-lg">
//                     <p>
//                       Total de entradas vendidas:{' '}
//                       <span className="text-purple-950 text-lg sm:text-xl">
//                         {totalVendidasFecha.toLocaleString('es-AR')}
//                       </span>
//                     </p>
//                   </div>

//                   <div className="mt-2 font-bold text-md sm:text-lg">
//                     <p>
//                       Total recaudado al momento:{' '}
//                       <span className="text-green-800 text-lg sm:text-xl">
//                         ${totalRecaudadoFecha.toLocaleString('es-AR')}
//                       </span>
//                     </p>
//                   </div>
//                 </section>
//               );
//             })}

//             {/* ===== Totales globales del evento ===== */}
//             {grupos.length > 1 && (
//               <div className="mt-10 border-t pt-6">
//                 <h3 className="text-2xl font-extrabold mb-3">Totales del evento</h3>

//                 <div className="font-bold text-md sm:text-lg">
//                   <p>
//                     Total de entradas vendidas del evento:{' '}
//                     <span className="text-purple-950 text-lg sm:text-xl">
//                       {totalesEvento.tVendidas.toLocaleString('es-AR')}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="mt-2 font-bold text-md sm:text-lg">
//                   <p>
//                     Total recaudado al momento del evento:{' '}
//                     <span className="text-green-800 text-lg sm:text-xl">
//                       ${totalesEvento.tRecaudado.toLocaleString('es-AR')}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             )}

//             <button className="btn btn-info mt-8" onClick={() => navigate('/mis-eventos-creados')}>
//               Volver
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default EntradasVendidas;