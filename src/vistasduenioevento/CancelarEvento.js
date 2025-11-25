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
  const [invalidState, setInvalidState] = useState(false); // ⬅︎ nuevo

  // modal
  const [showModal, setShowModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // por si vino desde MisEventos
  const nombreFromState = location.state?.nombre;

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNoOwner(false);
      setNotFound(false);
      setInvalidState(false); // ⬅︎ por las dudas

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

      // 3) Verificar estado permitido (0,1,2)
      const estadoActual = ev.cdEstado ?? ev.estado ?? null;
      const estadosPermitidos = [0, 1, 2];
      if (estadoActual == null || !estadosPermitidos.includes(estadoActual)) {
        // lo guardo igual para mostrar el nombre
        setEvento(ev);
        setInvalidState(true);
        setLoading(false);
        return;
      }

      setEvento(ev);

      // 4) Traer reporte de ventas
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

  // ====== agrupamos el reporte por fecha ======
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
        grupo.total = r;
      } else {
        grupo.filas.push(r);
      }
    }

    return Array.from(byFecha.values()).sort(
      (a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0)
    );
  }, [reporte]);

  const gruposConLineas = useMemo(() => {
    return gruposPorFecha.map((g) => {
      const lineasMap = new Map();

      for (const fila of g.filas) {
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

  const totalGlobal = useMemo(() => {
    return gruposConLineas.reduce((acc, g) => acc + g.totalFecha, 0);
  }, [gruposConLineas]);

  // === abrir modal ===
  const handleCancel = () => {
    setShowModal(true);
    setConfirmError('');
  };


  // === confirmar dentro del modal ===
  const handleConfirmCancel = async () => {
    if (!evento) {
      setConfirmError('No se pudo obtener la información del evento.');
      return;
    }

    if (!evento.idEvento) {
      console.error('idEvento inexistente en el objeto evento:', evento);
      setConfirmError('No se encontró el identificador del evento a cancelar.');
      return;
    }

    try {
      setConfirmLoading(true);
      setConfirmError('');

      // Flag para saber si NO hay entradas pagas
      let noHayPagas = false;

      // ==== 1) MAIL MASIVO ====
      const titulo = `Se ha cancelado el evento ${evento.nombre}`;
      const motivoTexto =
        motivo.trim() || 'El organizador no especificó un motivo.';

      const cuerpo = `<p>Lamentamos comunicarte que el evento <strong>${evento.nombre}</strong> se ha cancelado, por causas ajenas a RaveApp.<br>
El organizador del evento ha indicado lo siguiente: ${motivoTexto}
</p>
<p>
Por este motivo, procedemos a realizar el reembolso de tu compra al medio de pago que hayas utilizado en MercadoPago, y lo verás acreditado dentro de los 7 días hábiles.
</p>
<p>Atentamente,<br>El equipo de <strong>RaveApp</strong></p>`;

      const payloadMail = {
        idEvento: evento.idEvento,
        titulo,
        cuerpo,
        botonUrl: '',
        botonTexto: '',
      };

      try {
        await api.post('/Email/EnvioMailGenericoMasivo', payloadMail);
      } catch (mailError) {
        const status = mailError?.response?.status;
        if (status === 404) {
          console.warn(
            'No hay entradas pagas => no se enviaron mails masivos.'
          );
          noHayPagas = true; // 🔥 Este dato lo usamos más adelante
        } else {
          throw mailError;
        }
      }

      // ==== 2) ACTUALIZAR ESTADO DEL EVENTO ====
      const payloadEvento = {
        idEvento: evento.idEvento,
        idArtistas: (evento.artistas || []).map((a) => a.idArtista),
        domicilio: evento.domicilio,
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        genero: evento.genero,
        isAfter: evento.isAfter,
        isLgbt: evento.isLgbt,
        inicioEvento: evento.inicioEvento,
        finEvento: evento.finEvento,
        estado: 5,
        fechas: (evento.fechas || []).map((f) => ({
          idFecha: f.idFecha,
          inicio: f.inicio,
          fin: f.fin,
          inicioVenta: f.inicioVenta,
          finVenta: f.finVenta,
          estado: 5,
        })),
        idFiesta: evento.idFiesta,
        soundCloud: evento.soundCloud,
      };

      await api.put('/Evento/UpdateEvento', payloadEvento);

      // ==== 3) REEMBOLSO MASIVO ====
      // Si sabemos que NO hay entradas pagas => no llamamos al endpoint
      if (!noHayPagas) {
        try {
          await api.post('/Pago/ReembolsoMasivo', null, {
            params: { idEvento: evento.idEvento },
          });
        } catch (refundError) {
          const status = refundError?.response?.status;
          if (status === 404) {
            console.warn(
              'No hay pagos para reembolsar => se omite reembolso masivo.'
            );
          } else {
            throw refundError;
          }
        }
      } else {
        console.log('Skip reembolso: no hay pagas.');
      }

      setCancelSuccess(true);
    } catch (e) {
      console.error('Error:', e);
      console.error('Backend response:', e?.response?.data);

      setConfirmError(
        e?.response?.data?.message ||
        'Ocurrió un error al cancelar el evento, reembolsar o enviar los mails.'
      );
    } finally {
      setConfirmLoading(false);
    }
  };



  const handleCloseModal = () => {
    if (cancelSuccess) return;
    setShowModal(false);
  };

  const handleSuccessAccept = () => {
    navigate('/mis-eventos-creados');
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
                Estabas intentando cancelar:{' '}
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

  // ⬅︎ nuevo: estado no permitido
  if (invalidState) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="sm:px-10 mb-11">
            <NavBar />
            <div className="container mx-auto px-4 py-10">
              <h1 className="text-2xl font-bold mb-4">No se puede cancelar este evento.</h1>
              <p className="text-red-600 font-semibold mb-2">
                Solo puedes cancelar eventos que estén <strong>por aprobar </strong>,{' '}
                <strong>aprobados </strong> o <strong>en venta </strong>.
              </p>
              <p className="mb-6">
                Estabas intentando cancelar:{' '}
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

  // ====== pantalla normal ======
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

              {/* lista por fecha */}
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

              <p className="mt-6">
                <strong>Total a devolver (todas las fechas):</strong>{' '}
                <span className="text-red-600 font-bold text-lg">
                  ${totalGlobal.toLocaleString('es-AR')}
                </span>
              </p>

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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!cancelSuccess ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-red-600">
                  ¿Estás seguro de cancelar este evento?
                </h2>
                <p className="mb-3">
                  Se devolverán todas las entradas que se hayan adquirido para este evento.
                </p>
                <p className="mb-3 text-red-500 font-semibold">
                  Esta acción no se puede deshacer.
                </p>

                {confirmError && (
                  <div className="alert alert-error mb-3">
                    <span>{confirmError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="btn btn-ghost"
                    onClick={handleCloseModal}
                    disabled={confirmLoading}
                  >
                    Volver
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={handleConfirmCancel}
                    disabled={confirmLoading}
                  >
                    {confirmLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2" />
                        Cancelando...
                      </>
                    ) : (
                      'Sí, cancelar evento'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-green-600">
                  Evento cancelado
                </h2>
                <p className="mb-2">Las entradas serán reembolsadas a la brevedad.</p>
                <p className="mb-4 text-sm text-gray-600">
                  El dinero se devuelve al mismo medio de pago de MercadoPago con el cual los
                  clientes hayan realizado la compra, y lo verán reflejado dentro de los 7 días
                  hábiles.
                </p>
                <div className="flex justify-end">
                  <button className="btn btn-primary" onClick={handleSuccessAccept}>
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelarEvento;


// // src/vistasduenioevento/CancelarEvento.js
// import React, {
//   useEffect,
//   useState,
//   useContext,
//   useMemo,
//   useCallback,
// } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

// const CancelarEvento = () => {
//   const { id: eventoId } = useParams(); // /cancelar-evento/:id
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(AuthContext);

//   const [evento, setEvento] = useState(null);
//   const [reporte, setReporte] = useState([]);
//   const [motivo, setMotivo] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [noOwner, setNoOwner] = useState(false);
//   const [notFound, setNotFound] = useState(false);
//   const [invalidState, setInvalidState] = useState(false); // ⬅︎ nuevo

//   // modal
//   const [showModal, setShowModal] = useState(false);
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [confirmError, setConfirmError] = useState('');
//   const [cancelSuccess, setCancelSuccess] = useState(false);

//   // por si vino desde MisEventos
//   const nombreFromState = location.state?.nombre;

//   const fetchAll = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setNoOwner(false);
//       setNotFound(false);
//       setInvalidState(false); // ⬅︎ por las dudas

//       if (!eventoId) {
//         throw new Error('Falta el id del evento en la URL.');
//       }
//       if (!user) {
//         throw new Error('Debes iniciar sesión para cancelar un evento.');
//       }

//       const idUsuarioOrg =
//         user.id ?? user.idUsuario ?? user.idUsuarioOrg ?? null;

//       if (!idUsuarioOrg) {
//         throw new Error('No se pudo determinar el organizador logueado.');
//       }

//       // 1) Traer el evento
//       const evRes = await api.get('/Evento/GetEventos', {
//         params: { IdEvento: eventoId },
//       });
//       const ev = evRes?.data?.eventos?.[0] || null;

//       // si no existe el evento
//       if (!ev) {
//         setNotFound(true);
//         setLoading(false);
//         return;
//       }

//       // 2) Verificar dueño
//       const idDueñoEvento = ev?.usuario?.idUsuario ?? ev?.idUsuarioOrg ?? null;
//       if (idDueñoEvento && idDueñoEvento !== idUsuarioOrg) {
//         setEvento(ev);
//         setNoOwner(true);
//         setLoading(false);
//         return;
//       }

//       // 3) Verificar estado permitido (0,1,2)
//       const estadoActual = ev.cdEstado ?? ev.estado ?? null;
//       const estadosPermitidos = [0, 1, 2];
//       if (estadoActual == null || !estadosPermitidos.includes(estadoActual)) {
//         // lo guardo igual para mostrar el nombre
//         setEvento(ev);
//         setInvalidState(true);
//         setLoading(false);
//         return;
//       }

//       setEvento(ev);

//       // 4) Traer reporte de ventas
//       const repRes = await api.get('/Reporte/ReporteVentasEvento', {
//         params: { idEvento: eventoId, idUsuarioOrg },
//       });
//       setReporte(repRes?.data || []);
//     } catch (e) {
//       console.error(e);
//       const status = e?.response?.status;
//       if (status === 404) {
//         setNotFound(true);
//       } else {
//         setError(e.message || 'Ocurrió un error al cargar el evento.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [eventoId, user]);

//   useEffect(() => {
//     if (user) {
//       fetchAll();
//     } else {
//       setLoading(false);
//       setError('Debes iniciar sesión para cancelar un evento.');
//     }
//   }, [user, fetchAll]);

//   // ====== helpers de fecha ======
//   const fechasById = useMemo(() => {
//     const map = new Map();
//     (evento?.fechas || []).forEach((f) => {
//       map.set(f.idFecha, f);
//     });
//     return map;
//   }, [evento]);

//   const formatFechaInicio = (iso) => {
//     if (!iso) return '';
//     try {
//       const d = new Date(iso);
//       return d.toLocaleString('es-AR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } catch {
//       return iso;
//     }
//   };

//   // ====== agrupamos el reporte por fecha ======
//   const gruposPorFecha = useMemo(() => {
//     const byFecha = new Map();

//     for (const r of reporte) {
//       if (!byFecha.has(r.idFecha)) {
//         byFecha.set(r.idFecha, {
//           idFecha: r.idFecha,
//           numFecha: r.numFecha,
//           filas: [],
//           total: null,
//         });
//       }
//       const grupo = byFecha.get(r.idFecha);
//       if (r.entrada === 'TOTAL') {
//         grupo.total = r;
//       } else {
//         grupo.filas.push(r);
//       }
//     }

//     return Array.from(byFecha.values()).sort(
//       (a, b) => (a.numFecha ?? 0) - (b.numFecha ?? 0)
//     );
//   }, [reporte]);

//   const gruposConLineas = useMemo(() => {
//     return gruposPorFecha.map((g) => {
//       const lineasMap = new Map();

//       for (const fila of g.filas) {
//         const vendidas = fila.cantidadVendida || 0;
//         if (vendidas <= 0) continue;

//         const key = `${fila.entrada}||${fila.precioEntrada}`;
//         if (!lineasMap.has(key)) {
//           lineasMap.set(key, {
//             tipo: fila.entrada,
//             precio: fila.precioEntrada,
//             cantidad: 0,
//           });
//         }
//         lineasMap.get(key).cantidad += vendidas;
//       }

//       const lineas = Array.from(lineasMap.values());
//       const totalFecha = lineas.reduce(
//         (acc, l) => acc + l.precio * l.cantidad,
//         0
//       );

//       return {
//         ...g,
//         lineas,
//         totalFecha,
//       };
//     });
//   }, [gruposPorFecha]);

//   const totalGlobal = useMemo(() => {
//     return gruposConLineas.reduce((acc, g) => acc + g.totalFecha, 0);
//   }, [gruposConLineas]);

//   // === abrir modal ===
//   const handleCancel = () => {
//     setShowModal(true);
//     setConfirmError('');
//   };

//   // === confirmar dentro del modal ===
//   const handleConfirmCancel = async () => {
//     if (!evento) {
//       setConfirmError('No se pudo obtener la información del evento.');
//       return;
//     }

//     try {
//       setConfirmLoading(true);
//       setConfirmError('');

//       // 1) armar payload igual que el evento, pero estado 5
//       const payload = {
//         idEvento: evento.idEvento,
//         idArtistas: (evento.artistas || []).map((a) => a.idArtista),
//         domicilio: evento.domicilio,
//         nombre: evento.nombre,
//         descripcion: evento.descripcion,
//         genero: evento.genero,
//         isAfter: evento.isAfter,
//         isLgbt: evento.isLgbt,
//         inicioEvento: evento.inicioEvento,
//         finEvento: evento.finEvento,
//         estado: 5,
//         fechas: (evento.fechas || []).map((f) => ({
//           idFecha: f.idFecha,
//           inicio: f.inicio,
//           fin: f.fin,
//           inicioVenta: f.inicioVenta,
//           finVenta: f.finVenta,
//           estado: 5,
//         })),
//         idFiesta: evento.idFiesta,
//         soundCloud: evento.soundCloud,
//       };

//       // 2) PUT primero
//       await api.put('/Evento/UpdateEvento', payload);

//       // 3) POST reembolso masivo
//       await api.post('/Pago/ReembolsoMasivo', null, {
//         params: { idEvento: eventoId },
//       });

//       setCancelSuccess(true);
//     } catch (e) {
//       console.error(e);
//       setConfirmError(
//         e?.response?.data?.message ||
//           'Ocurrió un error al cancelar el evento y/o reembolsar las entradas.'
//       );
//     } finally {
//       setConfirmLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     if (cancelSuccess) return;
//     setShowModal(false);
//   };

//   const handleSuccessAccept = () => {
//     navigate('/mis-eventos-creados');
//   };

//   // ====== RENDERS DE ESTADO ======
//   if (loading) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1">
//           <div className="sm:px-10 mb-11">
//             <NavBar />
//             <div className="container mx-auto px-4 py-10 flex items-center justify-center">
//               <div className="text-center">
//                 <span className="loading loading-spinner loading-lg mb-4" />
//                 <p className="text-gray-600">Cargando datos del evento...</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // no existe o no es dueño
//   if (noOwner || notFound) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1">
//           <div className="sm:px-10 mb-11">
//             <NavBar />
//             <div className="container mx-auto px-4 py-10">
//               <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
//               <p className="text-red-600 font-semibold mb-2">
//                 No puedes acceder a esta página. Solo puedes cancelar eventos de tu propiedad.
//               </p>
//               <p className="mb-6">
//                 Estabas intentando cancelar:{' '}
//                 <span className="font-bold">
//                   {evento?.nombre || nombreFromState || 'Evento desconocido'}
//                 </span>
//               </p>
//               <button
//                 className="btn btn-info"
//                 onClick={() => navigate('/mis-eventos-creados')}
//               >
//                 Volver a mis eventos
//               </button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // ⬅︎ nuevo: estado no permitido
//   if (invalidState) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1">
//           <div className="sm:px-10 mb-11">
//             <NavBar />
//             <div className="container mx-auto px-4 py-10">
//               <h1 className="text-2xl font-bold mb-4">No se puede cancelar este evento.</h1>
//               <p className="text-red-600 font-semibold mb-2">
//                 Solo puedes cancelar eventos que estén <strong>por aprobar </strong>,{' '}
//                 <strong>aprobados </strong> o <strong>en venta </strong>.
//               </p>
//               <p className="mb-6">
//                 Estabas intentando cancelar:{' '}
//                 <span className="font-bold">
//                   {evento?.nombre || nombreFromState || 'Evento desconocido'}
//                 </span>
//               </p>
//               <button
//                 className="btn btn-info"
//                 onClick={() => navigate('/mis-eventos-creados')}
//               >
//                 Volver a mis eventos
//               </button>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // ====== pantalla normal ======
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-1">
//         <div className="sm:px-10 mb-11">
//           <NavBar />
//           <div className="container mx-auto">
//             <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
//               Cancelación de evento:
//             </h1>

//             <div className="mb-4 px-4">
//               {error && (
//                 <div className="alert alert-error mb-4">
//                   <span>{error}</span>
//                 </div>
//               )}

//               <p className="font-semibold">
//                 Si cancelas este evento, a continuación debes informar el motivo. La cancelación del evento se le avisará vía mail a las personas que hayan comprado una entrada, junto con el motivo que describas, y se procederá a realizar la devolución del dinero de las entradas.
//               </p>

//               <p className="mt-4">
//                 <strong>Evento a cancelar:</strong>{' '}
//                 <span className="text-red-600 font-bold">
//                   {evento?.nombre || nombreFromState || '—'}
//                 </span>
//               </p>

//               {/* lista por fecha */}
//               {gruposConLineas.length === 0 ? (
//                 <p className="mt-4 text-gray-600">
//                   Este evento no tiene entradas vendidas hasta el momento.
//                 </p>
//               ) : (
//                 <div className="mt-6 space-y-6">
//                   {gruposConLineas.map((g) => {
//                     const fechaEvento = fechasById.get(g.idFecha);
//                     const tituloFecha =
//                       fechaEvento?.inicio
//                         ? formatFechaInicio(fechaEvento.inicio)
//                         : `Fecha ${g.numFecha}`;

//                     return (
//                       <div key={g.idFecha} className="border rounded-lg p-4">
//                         <h2 className="text-lg font-bold mb-3">
//                           Entradas a devolver de la fecha:{' '}
//                           <span className="text-purple-700">{tituloFecha}</span>
//                         </h2>

//                         {g.lineas.length === 0 ? (
//                           <p className="text-gray-500">
//                             Esta fecha no tiene entradas vendidas.
//                           </p>
//                         ) : (
//                           <ul className="list-disc list-inside space-y-1">
//                             {g.lineas.map((item, idx) => {
//                               const esUna = item.cantidad === 1;
//                               return (
//                                 <li key={idx} className="font-semibold">
//                                   {item.cantidad}{' '}
//                                   {esUna ? 'Entrada' : 'Entradas'} {item.tipo} de $
//                                   {item.precio.toLocaleString('es-AR')} c/u. -- Subtotal: $
//                                   {(item.cantidad * item.precio).toLocaleString('es-AR')}
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         )}

//                         <p className="mt-3 font-semibold">
//                           Total a devolver por esta fecha:{' '}
//                           <span className="text-red-600 text-lg">
//                             ${g.totalFecha.toLocaleString('es-AR')}
//                           </span>
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               <p className="mt-6">
//                 <strong>Total a devolver (todas las fechas):</strong>{' '}
//                 <span className="text-red-600 font-bold text-lg">
//                   ${totalGlobal.toLocaleString('es-AR')}
//                 </span>
//               </p>

//               <p className="mt-4">
//                 <strong>Motivo:</strong>
//               </p>
//               <textarea
//                 className="textarea textarea-bordered w-full h-40 mt-2"
//                 value={motivo}
//                 onChange={(e) => setMotivo(e.target.value)}
//                 placeholder="Ej.: El artista principal no podrá presentarse por motivos de salud..."
//               />

//               <p className="mt-2 text-red-600">
//                 * Esta operación no puede ser reversada.
//               </p>

//               <div className="mt-6 flex flex-wrap gap-3">
//                 <button
//                   className="btn btn-error"
//                   onClick={handleCancel}
//                   disabled={!motivo.trim()}
//                   title={!motivo.trim() ? 'Debes indicar un motivo' : ''}
//                 >
//                   Cancelar evento
//                 </button>
//                 <button
//                   className="btn btn-info"
//                   onClick={() => navigate('/mis-eventos-creados')}
//                 >
//                   Volver
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div
//             className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {!cancelSuccess ? (
//               <>
//                 <h2 className="text-xl font-bold mb-4 text-red-600">
//                   ¿Estás seguro de cancelar este evento?
//                 </h2>
//                 <p className="mb-3">
//                   Se devolverán todas las entradas que se hayan adquirido para este evento.
//                 </p>
//                 <p className="mb-3 text-red-500 font-semibold">
//                   Esta acción no se puede deshacer.
//                 </p>

//                 {confirmError && (
//                   <div className="alert alert-error mb-3">
//                     <span>{confirmError}</span>
//                   </div>
//                 )}

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     className="btn btn-ghost"
//                     onClick={handleCloseModal}
//                     disabled={confirmLoading}
//                   >
//                     Volver
//                   </button>
//                   <button
//                     className="btn btn-error"
//                     onClick={handleConfirmCancel}
//                     disabled={confirmLoading}
//                   >
//                     {confirmLoading ? (
//                       <>
//                         <span className="loading loading-spinner loading-sm mr-2" />
//                         Cancelando...
//                       </>
//                     ) : (
//                       'Sí, cancelar evento'
//                     )}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-xl font-bold mb-4 text-green-600">
//                   Evento cancelado
//                 </h2>
//                 <p className="mb-2">Las entradas serán reembolsadas a la brevedad.</p>
//                 <p className="mb-4 text-sm text-gray-600">
//                   El dinero se devuelve al mismo medio de pago de MercadoPago con el cual los
//                   clientes hayan realizado la compra, y lo verán reflejado dentro de los 7 días
//                   hábiles.
//                 </p>
//                 <div className="flex justify-end">
//                   <button className="btn btn-primary" onClick={handleSuccessAccept}>
//                     Aceptar
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CancelarEvento;
