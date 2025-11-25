// components/evento/EtiquetasEvento.js
import RainbowIcon from "../../iconos/rainbow.png";
import AfterIcon from "../../iconos/confetti.png";

export default function EtiquetasEvento({ lgbt, after }) {
  if (!lgbt && !after) return null;

  return (
    <div className="flex gap-x-5 mt-2">
      {lgbt && (
        <div className='flex items-center gap-x-2'>
          <img src={RainbowIcon} alt="Rainbow" className='w-6 h-6' />
          <p className='font-bold'>LGBT</p>
        </div>
      )}
      {after && (
        <div className='flex items-center gap-x-2'>
          <img src={AfterIcon} alt="After" className='w-6 h-6' />
          <p className='font-bold'>AFTER</p>
        </div>
      )}
    </div>
  );
}
