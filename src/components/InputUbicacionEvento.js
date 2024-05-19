import React, { useState, useEffect } from 'react';

const InputUbicacionEvento = () => {
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedLocalidad, setSelectedLocalidad] = useState('');

  useEffect(() => {
    // Obtener provincias
    fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
      .then(response => response.json())
      .then(data => {
        const provinciasOrdenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProvincias(provinciasOrdenadas);
      })
      .catch(error => console.error('Error fetching provincias:', error));
  }, []);

  useEffect(() => {
    if (selectedProvincia === 'Ciudad Autónoma de Buenos Aires') {
      setMunicipios([{ nombre: 'Ciudad Autónoma de Buenos Aires' }]);
      setSelectedMunicipio('Ciudad Autónoma de Buenos Aires');
      setLocalidades([{ nombre: 'Ciudad Autónoma de Buenos Aires' }]);
      setSelectedLocalidad('Ciudad Autónoma de Buenos Aires');
    } else if (selectedProvincia) {
      // Obtener municipios para la provincia seleccionada
      fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvincia}&max=200`)
        .then(response => response.json())
        .then(data => {
          // Filtrar municipios para excluir las comunas de la Ciudad Autónoma de Buenos Aires
          const municipiosFiltrados = data.municipios.filter(municipio => !municipio.nombre.includes('Comuna'));
          const municipiosOrdenados = municipiosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setMunicipios(municipiosOrdenados);
        })
        .catch(error => console.error('Error fetching municipios:', error));
    } else {
      setMunicipios([]);
      setLocalidades([]);
    }
    setSelectedMunicipio('');
    setSelectedLocalidad('');
  }, [selectedProvincia]);

  useEffect(() => {
    if (selectedMunicipio && selectedProvincia !== 'Ciudad Autónoma de Buenos Aires') {
      // Obtener localidades para el municipio seleccionado
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio}&max=200`)
        .then(response => response.json())
        .then(data => {
          const localidadesOrdenadas = data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setLocalidades(localidadesOrdenadas);
        })
        .catch(error => console.error('Error fetching localidades:', error));
    } else {
      setLocalidades([]);
    }
    setSelectedLocalidad('');
  }, [selectedMunicipio, selectedProvincia]);

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
            <option key={provincia.id} value={provincia.nombre}>{provincia.nombre}</option>
          ))}
        </select>
      </div>
      {selectedProvincia && selectedProvincia !== 'Ciudad Autónoma de Buenos Aires' && (
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-semibold text-lg">Municipio:</span>
          </label>
          <select
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value)}
            className="select select-bordered"
          >
            <option value="">Seleccione un municipio</option>
            {municipios.map(municipio => (
              <option key={municipio.nombre} value={municipio.nombre}>{municipio.nombre}</option>
            ))}
          </select>
        </div>
      )}
      {selectedMunicipio && (
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
              <option key={localidad.id} value={localidad.nombre}>{localidad.nombre}</option>
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

