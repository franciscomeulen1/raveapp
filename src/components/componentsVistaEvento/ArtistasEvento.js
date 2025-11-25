// components/evento/ArtistasEvento.js
import { AiFillSound } from "react-icons/ai";

export default function ArtistasEvento({ artistas }) {
  if (!artistas || artistas.length === 0) return null;

  return (
    <div className='flex items-center gap-x-1 mb-4'>
      <AiFillSound style={{ color: "#080808" }} className='inline size-6' />
      <p className='font-bold'>
        <span className="underline underline-offset-4">Artistas:</span><span> </span>
        <span className='text-lg'>
          {artistas.map(a => a.nombre).join(' - ')}
        </span>
      </p>
    </div>
  );
}
