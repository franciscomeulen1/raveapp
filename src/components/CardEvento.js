import '../estilos.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as whiteHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as redHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../componenteapi/api';

export default function CardEvento(props) {
    const [isLiked, setIsLiked] = useState(props.isFavorito);

    const handleLikeClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            await api.put('/Usuario/EventoFavorito', {
                idUsuario: props.user.id,
                idEvento: props.id,
            });

            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            alert('Ocurrió un error al intentar guardar tu favorito.');
        }
    };

    const imagenEvento =
        props.eventoCompleto?.imagen ||
        'https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg';

    return (
        <Link
            to={`/evento/${props.id}`}
            state={{ evento: props.eventoCompleto }}
            className="
                inline-flex
                cursor-pointer
                p-5
                mx-auto
                max-w-[400px] sm:max-w-[420px] md:max-w-[440px]
                w-full
            "
        >
            <div className="card w-full shadow-xl rounded-xl overflow-hidden">
                {/* Imagen arriba */}

                <div
                    className="
                              w-full
                              max-w-md
                              aspect-[1.4]
                              bg-gray-100
                              overflow-hidden
                              flex items-center justify-center
                            "
                >
                    <img
                        src={imagenEvento}
                        alt="Evento"
                        className="
                               block
                               w-full h-full
                               object-cover object-center
                             "
                        width={448}
                        height={320}
                    />
                </div>


                {/* Cuerpo de la card */}
                <div className="card-body p-5">
                    {/* Título + fecha */}
                    <h2 className="card-title text-base 2xl:text-lg font-bold break-words">
                        {props.nombre}
                    </h2>
                    <p className="text-sm">{props.fecha}</p>

                    {/* Corazón izq + tags der, en la misma "línea visual" */}
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex items-start justify-between gap-3 w-full">
                            {/* Corazón abajo izquierda */}
                            <div className="shrink-0">
                                {props.user && (
                                    <button
                                        onClick={handleLikeClick}
                                        className="shrink-0"
                                        aria-label="Marcar como favorito"
                                    >
                                        <FontAwesomeIcon
                                            icon={isLiked ? redHeart : whiteHeart}
                                            size="lg"
                                            className={`heart ${isLiked ? 'liked' : ''}`}
                                        />
                                    </button>
                                )}
                            </div>

                            {/* Tags a la derecha */}
                            <div className="flex flex-col gap-2 items-end text-right">
                                {/* Fila géneros */}
                                <div className="flex flex-wrap justify-end gap-2">
                                    {Array.isArray(props.generos) ? (
                                        props.generos.map((g, index) => (
                                            <div
                                                key={index}
                                                className="badge badge-outline rounded-lg font-semibold text-white bg-black"
                                            >
                                                {g}
                                            </div>
                                        ))
                                    ) : props.generos ? (
                                        <div className="badge badge-outline rounded-lg font-semibold text-white bg-black">
                                            {props.generos}
                                        </div>
                                    ) : null}
                                </div>

                                {/* Fila especiales */}
                                {(props.lgbt || props.after) && (
                                    <div className="flex flex-wrap justify-end gap-2">
                                        {props.lgbt && (
                                            <div className="badge badge-outline px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 via-green-500 to-purple-500">
                                                LGBT
                                            </div>
                                        )}

                                        {props.after && (
                                            <div className="badge badge-outline px-4 py-2 rounded-lg font-semibold text-white bg-pink-800">
                                                After
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}