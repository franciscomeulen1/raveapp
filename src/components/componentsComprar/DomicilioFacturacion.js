import React from 'react';
import InputUbicacionUsuario from '../componentsMiPerfil/InputUbicacionUsuario';

export default function DomicilioFacturacion({
  selectedProvincia,
  selectedMunicipio,
  selectedLocalidad,
  direccion,
  domicilioBloqueado,
  onUbicacionChange,
  onDireccionChange,
}) {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6">
      <h3 className="text-lg font-semibold mb-2">Domicilio de facturación:</h3>

      <InputUbicacionUsuario
        initialProvincia={selectedProvincia?.nombre || ''}
        initialMunicipio={selectedMunicipio?.nombre || ''}
        initialLocalidad={selectedLocalidad?.nombre || ''}
        disabled={domicilioBloqueado}
        onUbicacionChange={onUbicacionChange}
      />

      <div className="form-control mt-4 max-w-xs">
        <label className="label">
          <span className="label-text">Dirección (calle y número):</span>
        </label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => onDireccionChange(e.target.value)}
          disabled={domicilioBloqueado}
          className={`input input-bordered w-full ${domicilioBloqueado ? 'bg-gray-100' : ''}`}
        />
      </div>
    </div>
  );
}
