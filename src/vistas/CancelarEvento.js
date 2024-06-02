import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const CancelarEvento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { nombre } = location.state || {};

    // Simulación de datos de evento
    const evento = {
        nombre: nombre || 'Evento no encontrado',
        reembolsos: [
            { tipo: 'General', precio: 5000, cantidad: 20 },
            { tipo: 'Vip', precio: 7000, cantidad: 15 }
        ]
    };

    const totalADevolver = evento.reembolsos.reduce((total, reembolso) => total + reembolso.precio * reembolso.cantidad, 0);

    const handleCancel = () => {
        // Lógica para cancelar el evento
        console.log(`Evento ${id} cancelado`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">Cancelación de evento:</h1>
                        <div className="mb-4 px-4">
                            <p className='font-semibold'>Si cancelas este evento, a continuación debes informar el motivo. La cancelación del evento se le avisará vía mail a las personas que hayan comprado una entrada, junto con el motivo que describas, y se procederá a realizar la devolución del dinero de las entradas.</p>
                            <p className="mt-4"><strong>Evento a cancelar:</strong> <span className="text-red-600 font-bold">{evento.nombre}</span></p>
                            <p className="mt-2"><strong>Se reembolsarán:</strong></p>
                            <ul className="list-disc list-inside">
                                {evento.reembolsos.map((reembolso, index) => (
                                    <li key={index} className='font-semibold'>{reembolso.cantidad} Entradas {reembolso.tipo} de ${reembolso.precio} c/u. -- Subtotal: ${reembolso.cantidad * reembolso.precio}</li>
                                ))}
                            </ul>
                            <p className="mt-4"><strong>Total a devolver:</strong> <span className="text-red-600 font-bold text-lg">${totalADevolver.toLocaleString()}</span></p>
                            <p className="mt-4"><strong>Motivo:</strong></p>
                            <textarea className="textarea textarea-bordered w-full h-40 mt-2"></textarea>
                            <p className="mt-2 text-red-600">* Esta operación no puede ser reversada.</p>

                            <button className="btn btn-error mt-6 mr-4" onClick={handleCancel}>Cancelar Evento</button>
                            <button className="btn btn-info mt-6" onClick={() => navigate('/miseventos')}>Volver</button>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CancelarEvento;
