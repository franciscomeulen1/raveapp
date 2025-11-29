// components/componentsVistaEvento/Resenias.js
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../componenteapi/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const Resenias = ({ idFiesta }) => {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [avg, setAvg] = useState({ avgEstrellas: 0, cantResenias: 0 });
    const [resenias, setResenias] = useState([]);
    const [order, setOrder] = useState('desc'); // 'desc' (default) o 'asc'
    const [openMenu, setOpenMenu] = useState(false);

    // 👇 mapa de avatares por idUsuario
    const [avatars, setAvatars] = useState({}); // { [idUsuario]: url }

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setErr('');

                const avgRes = await api.get(`/Resenia/GetAvgResenias`, {
                    params: { IdFiesta: idFiesta }
                });
                const avgData = avgRes?.data?.avgResenias?.[0] || { avgEstrellas: 0, cantResenias: 0 };

                const listRes = await api.get(`/Resenia/GetResenias`, {
                    params: { IdFiesta: idFiesta }
                });
                const list = Array.isArray(listRes?.data?.resenias) ? listRes.data.resenias : [];

                if (cancelled) return;

                // ✅ Si NO hay reseñas, dejamos estados por defecto y NO mostramos error
                if (!list || list.length === 0) {
                    setAvg({
                        avgEstrellas: 0,
                        cantResenias: 0,
                    });
                    setResenias([]);
                    setErr('');
                    return;
                }

                // ✅ Hay reseñas → seteamos todo normalmente
                setAvg({
                    avgEstrellas: Number(avgData.avgEstrellas || 0),
                    cantResenias: Number(avgData.cantResenias || list.length || 0),
                });
                setResenias(list);
            } catch (e) {
                if (cancelled) return;

                // ✅ Tratamos 404/204 como "sin reseñas" y NO como error
                const status = e?.response?.status;
                if (status === 404 || status === 204) {
                    setAvg({ avgEstrellas: 0, cantResenias: 0 });
                    setResenias([]);
                    setErr('');
                } else {
                    setErr('No se pudieron cargar las reseñas de la fiesta.');
                    console.error(e);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (idFiesta) fetchData();
        return () => { cancelled = true; };
    }, [idFiesta]);

    // Cargar avatares de los usuarios que dejaron reseñas
    useEffect(() => {
        if (!resenias || resenias.length === 0) {
            setAvatars({});
            return;
        }

        let cancelled = false;

        const fetchAvatars = async () => {
            try {
                const uniqueIds = Array.from(
                    new Set(
                        resenias
                            .map(r => r.idUsuario)
                            .filter(Boolean)
                    )
                );

                if (uniqueIds.length === 0) {
                    if (!cancelled) setAvatars({});
                    return;
                }

                const results = await Promise.all(
                    uniqueIds.map(async (idUsuario) => {
                        try {
                            const res = await api.get('/Media', {
                                params: { idEntidadMedia: idUsuario }
                            });

                            const mediaArr = res?.data?.media;
                            const url =
                                Array.isArray(mediaArr) && mediaArr.length > 0
                                    ? mediaArr[0].url
                                    : null;

                            return [idUsuario, url];
                        } catch (e) {
                            console.error('Error cargando avatar para usuario', idUsuario, e);
                            return [idUsuario, null];
                        }
                    })
                );

                if (!cancelled) {
                    const map = {};
                    for (const [idUsuario, url] of results) {
                        if (url) {
                            map[idUsuario] = url;
                        }
                    }
                    setAvatars(map);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error('Error en la carga de avatares', e);
                }
            }
        };

        fetchAvatars();

        return () => {
            cancelled = true;
        };
    }, [resenias]);

    const reseniasOrdenadas = useMemo(() => {
        const copiita = [...resenias];
        copiita.sort((a, b) => {
            const da = new Date(a.dtInsert).getTime();
            const db = new Date(b.dtInsert).getTime();
            return order === 'desc' ? db - da : da - db;
        });
        return copiita;
    }, [resenias, order]);

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

    const handlePickOrder = (value) => {
        setOrder(value);
        setOpenMenu(false);
    };

    if (loading) {
        return (
            <div className="p-4 flex items-center">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <span className="ml-3">Cargando reseñas…</span>
            </div>
        );
    }

    // ⚠️ Si hubo un error "real", mostramos el mensaje rojo
    if (err) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold underline underline-offset-8 mb-2">Reseñas de la fiesta</h2>
                <p className="text-error">{err}</p>
            </div>
        );
    }

    // ✅ Punto clave:
    // Si NO hay reseñas (lista vacía), NO renderizamos nada.
    if (!reseniasOrdenadas || reseniasOrdenadas.length === 0) {
        return null;
    }

    return (
        <div className="p-4">
            {/* Header responsive */}
            <div className="mb-4">
                {/* Fila 1: título */}
                <h2 className="text-xl font-bold underline underline-offset-8">
                    Reseñas de la fiesta
                </h2>

                {/* Fila 2: promedio + ordenar (misma fila incluso en mobile) */}
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    {/* Promedio (izquierda) */}
                    <div className="flex items-center min-w-0">
                        {renderAvgStars(avg.avgEstrellas)}
                        <span className="text-gray-600 ml-2">{avg.avgEstrellas.toFixed(1)}</span>
                        <span className="text-gray-500 ml-2">({avg.cantResenias} reseñas)</span>
                    </div>

                    {/* Dropdown Ordenar (derecha). Más chico en mobile */}
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
                                        onClick={() => handlePickOrder('desc')}
                                    >
                                        Más reciente → más antigua
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={order === 'asc' ? 'active' : ''}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handlePickOrder('asc')}
                                    >
                                        Más antigua → más reciente
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Listado */}
            {reseniasOrdenadas.map((r) => {
                const nombreCompleto = `${r.nombreUsuario ?? ''} ${r.apellidoUsuario ?? ''}`.trim() || 'Usuario';
                const fecha = new Date(r.dtInsert).toLocaleDateString('es-AR');

                const avatarUrl = avatars[r.idUsuario];

                return (
                    <div
                        key={r.idResenia}
                        className="border-b-2 border-gray-200 rounded-lg p-4 mb-4"
                    >
                        {/* Header de cada reseña */}
                        {/* Mobile (xs) */}
                        <div className="sm:hidden">
                            <div className="flex items-center gap-3">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={`Foto de perfil de ${nombreCompleto}`}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                                )}
                                <span className="text-sm font-bold break-words">{nombreCompleto}</span>
                            </div>

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

                        {/* Desktop / tablet (sm+) */}
                        <div className="hidden sm:grid sm:grid-cols-12 sm:items-center">
                            {/* Avatar + Nombre */}
                            <div className="flex items-center gap-3 sm:col-span-5">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={`Foto de perfil de ${nombreCompleto}`}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                                )}
                                <span className="sm:text-sm xl:text-base font-bold break-words">
                                    {nombreCompleto}
                                </span>
                            </div>

                            {/* Estrellas */}
                            <div className="flex items-center sm:justify-center sm:col-span-4">
                                {[...Array(5)].map((_, i) => (
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        key={i}
                                        className={`h-4 w-4 sm:h-5 sm:w-5 ${i < r.estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>

                            {/* Fecha */}
                            <span className="sm:text-sm xl:text-base text-gray-500 sm:text-right">
                                {fecha}
                            </span>
                        </div>

                        {/* Comentario */}
                        <p className="text-sm xl:text-base mt-2 whitespace-pre-line break-words">
                            {r.comentario}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default Resenias;


// // components/componentsVistaEvento/Resenias.js
// import React, { useEffect, useMemo, useState } from 'react';
// import api from '../../componenteapi/api';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

// const Resenias = ({ idFiesta }) => {
//     const [loading, setLoading] = useState(true);
//     const [err, setErr] = useState('');
//     const [avg, setAvg] = useState({ avgEstrellas: 0, cantResenias: 0 });
//     const [resenias, setResenias] = useState([]);
//     const [order, setOrder] = useState('desc'); // 'desc' (default) o 'asc'
//     const [openMenu, setOpenMenu] = useState(false);

//     // 👇 NUEVO: mapa de avatares por idUsuario
//     const [avatars, setAvatars] = useState({}); // { [idUsuario]: url }

//     useEffect(() => {
//         let cancelled = false;

//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 setErr('');

//                 const avgRes = await api.get(`/Resenia/GetAvgResenias`, {
//                     params: { IdFiesta: idFiesta }
//                 });
//                 const avgData = avgRes?.data?.avgResenias?.[0] || { avgEstrellas: 0, cantResenias: 0 };

//                 const listRes = await api.get(`/Resenia/GetResenias`, {
//                     params: { IdFiesta: idFiesta }
//                 });
//                 const list = Array.isArray(listRes?.data?.resenias) ? listRes.data.resenias : [];

//                 if (!cancelled) {
//                     setAvg({
//                         avgEstrellas: Number(avgData.avgEstrellas || 0),
//                         cantResenias: Number(avgData.cantResenias || 0),
//                     });
//                     setResenias(list);
//                 }
//             } catch (e) {
//                 if (!cancelled) setErr('No se pudieron cargar las reseñas de la fiesta.');
//                 console.error(e);
//             } finally {
//                 if (!cancelled) setLoading(false);
//             }
//         };

//         if (idFiesta) fetchData();
//         return () => { cancelled = true; };
//     }, [idFiesta]);

//     // 👇 NUEVO: cargar avatares de los usuarios que dejaron reseñas
//     useEffect(() => {
//         if (!resenias || resenias.length === 0) {
//             setAvatars({});
//             return;
//         }

//         let cancelled = false;

//         const fetchAvatars = async () => {
//             try {
//                 // ids únicos de usuarios con reseñas
//                 const uniqueIds = Array.from(
//                     new Set(
//                         resenias
//                             .map(r => r.idUsuario)
//                             .filter(Boolean)
//                     )
//                 );

//                 if (uniqueIds.length === 0) {
//                     if (!cancelled) setAvatars({});
//                     return;
//                 }

//                 const results = await Promise.all(
//                     uniqueIds.map(async (idUsuario) => {
//                         try {
//                             const res = await api.get('/Media', {
//                                 params: { idEntidadMedia: idUsuario }
//                             });

//                             const mediaArr = res?.data?.media;
//                             const url =
//                                 Array.isArray(mediaArr) && mediaArr.length > 0
//                                     ? mediaArr[0].url
//                                     : null;

//                             return [idUsuario, url];
//                         } catch (e) {
//                             console.error('Error cargando avatar para usuario', idUsuario, e);
//                             return [idUsuario, null];
//                         }
//                     })
//                 );

//                 if (!cancelled) {
//                     const map = {};
//                     for (const [idUsuario, url] of results) {
//                         if (url) {
//                             map[idUsuario] = url;
//                         }
//                     }
//                     setAvatars(map);
//                 }
//             } catch (e) {
//                 if (!cancelled) {
//                     console.error('Error en la carga de avatares', e);
//                 }
//             }
//         };

//         fetchAvatars();

//         return () => {
//             cancelled = true;
//         };
//     }, [resenias]);

//     const reseniasOrdenadas = useMemo(() => {
//         const copiita = [...resenias];
//         copiita.sort((a, b) => {
//             const da = new Date(a.dtInsert).getTime();
//             const db = new Date(b.dtInsert).getTime();
//             return order === 'desc' ? db - da : da - db;
//         });
//         return copiita;
//     }, [resenias, order]);

//     const renderAvgStars = (valor) => {
//         const full = Math.floor(valor);
//         const decimal = valor - full;
//         const icons = [];
//         for (let i = 0; i < full; i++) {
//             icons.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />);
//         }
//         if (decimal >= 0.5 && icons.length < 5) {
//             icons.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />);
//         }
//         while (icons.length < 5) {
//             icons.push(<FontAwesomeIcon key={`empty-${icons.length}`} icon={faStar} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />);
//         }
//         return icons;
//     };

//     const handlePickOrder = (value) => {
//         setOrder(value);
//         setOpenMenu(false);
//     };

//     if (loading) {
//         return (
//             <div className="p-4 flex items-center">
//                 <span className="loading loading-spinner loading-md text-primary"></span>
//                 <span className="ml-3">Cargando reseñas…</span>
//             </div>
//         );
//     }

//     if (err) {
//         return (
//             <div className="p-4">
//                 <h2 className="text-xl font-bold underline underline-offset-8 mb-2">Reseñas de la fiesta</h2>
//                 <p className="text-error">{err}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4">
//             {/* Header responsive */}
//             <div className="mb-4">
//                 {/* Fila 1: título */}
//                 <h2 className="text-xl font-bold underline underline-offset-8">
//                     Reseñas de la fiesta
//                 </h2>

//                 {/* Fila 2: promedio + ordenar (misma fila incluso en mobile) */}
//                 <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
//                     {/* Promedio (izquierda) */}
//                     <div className="flex items-center min-w-0">
//                         {renderAvgStars(avg.avgEstrellas)}
//                         <span className="text-gray-600 ml-2">{avg.avgEstrellas.toFixed(1)}</span>
//                         <span className="text-gray-500 ml-2">({avg.cantResenias} reseñas)</span>
//                     </div>

//                     {/* Dropdown Ordenar (derecha). Más chico en mobile */}
//                     <div className="dropdown dropdown-end shrink-0">
//                         <div
//                             tabIndex={0}
//                             role="button"
//                             className="btn btn-outline btn-xs sm:btn-sm"
//                             onClick={() => setOpenMenu((o) => !o)}
//                             onBlur={() => setOpenMenu(false)}
//                         >
//                             Ordenar
//                         </div>
//                         {openMenu && (
//                             <ul
//                                 tabIndex={0}
//                                 className="dropdown-content menu menu-sm p-2 shadow bg-base-100 rounded-box w-64 mt-2 z-[1]"
//                             >
//                                 <li>
//                                     <button
//                                         type="button"
//                                         className={order === 'desc' ? 'active' : ''}
//                                         onMouseDown={(e) => e.preventDefault()}
//                                         onClick={() => handlePickOrder('desc')}
//                                     >
//                                         Más reciente → más antigua
//                                     </button>
//                                 </li>
//                                 <li>
//                                     <button
//                                         type="button"
//                                         className={order === 'asc' ? 'active' : ''}
//                                         onMouseDown={(e) => e.preventDefault()}
//                                         onClick={() => handlePickOrder('asc')}
//                                     >
//                                         Más antigua → más reciente
//                                     </button>
//                                 </li>
//                             </ul>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Listado */}
//             {reseniasOrdenadas.length === 0 ? (
//                 <div className="p-4 border rounded-lg">
//                     <p className="text-gray-600">
//                         Aún no hay reseñas para esta fiesta. ¡Sé el primero en opinar luego de comprar una entrada y asistir al evento!
//                     </p>
//                 </div>
//             ) : (
//                 reseniasOrdenadas.map((r) => {
//                     const nombreCompleto = `${r.nombreUsuario ?? ''} ${r.apellidoUsuario ?? ''}`.trim() || 'Usuario';
//                     const fecha = new Date(r.dtInsert).toLocaleDateString('es-AR');

//                     // 👇 NUEVO: url del avatar para este usuario
//                     const avatarUrl = avatars[r.idUsuario];

//                     return (
//                         <div
//                             key={r.idResenia}
//                             className="border-b-2 border-gray-200 rounded-lg p-4 mb-4"
//                         >
//                             {/* Header de cada reseña */}
//                             {/* Mobile (xs) → avatar + nombre (1ra fila); estrellas izquierda + fecha derecha (2da fila) */}
//                             <div className="sm:hidden">
//                                 <div className="flex items-center gap-3">
//                                     {avatarUrl ? (
//                                         <img
//                                             src={avatarUrl}
//                                             alt={`Foto de perfil de ${nombreCompleto}`}
//                                             className="w-8 h-8 rounded-full object-cover flex-shrink-0"
//                                         />
//                                     ) : (
//                                         <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
//                                     )}
//                                     <span className="text-sm font-bold break-words">{nombreCompleto}</span>
//                                 </div>

//                                 <div className="mt-1 flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         {[...Array(5)].map((_, i) => (
//                                             <FontAwesomeIcon
//                                                 icon={faStar}
//                                                 key={i}
//                                                 className={`h-4 w-4 sm:h-5 sm:w-5 ${i < r.estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
//                                             />
//                                         ))}
//                                     </div>
//                                     <span className="text-sm text-gray-500">{fecha}</span>
//                                 </div>
//                             </div>

//                             {/* Desktop / tablet (sm+) → grilla con avatar + nombre en la primera columna */}
//                             <div className="hidden sm:grid sm:grid-cols-12 sm:items-center">
//                                 {/* Avatar + Nombre */}
//                                 <div className="flex items-center gap-3 sm:col-span-5">
//                                     {avatarUrl ? (
//                                         <img
//                                             src={avatarUrl}
//                                             alt={`Foto de perfil de ${nombreCompleto}`}
//                                             className="w-10 h-10 rounded-full object-cover flex-shrink-0"
//                                         />
//                                     ) : (
//                                         <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
//                                     )}
//                                     <span className="sm:text-sm xl:text-base font-bold break-words">
//                                         {nombreCompleto}
//                                     </span>
//                                 </div>

//                                 {/* Estrellas */}
//                                 <div className="flex items-center sm:justify-center sm:col-span-4">
//                                     {[...Array(5)].map((_, i) => (
//                                         <FontAwesomeIcon
//                                             icon={faStar}
//                                             key={i}
//                                             className={`h-4 w-4 sm:h-5 sm:w-5 ${i < r.estrellas ? 'text-yellow-500' : 'text-gray-300'}`}
//                                         />
//                                     ))}
//                                 </div>

//                                 {/* Fecha */}
//                                 <span className="sm:text-sm xl:text-base text-gray-500 sm:text-right">
//                                     {fecha}
//                                 </span>
//                             </div>

//                             {/* Comentario */}
//                             <p className="text-sm xl:text-base mt-2 whitespace-pre-line break-words">
//                                 {r.comentario}
//                             </p>
//                         </div>
//                     );
//                 })
//             )}
//         </div>
//     );
// };

// export default Resenias;