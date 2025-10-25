import { Link } from 'react-router-dom';

export default function CardNoticia({ id, titulo, imagen, contenido, urlEvento }) {
  const imagenFallback =
    'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp';

  return (
    <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 mx-auto my-5">
      <Link
        to={`/noticias/${id}`}
        state={{ noticia: { id, titulo, contenido, urlEvento, imagen } }}
        className="block w-full"
      >
        <div className="w-full overflow-hidden bg-gray-100 aspect-[1.2]">
          <img
            src={imagen || imagenFallback}
            alt={`Imagen de noticia: ${titulo}`}
            loading="lazy"             // ✅ carga diferida
            width={400}                // ✅ ancho aproximado del contenedor
            height={300}               // ✅ alto según tu aspecto
            className="block w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = imagenFallback;
            }}
          />
        </div>

        <div className="p-4">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
            {titulo}
          </h2>
        </div>
      </Link>
    </div>
  );
}
