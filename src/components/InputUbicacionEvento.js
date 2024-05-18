import React, { useState, useEffect } from 'react';

const InputUbicacionEvento = () => {
  const [provincias, setProvincias] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedPartido, setSelectedPartido] = useState('');
  const [selectedLocalidad, setSelectedLocalidad] = useState('');

  useEffect(() => {
    // Obtener provincias
    fetch('https://apis.datos.gob.ar/georef/api/provincias')
      .then(response => response.json())
      .then(data => setProvincias(data.provincias))
      .catch(error => console.error('Error fetching provincias:', error));
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      // Obtener partidos para la provincia seleccionada
      fetch(`https://apis.datos.gob.ar/georef/api/departamentos?provincia=${selectedProvincia}`)
        .then(response => response.json())
        .then(data => setPartidos(data.departamentos))
        .catch(error => console.error('Error fetching partidos:', error));
    } else {
      setPartidos([]);
    }
    setSelectedPartido('');
    setSelectedLocalidad('');
  }, [selectedProvincia]);

  useEffect(() => {
    if (selectedPartido) {
      // Obtener localidades para el partido seleccionado
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?departamento=${selectedPartido}`)
        .then(response => response.json())
        .then(data => setLocalidades(data.localidades))
        .catch(error => console.error('Error fetching localidades:', error));
    } else {
      setLocalidades([]);
    }
    setSelectedLocalidad('');
  }, [selectedPartido]);

  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-semibold text-lg">Provincia:</span>
        </label>
        <select
          value={selectedProvincia}
          onChange={(e) => setSelectedProvincia(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Seleccione una provincia</option>
          {provincias.map(provincia => (
            <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
          ))}
        </select>
      </div>
      {selectedProvincia && (
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold text-lg">Partido:</span>
          </label>
          <select
            value={selectedPartido}
            onChange={(e) => setSelectedPartido(e.target.value)}
            className="select select-bordered"
          >
            <option value="">Seleccione un partido</option>
            {partidos.map(partido => (
              <option key={partido.id} value={partido.id}>{partido.nombre}</option>
            ))}
          </select>
        </div>
      )}
      {selectedPartido && (
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold text-lg">Localidad:</span>
          </label>
          <select
            value={selectedLocalidad}
            onChange={(e) => setSelectedLocalidad(e.target.value)}
            className="select select-bordered"
          >
            <option value="">Seleccione una localidad</option>
            {localidades.map(localidad => (
              <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
            ))}
          </select>
        </div>
      )}
      <div className='form-control w-full max-w-xs'>
        <label className="label">
          <span className="label-text font-semibold text-lg">Dirección:</span>
        </label>
        <input type='text' placeholder="Dirección del evento" className="input input-bordered w-full" />
      </div>
    </div>
  );
};

export default InputUbicacionEvento;
