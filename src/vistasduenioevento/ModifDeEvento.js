import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ModifFechaHoraEvento from '../components/componentsModifEvento/ModifFechaHoraEvento';
import ModifEntradasCantPrecio from '../components/componentsModifEvento/ModifEntradasCantPrecio';

// Función para convertir "DD/MM/YYYY" a "YYYY-MM-DD" (formato que entiende el input date)
const convertDateToInput = (fecha) => {
  if (!fecha) return '';
  const parts = fecha.split('/');
  if (parts.length !== 3) return fecha;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Función para convertir "YYYY-MM-DD" a "DD/MM/YYYY"
const convertInputToDisplay = (inputDate) => {
  if (!inputDate) return '';
  const parts = inputDate.split('-');
  if (parts.length !== 3) return inputDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const ModifDeEvento = ({ onSave, onCancel }) => {
  const { state } = useLocation();
  const evento = state?.evento;

  const [nombre, setNombre] = useState(evento?.nombre || '');
  const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
  // Estado para fechas y horarios: convertimos cada fecha al formato que entiende el input (YYYY-MM-DD)
  const [dias, setDias] = useState(
    evento?.dias && Array.isArray(evento.dias) && evento.dias.length > 0
      ? evento.dias.map(d => ({ ...d, fecha: convertDateToInput(d.fecha) }))
      : [{ fecha: '', horaInicio: '', horaFin: '' }]
  );
  const [artistas, setArtistas] = useState(evento?.artistas || []);
  const [ubicacion, setUbicacion] = useState(evento?.ubicacion || {});
  // Estado para las entradas. Se espera que cada día tenga una propiedad "entradas" (array)
  const [entradas, setEntradas] = useState(
    evento?.dias && Array.isArray(evento.dias) && evento.dias.length > 0
      ? evento.dias.map(d => d.entradas || [])
      : []
  );

  useEffect(() => {
    if (evento) {
      setNombre(evento.nombre || '');
      setDescripcion(evento.descripcion || '');
      setDias(
        evento.dias && Array.isArray(evento.dias) && evento.dias.length > 0
          ? evento.dias.map(d => ({ ...d, fecha: convertDateToInput(d.fecha) }))
          : [{ fecha: '', horaInicio: '', horaFin: '' }]
      );
      setArtistas(evento.artistas || []);
      setUbicacion(evento.ubicacion || {});
      setEntradas(
        evento.dias && Array.isArray(evento.dias) && evento.dias.length > 0
          ? evento.dias.map(d => d.entradas || [])
          : []
      );
    }
  }, [evento]);

  const handleDiaChange = (index, field, value) => {
    const updatedDias = [...dias];
    updatedDias[index] = { ...updatedDias[index], [field]: value };
    setDias(updatedDias);
  };

  // "onChange" que se pasa al componente de entradas para actualizar el estado "entradas"
  const handleEntradasChange = (updatedEntradas) => {
    setEntradas(updatedEntradas);
  };

  const handleSave = () => {
    // Para cada día, convertimos la fecha de vuelta al formato "DD/MM/YYYY" y agregamos las entradas modificadas
    const updatedDias = dias.map((dia, index) => ({
      ...dia,
      fecha: convertInputToDisplay(dia.fecha),
      entradas: entradas[index] || []
    }));
    const updatedEvento = { ...evento, nombre, descripcion, dias: updatedDias, artistas, ubicacion };
    onSave(updatedEvento);
  };

  return (
    <div className="sm:px-10 flex flex-col min-h-screen">
      <NavBar />
      <div className="px-6 pb-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 underline underline-offset-8">Modificar Evento</h2>
        <p className="font-bold">
          <span className="text-red-700">* Importante:</span> Si modificás la dirección, las fechas, horarios, entradas o artistas, se enviará un mail a los usuarios que ya adquirieron una entrada, notificándoles de los cambios y ofreciéndoles la opción de devolución/reembolso.
        </p>
        <div className="form-control mb-4">
          <label className="label font-semibold text-lg">Nombre del Evento:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control mb-4">
          <label className="label font-semibold text-lg">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        
        {/* Componente para modificar artistas */}
        <InputDeArtistas selectedArtists={artistas} setSelectedArtists={setArtistas} />
        {/* Componente para modificar la ubicación */}
        <InputUbicacionEvento selectedUbicacion={ubicacion} setSelectedUbicacion={setUbicacion} />

        {/* Componente para modificar fechas y horarios */}
        <ModifFechaHoraEvento dias={dias} handleDiaChange={handleDiaChange} />

        {/* Componente para modificar las entradas por día */}
        <ModifEntradasCantPrecio entradasEvento={entradas} onChange={handleEntradasChange} />

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={handleSave} className="btn btn-success">
            Guardar cambios
          </button>
          <button onClick={onCancel} className="btn btn-error mr-2">
            Cancelar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModifDeEvento;




// import React, { useState, useEffect } from 'react';
// import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
// import InputFechaHora from '../components/componentsCrearEvento/InputFechaHora';
// import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

// const ModifDeEvento = ({ evento, onSave, onCancel }) => {
//     // Inicializamos los estados con los valores del objeto evento completo
//     const [nombre, setNombre] = useState(evento?.nombre || '');
//     const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
//     const [fechaHora, setFechaHora] = useState(evento?.fecha || '');
//     const [artistas, setArtistas] = useState(evento?.artistas || []);
//     const [ubicacion, setUbicacion] = useState(evento?.ubicacion || {});

//     // UseEffect para actualizar el estado en caso de que el evento cambie
//     useEffect(() => {
//         if (evento) {
//             setNombre(evento.nombre || '');
//             setDescripcion(evento.descripcion || '');
//             setFechaHora(evento.fecha || '');
//             setArtistas(evento.artistas || []);
//             setUbicacion(evento.ubicacion || {});
//         }
//     }, [evento]);

//     const handleSave = () => {
//         // Creando el objeto de evento actualizado con los valores modificados
//         const updatedEvento = { ...evento, nombre, descripcion, fechaHora, artistas, ubicacion };
//         onSave(updatedEvento); // Llamando a la función onSave con el evento actualizado
//     };

//     return (
//         <div className="sm:px-10 flex flex-col min-h-screen">
//             <NavBar />
//             <div className="px-6 pb-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
//                 <h2 className="text-2xl font-bold mb-4 underline underline-offset-8">Modificar Evento</h2>
//                 <p className='font-bold'><span className='text-red-700'>* Importante:</span> Si debes modificar la dirección, la fecha, el horario, o los artistas que toquen en la fiesta, se le enviará un mail automáticamente a los usuarios que ya hayan adquirido una entrada, para notificarles de los cambios, con la opción de devolución/reembolso de la entrada.</p>
//                 <div className="form-control mb-4">
//                     <label className="label font-semibold text-lg">Nombre del Evento:</label>
//                     <input
//                         type="text"
//                         value={nombre}
//                         onChange={(e) => setNombre(e.target.value)}
//                         className="input input-bordered w-full"
//                     />
//                 </div>

//                 <div className="form-control mb-4">
//                     <label className="label font-semibold text-lg">Descripción:</label>
//                     <textarea
//                         value={descripcion}
//                         onChange={(e) => setDescripcion(e.target.value)}
//                         className="textarea textarea-bordered w-full"
//                     />
//                 </div>

//                 <InputFechaHora label="Fecha y Hora" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />

//                 <InputDeArtistas selectedArtists={artistas} setSelectedArtists={setArtistas} />

//                 <InputUbicacionEvento selectedUbicacion={ubicacion} setSelectedUbicacion={setUbicacion} />

//                 <div className="flex justify-center gap-3 mt-4">
//                     <button onClick={handleSave} className="btn btn-success">Guardar cambios</button>
//                     <button onClick={onCancel} className="btn btn-error mr-2">Cancelar</button>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default ModifDeEvento;
