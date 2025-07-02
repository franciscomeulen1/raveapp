import React, { useState, useEffect, useRef } from 'react';

const InputFechaHoraEvento = ({ diasEvento, onFechaHoraChange, fechasIniciales = [] }) => {
  const yaInicializado = useRef(false);
  const [fechas, setFechas] = useState([]);

  // Inicialización segura: solo una vez
  useEffect(() => {
    if (yaInicializado.current) return;

    if (fechasIniciales.length) {
      setFechas(fechasIniciales);
    } else {
      const nuevas = Array.from({ length: diasEvento }, () => ({ inicio: '', fin: '' }));
      setFechas(nuevas);
    }

    yaInicializado.current = true;
  }, [fechasIniciales, diasEvento]);

  // Notificar al padre si las fechas cambian
  useEffect(() => {
    onFechaHoraChange(fechas);
  }, [fechas, onFechaHoraChange]);

  const handleChange = (index, tipo, value) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index][tipo] = value;
    setFechas(nuevasFechas);
  };

  return (
    <div>
      <h3 className='font-bold text-lg'>Fecha y hora del evento:</h3>
      {fechas.map((fecha, index) => (
        <div key={index} className='mb-4'>
          {diasEvento > 1 && <h4 className='font-semibold'>Día {index + 1}:</h4>}
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold text-lg'>Inicio:</span>
            </label>
            <input
              type='datetime-local'
              value={fecha.inicio}
              onChange={e => handleChange(index, 'inicio', e.target.value)}
              className='input input-bordered w-full max-w-md'
            />
          </div>
          <div className='form-control mt-2'>
            <label className='label'>
              <span className='label-text font-semibold text-lg'>Finalización:</span>
            </label>
            <input
              type='datetime-local'
              value={fecha.fin}
              onChange={e => handleChange(index, 'fin', e.target.value)}
              className='input input-bordered w-full max-w-md'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InputFechaHoraEvento;



// import React, { useState, useEffect } from 'react';

// const InputFechaHoraEvento = ({ diasEvento, onFechaHoraChange, fechasIniciales = [] }) => {
//     const [fechas, setFechas] = useState([]);

//     useEffect(() => {
//         if (fechasIniciales.length) {
//             setFechas(fechasIniciales);
//             onFechaHoraChange(fechasIniciales);
//         } else {
//             const nuevas = Array.from({ length: diasEvento }, () => ({ inicio: '', fin: '' }));
//             setFechas(nuevas);
//             onFechaHoraChange(nuevas);
//         }
//     }, [diasEvento, fechasIniciales, onFechaHoraChange]);

//     const handleChange = (index, tipo, value) => {
//         const nuevasFechas = [...fechas];
//         nuevasFechas[index][tipo] = value;
//         setFechas(nuevasFechas);
//         onFechaHoraChange(nuevasFechas);
//     };

//     return (
//         <div>
//             <h3 className='font-bold text-lg'>Fecha y hora del evento:</h3>
//             {fechas.map((fecha, index) => (
//                 <div key={index} className='mb-4'>
//                     {diasEvento > 1 && <h4 className='font-semibold'>Día {index + 1}:</h4>}
//                     <div className='form-control'>
//                         <label className='label'>
//                             <span className='label-text font-semibold text-lg'>Inicio:</span>
//                         </label>
//                         <input
//                             type='datetime-local'
//                             value={fecha.inicio}
//                             onChange={e => handleChange(index, 'inicio', e.target.value)}
//                             className='input input-bordered w-full max-w-md'
//                         />
//                     </div>
//                     <div className='form-control mt-2'>
//                         <label className='label'>
//                             <span className='label-text font-semibold text-lg'>Finalización:</span>
//                         </label>
//                         <input
//                             type='datetime-local'
//                             value={fecha.fin}
//                             onChange={e => handleChange(index, 'fin', e.target.value)}
//                             className='input input-bordered w-full max-w-md'
//                         />
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default InputFechaHoraEvento;