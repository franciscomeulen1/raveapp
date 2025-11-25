import React from 'react';

const ModifFechaHoraEvento = ({ dias, handleDiaChange }) => {
  return (
    <div className="form-control mb-4">
      <label className="label font-semibold text-lg">Fechas y Horarios:</label>
      {dias.map((dia, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          {dias.length > 1 && (
            <div className="mb-2">
              <label className="label">Fecha del día {index + 1}</label>
            </div>
          )}
          <input
            type="date"
            value={dia.fecha}
            onChange={(e) => handleDiaChange(index, 'fecha', e.target.value)}
            className="input input-bordered w-full"
          />
          <div className="flex space-x-2 mt-2">
            <div className="w-1/2">
              <label className="label">Hora de Inicio</label>
              <input
                type="time"
                value={dia.horaInicio}
                onChange={(e) => handleDiaChange(index, 'horaInicio', e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-1/2">
              <label className="label">Hora de Fin</label>
              <input
                type="time"
                value={dia.horaFin}
                onChange={(e) => handleDiaChange(index, 'horaFin', e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModifFechaHoraEvento;
