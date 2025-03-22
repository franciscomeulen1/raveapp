// FiltroUbicacion.js
import React, { useState, useEffect } from 'react';

const FiltroUbicacion = ({ onUbicacionChange }) => {
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
          // Eliminar duplicados
          const localidadesUnicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
            .map(nombre => data.localidades.find(a => a.nombre === nombre));
          const localidadesOrdenadas = localidadesUnicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setLocalidades(localidadesOrdenadas);
        })
        .catch(error => console.error('Error fetching localidades:', error));
    } else {
      setLocalidades([]);
    }
    setSelectedLocalidad('');
  }, [selectedMunicipio, selectedProvincia]);

  // Notificar al componente padre cada vez que cambie alguna selección
  useEffect(() => {
    if (onUbicacionChange) {
      onUbicacionChange({
        provincia: selectedProvincia,
        municipio: selectedMunicipio,
        localidad: selectedLocalidad,
      });
    }
  }, [selectedProvincia, selectedMunicipio, selectedLocalidad, onUbicacionChange]);

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
            <option key={provincia.id} value={provincia.nombre}>
              {provincia.nombre}
            </option>
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
              <option key={municipio.id} value={municipio.nombre}>
                {municipio.nombre}
              </option>
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
              <option key={localidad.id} value={localidad.nombre}>
                {localidad.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FiltroUbicacion;
