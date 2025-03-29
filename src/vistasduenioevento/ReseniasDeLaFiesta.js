import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar'; 
import Footer from '../components/Footer';

// Ejemplo de datos de prueba para simular reseñas
const dummyReviews = [
  {
    id: 1,
    username: 'usuario99',
    rating: 5,
    comment: 'Me gustó mucho la fiesta. Gente muy agradable. Volvería a ir.',
    date: '2025-03-12',
  },
  {
    id: 2,
    username: 'usuario07',
    rating: 4,
    comment: 'Buena música. Solo critico que el DJ principal tocó menos tiempo de lo esperado.',
    date: '2025-03-10',
  },
  {
    id: 3,
    username: 'juanma',
    rating: 5,
    comment: '¡Excelente! Uno de los mejores eventos a los que he ido.',
    date: '2025-03-11',
  },
  {
    id: 4,
    username: 'maria22',
    rating: 3,
    comment: 'La organización estuvo bien, pero creo que faltó más variedad de bebidas.',
    date: '2025-03-09',
  },
];

export default function ReseniasDeLaFiesta() {
  // Cuando se monta el componente, se hace scroll al tope
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Estado local para manejar la búsqueda y el criterio de orden
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recientes');

  // Aquí podrías usar un estado para tus reseñas si deseas cargarlas dinámicamente
  // Por ahora usamos un array de prueba (dummyReviews)
  const reviews = dummyReviews;

  // Calcula el promedio de todas las calificaciones
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Filtra las reseñas por el texto que ingrese el usuario en el buscador
  const filteredReviews = reviews.filter((review) => {
    const term = searchTerm.toLowerCase();
    return (
      review.username.toLowerCase().includes(term) ||
      review.comment.toLowerCase().includes(term)
    );
  });

  // Ordena las reseñas según la opción seleccionada
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'recientes') {
      // Ordenar por fecha descendente (más reciente primero)
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === 'alta') {
      // Ordenar por calificación descendente (mayor a menor)
      return b.rating - a.rating;
    } else if (sortOption === 'baja') {
      // Ordenar por calificación ascendente (menor a mayor)
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen sm:px-10">
      <NavBar />
      
      <div className="flex-grow sm:px-10 mb-11">
        {/* Contenedor principal */}
        <div className="px-10">
          {/* Título */}
          <h1 className="mb-2 mt-2 text-3xl font-bold">
            Calificaciones de <span className="italic">'Nombre de la fiesta'</span>
          </h1>
          
          {/* Promedio de calificaciones */}
          <div className="flex items-center mb-4">
            <span className="text-xl font-semibold mr-2">
              {averageRating}
            </span>
            {/* Representación sencilla de estrellas (sin medios puntos) */}
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                // Si quieres que 4.5 pinte 4 estrellas y media, habría que implementar
                // un sistema de "media estrella". Aquí sólo redondeamos:
                const starValue = Math.round(parseFloat(averageRating));
                return (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < starValue ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.986a1 1 0 00.95.69h4.21c.969 
                      0 1.371 1.24.588 1.81l-3.405 2.47a1 
                      1 0 00-.363 1.118l1.286 3.986c.3.921-.755 
                      1.688-1.54 1.118l-3.405-2.47a1 
                      1 0 00-1.175 0l-3.405 2.47c-.785.57-1.84-.197-1.54-1.118l1.286-3.986a1 
                      1 0 00-.363-1.118L2.224 9.413c-.783-.57-.38-1.81.588-1.81h4.21a1 
                      1 0 00.95-.69l1.286-3.986z"
                    />
                  </svg>
                );
              })}
            </div>
          </div>

          {/* Barra de búsqueda y selector de orden */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Buscar reseñas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex items-center space-x-2">
              <span>Ordenar:</span>
              <select
                className="select select-bordered"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="alta">Valoración más alta</option>
                <option value="baja">Valoración más baja</option>
              </select>
            </div>
          </div>

          {/* Listado de reseñas */}
          <div>
            {sortedReviews.length === 0 ? (
              <p>No hay reseñas que coincidan con tu búsqueda.</p>
            ) : (
              sortedReviews.map((review) => (
                <div key={review.id} className="mb-6">
                  {/* Nombre de usuario y rating */}
                  <div className="flex items-center mb-1">
                    <span className="font-bold">{review.username}</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 
                            3.986a1 1 0 00.95.69h4.21c.969 
                            0 1.371 1.24.588 1.81l-3.405 
                            2.47a1 1 0 00-.363 1.118l1.286 
                            3.986c.3.921-.755 1.688-1.54 
                            1.118l-3.405-2.47a1 
                            1 0 00-1.175 0l-3.405 2.47c-.785.57-1.84-.197-1.54-1.118l1.286-3.986a1 
                            1 0 00-.363-1.118L2.224 9.413c-.783-.57-.38-1.81.588-1.81h4.21a1 
                            1 0 00.95-.69l1.286-3.986z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {/* Texto del comentario */}
                  <p className="ml-1 text-gray-700">{review.comment}</p>
                  {/* Fecha de la reseña (opcional) */}
                  <p className="ml-1 text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString('es-AR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
