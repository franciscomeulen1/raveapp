import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos de estrella sólida y media desde FontAwesome

const Resenias = () => {
    const resenias = [
        {
            nombre: 'Usuario 1',
            calificacion: 4,
            diasAtras: 3,
            comentario: 'Excelente evento, me encantó la música y el ambiente.',
        },
        {
            nombre: 'Usuario 2',
            calificacion: 3,
            diasAtras: 5,
            comentario: '¡Increíble experiencia! Sin duda volvería a asistir.',
        },
        // Agrega más reseñas según necesites
    ];

    // Calcula el promedio de las calificaciones
    const promedioCalificaciones = resenias.reduce((total, resenia) => total + resenia.calificacion, 0) / resenias.length;

    // Obtiene la parte entera y decimal del promedio
    const parteEntera = Math.floor(promedioCalificaciones);
    const parteDecimal = promedioCalificaciones - parteEntera;

    // Crea un arreglo con el número de estrellas completas
    const estrellasCompletas = Array(parteEntera).fill(faStar);

    // Si hay parte decimal, agrega una estrella media
    if (parteDecimal > 0) {
        estrellasCompletas.push(faStarHalfAlt);
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold underline underline-offset-8">Reseñas del evento</h2>
                <div className="flex items-center">
                    <div className="flex items-center">
                        {/* Mostrar las estrellas del promedio */}
                        {estrellasCompletas.map((icon, index) => (
                            <FontAwesomeIcon
                                icon={icon}
                                key={index}
                                className={`h-5 w-5 text-yellow-500`}
                            />
                        ))}
                    </div>
                    <span className="text-gray-500 ml-2">{promedioCalificaciones.toFixed(1)}</span>
                    <span className="text-gray-500 ml-2">({resenias.length} reseñas)</span>
                </div>
            </div>
            {resenias.map((resenia, index) => (
                <div key={index} className="border-b-2 border-gray-400 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{resenia.nombre}</span>
                        <div className="flex items-center">
                            {/* Mostrar las estrellas */}
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon
                                    icon={faStar}
                                    key={i}
                                    className={`h-5 w-5 ${i < resenia.calificacion ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-500">{resenia.diasAtras} días atrás</span>
                    </div>
                    <p>{resenia.comentario}</p>
                </div>
            ))}
        </div>
    );
};

export default Resenias;


