import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventoItem = ({ evento, estadoTexto }) => {
  const navigate = useNavigate();

  const handleEntradasVendidas = () => {
    navigate(`/entradas-vendidas/${evento.idEvento}`);
  };

  const handleCancelClick = () => {
    navigate(`/cancelar-evento/${evento.idEvento}`, { state: { nombre: evento.nombre } });
  };

  const handleModificarEvento = () => {
    navigate(`/modificar-evento/${evento.idEvento}`, { state: { evento } });
  };

  const estadoColor = {
    "Por Aprobar": "text-purple-600",
    "Aprobado": "text-blue-600",
    "En venta": "text-green-600",
    "Fin Venta": "text-yellow-600",
    "Finalizado": "text-red-600",
    "Borrado": "text-gray-500"
  };

  const renderBotones = () => {
    switch (estadoTexto) {
      case "En venta":
        return (
          <>
            <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>
              Entradas vendidas
            </button>
            <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>
              Modificar
            </button>
            <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>
              Cancelar evento
            </button>
          </>
        );
      case "Por Aprobar":
      case "Aprobado":
        return (
          <>
            <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>
              Modificar
            </button>
            <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>
              Cancelar evento
            </button>
          </>
        );
      case "Finalizado":
      case "Fin Venta":
        return (
          <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>
            Entradas vendidas
          </button>
        );
      default:
        return null;
    }
  };

  const renderImagen = () => {
    if (evento.imagenUrl) {
      return (
        <img
          src={evento.imagenUrl}
          alt={`Imagen de ${evento.nombre}`}
          className="w-full h-full object-cover rounded-md"
        />
      );
    }
    return (
      <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-md text-sm text-gray-700">
        Sin imagen
      </div>
    );
  };





  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg shadow-sm bg-white space-y-4 lg:space-y-0 lg:space-x-4">

      {/* Estado + Imagen */}
      <div className="flex items-center justify-start md:justify-start space-x-4">
        {/* Estado */}
        <span className={`font-semibold text-md ${estadoColor[estadoTexto] || 'text-gray-600'}`}>
          {estadoTexto}
        </span>

        {/* Imagen */}
        <div className="w-60 h-40 lg:w-44 lg:h-32 shrink-0">
          {renderImagen()}
        </div>
      </div>


      {/* Info del evento */}
      <div className="flex-1">
        <p className="text-lg font-bold">{evento.nombre}</p>
        {evento.fechas.map((f, index) => (
          <p key={index} className="text-sm text-gray-600">
            {new Date(f.inicio).toLocaleDateString('es-AR')} | {new Date(f.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - {new Date(f.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        ))}
      </div>

      {/* Botones */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-2 w-full lg:w-auto">
        {renderBotones()}
      </div>
    </div>
  );
};

export default EventoItem;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const EventoItem = ({ evento, estadoTexto }) => {
//   const navigate = useNavigate();

//   const handleEntradasVendidas = () => {
//     navigate(`/entradas-vendidas/${evento.idEvento}`);
//   };

//   const handleCancelClick = () => {
//     navigate(`/cancelar-evento/${evento.idEvento}`, { state: { nombre: evento.nombre } });
//   };

//   const handleModificarEvento = () => {
//     navigate(`/modificar-evento/${evento.idEvento}`, { state: { evento } });
//   };

//   const estadoColor = {
//     "Por Aprobar": "text-purple-600",
//     "Aprobado": "text-blue-600",
//     "En venta": "text-green-600",
//     "Fin Venta": "text-yellow-600",
//     "Finalizado": "text-red-600",
//     "Borrado": "text-gray-500"
//   };

//   const renderBotones = () => {
//     switch (estadoTexto) {
//       case "En venta":
//         return (
//           <>
//             <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>
//               Entradas vendidas
//             </button>
//             <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>
//               Modificar
//             </button>
//             <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>
//               Cancelar evento
//             </button>
//           </>
//         );
//       case "Por Aprobar":
//       case "Aprobado":
//         return (
//           <>
//             <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>
//               Modificar
//             </button>
//             <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>
//               Cancelar evento
//             </button>
//           </>
//         );
//       case "Finalizado":
//       case "Fin Venta":
//         return (
//           <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>
//             Entradas vendidas
//           </button>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderImagen = () => {
//     if (evento.media?.url) {
//       return (
//         <img
//           src={evento.media.url}
//           alt={`Imagen de ${evento.nombre}`}
//           className="w-16 h-16 object-cover rounded-md"
//         />
//       );
//     }
//     return (
//       <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded-md text-sm text-gray-700">
//         Sin imagen
//       </div>
//     );
//   };

//   return (
//     <div className="flex items-center justify-between p-4 border-b border-gray-200">
//       <div className="flex items-center">
//         <div>
//           <span className={`font-semibold text-xl mr-6 ${estadoColor[estadoTexto] || 'text-gray-600'}`}>
//             {estadoTexto}
//           </span>
//         </div>
//         {renderImagen()}
//         <div className="ml-4">
//           <p className="text-lg font-semibold">{evento.nombre}</p>
//           {evento.fechas.map((f, index) => (
//             <p key={index} className="text-gray-600">
//               {new Date(f.inicio).toLocaleDateString('es-AR')} | {new Date(f.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} - {new Date(f.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
//             </p>
//           ))}
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
//         {renderBotones()}
//       </div>
//     </div>
//   );
// };

// export default EventoItem;