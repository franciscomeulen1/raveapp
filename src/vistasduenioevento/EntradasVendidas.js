import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';  // Asegúrate de importar NavBar y Footer correctamente
import Footer from '../components/Footer';

const EntradasVendidas = () => {
    const { eventoId } = useParams();
    const navigate = useNavigate();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const data = [
        { tipo: 'General - Early Bird', precio: 2000, cantidad: 100, stock: 0 },
        { tipo: 'General', precio: 4500, cantidad: 700, stock: 0 },
        { tipo: 'General', precio: 5000, cantidad: 500, stock: 100 },
        { tipo: 'Vip - Early Bird', precio: 5000, cantidad: 50, stock: 0 },
        { tipo: 'Vip', precio: 7000, cantidad: 200, stock: 5 },
    ];

    const totalRecaudado = data.reduce((total, item) => total + item.precio * item.cantidad, 0);

    const totalCantEntradasVendidas = data.reduce((total, item) => total + item.cantidad, 0);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Entradas vendidas de Nombre de Evento {eventoId}:</h1>
                        <p className="px-4 font-semibold text-sky-700">Información al {formattedDate} a las {formattedTime}hs</p>
                        <table className="table-auto w-full mt-4 mb-6">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Tipo de entrada</th>
                                    <th className="px-4 py-2">Precio</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Aún en stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.tipo}</td>
                                        <td className="border px-4 py-2">${item.precio.toLocaleString()}</td>
                                        <td className="border px-4 py-2">{item.cantidad}</td>
                                        <td className="border px-4 py-2">${(item.precio * item.cantidad).toLocaleString()}</td>
                                        <td className="border px-4 py-2">{item.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="px-4 font-bold text-xl">
                            <p>Total de entradas vendidas: <span className='text-purple-950 text-2xl'>{totalCantEntradasVendidas.toLocaleString()}</span></p>
                        </div>

                        <div className="px-4 font-bold text-xl">
                            <p>Total recaudado al momento: <span className='text-green-800 text-2xl'>${totalRecaudado.toLocaleString()}</span></p>
                        </div>
                        <button className="btn btn-info mt-6" onClick={() => navigate('/miseventos')}>Volver</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EntradasVendidas;
