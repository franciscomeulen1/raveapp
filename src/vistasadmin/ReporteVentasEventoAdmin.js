// src/vistas/ReporteVentasEvento.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function ReporteVentasEvento() {
  // La ruta declarada: "/reporte-ventas/:id"
  const { id, eventoId: eventoIdAlt } = useParams();
  const eventoId = id || eventoIdAlt;
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [reporte, setReporte] = useState([]); // array plano del endpoint
  const [usuarioOrganizador, setUsuarioOrganizador] = useState(null); // <-- NUEVO

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // helper fecha/hora legible
  const formatFechaInicio = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  // Cargar evento + reporte + datos organizador
  const fetchAll = useCallback(async () => {
    if (!eventoId) return;
    try {
      setLoading(true);
      setErr('');

      // 1) Traer evento (para nombre + fechas + datos organizador)
      const evRes = await api.get('/Evento/GetEventos', {
        params: { IdEvento: eventoId },
      });

      const ev = evRes?.data?.eventos?.[0] || null;
      setEvento(ev);

      // IMPORTANTE: ahora el id del organizador viene en ev.usuario.idUsuario
      const organizadorId = ev?.usuario?.idUsuario || null;

      // 2) Traer reporte usando también el idUsuario del organizador
      let reporteData = [];
      if (organizadorId) {
        const repRes = await api.get('/Reporte/ReporteVentasEvento', {
          params: {
            IdEvento: eventoId,
            IdUsuarioOrg: organizadorId,
          },
        });
        reporteData = repRes?.data || [];
        setReporte(reporteData);
      } else {
        setReporte([]);
        setErr('No se pudo identificar el organizador del evento.');
      }

      // 3) Traer datos del usuario organizador
      if (organizadorId) {
        const userRes = await api.get('/Usuario/GetUsuario', {
          params: {
            IdUsuario: organizadorId,
          },
        });

        const usuarioApi = Array.isArray(userRes?.data?.usuarios)
          ? userRes.data.usuarios[0]
          : null;

        setUsuarioOrganizador(usuarioApi || null);
      } else {
        setUsuarioOrganizador(null);
      }
    } catch (e) {
      console.error('Error al cargar reporte de ventas o datos del organizador:', e);
      setErr('No se pudo cargar el reporte de ventas.');
      setReporte([]);
      setUsuarioOrganizador(null);
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Indexar fechas del evento por idFecha para mostrar el título correcto
  const fechasById = useMemo(() => {
    const map = new Map();
    (evento?.fechas || []).forEach((f) => map.set(f.idFecha, f));
    return map;
  }, [evento]);

  // Agrupar reporte por idFecha y ordenar por numFecha
  const grupos = useMemo(() => {
    const byFecha = new Map();

    for (const r of reporte) {
      if (!byFecha.has(r.idFecha)) {
        byFecha.set(r.idFecha, {
          idFecha: r.idFecha,
          numFecha: r.numFecha,
          filas: [],
          total: null,
        });
      }

      if (r.entrada === 'TOTAL') {
        byFecha.get(r.idFecha).total = r;
      } else {
        byFecha.get(r.idFecha).filas.push(r);
      }
    }

    // Orden por numFecha asc
    return Array.from(byFecha.values()).sort(
      (a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0)
    );
  }, [reporte]);

  // Totales globales (sumatoria de los bloques TOTAL)
  const totalesEvento = useMemo(() => {
    const base = { vendidas: 0, subtotal: 0, servicio: 0, total: 0 };
    return grupos.reduce((acc, g) => {
      const t = g.total || {};
      return {
        vendidas: acc.vendidas + (t.cantidadVendida || 0),
        subtotal: acc.subtotal + (t.montoSubTotal || 0),
        servicio: acc.servicio + (t.montoCostoServicio || 0),
        total: acc.total + (t.montoVenta || 0),
      };
    }, base);
  }, [grupos]);

  // ---- Helpers para la sección "Datos del usuario dueño del evento" ----

  // Nombre completo
  const nombreCompletoOrganizador = usuarioOrganizador
    ? `${usuarioOrganizador.nombre || ''} ${usuarioOrganizador.apellido || ''}`.trim()
    : '';

  // Contacto
  const correoOrganizador = usuarioOrganizador?.correo || '';
  const telOrganizador = usuarioOrganizador?.telefono || '';

  // CBU
  const cbuOrganizador = usuarioOrganizador?.cbu;
  const cbuMostrado =
    cbuOrganizador && cbuOrganizador.trim() !== ''
      ? cbuOrganizador
      : 'CBU aún no informado por el dueño del evento';

  const correoConfirmado =
    usuarioOrganizador?.bio?.trim() === '1'
      ? 'confirmado'
      : 'no-confirmado';

  // Domicilio formateado (evitando repeticiones)
  let ubicacionFormateada = '';
  if (usuarioOrganizador?.domicilio) {
    const { localidad, municipio, provincia, direccion } =
      usuarioOrganizador.domicilio ?? {};

    const localidadNombre = localidad?.nombre || '';
    const municipioNombre = municipio?.nombre || '';
    const provinciaNombre = provincia?.nombre || '';
    const direccionTexto = direccion || '';

    const partes = [];
    if (
      localidadNombre &&
      localidadNombre !== municipioNombre &&
      localidadNombre !== provinciaNombre
    )
      partes.push(localidadNombre);

    if (
      municipioNombre &&
      municipioNombre !== provinciaNombre &&
      municipioNombre !== localidadNombre
    )
      partes.push(municipioNombre);

    if (provinciaNombre) partes.push(provinciaNombre);

    if (direccionTexto || partes.length > 0) {
      ubicacionFormateada = `${direccionTexto}${direccionTexto && partes.length > 0 ? ', ' : ''
        }${partes.join(', ')}`;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />

          <div className="container mx-auto px-4">
            <h1 className="mb-4 mt-2 text-xl md:text-2xl font-bold underline underline-offset-8">
              {loading
                ? 'Cargando reporte...'
                : `Reporte de ventas de evento: ${evento?.nombre || '—'}`}
            </h1>

            {/* Línea de info + botón Actualizar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-4">
              <p className="font-semibold text-sky-700">
                Información al {formattedDate} a las {formattedTime} hs
              </p>

              <button
                className="btn btn-secondary btn-sm w-fit"
                onClick={fetchAll}
                disabled={loading}
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

            {!loading && grupos.length === 0 && !err && (
              <p className="text-gray-600">
                No hay datos de ventas para este evento.
              </p>
            )}

            {/* ===== Sección por fecha ===== */}
            {grupos.map((g) => {
              const fEvento = fechasById.get(g.idFecha);
              const tituloFecha = fEvento
                ? formatFechaInicio(fEvento.inicio)
                : `Fecha ${g.numFecha}`;

              const tVendidas = g.total?.cantidadVendida || 0;
              const tSubtotal = g.total?.montoSubTotal || 0;
              const tServicio = g.total?.montoCostoServicio || 0;
              const tTotal = g.total?.montoVenta || 0;

              return (
                <section key={g.idFecha} className="mb-10">
                  <h2 className="md:text-lg xl:text-xl font-bold mb-3">
                    {`Reporte de ventas de la fecha ${tituloFecha}`}
                  </h2>

                  {/* ===== Mobile (cards) ===== */}
                  <div className="mt-4 space-y-3 md:hidden">
                    {g.filas.map((item, idx) => (
                      <div
                        key={`${g.idFecha}-card-${idx}`}
                        className="rounded-xl border p-4 shadow-sm"
                      >
                        <div className="font-semibold text-lg">
                          {item.entrada}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                          <span className="text-gray-600">Cantidad inicial</span>
                          <span className="text-right">
                            {item.stockInicial.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">
                            Cantidad vendida
                          </span>
                          <span className="text-right">
                            {item.cantidadVendida.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">
                            Precio unitario
                          </span>
                          <span className="text-right">
                            ${item.precioEntrada.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-right">
                            ${item.montoSubTotal.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">
                            Cargo por servicio
                          </span>
                          <span className="text-right">
                            ${item.montoCostoServicio.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">Total</span>
                          <span className="text-right">
                            ${item.montoVenta.toLocaleString('es-AR')}
                          </span>

                          <span className="text-gray-600">
                            Aún en stock
                          </span>
                          <span className="text-right">
                            {item.stockActual.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ===== Desktop/Tablet (tabla) ===== */}
                  <div className="mt-4 overflow-x-auto rounded-xl border shadow-sm hidden md:block">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-base-200">
                          <th className="px-4 py-3 text-left">
                            Tipo de entrada
                          </th>
                          <th className="px-4 py-3 text-right">
                            Cantidad inicial
                          </th>
                          <th className="px-4 py-3 text-right">
                            Cantidad vendida
                          </th>
                          <th className="px-4 py-3 text-right">
                            Precio unitario
                          </th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                          <th className="px-4 py-3 text-right">
                            Cargo por servicio
                          </th>
                          <th className="px-4 py-3 text-right">Total</th>
                          <th className="px-4 py-3 text-right">
                            Aún en stock
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.filas.map((item, idx) => (
                          <tr
                            key={`${g.idFecha}-row-${idx}`}
                            className="hover"
                          >
                            <td className="border-t px-4 py-3">
                              {item.entrada}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              {item.stockInicial.toLocaleString('es-AR')}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              {item.cantidadVendida.toLocaleString('es-AR')}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              ${item.precioEntrada.toLocaleString('es-AR')}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              ${item.montoSubTotal.toLocaleString('es-AR')}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              ${item.montoCostoServicio.toLocaleString(
                                'es-AR'
                              )}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              ${item.montoVenta.toLocaleString('es-AR')}
                            </td>
                            <td className="border-t px-4 py-3 text-right">
                              {item.stockActual.toLocaleString('es-AR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totales por fecha (desde el bloque TOTAL) */}
                  <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border p-4">
                      <p className="font-bold">
                        Total de entradas vendidas
                      </p>
                      <p className="text-purple-950 text-xl">
                        {tVendidas.toLocaleString('es-AR')}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="font-bold">
                        Total recaudado de entradas
                      </p>
                      <p className="text-green-800 text-xl">
                        ${tSubtotal.toLocaleString('es-AR')}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="font-bold">
                        Total de cargo por servicio
                      </p>
                      <p className="text-sky-800 text-xl">
                        ${tServicio.toLocaleString('es-AR')}
                      </p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="font-bold">
                        Total recaudado (entradas + servicio)
                      </p>
                      <p className="text-emerald-900 text-xl">
                        ${tTotal.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* ===== Totales globales del evento (si hay más de una fecha) ===== */}
            {grupos.length > 1 && (
              <div className="mt-10 border-t pt-6">
                <h3 className="text-2xl font-extrabold mb-3">
                  Totales del evento
                </h3>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border p-4">
                    <p className="font-bold">
                      Total de entradas vendidas
                    </p>
                    <p className="text-purple-950 text-xl">
                      {totalesEvento.vendidas.toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="font-bold">
                      Total recaudado de entradas
                    </p>
                    <p className="text-green-800 text-xl">
                      ${totalesEvento.subtotal.toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="font-bold">
                      Total de cargo por servicio
                    </p>
                    <p className="text-sky-800 text-xl">
                      ${totalesEvento.servicio.toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="font-bold">
                      Total recaudado (entradas + servicio)
                    </p>
                    <p className="text-emerald-900 text-xl">
                      ${totalesEvento.total.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===== Datos del usuario dueño del evento ===== */}
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl md:text-2xl font-extrabold mb-6">
                Datos del usuario dueño del evento
              </h3>

              {usuarioOrganizador ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Card Nombre/Correo */}
                  <div className="rounded-xl border p-4 shadow-sm bg-base-100">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Nombre y Apellido
                    </p>
                    <p className="xl:text-lg font-bold text-gray-800 break-words">
                      {nombreCompletoOrganizador || '—'}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Correo
                      </p>
                      <p className="text-gray-800 font-semibold break-words">
                        {correoOrganizador || '—'}
                      </p>

                      {/* ✅ Indicador de correo confirmado */}
                      {correoConfirmado === 'confirmado' ? (
                        <p className="text-green-700 font-semibold text-sm mt-1">
                          Correo confirmado por el usuario
                        </p>
                      ) : (
                        <p className="text-red-600 font-semibold text-sm mt-1">
                          Correo aún no confirmado por el usuario
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Teléfono / CBU */}
                  <div className="rounded-xl border p-4 shadow-sm bg-base-100">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Teléfono
                    </p>
                    <p className="xl:text-lg font-medium text-gray-800 break-words">
                      {telOrganizador || '—'}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        CBU
                      </p>
                      <p className="text-gray-800 break-words">
                        {cbuMostrado}
                      </p>
                    </div>
                  </div>

                  {/* Card Domicilio */}
                  <div className="rounded-xl border p-4 shadow-sm bg-base-100 md:col-span-2 lg:col-span-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Domicilio
                    </p>
                    <p className="xl:text-lg font-bold text-gray-800 break-words">
                      {ubicacionFormateada || '—'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border p-4 shadow-sm bg-base-100 text-gray-600">
                  No fue posible cargar los datos del dueño del evento.
                </div>
              )}
            </div>

            <button
              className="btn btn-info mt-10"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
