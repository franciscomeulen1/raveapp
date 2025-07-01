import React, { useState, useEffect, useContext } from 'react';
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
  const [entradasPorDia, setEntradasPorDia] = useState([]); 
  // eslint-disable-next-line
  const [hayEarlyBirdsPorDia, setHayEarlyBirdsPorDia] = useState([]);
  const [configFechasVenta, setConfigFechasVenta] = useState([]);
  const [configEntradas, setConfigEntradas] = useState([]);

  // Cargar artistas desde API
  useEffect(() => {
    const cargarArtistas = async () => {
      if (!evento?.artistas || !Array.isArray(evento.artistas)) return;
      const promesas = evento.artistas.map(async id => {
        const res = await api.get(`/Artista/GetArtista?idArtista=${id}`);
        return res.data;
      });

      const artistasCompletos = await Promise.all(promesas);
      setArtistasSeleccionados(artistasCompletos);
    };

    cargarArtistas();
  }, [evento]);

  // Cargar fechas
  useEffect(() => {
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

  const validarFormulario = () => {
    if (!nombreEvento.trim()) return alert('Ingresá el nombre del evento.');
    if (!ubicacionEvento?.provincia || !ubicacionEvento?.direccion) return alert('Completá los datos de ubicación.');
    if (!generosSeleccionados.length) return alert('Seleccioná al menos un género.');
    if (!artistasSeleccionados.length) return alert('Seleccioná al menos un artista.');
    if (!descripcionEvento.trim()) return alert('Ingresá una descripción.');
    if (!fechaHoraEvento.length) return alert('Completá las fechas y horarios.');
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
        idEvento: evento.id,
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
        idFiesta: idFiestaFinal
      };

      await api.put('/Evento/UpdateEvento', payload);

      alert('Evento actualizado correctamente.');
      navigate('/mis-eventos');
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      alert('Ocurrió un error al actualizar el evento.');
    }
  };

  return (
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

        <InputGeneroMusical
          onSeleccionGeneros={setGenerosSeleccionados}
          valorInicial={generosSeleccionados}
        />

        <InputDeArtistas
          onSeleccionarArtistas={setArtistasSeleccionados}
          artistasIniciales={artistasSeleccionados}
        />

        <InputUbicacionEvento
          onUbicacionChange={setUbicacionEvento}
          ubicacionInicial={ubicacionEvento}
        />

        <InputAfterOLbgt
          onSeleccion={setAfterOLgbt}
          valoresIniciales={afterOLgbt}
        />

        <InputDescripcionEvento
          onDescripcionChange={setDescripcionEvento}
          valorInicial={descripcionEvento}
        />

        <InputFechaHoraEvento
          diasEvento={fechaHoraEvento.length}
          onFechaHoraChange={setFechaHoraEvento}
          fechasIniciales={fechaHoraEvento}
        />

        <InputEntradasCantPrecio
          diasEvento={fechaHoraEvento.length}
          onEntradasPorDiaChange={setHayEarlyBirdsPorDia}
          onEntradasChange={setEntradasPorDia}
          entradasIniciales={entradasPorDia}
        />

        <InputConfigEntradas
         diasEvento={fechaHoraEvento.length}
        entradasPorDia={entradasPorDia}
        onConfigEntradasChange={setConfigEntradas}
        configInicial={configEntradas}
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