import { BsGeoAltFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function UbicacionEvento({ idEvento, direccion, localidad, municipio, provincia }) {
  const navigate = useNavigate();

  const handleComoLlegarClick = () => {
    navigate(`/comollegar/${idEvento}`, { state: { idEvento, direccion } });
  };

  // Lógica para evitar repeticiones
  const partes = [];
  if (localidad && localidad !== municipio && localidad !== provincia) partes.push(localidad);
  if (municipio && municipio !== provincia && municipio !== localidad) partes.push(municipio);
  if (provincia) partes.push(provincia);

  const ubicacionFormateada = `${direccion}, ${partes.join(', ')}`;

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
