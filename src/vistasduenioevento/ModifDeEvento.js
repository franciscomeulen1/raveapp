import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas'; // ok
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento'; // ok
import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento'; // ok
import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio'; // ok
import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas'; // ok
import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical'; // ok
import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento'; // ok
import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt'; // ok
import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const ModifDeEvento = () => {
  const { state } = useLocation();
  const evento = state?.evento;

  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user } = useContext(AuthContext);

  const [nombreEvento, setNombreEvento] = useState(evento?.nombre || '');
  const [descripcionEvento, setDescripcionEvento] = useState(evento?.descripcion || '');
  const [generosSeleccionados, setGenerosSeleccionados] = useState(evento?.genero || []);
  const [ubicacionEvento, setUbicacionEvento] = useState(evento?.domicilio || null);
  const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
  const [afterOLgbt, setAfterOLgbt] = useState({
    isAfter: evento?.isAfter || false,
    isLgbt: evento?.isLgbt || false
  });
  const [fechaHoraEvento, setFechaHoraEvento] = useState([]);

  const setFechaHoraEventoCallback = useCallback((nuevasFechas) => {
   setFechaHoraEvento(nuevasFechas);
  }, []);

  const [entradasPorDia, setEntradasPorDia] = useState([]); 
  // eslint-disable-next-line
  const [hayEarlyBirdsPorDia, setHayEarlyBirdsPorDia] = useState([]);
  const [configFechasVenta, setConfigFechasVenta] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [configEntradas, setConfigEntradas] = useState([]);
  
  const [multimedia, setMultimedia] = useState({
  soundCloud: evento?.soundCloud || '',
  videoUrl: ''
  });
  const [errorMultimedia, setErrorMultimedia] = useState(false);

  const [mediaImagenUrl, setMediaImagenUrl] = useState(null);
  const [mediaVideoUrl, setMediaVideoUrl] = useState('');

  // Cargar artistas desde API
  useEffect(() => {
  if (!evento?.artistas || !Array.isArray(evento.artistas)) return;

  const artistasCompletos = evento.artistas.map(a => ({
    id: a.idArtista,
    nombre: a.nombre,
    esNuevo: false
  }));

  setArtistasSeleccionados(artistasCompletos);
}, [evento]);

  // Cargar fechas
  useEffect(() => {

      console.log('Evento recibido:', evento);
    if (!evento?.fechas) return;

    setFechaHoraEvento(
      evento.fechas.map(f => ({
        idFecha: f.idFecha,
        inicio: f.inicio,
        fin: f.fin
      }))
    );

    setHayEarlyBirdsPorDia([]);
    setConfigFechasVenta([]);
  }, [evento]);


  const eventoId = evento?.idEvento;

useEffect(() => {
  if (!eventoId) return;

  const fetchMedia = async () => {
    try {
      const resp = await api.get(`/Media?idEntidadMedia=${eventoId}`);
      const medias = resp.data.media || [];

      const imagen = medias.find(m => m.url);
      const video = medias.find(m => m.mdVideo);

      setMediaImagenUrl(imagen?.url || null);
      setMediaVideoUrl(video?.mdVideo || '');
    } catch (err) {
      console.error('Error al cargar multimedia:', err);
    }
  };

  fetchMedia();
}, [eventoId]);

