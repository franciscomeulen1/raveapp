import React, { useState, useEffect } from 'react';

const InputEntradasCantPrecio = ({ diasEvento }) => {
    const [entradas, setEntradas] = useState([]);

    useEffect(() => {
        setEntradas(
            Array.from({ length: diasEvento }, () => ({
                generalesEarly: 0,
                generales: 0,
                vipEarly: 0,
                vip: 0,
            }))
        );
    }, [diasEvento]); // Se actualiza cada vez que cambia diasEvento

    const handleEntradaChange = (diaIndex, tipo, value) => {
        const cantidad = parseInt(value, 10) || 0;
        setEntradas(prevEntradas => {
            const updatedEntradas = [...prevEntradas];
            updatedEntradas[diaIndex] = { ...updatedEntradas[diaIndex], [tipo]: cantidad };
            return updatedEntradas;
        });
    };

    return (
        <div>
            {entradas.map((diaEntradas, index) => (
                <div key={index}>
                    <h3 className='font-bold text-lg my-4'>Entradas para el día {index + 1}:</h3>
                    {/* Estructura de Grid */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                        {/* Primera columna (izquierda) */}
                        <div className='col-span-1'>
                            <h4 className='font-semibold'>Entradas generales:</h4>
                            <div className='flex space-x-2'>
                                <input type='number' placeholder='Cantidad' className='input input-bordered w-20' 
                                    value={diaEntradas.generales} 
                                    onChange={e => handleEntradaChange(index, 'generales', e.target.value)} />
                                <input type='text' placeholder='Precio' className='input input-bordered w-20' />
                            </div>
                            <h4 className='font-semibold mt-3'>Entradas generales - Early Birds:</h4>
                            <div className='flex space-x-2'>
                                <input type='number' placeholder='Cantidad' className='input input-bordered w-20' 
                                    value={diaEntradas.generalesEarly} 
                                    onChange={e => handleEntradaChange(index, 'generalesEarly', e.target.value)} />
                                <input type='text' placeholder='Precio' className='input input-bordered w-20' />
                            </div>
                        </div>

                        {/* Segunda columna (derecha) */}
                        <div className='col-span-1'>
                            <h4 className='font-semibold'>Entradas VIP:</h4>
                            <div className='flex space-x-2'>
                                <input type='number' placeholder='Cantidad' className='input input-bordered w-20' 
                                    value={diaEntradas.vip} 
                                    onChange={e => handleEntradaChange(index, 'vip', e.target.value)} />
                                <input type='text' placeholder='Precio' className='input input-bordered w-20' />
                            </div>
                            <h4 className='font-semibold mt-3'>Entradas VIP - Early Birds:</h4>
                            <div className='flex space-x-2'>
                                <input type='number' placeholder='Cantidad' className='input input-bordered w-20' 
                                    value={diaEntradas.vipEarly} 
                                    onChange={e => handleEntradaChange(index, 'vipEarly', e.target.value)} />
                                <input type='text' placeholder='Precio' className='input input-bordered w-20' />
                            </div>
                        </div>

                        {/* Tercera y Cuarta columnas VACÍAS en pantallas grandes */}
                        <div className='hidden md:block'></div>
                        <div className='hidden md:block'></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InputEntradasCantPrecio;


// import React, { useState, useEffect } from 'react';

// const InputEntradasCantPrecio = ({ diasEvento }) => {
//     const [entradas, setEntradas] = useState([]);

//     useEffect(() => {
//         setEntradas(
//             Array.from({ length: diasEvento }, () => ({
//                 generalesEarly: 0,
//                 generales: 0,
//                 vipEarly: 0,
//                 vip: 0,
//             }))
//         );
//     }, [diasEvento]); // Se actualiza cada vez que cambia diasEvento

//     const handleEntradaChange = (diaIndex, tipo, value) => {
//         const cantidad = parseInt(value, 10) || 0;
//         setEntradas(prevEntradas => {
//             const updatedEntradas = [...prevEntradas];
//             updatedEntradas[diaIndex] = { ...updatedEntradas[diaIndex], [tipo]: cantidad };
//             return updatedEntradas;
//         });
//     };

//     return (
//         <div>
//             {entradas.map((diaEntradas, index) => (
//                 <div key={index}>
//                     <h3 className='font-bold text-lg my-4'>Entradas para el día {index + 1}:</h3>
//                     <div className='grid grid-cols-2 gap-4 mb-6'>
//                         {[{ key: 'generales', label: 'Entradas generales'},
//                         { key: 'vip', label: 'Entradas vip' },
//                         { key: 'generalesEarly', label: 'Entradas generales - Early Birds' },
//                         { key: 'vipEarly', label: 'Entradas vip - Early Birds' }].map(({ key, label }) => (
//                             <div key={key}>
//                                 <h4 className='font-semibold'>{label}:</h4>
//                                 <div className='flex space-x-2'>
//                                     <input type='number' placeholder='Cantidad' className='input input-bordered w-20' value={diaEntradas[key]} onChange={e => handleEntradaChange(index, key, e.target.value)} />
//                                     <input type='text' placeholder='Precio' className='input input-bordered w-20' />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default InputEntradasCantPrecio;


