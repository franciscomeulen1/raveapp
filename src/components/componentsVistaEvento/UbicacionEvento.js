// src/components/componentsVistaEvento/UbicacionEvento.js
import { BsGeoAltFill } from "react-icons/bs";

export default function UbicacionEvento({ idEvento, direccion, localidad, municipio, provincia }) {
  // Armar la ubicación igual que antes (evitar repeticiones)
  const partes = [];
  if (localidad && localidad !== municipio && localidad !== provincia) partes.push(localidad);
  if (municipio && municipio !== provincia && municipio !== localidad) partes.push(municipio);
  if (provincia) partes.push(provincia);

  // Esto es lo que vamos a mandar a Google Maps
  const ubicacionFormateada = [direccion, partes.join(", ")].filter(Boolean).join(", ");

  const handleComoLlegarClick = () => {
    const q = encodeURIComponent(
      ubicacionFormateada || "Evento"
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${q}&hl=es&gl=AR`,
      "_blank"
    );
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-x-2'>
        <BsGeoAltFill style={{ color: "#080808" }} className='size-5' />
        <p className='font-semibold'>{ubicacionFormateada}</p>
      </div>
      <button
        className='btn bg-cyan-600 rounded-full ml-3'
        onClick={handleComoLlegarClick}
      >
        Cómo llegar
      </button>
    </div>
  );
}

