// components/evento/FechasEvento.js
import { FaCalendarAlt } from "react-icons/fa";

export default function FechasEvento({ dias }) {
  if (!dias || dias.length === 0) return null;

  return (
    <div className='mb-4'>
      {dias.map((dia, index) => (
        <div key={index} className='flex flex-col mb-2'>
          <div className='flex items-center gap-x-2'>
            <FaCalendarAlt style={{ color: "#080808" }} className='size-5' />
            <p>
              <span className='font-bold'>Fecha:</span> {dia.fecha} <br />
              <span className='font-bold'>Horario:</span> {dia.horaInicio} - {dia.horaFin}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
