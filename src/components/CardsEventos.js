import React from 'react';
import CardEvento from './CardEvento';

export default function CardsEventos({ eventos, user }) {
    return (
        <div
            className="
                grid 
                gap-6 
                justify-center
                [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]
                sm:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]
                lg:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]
                xl:[grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]
            "
        >
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
                        eventoCompleto={evento}
                        user={user}
                    />
                );
            })}
        </div>
    );
}