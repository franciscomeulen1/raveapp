import React, { useState, useEffect, useRef } from 'react';

const InputConfigEntradas = ({
  diasEvento,
  entradasPorDia,
  onConfigEntradasChange,
  configInicial = []
}) => {
  const [configEntradas, setConfigEntradas] = useState([]);
  const prevConfigRef = useRef();

  // Inicializar solo una vez o si cambian los datos realmente
  useEffect(() => {
    if (configEntradas.length > 0) return;

    if (configInicial.length > 0) {
      setConfigEntradas(configInicial);
      if (typeof onConfigEntradasChange === 'function') {
        onConfigEntradasChange(configInicial);
        prevConfigRef.current = configInicial;
      }
    } else {
      const nuevasConfigs = Array.from({ length: diasEvento }, () => ({
        inicioVenta: '',
        finVentaGeneralVip: ''
      }));
      setConfigEntradas(nuevasConfigs);
      if (typeof onConfigEntradasChange === 'function') {
        onConfigEntradasChange(nuevasConfigs);
        prevConfigRef.current = nuevasConfigs;
      }
    }
  }, [diasEvento, configInicial, configEntradas.length, onConfigEntradasChange]);

  // Notificar cambios si son reales
  useEffect(() => {
    if (typeof onConfigEntradasChange === 'function') {
      const prev = prevConfigRef.current;
      if (JSON.stringify(prev) !== JSON.stringify(configEntradas)) {
        onConfigEntradasChange(configEntradas);
        prevConfigRef.current = configEntradas;
      }
    }
  }, [configEntradas, onConfigEntradasChange]);

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
              <span className='label-text font-semibold text-base'>
                Fecha y hora de inicio de venta de entradas:
              </span>
            </label>
            <input
              type='datetime-local'
              value={config.inicioVenta}
              onChange={e => handleConfigChange(index, 'inicioVenta', e.target.value)}
              className='input input-bordered w-full max-w-md'
            />
          </div>

          <h4 className='font-semibold mt-4'>Vender Generales/Vip hasta:</h4>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold text-base'>Fecha y hora:</span>
            </label>
            <input
              type='datetime-local'
              value={config.finVentaGeneralVip}
              onChange={e => handleConfigChange(index, 'finVentaGeneralVip', e.target.value)}
              className='input input-bordered w-full max-w-md'
            />
          </div>

          {index < configEntradas.length - 1 && (
            <hr className='my-4 w-1/2 border-gray-400' style={{ marginLeft: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default InputConfigEntradas;


// import React, { useState, useEffect } from 'react';

// const InputConfigEntradas = ({
//   diasEvento,
//   entradasPorDia,
//   onConfigEntradasChange,
//   configInicial = []
// }) => {
//   const [configEntradas, setConfigEntradas] = useState([]);

//   useEffect(() => {
//     if (configInicial.length > 0) {
//       setConfigEntradas(configInicial);
//       if (typeof onConfigEntradasChange === 'function') {
//         onConfigEntradasChange(configInicial);
//       }
//     } else {
//       const nuevasConfigs = Array.from({ length: diasEvento }, () => ({
//         inicioVenta: '',
//         finVentaGeneralVip: ''
//       }));
//       setConfigEntradas(nuevasConfigs);
//       if (typeof onConfigEntradasChange === 'function') {
//         onConfigEntradasChange(nuevasConfigs);
//       }
//     }
//   }, [diasEvento, configInicial, onConfigEntradasChange]);

//   useEffect(() => {
//     if (typeof onConfigEntradasChange === 'function') {
//       onConfigEntradasChange(configEntradas);
//     }
//   }, [configEntradas, onConfigEntradasChange]);

//   const handleConfigChange = (diaIndex, campo, value) => {
//     setConfigEntradas(prevConfig => {
//       const updatedConfig = [...prevConfig];
//       updatedConfig[diaIndex] = { ...updatedConfig[diaIndex], [campo]: value };
//       return updatedConfig;
//     });
//   };

//   return (
//     <div>
//       {configEntradas.map((config, index) => (
//         <div key={index}>
//           <h3 className='font-bold text-lg'>Configuración de entradas del día {index + 1}:</h3>

//           <div className='form-control'>
//             <label className='label'>
//               <span className='label-text font-semibold text-base'>
//                 Fecha y hora de inicio de venta de entradas:
//               </span>
//             </label>
//             <input
//               type='datetime-local'
//               value={config.inicioVenta}
//               onChange={e => handleConfigChange(index, 'inicioVenta', e.target.value)}
//               className='input input-bordered w-full max-w-md'
//             />
//           </div>

//           <h4 className='font-semibold mt-4'>Vender Generales/Vip hasta:</h4>
//           <div className='form-control'>
//             <label className='label'>
//               <span className='label-text font-semibold text-base'>Fecha y hora:</span>
//             </label>
//             <input
//               type='datetime-local'
//               value={config.finVentaGeneralVip}
//               onChange={e => handleConfigChange(index, 'finVentaGeneralVip', e.target.value)}
//               className='input input-bordered w-full max-w-md'
//             />
//           </div>

//           {index < configEntradas.length - 1 && (
//             <hr className='my-4 w-1/2 border-gray-400' style={{ marginLeft: 0 }} />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default InputConfigEntradas;