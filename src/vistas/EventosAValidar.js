import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const EventosAValidar = () => {
    const eventos = [
        {
            fechaEvento: '02/09/2025',
            fechaCreacion: '02/12/2024',
            nombre: 'Nombre del evento 1',
            genero: 'Techno',
            propietario: 'Usuario 1',
        },
        {
            fechaEvento: '02/09/2025',
            fechaCreacion: '02/12/2024',
            nombre: 'Nombre del evento 2',
            genero: 'Techno',
            propietario: 'Usuario 2',
        },
        {
            fechaEvento: '02/09/2025',
            fechaCreacion: '02/12/2024',
            nombre: 'Nombre del evento 3',
            genero: 'Techno',
            propietario: 'Usuario 3',
        },
        {
            fechaEvento: '02/09/2025',
            fechaCreacion: '02/12/2024',
            nombre: 'Nombre del evento 4',
            genero: 'Techno',
            propietario: 'Usuario 4',
        },
        // Se pueden añadir más eventos con el mismo formato.
    ];

    const navigate = useNavigate();

    const handleVerificar = () => {
        navigate('/eventoavalidar'); 
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <main className="p-4">
                            <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Eventos a validar:</h1>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="bg-purple-700"> {/* Verificar que quede violeta */}
                                            <th>Fecha del evento</th>
                                            <th>Fecha de creación</th>
                                            <th>Nombre del evento</th>
                                            <th>Género</th>
                                            <th>Propietario</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventos.map((evento, index) => (
                                            <tr key={index} className="bg-gray-200 text-black">
                                                <td>{evento.fechaEvento}</td>
                                                <td>{evento.fechaCreacion}</td>
                                                <td>{evento.nombre}</td>
                                                <td>{evento.genero}</td>
                                                <td>{evento.propietario}</td>
                                                <td>
                                                    <button
                                                    onClick={handleVerificar}  
                                                    className="btn btn-primary text-white bg-purple-500 hover:bg-purple-600">
                                                        Verificar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventosAValidar;