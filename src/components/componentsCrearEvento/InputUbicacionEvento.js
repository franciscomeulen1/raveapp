import React, { useState, useEffect } from 'react';

const InputUbicacionEvento = ({ onUbicacionChange, ubicacionInicial }) => {
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [direccion, setDireccion] = useState('');

  // Cargar provincias
  useEffect(() => {
    fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
      .then(res => res.json())
      .then(data => {
        const ordenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProvincias(ordenadas);
      })
      .catch(err => console.error('Error fetching provincias:', err));
  }, []);

  // Precargar valores iniciales
  useEffect(() => {
    if (ubicacionInicial?.provincia?.nombre) {
      const cargarDesdeInicial = async () => {
        const provincia = ubicacionInicial.provincia;
        const municipio = ubicacionInicial.municipio;
        const localidad = ubicacionInicial.localidad;

        setSelectedProvincia(provincia);
        setSelectedMunicipio(municipio);
        setSelectedLocalidad(localidad);
        setDireccion(ubicacionInicial.direccion || '');

        // Solo si no es CABA, cargar municipios y localidades
        if (provincia.nombre !== 'Ciudad Autónoma de Buenos Aires') {
          try {
            const munRes = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia.nombre}&max=200`);
            const munData = await munRes.json();
            const munFiltrados = munData.municipios.filter(m => !m.nombre.includes('Comuna'));
            setMunicipios(munFiltrados);

            if (municipio?.nombre) {
              const locRes = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${municipio.nombre}&max=200`);
              const locData = await locRes.json();
              const unicas = Array.from(new Set(locData.localidades.map(a => a.nombre)))
                .map(nombre => locData.localidades.find(a => a.nombre === nombre));
              setLocalidades(unicas);
            }
          } catch (err) {
            console.error('Error cargando ubicación inicial:', err);
          }
        } else {
          const caba = { nombre: 'Ciudad Autónoma de Buenos Aires', id: '02' };
          setMunicipios([caba]);
          setLocalidades([caba]);
        }
      };

      cargarDesdeInicial();
    }
  }, [ubicacionInicial]);

  // Cargar municipios al seleccionar provincia
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
            setMunicipios(filtrados);
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

  // Cargar localidades al seleccionar municipio
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
          setLocalidades(unicas);
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

  // Notificar al padre
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
      {/* Provincia */}
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

      {/* Municipio */}
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

      {/* Localidad */}
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

      {/* Dirección */}
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

// const InputUbicacionEvento = ({ onUbicacionChange }) => {
//   const [provincias, setProvincias] = useState([]);
//   const [municipios, setMunicipios] = useState([]);
//   const [localidades, setLocalidades] = useState([]);

//   const [selectedProvincia, setSelectedProvincia] = useState(null);
//   const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//   const [selectedLocalidad, setSelectedLocalidad] = useState(null);
//   const [direccion, setDireccion] = useState('');

//   useEffect(() => {
//     fetch('https://apis.datos.gob.ar/georef/api/provincias?max=100')
//       .then(res => res.json())
//       .then(data => {
//         const ordenadas = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
//         setProvincias(ordenadas);
//       })
//       .catch(err => console.error('Error fetching provincias:', err));
//   }, []);

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
//             setSelectedMunicipio(null);
//             setSelectedLocalidad(null);
//             setLocalidades([]);
//           })
//           .catch(err => console.error('Error fetching municipios:', err));
//       }
//     } else {
//       setMunicipios([]);
//       setLocalidades([]);
//       setSelectedMunicipio(null);
//       setSelectedLocalidad(null);
//     }
//   }, [selectedProvincia]);

//   useEffect(() => {
//     if (
//       selectedProvincia?.nombre !== 'Ciudad Autónoma de Buenos Aires' &&
//       selectedMunicipio
//     ) {
//       fetch(`https://apis.datos.gob.ar/georef/api/localidades?municipio=${selectedMunicipio.nombre}&max=200`)
//         .then(res => res.json())
//         .then(data => {
//           const unicas = Array.from(new Set(data.localidades.map(a => a.nombre)))
//             .map(nombre => data.localidades.find(a => a.nombre === nombre));
//           const ordenadas = unicas.sort((a, b) => a.nombre.localeCompare(b.nombre));
//           setLocalidades(ordenadas);
//           setSelectedLocalidad(null);
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
//   }, [selectedMunicipio, selectedProvincia]);

//   // Notificar cambios al componente padre
//   useEffect(() => {
//     if (onUbicacionChange) {
//       const domicilio = {
//         provincia: selectedProvincia
//           ? { nombre: selectedProvincia.nombre, codigo: selectedProvincia.id || selectedProvincia.codigo || '' }
//           : null,
//         municipio: selectedMunicipio
//           ? { nombre: selectedMunicipio.nombre, codigo: selectedMunicipio.id || selectedMunicipio.codigo || '' }
//           : null,
//         localidad: selectedLocalidad
//           ? { nombre: selectedLocalidad.nombre, codigo: selectedLocalidad.id || selectedLocalidad.codigo || '' }
//           : null,
//         direccion,
//         latitud: 0,
//         longitud: 0,
//       };

//       // Si es CABA, forzar todos los campos
//       if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//         domicilio.provincia = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
//         domicilio.municipio = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
//         domicilio.localidad = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
//       }

//       onUbicacionChange(domicilio);
//     }
//   }, [selectedProvincia, selectedMunicipio, selectedLocalidad, direccion, onUbicacionChange]);

//   return (
//     <div>
//       <div className="form-control w-full max-w-xs">
//         <label className="label">
//           <span className="label-text font-semibold text-lg">Provincia:</span>
//         </label>
//         <select
//           value={selectedProvincia?.nombre || ''}
//           onChange={(e) => {
//             const prov = provincias.find(p => p.nombre === e.target.value);
//             setSelectedProvincia(prov || null);
//           }}
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
//             onChange={(e) => {
//               const muni = municipios.find(m => m.nombre === e.target.value);
//               setSelectedMunicipio(muni || null);
//             }}
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
//             onChange={(e) => {
//               const loc = localidades.find(l => l.nombre === e.target.value);
//               setSelectedLocalidad(loc || null);
//             }}
//             className="select select-bordered"
//           >
//             <option value="">Seleccione una localidad</option>
//             {localidades.map(l => (
//               <option key={l.id} value={l.nombre}>{l.nombre}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       <div className='form-control w-full max-w-xs mt-4'>
//         <label className="label">
//           <span className="label-text font-semibold text-lg">Dirección:</span>
//         </label>
//         <input
//           type='text'
//           placeholder="Dirección del evento"
//           className="input input-bordered w-full"
//           value={direccion}
//           onChange={(e) => setDireccion(e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default InputUbicacionEvento;