useEffect(() => {
  const fetchEntradasYFechasVenta = async () => {
    if (!evento?.fechas || evento.fechas.length === 0) return;

    try {
      const entradasPorFecha = [];
      const fechasVentaConfig = [];

      for (const fecha of evento.fechas) {
        const { idFecha } = fecha;

        // GET Entradas por fecha
        const resEntradas = await api.get(`/Entrada/GetEntradasFecha?IdFecha=${idFecha}`);
        const entradas = resEntradas.data;

        // Inicializar objeto vacío para ese día
        const entradaDia = {
          generales: 0,
          generalesEarly: 0,
          vip: 0,
          vipEarly: 0,
          generalesPrice: '',
          generalesEarlyPrice: '',
          vipPrice: '',
          vipEarlyPrice: '',
        };

        for (const entrada of entradas) {
          const { tipo, cantidad, precio } = entrada;
          const cdTipo = tipo.cdTipo;
          switch (cdTipo) {
            case 0:
              entradaDia.generales = cantidad;
              entradaDia.generalesPrice = precio.toString();
              break;
            case 1:
              entradaDia.generalesEarly = cantidad;
              entradaDia.generalesEarlyPrice = precio.toString();
              break;
            case 2:
              entradaDia.vip = cantidad;
              entradaDia.vipPrice = precio.toString();
              break;
            case 3:
              entradaDia.vipEarly = cantidad;
              entradaDia.vipEarlyPrice = precio.toString();
              break;
            default:
              break;
          }
        }

        entradasPorFecha.push(entradaDia);

        fechasVentaConfig.push({
          inicioVenta: fecha.inicioVenta ? fecha.inicioVenta.slice(0, 16) : '',
          finVentaGeneralVip: fecha.finVenta ? fecha.finVenta.slice(0, 16) : '',
        });
      }

      setEntradasPorDia(entradasPorFecha);
      setConfigFechasVenta(fechasVentaConfig);
    } catch (error) {
      console.error('Error al cargar entradas y configuración de fechas:', error);
    }
  };

  fetchEntradasYFechasVenta();
}, [evento?.fechas]);





  const validarFormulario = () => {
    if (!nombreEvento.trim()) return alert('Ingresá el nombre del evento.');
    if (!ubicacionEvento?.provincia || !ubicacionEvento?.direccion) return alert('Completá los datos de ubicación.');
    if (!generosSeleccionados.length) return alert('Seleccioná al menos un género.');
    if (!artistasSeleccionados.length) return alert('Seleccioná al menos un artista.');
    if (!descripcionEvento.trim()) return alert('Ingresá una descripción.');
    if (!fechaHoraEvento.length) return alert('Completá las fechas y horarios.');
    if (errorMultimedia) {
      alert('El link de SoundCloud no es válido. Solo se aceptan enlaces de soundcloud.com.');
       return false;
    }
    return true;
  };

  const resolverIdFiesta = async () => {
    return evento?.idFiesta || null;
  };

  const actualizarEvento = async () => {
    if (!validarFormulario()) return;

    try {
      const idFiestaFinal = await resolverIdFiesta();

      const payload = {
        idEvento: evento.idEvento,
        idArtistas: artistasSeleccionados.map(a => a.id),
        domicilio: ubicacionEvento,
        nombre: nombreEvento,
        descripcion: descripcionEvento,
        genero: generosSeleccionados,
        isAfter: afterOLgbt.isAfter,
        isLgbt: afterOLgbt.isLgbt,
        inicioEvento: fechaHoraEvento[0]?.inicio,
        finEvento: fechaHoraEvento[fechaHoraEvento.length - 1]?.fin,
        estado: evento.cdEstado,
        fechas: fechaHoraEvento.map((dia, i) => ({
          idFecha: dia.idFecha,
          inicio: dia.inicio,
          fin: dia.fin,
          inicioVenta: configFechasVenta[i]?.inicioVenta || '2025-01-01T00:00:00',
          finVenta: configFechasVenta[i]?.finVentaGeneralVip || '2025-01-02T00:00:00',
          estado: 0
        })),
        idFiesta: idFiestaFinal,
        soundCloud: multimedia.soundCloud?.trim() || null
      };

      console.log(payload);

      await api.put('/Evento/UpdateEvento', payload);
      await actualizarMultimedia();
      alert('Evento actualizado correctamente.');
      navigate('/mis-eventos-creados');
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      alert('Ocurrió un error al actualizar el evento.');
    }
  };

  const actualizarMultimedia = async () => {
  try {
    const mediaResp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
    const medias = mediaResp.data.media || [];

    const imagenExistente = medias.find(m => m.url);
    const videoExistente = medias.find(m => m.mdVideo);

    // 📸 Reemplazo de imagen
    if (multimedia.file) {
      if (imagenExistente?.idMedia) {
        await api.delete(`/Media/${imagenExistente.idMedia}`);
      }

      const formData = new FormData();
      formData.append('IdEntidadMedia', evento.idEvento);
      formData.append('File', multimedia.file);
      // formData.append('Video', null);

      await api.post('/Media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    // 🎬 Reemplazo de video
    if (multimedia.videoUrl) {
      if (videoExistente?.idMedia) {
        await api.delete(`/Media/${videoExistente.idMedia}`);
      }

      const formDataVideo = new FormData();
      formDataVideo.append('IdEntidadMedia', evento.idEvento);
      formDataVideo.append('File', null);
      formDataVideo.append('Video', multimedia.videoUrl);

      await api.post('/Media', formDataVideo, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

  } catch (err) {
    console.error('Error al actualizar multimedia:', err);
    alert('Error al actualizar la imagen o video del evento.');
  }
};



  return (
    <div className="flex flex-col min-h-screen">
    <div className="sm:px-10 mb-11">
      <NavBar />
      <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">Modificar Evento</h1>

      <form className="px-10">
        <div className="form-control w-full mb-4">
          <label className="label font-semibold text-lg">Nombre del evento:</label>
          <input
            type="text"
            className="input input-bordered w-full max-w-lg"
            value={nombreEvento}
            onChange={(e) => setNombreEvento(e.target.value)}
          />
        </div>

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputGeneroMusical
          onSeleccionGeneros={setGenerosSeleccionados}
          valorInicial={generosSeleccionados}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputDeArtistas
          onSeleccionarArtistas={setArtistasSeleccionados}
          artistasIniciales={artistasSeleccionados}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputUbicacionEvento
          onUbicacionChange={setUbicacionEvento}
          ubicacionInicial={ubicacionEvento}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputAfterOLbgt
          onSeleccion={setAfterOLgbt}
          valoresIniciales={afterOLgbt}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputDescripcionEvento
          onDescripcionChange={setDescripcionEvento}
          valorInicial={descripcionEvento}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        {/* <InputFechaHoraEvento
         diasEvento={fechaHoraEvento.length}
         onFechaHoraChange={setFechaHoraEventoCallback}
         fechasIniciales={fechaHoraEvento}
        /> */}
        {fechaHoraEvento.length > 0 && (
  <InputFechaHoraEvento
    diasEvento={fechaHoraEvento.length}
    onFechaHoraChange={setFechaHoraEventoCallback}
    fechasIniciales={fechaHoraEvento}
  />
)}

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        {/* <InputEntradasCantPrecio
          diasEvento={fechaHoraEvento.length}
          onEntradasPorDiaChange={setHayEarlyBirdsPorDia}
          onEntradasChange={setEntradasPorDia}
          entradasIniciales={entradasPorDia}
        /> */}
        <InputEntradasCantPrecio
          diasEvento={fechaHoraEvento.length}
          onEntradasPorDiaChange={setHayEarlyBirdsPorDia}
          onEntradasChange={setEntradasPorDia}
          entradasIniciales={entradasPorDia}
          soloEditarPrecios={true}
        />


        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

        <InputConfigEntradas
         diasEvento={fechaHoraEvento.length}
        entradasPorDia={entradasPorDia}
        // onConfigEntradasChange={setConfigEntradas}
        onConfigEntradasChange={setConfigFechasVenta}
        // configInicial={configEntradas}
        configInicial={configFechasVenta}
        />

        <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputMultimedia
           onMultimediaChange={setMultimedia}
           onErrorChange={setErrorMultimedia}
           imagenInicial={mediaImagenUrl}
           videoInicial={mediaVideoUrl}
           soundCloudInicial={evento?.soundCloud}
           />

        <div className="form-control mb-4 mt-6">
          <label className="cursor-pointer label justify-start">
            <input type="checkbox" className="checkbox checkbox-accent mr-2" />
            <span className="label-text">Confirmo que deseo modificar el evento</span>
          </label>
        </div>

        <button
          type="button"
          onClick={actualizarEvento}
          className="btn btn-primary bg-blue-600 text-white rounded-xl"
        >
          Guardar cambios
        </button>
      </form>
      
    </div>
    <Footer />
    </div>
  );
};

export default ModifDeEvento;





// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
// import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import ModifFechaHoraEvento from '../components/componentsModifEvento/ModifFechaHoraEvento';
// import ModifEntradasCantPrecio from '../components/componentsModifEvento/ModifEntradasCantPrecio';

// // Función para convertir "DD/MM/YYYY" a "YYYY-MM-DD" (formato que entiende el input date)
// const convertDateToInput = (fecha) => {
//   if (!fecha) return '';
//   const parts = fecha.split('/');
//   if (parts.length !== 3) return fecha;
//   const [day, month, year] = parts;
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// };

// // Función para convertir "YYYY-MM-DD" a "DD/MM/YYYY"
// const convertInputToDisplay = (inputDate) => {
//   if (!inputDate) return '';
//   const parts = inputDate.split('-');
//   if (parts.length !== 3) return inputDate;
//   const [year, month, day] = parts;
//   return `${day}/${month}/${year}`;
// };

// const ModifDeEvento = ({ onSave, onCancel }) => {
//   const { state } = useLocation();
//   const evento = state?.evento;

//   const [nombre, setNombre] = useState(evento?.nombre || '');
//   const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
//   // Estado para fechas y horarios: convertimos cada fecha al formato que entiende el input (YYYY-MM-DD)
//   const [dias, setDias] = useState(
//     evento?.dias && Array.isArray(evento.dias) && evento.dias.length > 0
//       ? evento.dias.map(d => ({ ...d, fecha: convertDateToInput(d.fecha) }))
//       : [{ fecha: '', horaInicio: '', horaFin: '' }]
//   );
//   const [artistas, setArtistas] = useState(evento?.artistas || []);
//   const [ubicacion, setUbicacion] = useState(evento?.ubicacion || {});
//   // Estado para las entradas. Se espera que cada día tenga una propiedad "entradas" (array)
//   const [entradas, setEntradas] = useState(
//     evento?.dias && Array.isArray(evento.dias) && evento.dias.length > 0
//       ? evento.dias.map(d => d.entradas || [])
//       : []
//   );

//   useEffect(() => {
//     if (evento) {
//       setNombre(evento.nombre || '');
//       setDescripcion(evento.descripcion || '');
//       setDias(
//         evento.dias && Array.isArray(evento.dias) && evento.dias.length > 0
//           ? evento.dias.map(d => ({ ...d, fecha: convertDateToInput(d.fecha) }))
//           : [{ fecha: '', horaInicio: '', horaFin: '' }]
//       );
//       setArtistas(evento.artistas || []);
//       setUbicacion(evento.ubicacion || {});
//       setEntradas(
//         evento.dias && Array.isArray(evento.dias) && evento.dias.length > 0
//           ? evento.dias.map(d => d.entradas || [])
//           : []
//       );
//     }
//   }, [evento]);

//   const handleDiaChange = (index, field, value) => {
//     const updatedDias = [...dias];
//     updatedDias[index] = { ...updatedDias[index], [field]: value };
//     setDias(updatedDias);
//   };

//   // "onChange" que se pasa al componente de entradas para actualizar el estado "entradas"
//   const handleEntradasChange = (updatedEntradas) => {
//     setEntradas(updatedEntradas);
//   };

//   const handleSave = () => {
//     // Para cada día, convertimos la fecha de vuelta al formato "DD/MM/YYYY" y agregamos las entradas modificadas
//     const updatedDias = dias.map((dia, index) => ({
//       ...dia,
//       fecha: convertInputToDisplay(dia.fecha),
//       entradas: entradas[index] || []
//     }));
//     const updatedEvento = { ...evento, nombre, descripcion, dias: updatedDias, artistas, ubicacion };
//     onSave(updatedEvento);
//   };

//   return (
//     <div className="sm:px-10 flex flex-col min-h-screen">
//       <NavBar />
//       <div className="px-6 pb-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4 underline underline-offset-8">Modificar Evento</h2>
//         <p className="font-bold">
//           <span className="text-red-700">* Importante:</span> Si modificás la dirección, las fechas, horarios, entradas o artistas, se enviará un mail a los usuarios que ya adquirieron una entrada, notificándoles de los cambios y ofreciéndoles la opción de devolución/reembolso.
//         </p>
//         <div className="form-control mb-4">
//           <label className="label font-semibold text-lg">Nombre del Evento:</label>
//           <input
//             type="text"
//             value={nombre}
//             onChange={(e) => setNombre(e.target.value)}
//             className="input input-bordered w-full"
//           />
//         </div>
//         <div className="form-control mb-4">
//           <label className="label font-semibold text-lg">Descripción:</label>
//           <textarea
//             value={descripcion}
//             onChange={(e) => setDescripcion(e.target.value)}
//             className="textarea textarea-bordered w-full"
//           />
//         </div>
        
//         {/* Componente para modificar artistas */}
//         <InputDeArtistas selectedArtists={artistas} setSelectedArtists={setArtistas} />
//         {/* Componente para modificar la ubicación */}
//         <InputUbicacionEvento selectedUbicacion={ubicacion} setSelectedUbicacion={setUbicacion} />

//         {/* Componente para modificar fechas y horarios */}
//         <ModifFechaHoraEvento dias={dias} handleDiaChange={handleDiaChange} />

//         {/* Componente para modificar las entradas por día */}
//         <ModifEntradasCantPrecio entradasEvento={entradas} onChange={handleEntradasChange} />

//         <div className="flex justify-center gap-3 mt-4">
//           <button onClick={handleSave} className="btn btn-success">
//             Guardar cambios
//           </button>
//           <button onClick={onCancel} className="btn btn-error mr-2">
//             Cancelar
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ModifDeEvento;