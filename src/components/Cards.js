import React from 'react';
import Card from './Card';
import { useNavigate } from "react-router-dom";

export default function Cards({ eventos }) {
    const navigate = useNavigate();

    const esEventoFinalizado = (fecha) => {
        const fechaEvento = new Date(fecha.split('/').reverse().join('-'));
        const fechaActual = new Date();
        return fechaEvento < fechaActual;
    };

    const handleCardClick = (evento) => {
        navigate(`/evento/${evento.nombreEvento}`, { state: { evento } });
    };

    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {eventos.map(evento => {
                const eventoFinalizado = esEventoFinalizado(evento.fecha);
                return (
                    <Card key={evento.id}
                        nombre={evento.nombreEvento}
                        fecha={evento.fecha}
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

