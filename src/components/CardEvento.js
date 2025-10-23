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
        event.preventDefault(); // evitar que el clic navegue
        event.stopPropagation(); // evitar burbuja

        try {
            await api.put('/Usuario/EventoFavorito', {
                idUsuario: props.user.id,
                idEvento: props.id
            });

            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            alert('Ocurrió un error al intentar guardar tu favorito.');
        }
    };


    return (
        <Link
            to={`/evento/${props.id}`}
            state={{ evento: props.eventoCompleto }} // Puedes ajustar según cómo lo uses
            className="p-5 inline-flex relative cursor-pointer"
        >
            {/* <div className="card w-96 bg-base-100 shadow-xl"> */}
            <div className="card w-full bg-base-100 shadow-xl">
                <div className="image-container">
                    <figure>
                        <img
                            src={props.eventoCompleto?.imagen || "https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg"}
                            alt="Evento"
                        />
                    </figure>
                </div>
                <div className="card-body p-5">
                    <h2 className="card-title text-base 2xl:text-lg font-bold">{props.nombre}</h2>
                    <p className="text-sm">{props.fecha}</p>
                    <div className="card-actions justify-end flex-wrap gap-1">
                        {props.user && (
                            <button onClick={handleLikeClick}>
                                <FontAwesomeIcon
                                    icon={isLiked ? redHeart : whiteHeart}
                                    size="lg"
                                    className={`heart ${isLiked ? 'liked' : ''}`}
                                />
                            </button>
                        )}
                        {Array.isArray(props.generos) ? (
                            props.generos.map((g, index) => (
                                <div
                                    key={index}
                                    className="badge badge-outline rounded-lg font-semibold text-white bg-black"
                                >
                                    {g}
                                </div>
                            ))
                        ) : (
                            <div className="badge badge-outline rounded-lg font-semibold text-white bg-black">
                                {props.generos}
                            </div>
                        )}
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
                </div>
            </div>
        </Link>
    );
}