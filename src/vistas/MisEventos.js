import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import EventoItem from '../components/EventoItem';

const MisEventos = () => {
    const [eventos] = useState([
        { fecha: '2024-06-01', nombre: 'Nombre del evento 1', finalizado: false },
        { fecha: '2024-06-15', nombre: 'Nombre del evento 2', finalizado: false },
        { fecha: '2024-07-01', nombre: 'Nombre del evento 3', finalizado: false },
        { fecha: '2024-05-01', nombre: 'Nombre del evento 4', finalizado: true },
    ]);

    const [orden, setOrden] = useState('asc');
    const [busqueda, setBusqueda] = useState('');

    const ordenarEventos = (eventos, orden) => {
        return [...eventos].sort((a, b) => {
            if (orden === 'asc') {
                return new Date(a.fecha) - new Date(b.fecha);
            } else {
                return new Date(b.fecha) - new Date(a.fecha);
            }
        });
    };

    const eventosFiltrados = ordenarEventos(
        eventos.filter(evento => evento.nombre.toLowerCase().includes(busqueda.toLowerCase())),
        orden
    );

    const handleOrdenChange = (e) => {
        setOrden(e.target.value);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Mis eventos:</h1>
                        <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between">
                            <select className="select select-bordered mb-4 sm:mb-0" value={orden} onChange={handleOrdenChange}>
                                <option value="asc">Ordenar por fecha (ascendente)</option>
                                <option value="desc">Ordenar por fecha (descendente)</option>
                            </select>
                            <input 
                                type="text" 
                                className="input input-bordered" 
                                placeholder="Buscar evento..." 
                                value={busqueda} 
                                onChange={handleBusquedaChange} 
                            />
                        </div>
                        <div className="space-y-4">
                            {eventosFiltrados.map((evento, index) => (
                                <EventoItem key={index} {...evento} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MisEventos;


// import React from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import EventoItem from '../components/EventoItem';

// const MisEventos = () => {
//     const eventos = [
//         { fecha: '2024-06-01', nombre: 'Nombre del evento 1', finalizado: false },
//         { fecha: '2024-06-15', nombre: 'Nombre del evento 2', finalizado: false },
//         { fecha: '2024-07-01', nombre: 'Nombre del evento 3', finalizado: false },
//         { fecha: '2024-05-01', nombre: 'Nombre del evento 4', finalizado: true },
//     ];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1">
//                 <div className="sm:px-10 mb-11">
//                     <NavBar />
//                     <div className="container mx-auto">
//                         <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Mis eventos:</h1>
//                         <div className="mb-4 px-4">
//                             <select className="select select-bordered">
//                                 <option value="fecha">Ordenar por fecha</option>
//                                 {/* Puedes agregar más opciones de ordenamiento aquí */}
//                             </select>
//                         </div>
//                         <div className="space-y-4">
//                             {eventos.map((evento, index) => (
//                                 <EventoItem key={index} {...evento} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default MisEventos;
