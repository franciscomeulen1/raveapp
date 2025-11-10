// src/vistas/Noticias.js
import React, { useState, useEffect } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noNoticias, setNoNoticias] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await api.get('/noticia');
        const noticiasCrudas = response?.data?.noticias || [];

        if (!Array.isArray(noticiasCrudas) || noticiasCrudas.length === 0) {
          setNoNoticias(true);
          setNoticias([]);
          setLoading(false);
          return;
        }

        const noticiasConImagen = await Promise.all(
          noticiasCrudas.map(async (item) => {
            const id = item.idNoticia;
            let imagenUrl = null;

            try {
              const resMedia = await api.get(`/Media?idEntidadMedia=${id}`);
              const media = resMedia?.data?.media || [];
              if (media.length > 0 && media[0].url) {
                imagenUrl = media[0].url; 
              }
            } catch (e) {
              if (e.response?.status !== 404) {
                console.warn('Error al obtener imagen para noticia:', id, e);
              }
            }

            return {
              id,
              titulo: item.titulo,
              contenido: item.contenido,
              urlEvento: item.urlEvento,
              imagen: imagenUrl,
            };
          })
        );

        setNoticias(noticiasConImagen);
        setNoNoticias(noticiasConImagen.length === 0);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          // La API usa 404 cuando no hay noticias
          setNoNoticias(true);
          setNoticias([]);
          setLoading(false);
          return;
        }
        console.error('Error al obtener noticias:', err);
        setError('Ocurrió un error inesperado al cargar las noticias. Intenta más tarde.');
        setLoading(false);
      }
    };

    fetchNoticias();
    window.scrollTo(0, 0);
  }, []);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-16 h-16 mb-4">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
          <path d="M3 5a2 2 0 0 1 2-2h11a1 1 0 1 1 0 2H5v12a1 1 0 0 0 1 1h13V7a1 1 0 1 1 2 0v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5z" />
          <rect x="7" y="7" width="7" height="2" rx="1" />
          <rect x="7" y="11" width="10" height="2" rx="1" />
          <rect x="7" y="15" width="10" height="2" rx="1" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">No hay noticias por ahora</h2>
      <p className="text-gray-500 max-w-prose">
        Por el momento, no hay noticias para mostrar. Próximamente estaremos subiendo las últimas novedades.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando noticias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Hubo un problema</h2>
            <p className="mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
    <div className="px-4 sm:px-10 mb-11 flex-1">
      <NavBar />
      <div className="flex-grow mb-11">
        <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>

        {noNoticias || noticias.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
              <EmptyState />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 sm:px-12">
            {noticias.map((noticia) => (
              <CardNoticia
                key={noticia.id}
                id={noticia.id}
                titulo={noticia.titulo}
                contenido={noticia.contenido}
                urlEvento={noticia.urlEvento}
                imagen={noticia.imagen}
              />
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}



// import React, { useState, useEffect } from 'react';
// import api from '../componenteapi/api';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import CardNoticia from '../components/CardNoticia';

// export default function Noticias() {
//   const [noticias, setNoticias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchNoticias = async () => {
//       const cachedNoticias = sessionStorage.getItem('noticias');

//       if (cachedNoticias) {
//         const parsed = JSON.parse(cachedNoticias);
//         setNoticias(parsed);
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await api.get('/noticia');
//         const noticiasCrudas = response.data.noticias;

//         const noticiasConImagen = await Promise.all(
//           noticiasCrudas.map(async (item) => {
//             const id = item.idNoticia;
//             let imagenUrl = sessionStorage.getItem(`noticia-img-${id}`) || null;

//             if (!imagenUrl) {
//               try {
//                 const resMedia = await api.get(`/Media?idEntidadMedia=${id}`);
//                 if (resMedia.data.media.length > 0) {
//                   imagenUrl = resMedia.data.media[0].url;
//                   sessionStorage.setItem(`noticia-img-${id}`, imagenUrl);
//                 }
//               } catch (e) {
//                 if (e.response?.status !== 404) {
//                   console.warn('Error al obtener imagen para noticia:', id, e);
//                 }
//               }
//             }

//             return {
//               id,
//               titulo: item.titulo,
//               contenido: item.contenido,
//               urlEvento: item.urlEvento,
//               imagen: imagenUrl,
//             };
//           })
//         );

//         setNoticias(noticiasConImagen);
//         sessionStorage.setItem('noticias', JSON.stringify(noticiasConImagen));
//         setLoading(false);
//       } catch (err) {
//         console.error('Error al obtener noticias:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchNoticias();
//   }, []);

//   if (loading) return <div>Cargando noticias...</div>;
//   if (error) return <div>Hubo un error: {error}</div>;

//   return (
//     <div className="flex flex-col min-h-screen">
//       <NavBar />
//       <div className="flex-grow sm:px-10 mb-11">
//         <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 sm:px-20">
//           {noticias.map((noticia) => (
//             <CardNoticia
//               key={noticia.id}
//               id={noticia.id}
//               titulo={noticia.titulo}
//               contenido={noticia.contenido}
//               urlEvento={noticia.urlEvento}
//               imagen={noticia.imagen}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }