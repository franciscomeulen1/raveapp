// TablaDeEntradas.js
import React, { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

export default function TablaDeEntradas({ idFecha, diaIndex, estadoFecha, onCantidadChange }) {
  const [entradasDisponibles, setEntradasDisponibles] = useState([]);

  const disabledMode = estadoFecha !== 2; // true para "Aprobado" (1) u otros, habilitado solo si

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        // Si la fecha está "En venta" (2), traemos SOLO disponibles (Estado=0).
        // Si NO está "En venta", traemos todas las configuradas para mostrarlas grisadas (sin &Estado=0).
        const urlEntradas =
          estadoFecha === 2
            ? `/Entrada/GetEntradasFecha?IdFecha=${idFecha}&Estado=0`
            : `/Entrada/GetEntradasFecha?IdFecha=${idFecha}`;

        const [resEntradas, resTipos] = await Promise.all([
          api.get(urlEntradas),
          api.get(`/Entrada/GetTiposEntrada`)
        ]);

        const tiposMap = {};
        resTipos.data.forEach(tipo => {
          tiposMap[tipo.cdTipo] = tipo.dsTipo;
        });

        // La API puede responder array o { ... } según tu backend;
        // asumimos array de entradas como en tus otros componentes.
        const lista = Array.isArray(resEntradas.data) ? resEntradas.data : (resEntradas.data?.entradas || []);

        const procesadas = lista.map(e => ({
          cdTipo: e.tipo?.cdTipo ?? e.cdTipo, // tolerante a estructura
          tipo: tiposMap[e.tipo?.cdTipo ?? e.cdTipo] || 'Sin nombre',
          precio: e.precio,
          cantidad: e.cantidad ?? 0, // stock disponible (si viene)
          estadoEntrada: e.estado?.cdEstado // por si quisieras usarlo
        }));

        setEntradasDisponibles(procesadas);
      } catch (err) {
        console.error('Error al cargar entradas disponibles:', err);
        setEntradasDisponibles([]);
      } finally {
        // Si está deshabilitado, aseguramos que el total notifique 0
        if (disabledMode) onCantidadChange(0);
      }
    };

    if (idFecha) {
      fetchEntradas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFecha, estadoFecha]);

  const handleSelectChange = () => {
    // Sólo contamos selects habilitados
    const total = Array.from(
      document.querySelectorAll(`[name^="dia-${diaIndex}-entrada-"]`)
    )
      .filter(select => !select.disabled)
      .map(select => parseInt(select.value, 10))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

    onCantidadChange(total);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {entradasDisponibles.length > 0 ? (
            entradasDisponibles.map((entrada, index) => (
              <tr key={index} className={disabledMode ? 'opacity-60' : ''}>
                <td className="lg-min:text-sm">{entrada.tipo}</td>
                <td>${entrada.precio}</td>
                <td>
                  {entrada.cantidad === 0 || disabledMode ? (
                    // Si está deshabilitado o sin stock, mostramos el select deshabilitado o “Agotadas”
                    disabledMode ? (
                      <select
                        name={`dia-${diaIndex}-entrada-${index}`}
                        className="select select-bordered select-disabled w-full max-w-xs"
                        data-precio={entrada.precio}
                        data-tipo={entrada.tipo}
                        defaultValue="0"
                        disabled
                      >
                        <option value="0">0</option>
                      </select>
                    ) : (
                      <span className="text-red-600 font-semibold">Agotadas</span>
                    )
                  ) : (
                    <select
                      name={`dia-${diaIndex}-entrada-${index}`}
                      className="select select-bordered w-full max-w-xs"
                      data-precio={entrada.precio}
                      data-tipo={entrada.tipo}
                      defaultValue="0"
                      onChange={handleSelectChange}
                    >
                      {[...Array(Math.min(10, entrada.cantidad) + 1).keys()].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-sm italic">
                {estadoFecha === 1
                  ? 'Entradas configuradas no disponibles para la venta en este momento.'
                  : estadoFecha === 3
                    ? 'Venta de entradas finalizada.'
                    : disabledMode
                      ? 'Entradas no disponibles.'
                      : 'No hay entradas disponibles para esta fecha.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// // TablaDeEntradas.js
// import React, { useEffect, useState } from 'react';
// import api from '../../componenteapi/api';

// export default function TablaDeEntradas({ idFecha, diaIndex, onCantidadChange }) {
//   const [entradasDisponibles, setEntradasDisponibles] = useState([]);

//   useEffect(() => {
//     const fetchEntradas = async () => {
//       try {
//         const [resEntradas, resTipos] = await Promise.all([
//           api.get(`/Entrada/GetEntradasFecha?IdFecha=${idFecha}&Estado=0`),
//           api.get(`/Entrada/GetTiposEntrada`)
//         ]);

//         const tiposMap = {};
//         resTipos.data.forEach(tipo => {
//           tiposMap[tipo.cdTipo] = tipo.dsTipo;
//         });

//         const procesadas = resEntradas.data.map(e => ({
//           cdTipo: e.tipo.cdTipo,
//           tipo: tiposMap[e.tipo.cdTipo] || 'Sin nombre',
//           precio: e.precio,
//           cantidad: e.cantidad
//         }));

//         setEntradasDisponibles(procesadas);
//       } catch (err) {
//         console.error('Error al cargar entradas disponibles:', err);
//       }
//     };

//     if (idFecha) {
//       fetchEntradas();
//     }
//   }, [idFecha]);

//   const handleSelectChange = () => {
//     const total = Array.from(document.querySelectorAll(`[name^="dia-${diaIndex}-entrada-"]`))
//       .map(select => parseInt(select.value))
//       .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
//     onCantidadChange(total);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="table w-full">
//         <thead>
//           <tr>
//             <th>Ticket</th>
//             <th>Precio</th>
//             <th>Cantidad</th>
//           </tr>
//         </thead>
//         <tbody>
//           {entradasDisponibles.length > 0 ? (
//             entradasDisponibles.map((entrada, index) => (
//               <tr key={index}>
//                 <td className="lg-min:text-sm">{entrada.tipo}</td>
//                 <td>${entrada.precio}</td>
//                 <td>
//                   {entrada.cantidad === 0 ? (
//                     <span className="text-red-600 font-semibold">Agotadas</span>
//                   ) : (
//                     <select
//                       name={`dia-${diaIndex}-entrada-${index}`}
//                       className="select select-bordered w-full max-w-xs"
//                       data-precio={entrada.precio}
//                       data-tipo={entrada.tipo}
//                       defaultValue="0"
//                       onChange={handleSelectChange}
//                     >
//                       {[...Array(Math.min(10, entrada.cantidad) + 1).keys()].map(option => (
//                         <option key={option} value={option}>{option}</option>
//                       ))}
//                     </select>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="3" className="text-center text-sm italic">
//                 No hay entradas disponibles para esta fecha.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }