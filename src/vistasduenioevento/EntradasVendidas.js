import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const EntradasVendidas = () => {
    const { eventoId } = useParams();
    const navigate = useNavigate();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const formattedTime = currentDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // 🔹 Ejemplo de datos mock
    const data = [
        { tipo: 'General - Early Bird', cantidadInicial: 100, cantidadVendida: 100, precio: 2000, stock: 0 },
        { tipo: 'General', cantidadInicial: 700, cantidadVendida: 700, precio: 4500, stock: 0 },
        { tipo: 'General', cantidadInicial: 600, cantidadVendida: 500, precio: 5000, stock: 100 },
        { tipo: 'Vip - Early Bird', cantidadInicial: 50, cantidadVendida: 50, precio: 5000, stock: 0 },
        { tipo: 'Vip', cantidadInicial: 205, cantidadVendida: 200, precio: 7000, stock: 5 },
    ];

    const totalRecaudado = data.reduce(
        (acc, item) => acc + item.precio * item.cantidadVendida,
        0
    );

    const totalVendidas = data.reduce(
        (acc, item) => acc + item.cantidadVendida,
        0
    );

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto px-4">
                        <h1 className="mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
                            Entradas vendidas de Nombre de Evento {eventoId}:
                        </h1>

                        <p className="font-semibold text-sky-700">
                            Información al {formattedDate} a las {formattedTime}hs
                        </p>

                        {/* ====== Vista Mobile (cards) ====== */}
                        <div className="mt-4 space-y-3 md:hidden">
                            {data.map((item, idx) => (
                                <div key={idx} className="rounded-xl border p-4 shadow-sm">
                                    <div className="font-semibold text-lg">{item.tipo}</div>
                                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                                        <span className="text-gray-600">Cantidad inicial</span>
                                        <span className="text-right">{item.cantidadInicial.toLocaleString()}</span>

                                        <span className="text-gray-600">Cantidad vendida</span>
                                        <span className="text-right">{item.cantidadVendida.toLocaleString()}</span>

                                        <span className="text-gray-600">Precio</span>
                                        <span className="text-right">${item.precio.toLocaleString()}</span>

                                        <span className="text-gray-600">Total recaudado</span>
                                        <span className="text-right">
                                            ${(item.precio * item.cantidadVendida).toLocaleString()}
                                        </span>

                                        <span className="text-gray-600">Aún en stock</span>
                                        <span className="text-right">{item.stock.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ====== Vista Desktop/Tablet (tabla) ====== */}
                        <div className="mt-4 overflow-x-auto rounded-xl border shadow-sm hidden md:block">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th className="px-4 py-3 text-left">Tipo de entrada</th>
                                        <th className="px-4 py-3 text-right">Cantidad inicial</th>
                                        <th className="px-4 py-3 text-right">Cantidad vendida</th>
                                        <th className="px-4 py-3 text-right">Precio</th>
                                        <th className="px-4 py-3 text-right">Total recaudado</th>
                                        <th className="px-4 py-3 text-right">Aún en stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, idx) => (
                                        <tr key={idx} className="hover">
                                            <td className="border-t px-4 py-3">{item.tipo}</td>
                                            <td className="border-t px-4 py-3 text-right">
                                                {item.cantidadInicial.toLocaleString()}
                                            </td>
                                            <td className="border-t px-4 py-3 text-right">
                                                {item.cantidadVendida.toLocaleString()}
                                            </td>
                                            <td className="border-t px-4 py-3 text-right">
                                                ${item.precio.toLocaleString()}
                                            </td>
                                            <td className="border-t px-4 py-3 text-right">
                                                ${(item.precio * item.cantidadVendida).toLocaleString()}
                                            </td>
                                            <td className="border-t px-4 py-3 text-right">
                                                {item.stock.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totales */}
                        <div className="mt-6 font-bold text-xl">
                            <p>
                                Total de entradas vendidas:{' '}
                                <span className="text-purple-950 text-2xl">
                                    {totalVendidas.toLocaleString()}
                                </span>
                            </p>
                        </div>

                        <div className="mt-2 font-bold text-xl">
                            <p>
                                Total recaudado al momento:{' '}
                                <span className="text-green-800 text-2xl">
                                    ${totalRecaudado.toLocaleString()}
                                </span>
                            </p>
                        </div>

                        <button
                            className="btn btn-info mt-6"
                            onClick={() => navigate('/mis-eventos-creados')}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EntradasVendidas;



// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';  // Asegúrate de importar NavBar y Footer correctamente
// import Footer from '../components/Footer';

// const EntradasVendidas = () => {
//     const { eventoId } = useParams();
//     const navigate = useNavigate();
//     const currentDate = new Date();
//     const formattedDate = currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
//     const formattedTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

//     const data = [
//         { tipo: 'General - Early Bird', precio: 2000, cantidad: 100, stock: 0 },
//         { tipo: 'General', precio: 4500, cantidad: 700, stock: 0 },
//         { tipo: 'General', precio: 5000, cantidad: 500, stock: 100 },
//         { tipo: 'Vip - Early Bird', precio: 5000, cantidad: 50, stock: 0 },
//         { tipo: 'Vip', precio: 7000, cantidad: 200, stock: 5 },
//     ];

//     const totalRecaudado = data.reduce((total, item) => total + item.precio * item.cantidad, 0);

//     const totalCantEntradasVendidas = data.reduce((total, item) => total + item.cantidad, 0);

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1">
//                 <div className="sm:px-10 mb-11">
//                     <NavBar />
//                     <div className="container mx-auto">
//                         <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Entradas vendidas de Nombre de Evento {eventoId}:</h1>
//                         <p className="px-4 font-semibold text-sky-700">Información al {formattedDate} a las {formattedTime}hs</p>
//                         <table className="table-auto w-full mt-4 mb-6">
//                             <thead>
//                                 <tr>
//                                     <th className="px-4 py-2">Tipo de entrada</th>
//                                     <th className="px-4 py-2">Precio</th>
//                                     <th className="px-4 py-2">Cantidad</th>
//                                     <th className="px-4 py-2">Total</th>
//                                     <th className="px-4 py-2">Aún en stock</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data.map((item, index) => (
//                                     <tr key={index}>
//                                         <td className="border px-4 py-2">{item.tipo}</td>
//                                         <td className="border px-4 py-2">${item.precio.toLocaleString()}</td>
//                                         <td className="border px-4 py-2">{item.cantidad}</td>
//                                         <td className="border px-4 py-2">${(item.precio * item.cantidad).toLocaleString()}</td>
//                                         <td className="border px-4 py-2">{item.stock}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>

//                         <div className="px-4 font-bold text-xl">
//                             <p>Total de entradas vendidas: <span className='text-purple-950 text-2xl'>{totalCantEntradasVendidas.toLocaleString()}</span></p>
//                         </div>

//                         <div className="px-4 font-bold text-xl">
//                             <p>Total recaudado al momento: <span className='text-green-800 text-2xl'>${totalRecaudado.toLocaleString()}</span></p>
//                         </div>
//                         <button className="btn btn-info mt-6" onClick={() => navigate('/miseventos')}>Volver</button>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default EntradasVendidas;
