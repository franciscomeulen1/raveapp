// src/vistas/ReporteDeMisVentas.js
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { FaSearch, FaTimes, FaChevronDown, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

// 👉 Solo estados permitidos para reporte (sin cancelados)
const ESTADOS_REPORTABLES = [2, 3, 4];

const MAP_ESTADOS = {
  2: 'En venta',
  3: 'Venta finalizada',
  4: 'Finalizado',
};

export default function ReporteDeMisVentas() {
  const { user } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(2); // por defecto: En Venta
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef(null);

  const organizadorId = user?.id; // ✅ id del usuario logueado

  // cierra el dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMinFechaInicio = (fechas = []) => {
    const ts = fechas
      .map((f) => (f?.inicio ? new Date(f.inicio).getTime() : null))
      .filter((n) => typeof n === 'number');
    return ts.length ? new Date(Math.min(...ts)) : null;
  };

  const getMaxFechaInicio = (fechas = []) => {
    const ts = fechas
      .map((f) => (f?.inicio ? new Date(f.inicio).getTime() : null))
      .filter((n) => typeof n === 'number');
    return ts.length ? new Date(Math.max(...ts)) : null;
  };

  // para los que están "En venta": ordenar por fecha más cercana a hoy
  const getSortKeyVenta = (fechas = []) => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    const futureTs = fechas
      .map((f) => (f?.inicio ? new Date(f.inicio).getTime() : null))
      .filter((n) => typeof n === 'number' && n >= startOfToday)
      .sort((a, b) => a - b);

    if (futureTs.length) return futureTs[0];

    const allTs = fechas
      .map((f) => (f?.inicio ? new Date(f.inicio).getTime() : null))
      .filter((n) => typeof n === 'number');

    if (!allTs.length) return null;

    const nowMs = now.getTime();
    return allTs.reduce((best, ts) =>
      Math.abs(ts - nowMs) < Math.abs(best - nowMs) ? ts : best
    );
  };

  const fetchEventos = useCallback(async () => {
    if (!organizadorId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // pedimos solo los estados reportables (2,3,4) del organizador
      const peticiones = ESTADOS_REPORTABLES.map((st) =>
        api.get(`/Evento/GetEventos?Estado=${st}&IdUsuarioOrg=${organizadorId}`)
      );
      const respuestas = await Promise.allSettled(peticiones);

      const todos = respuestas
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value.data?.eventos || [])
        .filter((ev) =>
          ESTADOS_REPORTABLES.includes(
            ev?.estado?.cdEstado ?? ev?.cdEstado ?? -1
          )
        );

      // evitar duplicados
      const mapa = new Map();
      todos.forEach((ev) => mapa.set(ev.idEvento, ev));
      const eventosUnicos = Array.from(mapa.values());

      // completar con imagen y fechas procesadas
      const eventosConInfo = await Promise.all(
        eventosUnicos.map(async (evento) => {
          let imagen = null;
          try {
            const m = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
            const media = m.data?.media || [];
            const img = media.find((mm) => mm.url && mm.url !== '');
            imagen = img?.url || null;
          } catch (err) {
            console.error('Error al obtener imagen:', err);
          }

          return {
            ...evento,
            imagen,
            cdEstado: evento?.estado?.cdEstado ?? evento?.cdEstado ?? null,
            _minFechaInicio: getMinFechaInicio(evento?.fechas),
            _maxFechaInicio: getMaxFechaInicio(evento?.fechas),
          };
        })
      );

      setEventos(eventosConInfo);
    } catch (err) {
      console.error('Error al obtener mis eventos reportables:', err);
    } finally {
      setIsLoading(false);
    }
  }, [organizadorId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetchEventos();
  }, [fetchEventos]);

  const eventosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    let lista = eventos
      .filter((ev) => ev.cdEstado === estadoSeleccionado)
      .filter((ev) => {
        if (texto === '') return true;
        return (ev?.nombre || '').toLowerCase().includes(texto);
      });

    // orden según estado
    if (estadoSeleccionado === 2) {
      // en venta -> más cerca a hoy primero
      lista = [...lista].sort((a, b) => {
        const aKey = getSortKeyVenta(a?.fechas) ?? Infinity;
        const bKey = getSortKeyVenta(b?.fechas) ?? Infinity;
        const now = Date.now();
        const aDiff = Math.abs(aKey - now);
        const bDiff = Math.abs(bKey - now);
        return aDiff - bDiff;
      });
    } else {
      // resto -> más reciente primero
      lista = [...lista].sort((a, b) => {
        const aMS = a._maxFechaInicio ? a._maxFechaInicio.getTime() : 0;
        const bMS = b._maxFechaInicio ? b._maxFechaInicio.getTime() : 0;
        return bMS - aMS;
      });
    }

    return lista;
  }, [eventos, estadoSeleccionado, busqueda]);

  const handleElegirEstado = (cd) => {
    setEstadoSeleccionado(cd);
    setAbierto(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          <main className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold underline underline-offset-8 mb-6">
              Reporte de mis ventas
            </h1>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Dropdown estados */}
              <div ref={dropdownRef} className="relative w-full sm:w-auto">
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto justify-between"
                  onClick={() => setAbierto((v) => !v)}
                >
                  <span className="font-semibold">
                    {`Filtrar: ${MAP_ESTADOS[estadoSeleccionado]}`}
                  </span>
                  <FaChevronDown
                    className={`ml-2 transition-transform ${
                      abierto ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {abierto && (
                  <ul className="menu bg-base-100 rounded-box shadow-lg absolute z-10 mt-2 w-full sm:w-64">
                    {ESTADOS_REPORTABLES.map((cd) => (
                      <li key={cd}>
                        <button
                          className="flex items-center justify-between"
                          onClick={() => handleElegirEstado(cd)}
                        >
                          <span>{MAP_ESTADOS[cd]}</span>
                          {estadoSeleccionado === cd && (
                            <FaCheckCircle className="opacity-70" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Buscador */}
              <div className="relative w-full sm:w-1/2">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre del evento..."
                  className="input input-bordered w-full pl-10 pr-10"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setBusqueda('')}
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Contenido */}
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando tus eventos...</p>
                </div>
              </div>
            ) : !organizadorId ? (
              <p className="text-center text-red-500 mt-10">
                No se pudo obtener el usuario organizador (user.id). Revisá tu
                AuthContext.
              </p>
            ) : eventosFiltrados.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No se encontraron eventos para “{MAP_ESTADOS[estadoSeleccionado]}”
                {busqueda ? ` con la búsqueda “${busqueda}”` : ''}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div
                    key={evento.idEvento}
                    className="bg-white shadow-md rounded-xl flex flex-col overflow-hidden"
                  >
                    {evento.imagen ? (
                      <div
                        className="
                          w-full
                          max-w-md
                          aspect-[1.4]
                          bg-gray-100
                          rounded-xl
                          overflow-hidden
                          flex items-center justify-center
                        "
                      >
                        <img
                          src={evento.imagen}
                          alt={`Imagen del evento ${evento.nombre}`}
                          className="
                            block
                            w-full h-full
                            object-cover object-center
                            rounded-xl
                          "
                          width={448}
                          height={320}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full pt-[56.25%] bg-gray-300">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                          Sin imagen
                        </div>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-lg md:text-xl font-semibold">
                            {evento.nombre}
                          </h2>
                          <span className="badge badge-outline whitespace-nowrap">
                            {MAP_ESTADOS[evento.cdEstado] || '—'}
                          </span>
                        </div>

                        <p className="text-sm mt-2">
                          <strong>Fecha(s):</strong>{' '}
                          {Array.isArray(evento.fechas) &&
                          evento.fechas.length > 0
                            ? evento.fechas
                                .map((f) =>
                                  f?.inicio
                                    ? new Date(f.inicio).toLocaleDateString()
                                    : ''
                                )
                                .filter(Boolean)
                                .join(', ')
                            : '—'}
                        </p>
                      </div>

                      <Link
                        to={`/entradas-vendidas/${evento.idEvento}`}
                        className="btn bg-fuchsia-600 hover:bg-fuchsia-700 border-fuchsia-600 text-white text-center"
                      >
                        Ver reporte de ventas
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}