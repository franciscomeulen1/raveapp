import React from 'react';
import Card from './Card';
import { useNavigate } from "react-router-dom";

export default function Cards({ eventos }) {
    const navigate = useNavigate();

    // Se verifica si el evento está finalizado usando la fecha del último día
    const esEventoFinalizado = (evento) => {
        const dias = evento.dias;
        const ultimaFechaStr = dias[dias.length - 1].fecha;
        const fechaEvento = new Date(ultimaFechaStr.split('/').reverse().join('-'));
        const fechaActual = new Date();
        return fechaEvento < fechaActual;
    };

    // Obtiene una representación de la fecha:
    // Si es un día, muestra ese día; si es múltiple, muestra el rango.
    const obtenerFechaDisplay = (evento) => {
        if (evento.dias.length === 1) {
            return evento.dias[0].fecha;
        } else {
            const primeraFecha = evento.dias[0].fecha;
            const ultimaFecha = evento.dias[evento.dias.length - 1].fecha;
            return `${primeraFecha} - ${ultimaFecha}`;
        }
    };

    const handleCardClick = (evento) => {
        navigate(`/evento/${evento.nombreEvento}`, { state: { evento } });
    };

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {eventos.map(evento => {
                const eventoFinalizado = esEventoFinalizado(evento);
                const fechaDisplay = obtenerFechaDisplay(evento);
                return (
                    <Card key={evento.id}
                        nombre={evento.nombreEvento}
                        fecha={fechaDisplay}
                        generos={evento.generos}
                        lgbt={evento.lgbt}
                        after={evento.after}
                        onClick={() => handleCardClick(evento)}
                        eventoFinalizado={eventoFinalizado}
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

//     const esEventoFinalizado = (fecha) => {
//         const fechaEvento = new Date(fecha.split('/').reverse().join('-'));
//         const fechaActual = new Date();
//         return fechaEvento < fechaActual;
//     };

//     const handleCardClick = (evento) => {
//         navigate(`/evento/${evento.nombreEvento}`, { state: { evento } });
//     };

//     return (
//         <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
//             {eventos.map(evento => {
//                 const eventoFinalizado = esEventoFinalizado(evento.fecha);
//                 return (
//                     <Card key={evento.id}
//                         nombre={evento.nombreEvento}
//                         fecha={evento.fecha}
//                         generos={evento.generos}
//                         lgbt={evento.lgbt}
//                         after={evento.after}
//                         onClick={() => handleCardClick(evento)}
//                         eventoFinalizado={eventoFinalizado}
//                     />
//                 );
//             })}
//         </div>
//     );
// }

