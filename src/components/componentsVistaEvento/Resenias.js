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

                if (!cancelled) {
                    setAvg({
                        avgEstrellas: Number(avgData.avgEstrellas || 0),
                        cantResenias: Number(avgData.cantResenias || 0),
                    });
                    setResenias(list);
                }
            } catch (e) {
                if (!cancelled) setErr('No se pudieron cargar las reseñas de la fiesta.');
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (idFiesta) fetchData();
        return () => { cancelled = true; };
    }, [idFiesta]);

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

    if (err) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold underline underline-offset-8 mb-2">Reseñas de la fiesta</h2>
                <p className="text-error">{err}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header responsive */}
            {/* Header: título (fila 1) y, debajo, promedio + ordenar en la misma fila en todas las pantallas */}
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
            {reseniasOrdenadas.length === 0 ? (
                <div className="p-4 border rounded-lg">
                    <p className="text-gray-600">Aún no hay reseñas para esta fiesta. ¡Sé el primero en opinar luego de comprar una entrada y asistir al evento!</p>
                </div>
            ) : (
                reseniasOrdenadas.map((r) => {
                    const nombreCompleto = `${r.nombreUsuario ?? ''} ${r.apellidoUsuario ?? ''}`.trim() || 'Usuario';
                    const fecha = new Date(r.dtInsert).toLocaleDateString('es-AR');

                    return (
                        <div
                            key={r.idResenia}
                            className="border-b-2 border-gray-200 rounded-lg p-4 mb-4"
                        >
                            {/* Header de cada reseña */}
                            {/* Mobile (xs) → nombre en 1ra fila; estrellas izquierda + fecha derecha en 2da fila */}
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

                            {/* Desktop / tablet (sm+) → grilla como ya la tenías */}
                            <div className="hidden sm:grid sm:grid-cols-12 sm:items-center">
                                {/* Nombre */}
                                <span className="sm:text-sm xl:text-base font-bold break-words sm:col-span-5">{nombreCompleto}</span>

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
                                <span className="sm:text-sm xl:text-base text-gray-500 sm:text-right">{fecha}</span>

                            </div>


                            {/* Comentario */}
                            <p className="text-sm xl:text-base mt-2 whitespace-pre-line break-words">{r.comentario}</p>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Resenias;



// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos de estrella sólida y media desde FontAwesome

// const Resenias = () => {
//     const resenias = [
//         {
//             nombre: 'Carlos Menem',
//             calificacion: 4,
//             diasAtras: 3,
//             comentario: 'Excelente evento, me encantó la música y el ambiente.',
//         },
//         {
//             nombre: 'Teté Coustarot',
//             calificacion: 3,
//             diasAtras: 5,
//             comentario: '¡Increíble experiencia! Sin duda volvería a asistir.',
//         },
//         // Agrega más reseñas según necesites
//     ];

//     // Calcula el promedio de las calificaciones
//     const promedioCalificaciones = resenias.reduce((total, resenia) => total + resenia.calificacion, 0) / resenias.length;

//     // Obtiene la parte entera y decimal del promedio
//     const parteEntera = Math.floor(promedioCalificaciones);
//     const parteDecimal = promedioCalificaciones - parteEntera;

//     // Crea un arreglo con el número de estrellas completas
//     const estrellasCompletas = Array(parteEntera).fill(faStar);

//     // Si hay parte decimal, agrega una estrella media
//     if (parteDecimal > 0) {
//         estrellasCompletas.push(faStarHalfAlt);
//     }

//     return (
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-4 gap-x-1">
//                 <h2 className="text-xl font-bold underline underline-offset-8">Reseñas del evento</h2>
//                 <div className="flex items-center">
//                     <div className="flex items-center">
//                         {/* Mostrar las estrellas del promedio */}
//                         {estrellasCompletas.map((icon, index) => (
//                             <FontAwesomeIcon
//                                 icon={icon}
//                                 key={index}
//                                 className={`h-5 w-5 text-yellow-500`}
//                             />
//                         ))}
//                     </div>
//                     <span className="text-gray-500 ml-2">{promedioCalificaciones.toFixed(1)}</span>
//                     <span className="text-gray-500 ml-2">({resenias.length} reseñas)</span>
//                 </div>
//             </div>
//             {resenias.map((resenia, index) => (
//                 <div key={index} className="border-b-2 border-gray-400 rounded-lg p-4 mb-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <span className="font-bold">{resenia.nombre}</span>
//                         <div className="flex items-center">
//                             {/* Mostrar las estrellas */}
//                             {[...Array(5)].map((_, i) => (
//                                 <FontAwesomeIcon
//                                     icon={faStar}
//                                     key={i}
//                                     className={`h-5 w-5 ${i < resenia.calificacion ? 'text-yellow-500' : 'text-gray-300'
//                                         }`}
//                                 />
//                             ))}
//                         </div>
//                         <span className="text-gray-500">{resenia.diasAtras} días atrás</span>
//                     </div>
//                     <p>{resenia.comentario}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Resenias;


