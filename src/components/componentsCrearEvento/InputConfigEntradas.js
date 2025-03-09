import React, { useState, useEffect } from 'react';

const InputConfigEntradas = ({ diasEvento }) => {
    const [configEntradas, setConfigEntradas] = useState([]);

    useEffect(() => {
        setConfigEntradas(
            Array.from({ length: diasEvento }, () => ({
                inicioVenta: '',
                hastaAgotarStockEarlyBirds: false,
                finVentaEarlyBirds: '',
                finVentaGeneralVip: ''
            }))
        );
    }, [diasEvento]); // Se actualiza cada vez que cambia diasEvento

    const handleConfigChange = (diaIndex, campo, value) => {
        setConfigEntradas(prevConfig => {
            const updatedConfig = [...prevConfig];
            updatedConfig[diaIndex] = { ...updatedConfig[diaIndex], [campo]: value };
            return updatedConfig;
        });
    };

    return (
        <div>
            {configEntradas.map((config, index) => (
                <div key={index}>
                    <h3 className='font-bold text-lg'>Configuración de entradas del día {index + 1}:</h3>
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text font-semibold text-lg'>Fecha y hora de inicio de venta de entradas:</span>
                        </label>
                        <input
                            type='datetime-local'
                            value={config.inicioVenta}
                            onChange={e => handleConfigChange(index, 'inicioVenta', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                        />
                    </div>

                    <h4 className='font-semibold mt-4 mb-3'>Vender Early Birds hasta:</h4>
                    <label className='block'>
                        <input type='checkbox' className='mr-2' checked={config.hastaAgotarStockEarlyBirds} onChange={e => handleConfigChange(index, 'hastaAgotarStockEarlyBirds', e.target.checked)} /> Agotar stock
                    </label>

                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text font-semibold text-lg'>Fecha y hora:</span>
                        </label>
                        <input
                            type='datetime-local'
                            value={config.finVentaEarlyBirds}
                            onChange={e => handleConfigChange(index, 'finVentaEarlyBirds', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                        />
                    </div>

                    <h4 className='font-semibold mt-4'>Vender Generales/Vip hasta:</h4>
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text font-semibold text-lg'>Fecha y hora:</span>
                        </label>
                        <input
                            type='datetime-local'
                            value={config.finVentaGeneralVip}
                            onChange={e => handleConfigChange(index, 'finVentaGeneralVip', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                        />
                    </div>
                    {index < configEntradas.length - 1 && <hr className='my-4 w-1/2 border-gray-400' style={{ marginLeft: 0 }} />}
                </div>
            ))}
        </div>
    );
};

export default InputConfigEntradas;



// import React, { useState } from 'react';

// const InputConfigEntradas = () => {
//     // fecha y hora
//     const [inicioVentaEntradas, setInicioVentaEntradas] = useState('');
//     // booleano
//     const [hastaAgotarStockEarlyBirds, setHastaAgotarStockEarlyBirds] = useState(false);
//     // fecha y hora
//     const [finVentaEarlyBirds, setFinVentaEarlyBirds] = useState('');
//     const [finVentaGeneralVip, setFinVentaGeneralVip] = useState('');

//     return (
//         <div>
//             <h3 className='font-bold text-lg'>Configuración de entradas:</h3>

//             {/* FECHA HORA INICIO VENTA */}
//             <div className='form-control'>
//                 <label className='label'>
//                     <span className='label-text font-semibold text-lg'>{<span className='text-sm'>Fecha y hora de inicio de venta de entradas:</span>}</span>
//                 </label>
//                 <input
//                     type='datetime-local'
//                     value={inicioVentaEntradas}
//                     onChange={e => setInicioVentaEntradas(e.target.value)}
//                     className='input input-bordered w-full max-w-md'
//                 />
//             </div>

//             <h4 className='font-semibold mt-4 mb-3'>Vender Early Birds hasta:</h4>
//             <label className='block'><input type='checkbox' className='mr-2' checked={hastaAgotarStockEarlyBirds} onChange={e => setHastaAgotarStockEarlyBirds(e.target.checked)} /> Agotar stock</label>

//             {/* FECHA HORA FIN EARLY BIRDS */}

//             <div className='form-control'>
//                 <label className='label'>
//                     <span className='label-text font-semibold text-lg'>{<span className='text-sm'>Fecha y hora:</span>}</span>
//                 </label>
//                 <input
//                     type='datetime-local'
//                     value={finVentaEarlyBirds}
//                     onChange={e => setFinVentaEarlyBirds(e.target.value)}
//                     className='input input-bordered w-full max-w-md'
//                 />
//             </div>

//             <h4 className='font-semibold mt-4'>Vender Generales/Vip hasta:</h4>

//             {/* FECHA HORA FIN GENERALES VIP */}

//             <div className='form-control'>
//                 <label className='label'>
//                     <span className='label-text font-semibold text-lg'>{<span className='text-sm'>Fecha y hora:</span>}</span>
//                 </label>
//                 <input
//                     type='datetime-local'
//                     value={finVentaGeneralVip}
//                     onChange={e => setFinVentaGeneralVip(e.target.value)}
//                     className='input input-bordered w-full max-w-md'
//                 />
//             </div>
//         </div>
//     );
// };

// export default InputConfigEntradas;