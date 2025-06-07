import React, { useState, useEffect } from 'react';

const InputUbicacionEvento = ({ onUbicacionChange }) => {
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
      .then(res => res.json())
      .then(data => {
        const ordenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProvincias(ordenadas);
      })
      .catch(err => console.error('Error fetching provincias:', err));
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      if (selectedProvincia.nombre === 'Ciudad Autónoma de Buenos Aires') {
        const caba = { nombre: 'Ciudad Autónoma de Buenos Aires', id: '02' };
        setMunicipios([caba]);
        setSelectedMunicipio(caba);
        setLocalidades([caba]);
        setSelectedLocalidad(caba);
      } else {
        fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvincia.nombre}&max=200`)
          .then(res => res.json())
          .then(data => {
            const filtrados = data.municipios.filter(m => !m.nombre.includes('Comuna'));
            const ordenados = filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            setMunicipios(ordenados);
            setSelectedMunicipio(null);
            setSelectedLocalidad(null);
            setLocalidades([]);
          })
          .catch(err => console.error('Error fetching municipios:', err));
      }
    } else {
      setMunicipios([]);
      setLocalidades([]);
      setSelectedMunicipio(null);
      setSelectedLocalidad(null);
    }
  }, [selectedProvincia]);

  useEffect(() => {
    if (
      selectedProvincia?.nombre !== 'Ciudad Autónoma de Buenos Aires' &&
      selectedMunicipio
    ) {
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio.nombre}&max=200`)
        .then(res => res.json())
        .then(data => {
          const unicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
            .map(nombre => data.localidades.find(a => a.nombre === nombre));
          const ordenadas = unicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setLocalidades(ordenadas);
          setSelectedLocalidad(null);
        })
        .catch(err => console.error('Error fetching localidades:', err));
    } else if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
      const caba = { nombre: 'Ciudad Autónoma de Buenos Aires', id: '02' };
      setLocalidades([caba]);
      setSelectedLocalidad(caba);
    } else {
      setLocalidades([]);
      setSelectedLocalidad(null);
    }
  }, [selectedMunicipio, selectedProvincia]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onUbicacionChange) {
      const domicilio = {
        provincia: selectedProvincia
          ? { nombre: selectedProvincia.nombre, codigo: selectedProvincia.id || selectedProvincia.codigo || '' }
          : null,
        municipio: selectedMunicipio
          ? { nombre: selectedMunicipio.nombre, codigo: selectedMunicipio.id || selectedMunicipio.codigo || '' }
          : null,
        localidad: selectedLocalidad
          ? { nombre: selectedLocalidad.nombre, codigo: selectedLocalidad.id || selectedLocalidad.codigo || '' }
          : null,
        direccion,
        latitud: 0,
        longitud: 0,
      };

      // Si es CABA, forzar todos los campos
      if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
        domicilio.provincia = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
        domicilio.municipio = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
        domicilio.localidad = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
      }

      onUbicacionChange(domicilio);
    }
  }, [selectedProvincia, selectedMunicipio, selectedLocalidad, direccion, onUbicacionChange]);

  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-semibold text-lg">Provincia:</span>
        </label>
        <select
          value={selectedProvincia?.nombre || ''}
          onChange={(e) => {
            const prov = provincias.find(p => p.nombre === e.target.value);
            setSelectedProvincia(prov || null);
          }}
          className="select select-bordered"
        >
          <option value="">Seleccione una provincia</option>
          {provincias.map(p => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {municipios.length > 0 && (
        <div className="form-control w-full max-w-xs mt-2">
          <label className="label">
            <span className="label-text font-semibold text-lg">Municipio:</span>
          </label>
          <select
            value={selectedMunicipio?.nombre || ''}
            onChange={(e) => {
              const muni = municipios.find(m => m.nombre === e.target.value);
              setSelectedMunicipio(muni || null);
            }}
            className="select select-bordered"
          >
            <option value="">Seleccione un municipio</option>
            {municipios.map(m => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {localidades.length > 0 && (
        <div className="form-control w-full max-w-xs mt-2">
          <label className="label">
            <span className="label-text font-semibold text-lg">Localidad:</span>
          </label>
          <select
            value={selectedLocalidad?.nombre || ''}
            onChange={(e) => {
              const loc = localidades.find(l => l.nombre === e.target.value);
              setSelectedLocalidad(loc || null);
            }}
            className="select select-bordered"
          >
            <option value="">Seleccione una localidad</option>
            {localidades.map(l => (
              <option key={l.id} value={l.nombre}>{l.nombre}</option>
            ))}
          </select>
        </div>
      )}

      <div className='form-control w-full max-w-xs mt-4'>
        <label className="label">
          <span className="label-text font-semibold text-lg">Dirección:</span>
        </label>
        <input
          type='text'
          placeholder="Dirección del evento"
          className="input input-bordered w-full"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputUbicacionEvento;


// import React, { useState, useEffect } from 'react';

// const InputUbicacionEvento = () => {
//   const [provincias, setProvincias] = useState([]);
//   const [municipios, setMunicipios] = useState([]);
//   const [localidades, setLocalidades] = useState([]);

//   const [selectedProvincia, setSelectedProvincia] = useState('');
//   const [selectedMunicipio, setSelectedMunicipio] = useState('');
//   const [selectedLocalidad, setSelectedLocalidad] = useState('');

//   useEffect(() => {
//     // Obtener provincias
//     fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
//       .then(response => response.json())
//       .then(data => {
//         const provinciasOrdenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
//         setProvincias(provinciasOrdenadas);
//       })
//       .catch(error => console.error('Error fetching provincias:', error));
//   }, []);

//   useEffect(() => {
//     if (selectedProvincia === 'Ciudad Autónoma de Buenos Aires') {
//       setMunicipios([{ nombre: 'Ciudad Autónoma de Buenos Aires' }]);
//       setSelectedMunicipio('Ciudad Autónoma de Buenos Aires');
//       setLocalidades([{ nombre: 'Ciudad Autónoma de Buenos Aires' }]);
//       setSelectedLocalidad('Ciudad Autónoma de Buenos Aires');
//     } else if (selectedProvincia) {
//       // Obtener municipios para la provincia seleccionada
//       fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvincia}&max=200`)
//         .then(response => response.json())
//         .then(data => {
//           // Filtrar municipios para excluir las comunas de la Ciudad Autónoma de Buenos Aires
//           const municipiosFiltrados = data.municipios.filter(municipio => !municipio.nombre.includes('Comuna'));
//           const municipiosOrdenados = municipiosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
//           setMunicipios(municipiosOrdenados);
//         })
//         .catch(error => console.error('Error fetching municipios:', error));
//     } else {
//       setMunicipios([]);
//       setLocalidades([]);
//     }
//     setSelectedMunicipio('');
//     setSelectedLocalidad('');
//   }, [selectedProvincia]);

//   useEffect(() => {
//     if (selectedMunicipio && selectedProvincia !== 'Ciudad Autónoma de Buenos Aires') {
//       // Obtener localidades para el municipio seleccionado
//       fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio}&max=200`)
//         .then(response => response.json())
//         .then(data => {
//           // Eliminar duplicados
//           const localidadesUnicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
//             .map(nombre => {
//               return data.localidades.find(a => a.nombre === nombre);
//             });
//           const localidadesOrdenadas = localidadesUnicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
//           setLocalidades(localidadesOrdenadas);
//         })
//         .catch(error => console.error('Error fetching localidades:', error));
//     } else {
//       setLocalidades([]);
//     }
//     setSelectedLocalidad('');
//   }, [selectedMunicipio, selectedProvincia]);

//   return (
//     <div>
//       <div className="form-control w-full max-w-xs">
//         <label className="label">
//           <span className="label-text font-semibold text-lg">Provincia:</span>
//         </label>
//         <select
//           value={selectedProvincia}
//           onChange={(e) => setSelectedProvincia(e.target.value)}
//           className="select select-bordered"
//         >
//           <option value="">Seleccione una provincia</option>
//           {provincias.map(provincia => (
//             <option key={provincia.id} value={provincia.nombre}>{provincia.nombre}</option>
//           ))}
//         </select>
//       </div>
//       {selectedProvincia && selectedProvincia !== 'Ciudad Autónoma de Buenos Aires' && (
//         <div className="form-control w-full max-w-xs">
//           <label className="label">
//             <span className="label-text font-semibold text-lg">Municipio:</span>
//           </label>
//           <select
//             value={selectedMunicipio}
//             onChange={(e) => setSelectedMunicipio(e.target.value)}
//             className="select select-bordered"
//           >
//             <option value="">Seleccione un municipio</option>
//             {municipios.map(municipio => (
//               <option key={municipio.id} value={municipio.nombre}>{municipio.nombre}</option>
//             ))}
//           </select>
//         </div>
//       )}
//       {selectedMunicipio && (
//         <div className="form-control w-full max-w-xs">
//           <label className="label">
//             <span className="label-text font-semibold text-lg">Localidad:</span>
//           </label>
//           <select
//             value={selectedLocalidad}
//             onChange={(e) => setSelectedLocalidad(e.target.value)}
//             className="select select-bordered"
//           >
//             <option value="">Seleccione una localidad</option>
//             {localidades.map(localidad => (
//               <option key={localidad.id} value={localidad.nombre}>{localidad.nombre}</option>
//             ))}
//           </select>
//         </div>
//       )}
//       <div className='form-control w-full max-w-xs'>
//         <label className="label">
//           <span className="label-text font-semibold text-lg">Dirección:</span>
//         </label>
//         <input type='text' placeholder="Dirección del evento" className="input input-bordered w-full" />
//       </div>
//     </div>
//   );
// };

// export default InputUbicacionEvento;


