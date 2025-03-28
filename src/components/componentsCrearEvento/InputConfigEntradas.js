import React, { useState, useEffect } from 'react';

const InputConfigEntradas = ({ diasEvento }) => {
  const [configEntradas, setConfigEntradas] = useState([]);

  useEffect(() => {
    setConfigEntradas(
      Array.from({ length: diasEvento }, () => ({
        inicioVenta: '',
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
              <span className='label-text font-semibold text-base'>Fecha y hora de inicio de venta de entradas:</span>
            </label>
            <input
              type='datetime-local'
              value={config.inicioVenta}
              onChange={e => handleConfigChange(index, 'inicioVenta', e.target.value)}
              className='input input-bordered w-full max-w-md'
            />
          </div>

          <h4 className='font-semibold mt-4'>Vender Early Birds hasta:</h4>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-semibold text-base'>Fecha y hora:</span>
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
              <span className='label-text font-semibold text-base'>Fecha y hora:</span>
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
