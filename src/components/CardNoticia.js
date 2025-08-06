import { Link } from 'react-router-dom';

export default function CardNoticia({ id, titulo, imagen, contenido, urlEvento }) {
  const imagenFallback = 'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp';

  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 mx-auto my-5">
      <Link
        to={`/noticias/${id}`}
        state={{ noticia: { id, titulo, contenido, urlEvento, imagen } }}
        className="w-full block"
      >
        <img
          src={imagen || imagenFallback}
          alt="noticia"
          className="w-full object-cover aspect-[1.2]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = imagenFallback;
          }}
        />
        <div className="p-4">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">{titulo}</h2>
        </div>
      </Link>
    </div>
  );
}
