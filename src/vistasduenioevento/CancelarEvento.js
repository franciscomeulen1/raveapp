// src/vistasduenioevento/CancelarEvento.js
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const CancelarEvento = () => {
  const { id: eventoId } = useParams(); // /cancelar-evento/:id
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [evento, setEvento] = useState(null);
  const [reporte, setReporte] = useState([]);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noOwner, setNoOwner] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // por si vino desde MisEventos
  const nombreFromState = location.state?.nombre;

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNoOwner(false);
      setNotFound(false);

      if (!eventoId) {
        throw new Error('Falta el id del evento en la URL.');
      }
      if (!user) {
        throw new Error('Debes iniciar sesión para cancelar un evento.');
      }

      const idUsuarioOrg =
        user.id ?? user.idUsuario ?? user.idUsuarioOrg ?? null;

      if (!idUsuarioOrg) {
        throw new Error('No se pudo determinar el organizador logueado.');
      }

      // 1) Traer el evento
      const evRes = await api.get('/Evento/GetEventos', {
        params: { IdEvento: eventoId },
      });
      const ev = evRes?.data?.eventos?.[0] || null;

      // si no existe el evento
      if (!ev) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // 2) Verificar dueño
      const idDueñoEvento = ev?.usuario?.idUsuario ?? ev?.idUsuarioOrg ?? null;
      if (idDueñoEvento && idDueñoEvento !== idUsuarioOrg) {
        setEvento(ev);
        setNoOwner(true);
        setLoading(false);
        return;
      }

      setEvento(ev);

      // 3) Traer reporte de ventas
      const repRes = await api.get('/Reporte/ReporteVentasEvento', {
        params: { idEvento: eventoId, idUsuarioOrg },
      });
      setReporte(repRes?.data || []);
    } catch (e) {
      console.error(e);
      const status = e?.response?.status;
      if (status === 404) {
        setNotFound(true);
      } else {
        setError(e.message || 'Ocurrió un error al cargar el evento.');
      }
    } finally {
      setLoading(false);
    }
  }, [eventoId, user]);

  useEffect(() => {
    if (user) {
      fetchAll();
    } else {
      setLoading(false);
      setError('Debes iniciar sesión para cancelar un evento.');
    }
  }, [user, fetchAll]);

  // ====== helpers de fecha ======
  const fechasById = useMemo(() => {
    const map = new Map();
    (evento?.fechas || []).forEach((f) => {
      map.set(f.idFecha, f);
    });
    return map;
  }, [evento]);

  const formatFechaInicio = (iso) => {
    if (!iso) return '';
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

  // ====== agrupamos el reporte por fecha, IGUAL que en EntradasVendidas ======
  const gruposPorFecha = useMemo(() => {
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
      const grupo = byFecha.get(r.idFecha);
      if (r.entrada === 'TOTAL') {
        grupo.total = r; // viene la fila total de esa fecha
      } else {
        grupo.filas.push(r);
      }
    }

    // devolver ordenado por numFecha
    return Array.from(byFecha.values()).sort(
      (a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0)
    );
  }, [reporte]);

  // ====== dentro de cada fecha, queremos agrupar por (entrada + precio) ======
  const gruposConLineas = useMemo(() => {
    return gruposPorFecha.map((g) => {
      const lineasMap = new Map();

      for (const fila of g.filas) {
        // ignoramos las que no vendieron nada
        const vendidas = fila.cantidadVendida || 0;
        if (vendidas <= 0) continue;

        const key = `${fila.entrada}||${fila.precioEntrada}`;
        if (!lineasMap.has(key)) {
          lineasMap.set(key, {
            tipo: fila.entrada,
            precio: fila.precioEntrada,
            cantidad: 0,
          });
        }
        lineasMap.get(key).cantidad += vendidas;
      }

      const lineas = Array.from(lineasMap.values());
      const totalFecha = lineas.reduce(
        (acc, l) => acc + l.precio * l.cantidad,
        0
      );

      return {
        ...g,
        lineas,
        totalFecha,
      };
    });
  }, [gruposPorFecha]);

  // ====== total global ======
  const totalGlobal = useMemo(() => {
    return gruposConLineas.reduce((acc, g) => acc + g.totalFecha, 0);
  }, [gruposConLineas]);

  const handleCancel = () => {
    // después conectamos acá el endpoint real
    console.log(`Evento ${eventoId} cancelado. Motivo: ${motivo}`);
  };

  // ====== RENDERS DE ESTADO ======

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="sm:px-10 mb-11">
            <NavBar />
            <div className="container mx-auto px-4 py-10 flex items-center justify-center">
              <div className="text-center">
                <span className="loading loading-spinner loading-lg mb-4" />
                <p className="text-gray-600">Cargando datos del evento...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // no existe o no es dueño
  if (noOwner || notFound) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="sm:px-10 mb-11">
            <NavBar />
            <div className="container mx-auto px-4 py-10">
              <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
              <p className="text-red-600 font-semibold mb-2">
                No puedes acceder a esta página. Solo puedes cancelar eventos de tu propiedad.
              </p>
              <p className="mb-6">
                {`Estabas intentando cancelar: `}
                <span className="font-bold">
                  {evento?.nombre || nombreFromState || 'Evento desconocido'}
                </span>
              </p>
              <button
                className="btn btn-info"
                onClick={() => navigate('/mis-eventos-creados')}
              >
                Volver a mis eventos
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          <div className="container mx-auto">
            <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
              Cancelación de evento:
            </h1>

            <div className="mb-4 px-4">
              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}

              <p className="font-semibold">
                Si cancelas este evento, a continuación debes informar el motivo. La cancelación del evento se le avisará vía mail a las personas que hayan comprado una entrada, junto con el motivo que describas, y se procederá a realizar la devolución del dinero de las entradas.
              </p>

              <p className="mt-4">
                <strong>Evento a cancelar:</strong>{' '}
                <span className="text-red-600 font-bold">
                  {evento?.nombre || nombreFromState || '—'}
                </span>
              </p>

              {/* ====== LISTA POR FECHA ====== */}
              {gruposConLineas.length === 0 ? (
                <p className="mt-4 text-gray-600">
                  Este evento no tiene entradas vendidas hasta el momento.
                </p>
              ) : (
                <div className="mt-6 space-y-6">
                  {gruposConLineas.map((g) => {
                    const fechaEvento = fechasById.get(g.idFecha);
                    const tituloFecha =
                      fechaEvento?.inicio
                        ? formatFechaInicio(fechaEvento.inicio)
                        : `Fecha ${g.numFecha}`;

                    return (
                      <div key={g.idFecha} className="border rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-3">
                          Entradas a devolver de la fecha:{' '}
                          <span className="text-purple-700">{tituloFecha}</span>
                        </h2>

                        {g.lineas.length === 0 ? (
                          <p className="text-gray-500">
                            Esta fecha no tiene entradas vendidas.
                          </p>
                        ) : (
                          <ul className="list-disc list-inside space-y-1">
                            {g.lineas.map((item, idx) => {
                              const esUna = item.cantidad === 1;
                              return (
                                <li key={idx} className="font-semibold">
                                  {item.cantidad}{' '}
                                  {esUna ? 'Entrada' : 'Entradas'} {item.tipo} de $
                                  {item.precio.toLocaleString('es-AR')} c/u. -- Subtotal: $
                                  {(item.cantidad * item.precio).toLocaleString('es-AR')}
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        <p className="mt-3 font-semibold">
                          Total a devolver por esta fecha:{' '}
                          <span className="text-red-600 text-lg">
                            ${g.totalFecha.toLocaleString('es-AR')}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ====== TOTAL GLOBAL ====== */}
              <p className="mt-6">
                <strong>Total a devolver (todas las fechas):</strong>{' '}
                <span className="text-red-600 font-bold text-lg">
                  ${totalGlobal.toLocaleString('es-AR')}
                </span>
              </p>

              {/* ====== MOTIVO ====== */}
              <p className="mt-4">
                <strong>Motivo:</strong>
              </p>
              <textarea
                className="textarea textarea-bordered w-full h-40 mt-2"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej.: El artista principal no podrá presentarse por motivos de salud..."
              />

              <p className="mt-2 text-red-600">
                * Esta operación no puede ser reversada.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="btn btn-error"
                  onClick={handleCancel}
                  disabled={!motivo.trim()}
                  title={!motivo.trim() ? 'Debes indicar un motivo' : ''}
                >
                  Cancelar evento
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => navigate('/mis-eventos-creados')}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CancelarEvento;
