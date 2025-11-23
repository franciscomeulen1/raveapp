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

  const renderImagen = () => {
    const fallback = (
      <div
        className="
          w-full h-full
          flex items-center justify-center
          text-sm text-gray-700
          bg-gray-300
          rounded-md
        "
      >
        Sin imagen
      </div>
    );

    if (!evento.imagenUrl) {
      return fallback;
    }

    return (
      <img
        src={evento.imagenUrl}
        alt={`Imagen de ${evento.nombre}`}
        loading="lazy"
        width={240}
        height={180}
        className="
          block
          w-full h-full
          object-cover object-center
          rounded-md
        "
        onError={(e) => {
          e.target.onerror = null;
          e.target.replaceWith(fallback);
        }}
      />
    );
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

  return (
    <div
      className="
        flex flex-col lg:flex-row lg:items-center
        justify-between
        p-4 border rounded-lg shadow-sm bg-white
        space-y-4 lg:space-y-0 lg:space-x-4
      "
    >
      {/* Estado + Imagen */}
      <div className="flex items-start space-x-4">
        {/* Estado */}
        <span
          className={`font-semibold text-md ${estadoColor[estadoTexto] || 'text-gray-600'
            }`}
        >
          {estadoTexto}
        </span>

        {/* 👉 Contenedor clickeable de la imagen */}
        <a
          href={`/evento/${evento.idEvento}`}
          className="
                   w-60 h-40
                   lg:w-44 lg:h-32
                   shrink-0
                   rounded-md
                   overflow-hidden
                   bg-gray-200
                   flex items-center justify-center
                   cursor-pointer
                   hover:opacity-90
                   transition-opacity
                   block
                 "
        >
          {renderImagen()}
        </a>
      </div>

      {/* Info del evento */}
      <div className="flex-1">
        <p className="text-lg font-bold">{evento.nombre}</p>

        {evento.fechas.map((f, index) => (
          <p
            key={index}
            className="text-sm text-gray-600"
          >
            {new Date(f.inicio).toLocaleDateString('es-AR')} |{" "}
            {new Date(f.inicio).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}{" "}
            -{" "}
            {new Date(f.fin).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
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