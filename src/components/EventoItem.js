import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventoItem = ({ fecha, nombre, finalizado, id }) => {

    const navigate = useNavigate();

    const handleEntradasVendidas = () => {
        navigate(`/entradas-vendidas/${id}`);
    };
    const handleCancelClick = () => {
        navigate(`/cancelar-evento/${id}`, { state: { nombre } });
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                    <span>Img</span>
                </div>
                <div className="ml-4">
                    <p className="text-gray-600">{fecha}</p>
                    <p className="text-lg font-semibold">{nombre}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                {finalizado ? (
                    <span className="text-red-600 font-semibold text-xl mr-6">Finalizado</span>
                ) : (
                    <>
                        <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>Entradas vendidas</button>
                        <button className="btn btn-primary w-full md:w-auto">Modificar</button>
                        <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>Cancelar evento</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventoItem;

