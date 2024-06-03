import '../estilos.css';
import '../index.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as whiteHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as redHeart } from '@fortawesome/free-solid-svg-icons';

export default function Card(props) {
    const [isLiked, setIsLiked] = useState(false);

    const handleLikeClick = (event) => {
        event.stopPropagation(); // Evitar la propagación del evento de clic
        setIsLiked(!isLiked);
    };

    return (
        <div className="p-5 inline-flex relative cursor-pointer">
            <div className="card w-96 bg-base-100 shadow-xl" onClick={props.onClick}>
                <div className={`image-container ${props.eventoFinalizado ? 'evento-finalizado' : ''}`}>
                    <figure><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Evento" /></figure>
                </div>
                <div className="card-body">
                    <h2 className="card-title">
                        {props.nombre}
                    </h2>
                    <p>{props.fecha}</p>
                    {props.eventoFinalizado && (
                        <p className="text-red-500 font-bold">Evento finalizado</p>
                    )}
                    <div className="card-actions justify-end">
                        <button onClick={handleLikeClick}>
                            <FontAwesomeIcon icon={isLiked ? redHeart : whiteHeart} size="lg" className={`heart ${isLiked ? 'liked' : ''}`} />
                        </button>
                        {Array.isArray(props.generos) ? (
                            props.generos.map((g, index) => {
                                return <div key={index} className="badge badge-outline rounded-lg font-semibold text-white bg-black">{g}</div>
                            })
                        ) : (
                            <div className="badge badge-outline rounded-lg font-semibold text-white bg-black">{props.generos}</div>
                        )}
                        {props.lgbt === true && (
                            <div className="badge badge-outline px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 via-green-500 to-purple-500">LGBT</div>
                        )}
                        {props.after === true && (
                            <div className="badge badge-outline px-4 py-2 rounded-lg font-semibold text-white bg-pink-800 ">After</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}





// Componente hardcodeado

// <div className="p-5 inline-flex">
//     <Link className="card w-96 bg-base-100 shadow-xl" to='/evento'>
//         <figure><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Joda" /></figure>
//         <div className="card-body">
//             <h2 className="card-title">
//                 Nombre del Evento
//                 <div className="badge badge-secondary">NEW</div>
//             </h2>
//             <p >{props.fecha}</p>
//             <div className="card-actions justify-end">
//                 <div className="badge badge-outline">Techno</div>
//                 <div className="badge badge-outline">LGBT</div>
//             </div>
//         </div>
//     </Link>
// </div>