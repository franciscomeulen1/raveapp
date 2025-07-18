import React from 'react';
import CardEvento from './CardEvento';

export default function CardsEventos({ eventos, user }) {
    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {eventos.map(evento => {
                const fechaDisplay = evento.dias.length === 1
                    ? evento.dias[0].fecha
                    : `${evento.dias[0].fecha} - ${evento.dias[evento.dias.length - 1].fecha}`;

                return (
                    <CardEvento
                        key={evento.id}
                        id={evento.id}
                        nombre={evento.nombreEvento}
                        fecha={fechaDisplay}
                        generos={evento.generos}
                        lgbt={evento.lgbt}
                        after={evento.after}
                        isFavorito={evento.isFavorito}
                        eventoCompleto={evento} // si querés pasar todo el objeto
                        user={user}
                    />
                );
            })}
        </div>
    );
}


// import React from 'react';
// import Card from './Card';
// import { useNavigate } from "react-router-dom";

// export default function Cards({ eventos }) {
//     const navigate = useNavigate();

//     // Obtiene una representación de la fecha:
//     // Si es un día, muestra ese día; si es múltiple, muestra el rango.
//     const obtenerFechaDisplay = (evento) => {
//         if (evento.dias.length === 1) {
//             return evento.dias[0].fecha;
//         } else {
//             const primeraFecha = evento.dias[0].fecha;
//             const ultimaFecha = evento.dias[evento.dias.length - 1].fecha;
//             return `${primeraFecha} - ${ultimaFecha}`;
//         }
//     };

//     const handleCardClick = (evento) => {
//         navigate(`/evento/${evento.id}`, { state: { evento } });
//     };

//     return (
//         <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
//             {eventos.map(evento => {
//                 const fechaDisplay = obtenerFechaDisplay(evento);
//                 return (
//                     <Card key={evento.id}
//                         nombre={evento.nombreEvento}
//                         fecha={fechaDisplay}
//                         generos={evento.generos}
//                         lgbt={evento.lgbt}
//                         after={evento.after}
//                         onClick={() => handleCardClick(evento)}
//                     />
//                 );
//             })}
//         </div>
//     );
// }