// src/vistas/ReseniasDeLaFiesta.jsx
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

export default function ReseniasDeLaFiesta() {
  const { id } = useParams(); // idFiesta
  const navigate = useNavigate();
  const location = useLocation();
  const { user: loggedUser } = useContext(AuthContext);

  const [nombreFiesta, setNombreFiesta] = useState(location.state?.nombreFiesta || '');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Estados de validación
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  // Datos
  const [avg, setAvg] = useState({ avgEstrellas: 0, cantResenias: 0 });
  const [resenias, setResenias] = useState([]);

  // UI
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('desc'); // 'desc' (más reciente primero) o 'asc'
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        if (!id || !loggedUser?.id) {
          setErr('Parámetros inválidos.');
          setLoading(false);
          return;
        }

        setLoading(true);
        setErr('');
        setNotFound(false);
        setNotOwner(false);

        // 1) Validar que la fiesta exista y sea del usuario
        const fiestaRes = await api.get('/Fiesta/GetFiestas', { params: { IdFiesta: id } });
        const fiesta = Array.isArray(fiestaRes?.data?.fiestas) ? fiestaRes.data.fiestas[0] : null;

        if (!fiesta) {
          if (!cancelled) setNotFound(true);
          return;
        }

        if (fiesta.idUsuario !== loggedUser.id) {
          if (!cancelled) setNotOwner(true);
          // Si prefieres redirigir directamente:
          // navigate('/misfiestasrecurrentes', { replace: true });
          return;
        }

        if (!cancelled) setNombreFiesta(fiesta.dsNombre || '');

        // 2) Promedio (manejar 404/204 como "sin reseñas")
        let avgData = { avgEstrellas: 0, cantResenias: 0 };
        try {
          const avgRes = await api.get('/Resenia/GetAvgResenias', { params: { IdFiesta: id } });
          avgData = avgRes?.data?.avgResenias?.[0] || avgData;
        } catch (e) {
          if (e.response?.status === 404 || e.response?.status === 204) {
            avgData = { avgEstrellas: 0, cantResenias: 0 };
          } else {
            throw e;
          }
        }

        // 3) Listado (manejar 404 como "sin reseñas")
        let list = [];
        try {
          const listRes = await api.get('/Resenia/GetResenias', { params: { IdFiesta: id } });
          list = Array.isArray(listRes?.data?.resenias) ? listRes.data.resenias : [];
        } catch (e) {
          if (e.response?.status === 404) {
            console.info('La fiesta aún no tiene reseñas');
            list = [];
          } else {
            throw e;
          }
        }

        if (!cancelled) {
          setAvg({
            avgEstrellas: Number(avgData.avgEstrellas || 0),
            cantResenias: Number(avgData.cantResenias || 0),
          });
          setResenias(list);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setErr('No se pudieron cargar las reseñas de la fiesta.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [id, loggedUser?.id, navigate]);

  const renderAvgStars = (valor) => {
    const full = Math.floor(valor);
    const decimal = valor - full;
    const icons = [];
    for (let i = 0; i < full; i++) {
      icons.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />);
    }
    if (decimal >= 0.5 && icons.length < 5) {
      icons.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />);
    }
    while (icons.length < 5) {
      icons.push(<FontAwesomeIcon key={`empty-${icons.length}`} icon={faStar} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />);
    }
    return icons;
  };

  const reseniasFiltradasYOrdenadas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtradas = resenias.filter((r) => {
      const nombreCompleto = `${r.nombreUsuario ?? ''} ${r.apellidoUsuario ?? ''}`.trim().toLowerCase();
      const comentario = (r.comentario ?? '').toLowerCase();
      if (!term) return true;
      return nombreCompleto.includes(term) || comentario.includes(term);
    });
    filtradas.sort((a, b) => {
      const da = new Date(a.dtInsert).getTime();
      const db = new Date(b.dtInsert).getTime();
      return order === 'desc' ? db - da : da - db;
    });
    return filtradas;
  }, [resenias, searchTerm, order]);

  const noHayResenias = resenias.length === 0 && searchTerm.trim() === '';

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen sm:px-10">
        <NavBar />
        <div className="flex-grow sm:px-10 mb-11 px-10 py-8">
          <div className="p-4 flex items-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <span className="ml-3">Cargando reseñas…</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mensajes de validación
  const GuardRail = () => (
    <div className="px-10 py-8">
      <h1 className="mb-2 mt-2 text-3xl font-bold">
        Calificaciones de <span className="italic">'{nombreFiesta || 'Fiesta'}'</span>
      </h1>

      {notFound && (
        <div className="alert alert-warning mt-4">
          <span>⚠️ No existe fiesta asociada al id ingresado.</span>
        </div>
      )}

      {notOwner && (
        <div className="alert alert-error mt-4">
          <span>🚫 No puedes ver el listado completo de reseñas de una fiesta que no es de tu propiedad.</span>
        </div>
      )}

      <Link to="/misfiestasrecurrentes" className="btn btn-primary mt-6">Ir a Mis Fiestas Recurrentes</Link>
    </div>
  );

  if (notFound || notOwner) {
    return (
      <div className="flex flex-col min-h-screen sm:px-10">
        <NavBar />
        <div className="flex-grow sm:px-10 mb-11">
          <GuardRail />
        </div>
        <Footer />
      </div>
    );
  }

  // Error genérico
  if (err) {
    return (
      <div className="flex flex-col min-h-screen sm:px-10">
        <NavBar />
        <div className="flex-grow sm:px-10 mb-11 px-10 py-8">
          <h1 className="mb-2 mt-2 text-3xl font-bold">
            Calificaciones de <span className="italic">'{nombreFiesta || 'Fiesta'}'</span>
          </h1>
          <p className="text-error mt-2">{err}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Vista OK
  return (
    <div className="flex flex-col min-h-screen sm:px-10">
      <NavBar />

      <div className="flex-grow sm:px-10 mb-11 flex justify-start">
        <div className="px-10 w-full xl:w-3/4">
          {/* Título */}
          <h1 className="mb-2 md:mb-5 mt-2 text-lg sm:text-xl lg: lg:text-2xl xl:text-3xl font-bold">
            Calificaciones de <span className="italic">'{nombreFiesta || 'Fiesta'}'</span>
          </h1>

          {/* Promedio + controles */}
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center min-w-0">
              {renderAvgStars(avg.avgEstrellas)}
              <span className="text-gray-600 ml-2">{avg.avgEstrellas.toFixed(1)}</span>
              <span className="text-gray-500 ml-2">({avg.cantResenias} reseñas)</span>
            </div>

            <input
              type="text"
              className="input input-bordered w-full max-w-xs h-8"
              placeholder="Buscar reseñas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="dropdown dropdown-end shrink-0">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline btn-xs sm:btn-sm"
                onClick={() => setOpenMenu((o) => !o)}
                onBlur={() => setOpenMenu(false)}
              >
                Ordenar
              </div>
              {openMenu && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm p-2 shadow bg-base-100 rounded-box w-64 mt-2 z-[1]"
                >
                  <li>
                    <button
                      type="button"
                      className={order === 'desc' ? 'active' : ''}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {setOrder('desc'); setOpenMenu(false);}}>
                      Más reciente → más antigua
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={order === 'asc' ? 'active' : ''}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {setOrder('asc'); setOpenMenu(false);}}
                    >
                      Más antigua → más reciente
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Listado */}
          <div className="mt-6">
            {noHayResenias ? (
              <div className="p-4 border rounded-lg">
                <p className="text-gray-600">
                  Aún no hay reseñas para esta fiesta.
                </p>
              </div>
            ) : reseniasFiltradasYOrdenadas.length === 0 ? (
              <div className="p-4 border rounded-lg">
                <p className="text-gray-600">
                  No hay reseñas que coincidan con tu búsqueda.
                </p>
              </div>
            ) : (
              reseniasFiltradasYOrdenadas.map((r) => {
                const nombreCompleto = `${r.nombreUsuario ?? ''} ${r.apellidoUsuario ?? ''}`.trim() || 'Usuario';
                const fecha = new Date(r.dtInsert).toLocaleDateString('es-AR');
                return (
                  <div key={r.idResenia} className="border-b-2 border-gray-200 rounded-lg p-4 mb-4">
                    {/* Mobile */}
                    <div className="sm:hidden">
                      <span className="text-sm font-bold break-words">{nombreCompleto}</span>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              icon={faStar}
                              key={i}
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${i < r.estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{fecha}</span>
                      </div>
                    </div>

                    {/* Desktop / tablet */}
                    <div className="hidden sm:grid sm:grid-cols-12 sm:items-center">
                      <span className="sm:text-sm xl:text-base font-bold break-words sm:col-span-5">
                        {nombreCompleto}
                      </span>
                      <div className="flex items-center sm:justify-center sm:col-span-4">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            icon={faStar}
                            key={i}
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${i < r.estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="sm:text-sm xl:text-base text-gray-500 sm:text-right">
                        {fecha}
                      </span>
                    </div>

                    {/* Comentario */}
                    <p className="text-sm xl:text-base mt-2 whitespace-pre-line break-words">{r.comentario}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
