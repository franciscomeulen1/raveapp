import React, { useEffect, useState, useContext } from 'react';
import api from '../../componenteapi/api';
import { AuthContext } from '../../context/AuthContext';

const InputEsEventoRecurrente = ({ onSeleccionRecurrente }) => {
  const { user } = useContext(AuthContext);
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [fiestas, setFiestas] = useState([]);
  const [errorFiestas, setErrorFiestas] = useState(false);
  const [fiestaSeleccionada, setFiestaSeleccionada] = useState('');
  const [nuevaFiesta, setNuevaFiesta] = useState('');

  // Función para capitalizar las primeras letras de cada palabra
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  useEffect(() => {
  const cargarFiestas = async () => {
    try {
      const response = await api.get(`/Fiesta/GetFiestas?IdUsuario=${user.id}`);
      const fiestasActivas = (response.data.fiestas || []).filter(f => f.isActivo);
      setFiestas(fiestasActivas);
      setErrorFiestas(fiestasActivas.length === 0);
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorFiestas(true); // Usuario sin fiestas cargadas
      } else {
        console.error('Error al obtener fiestas:', err);
      }
    }
  };

  if (user?.id && esRecurrente) {
    cargarFiestas();
  }
}, [user, esRecurrente]);

  useEffect(() => {
    if (esRecurrente) {
      const textoIngresado = nuevaFiesta.trim();
      const normalizado = toTitleCase(textoIngresado);
      const fiestaExistenteDirecta = fiestas.find(f => f.idFiesta === fiestaSeleccionada);

      // Comparar el nombre ingresado con los nombres de fiestas existentes (normalizado)
      const fiestaConNombreCoincidente = fiestas.find(f =>
        f.dsNombre.trim().toLowerCase() === normalizado.toLowerCase()
      );

      const fiestaUsar = fiestaExistenteDirecta || fiestaConNombreCoincidente;

      const validacion = !!(fiestaUsar || normalizado);

      onSeleccionRecurrente({
        esRecurrente: true,
        idFiesta: fiestaUsar?.idFiesta || null,
        nombreFiestaNueva: fiestaUsar ? null : normalizado || null,
        valido: validacion,
      });
    } else {
      onSeleccionRecurrente({ esRecurrente: false, idFiesta: null, nombreFiestaNueva: null, valido: true });
    }
  }, [esRecurrente, fiestaSeleccionada, nuevaFiesta, fiestas, onSeleccionRecurrente]);

  return (
    <div>
      <div className='form-control mb-4'>
        <label className='cursor-pointer label justify-start'>
          <input
            type='checkbox'
            className='checkbox checkbox-accent mr-2'
            checked={esRecurrente}
            onChange={() => setEsRecurrente(!esRecurrente)}
          />
          <span className='label-text'>Este evento es recurrente</span>
        </label>
      </div>

      {esRecurrente && (
        <div className='mb-4'>
          {errorFiestas ? (
            <p className="text-yellow-700 font-medium mb-3">
              No tienes fiestas recurrentes cargadas en sistema. Crea el nombre de tu fiesta recurrente:
            </p>
          ) : fiestas.length > 0 ? (
            <>
              <label className='label'>
                <span className='label-text font-semibold text-lg'>Selecciona una fiesta recurrente:</span>
              </label>
              <select
                className='select select-bordered w-full max-w-lg'
                value={fiestaSeleccionada}
                onChange={(e) => {
                  setFiestaSeleccionada(e.target.value);
                  setNuevaFiesta('');
                }}
              >
                <option value=''>Selecciona una opción</option>
                {fiestas.map((fiesta) => (
                  <option key={fiesta.idFiesta} value={fiesta.idFiesta}>
                    {fiesta.dsNombre}
                  </option>
                ))}
              </select>

              <label className='label mt-2'>
                <span className='label-text font-semibold text-lg'>O crea una nueva:</span>
              </label>
            </>
          ) : null}

          <input
            type='text'
            placeholder='Nombre de la nueva fiesta'
            className='input input-bordered w-full max-w-lg'
            value={nuevaFiesta}
            onChange={(e) => {
              setNuevaFiesta(e.target.value);
              setFiestaSeleccionada('');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InputEsEventoRecurrente;





// import React, { useState } from 'react';

// const InputEsEventoRecurrente = () => {

    
//     const [esRecurrente, setEsRecurrente] = useState(false);
//     // eslint-disable-next-line no-unused-vars
//     const [fiestasRecurrentes, setFiestasRecurrentes] = useState(["Fiesta X", "Club 69", "Techno Vibes"]); // Simulación de datos
//     const [fiestaSeleccionada, setFiestaSeleccionada] = useState('');
//     const [nuevaFiesta, setNuevaFiesta] = useState('');

//     return (
//         <div>
//             <div className='form-control mb-4'>
//                 <label className='cursor-pointer label justify-start'>
//                     <input
//                         type='checkbox'
//                         className='checkbox checkbox-accent mr-2'
//                         checked={esRecurrente}
//                         onChange={() => setEsRecurrente(!esRecurrente)}
//                     />
//                     <span className='label-text'>Este evento es recurrente</span>
//                 </label>
//             </div>

//             {esRecurrente && (
//                 <div className='mb-4'>
//                     <label className='label'>
//                         <span className='label-text font-semibold text-lg'>Selecciona una fiesta recurrente:</span>
//                     </label>
//                     <select
//                         className='select select-bordered w-full max-w-lg'
//                         value={fiestaSeleccionada}
//                         onChange={(e) => setFiestaSeleccionada(e.target.value)}
//                     >
//                         <option value=''>Selecciona una opción</option>
//                         {fiestasRecurrentes.map((fiesta, index) => (
//                             <option key={index} value={fiesta}>{fiesta}</option>
//                         ))}
//                     </select>

//                     <label className='label mt-2'>
//                         <span className='label-text font-semibold text-lg'>O crea una nueva:</span>
//                     </label>
//                     <input
//                         type='text'
//                         placeholder='Nombre de la nueva fiesta'
//                         className='input input-bordered w-full max-w-lg'
//                         value={nuevaFiesta}
//                         onChange={(e) => setNuevaFiesta(e.target.value)}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InputEsEventoRecurrente;