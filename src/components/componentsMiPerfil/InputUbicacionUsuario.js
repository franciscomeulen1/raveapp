// InputUbicacionUsuario.js corregido para precargar municipio y localidad
import React, { useState, useEffect } from 'react';

const InputUbicacionUsuario = ({ initialProvincia, initialMunicipio, initialLocalidad, onUbicacionChange, disabled = false }) => {
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);

  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
      .then(res => res.json())
      .then(data => {
        const ordenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProvincias(ordenadas);
        const prov = ordenadas.find(p => p.nombre === initialProvincia);
        if (prov) setSelectedProvincia(prov);
      })
      .catch(err => console.error('Error fetching provincias:', err));
  }, [initialProvincia]);

  // Cuando selecciono provincia, traigo municipios
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
            if (initialMunicipio) {
              const muni = ordenados.find(m => m.nombre === initialMunicipio);
              if (muni) setSelectedMunicipio(muni);
            }
          })
          .catch(err => console.error('Error fetching municipios:', err));
      }
    } else {
      setMunicipios([]);
      setSelectedMunicipio(null);
      setLocalidades([]);
      setSelectedLocalidad(null);
    }
  }, [selectedProvincia, initialMunicipio]);

  // Cuando selecciono municipio, traigo localidades
  useEffect(() => {
    if (selectedMunicipio && selectedProvincia?.nombre !== 'Ciudad Autónoma de Buenos Aires') {
      fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio.nombre}&max=200`)
        .then(res => res.json())
        .then(data => {
          const unicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
            .map(nombre => data.localidades.find(a => a.nombre === nombre));
          const ordenadas = unicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setLocalidades(ordenadas);
          if (initialLocalidad) {
            const loc = ordenadas.find(l => l.nombre === initialLocalidad);
            if (loc) setSelectedLocalidad(loc);
          }
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
  }, [selectedMunicipio, selectedProvincia, initialLocalidad]);

  const notifyChange = (provincia, municipio, localidad) => {
    if (onUbicacionChange) {
      onUbicacionChange({
        provincia: provincia ? { nombre: provincia.nombre, id: provincia.id } : null,
        municipio: municipio ? { nombre: municipio.nombre, id: municipio.id } : null,
        localidad: localidad ? { nombre: localidad.nombre, id: localidad.id } : null,
      });
    }
  };

  const handleProvinciaChange = (value) => {
    const prov = provincias.find(p => p.nombre === value);
    setSelectedProvincia(prov || null);
    setSelectedMunicipio(null);
    setSelectedLocalidad(null);
    notifyChange(prov, null, null);
  };

  const handleMunicipioChange = (value) => {
    const muni = municipios.find(m => m.nombre === value);
    setSelectedMunicipio(muni || null);
    setSelectedLocalidad(null);
    notifyChange(selectedProvincia, muni, null);
  };

  const handleLocalidadChange = (value) => {
    const loc = localidades.find(l => l.nombre === value);
    setSelectedLocalidad(loc || null);
    notifyChange(selectedProvincia, selectedMunicipio, loc);
  };

  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-semibold text-lg">Provincia:</span>
        </label>
        <select
          value={selectedProvincia?.nombre || ''}
          onChange={e => handleProvinciaChange(e.target.value)}
          className="select select-bordered"
          disabled={disabled} // 🚀 aquí
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
            onChange={e => handleMunicipioChange(e.target.value)}
            className="select select-bordered"
            disabled={disabled} // 🚀 aquí
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
            onChange={e => handleLocalidadChange(e.target.value)}
            className="select select-bordered"
            disabled={disabled} // 🚀 aquí
          >
            <option value="">Seleccione una localidad</option>
            {localidades.map(l => (
              <option key={l.id} value={l.nombre}>{l.nombre}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default InputUbicacionUsuario;

// // InputUbicacionUsuario.js corregido para precargar municipio y localidad
// import React, { useState, useEffect } from 'react';

// const InputUbicacionUsuario = ({ initialProvincia, initialMunicipio, initialLocalidad, onUbicacionChange }) => {
//   const [provincias, setProvincias] = useState([]);
//   const [municipios, setMunicipios] = useState([]);
//   const [localidades, setLocalidades] = useState([]);

//   const [selectedProvincia, setSelectedProvincia] = useState(null);
//   const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//   const [selectedLocalidad, setSelectedLocalidad] = useState(null);

//   useEffect(() => {
//     fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
//       .then(res => res.json())
//       .then(data => {
//         const ordenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
//         setProvincias(ordenadas);
//         const prov = ordenadas.find(p => p.nombre === initialProvincia);
//         if (prov) setSelectedProvincia(prov);
//       })
//       .catch(err => console.error('Error fetching provincias:', err));
//   }, [initialProvincia]);

//   // Cuando selecciono provincia, traigo municipios
//   useEffect(() => {
//     if (selectedProvincia) {
//       if (selectedProvincia.nombre === 'Ciudad Autónoma de Buenos Aires') {
//         const caba = { nombre: 'Ciudad Autónoma de Buenos Aires', id: '02' };
//         setMunicipios([caba]);
//         setSelectedMunicipio(caba);
//         setLocalidades([caba]);
//         setSelectedLocalidad(caba);
//       } else {
//         fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${selectedProvincia.nombre}&max=200`)
//           .then(res => res.json())
//           .then(data => {
//             const filtrados = data.municipios.filter(m => !m.nombre.includes('Comuna'));
//             const ordenados = filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
//             setMunicipios(ordenados);
//             if (initialMunicipio) {
//               const muni = ordenados.find(m => m.nombre === initialMunicipio);
//               if (muni) setSelectedMunicipio(muni);
//             }
//           })
//           .catch(err => console.error('Error fetching municipios:', err));
//       }
//     } else {
//       setMunicipios([]);
//       setSelectedMunicipio(null);
//       setLocalidades([]);
//       setSelectedLocalidad(null);
//     }
//   }, [selectedProvincia, initialMunicipio]);

//   // Cuando selecciono municipio, traigo localidades
//   useEffect(() => {
//     if (selectedMunicipio && selectedProvincia?.nombre !== 'Ciudad Autónoma de Buenos Aires') {
//       fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio.nombre}&max=200`)
//         .then(res => res.json())
//         .then(data => {
//           const unicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
//             .map(nombre => data.localidades.find(a => a.nombre === nombre));
//           const ordenadas = unicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
//           setLocalidades(ordenadas);
//           if (initialLocalidad) {
//             const loc = ordenadas.find(l => l.nombre === initialLocalidad);
//             if (loc) setSelectedLocalidad(loc);
//           }
//         })
//         .catch(err => console.error('Error fetching localidades:', err));
//     } else if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//       const caba = { nombre: 'Ciudad Autónoma de Buenos Aires', id: '02' };
//       setLocalidades([caba]);
//       setSelectedLocalidad(caba);
//     } else {
//       setLocalidades([]);
//       setSelectedLocalidad(null);
//     }
//   }, [selectedMunicipio, selectedProvincia, initialLocalidad]);

//   const notifyChange = (provincia, municipio, localidad) => {
//     if (onUbicacionChange) {
//       onUbicacionChange({
//         provincia: provincia ? { nombre: provincia.nombre, id: provincia.id } : null,
//         municipio: municipio ? { nombre: municipio.nombre, id: municipio.id } : null,
//         localidad: localidad ? { nombre: localidad.nombre, id: localidad.id } : null,
//       });
//     }
//   };

//   const handleProvinciaChange = (value) => {
//     const prov = provincias.find(p => p.nombre === value);
//     setSelectedProvincia(prov || null);
//     setSelectedMunicipio(null);
//     setSelectedLocalidad(null);
//     notifyChange(prov, null, null);
//   };

//   const handleMunicipioChange = (value) => {
//     const muni = municipios.find(m => m.nombre === value);
//     setSelectedMunicipio(muni || null);
//     setSelectedLocalidad(null);
//     notifyChange(selectedProvincia, muni, null);
//   };

//   const handleLocalidadChange = (value) => {
//     const loc = localidades.find(l => l.nombre === value);
//     setSelectedLocalidad(loc || null);
//     notifyChange(selectedProvincia, selectedMunicipio, loc);
//   };

//   return (
//     <div>
//       <div className="form-control w-full max-w-xs">
//         <label className="label">
//           <span className="label-text font-semibold text-lg">Provincia:</span>
//         </label>
//         <select
//           value={selectedProvincia?.nombre || ''}
//           onChange={e => handleProvinciaChange(e.target.value)}
//           className="select select-bordered"
//         >
//           <option value="">Seleccione una provincia</option>
//           {provincias.map(p => (
//             <option key={p.id} value={p.nombre}>{p.nombre}</option>
//           ))}
//         </select>
//       </div>

//       {municipios.length > 0 && (
//         <div className="form-control w-full max-w-xs mt-2">
//           <label className="label">
//             <span className="label-text font-semibold text-lg">Municipio:</span>
//           </label>
//           <select
//             value={selectedMunicipio?.nombre || ''}
//             onChange={e => handleMunicipioChange(e.target.value)}
//             className="select select-bordered"
//           >
//             <option value="">Seleccione un municipio</option>
//             {municipios.map(m => (
//               <option key={m.id} value={m.nombre}>{m.nombre}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {localidades.length > 0 && (
//         <div className="form-control w-full max-w-xs mt-2">
//           <label className="label">
//             <span className="label-text font-semibold text-lg">Localidad:</span>
//           </label>
//           <select
//             value={selectedLocalidad?.nombre || ''}
//             onChange={e => handleLocalidadChange(e.target.value)}
//             className="select select-bordered"
//           >
//             <option value="">Seleccione una localidad</option>
//             {localidades.map(l => (
//               <option key={l.id} value={l.nombre}>{l.nombre}</option>
//             ))}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InputUbicacionUsuario;