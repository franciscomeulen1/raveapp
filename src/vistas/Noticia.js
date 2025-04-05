import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function Noticia() {
  window.scrollTo(0, 0);

  const location = useLocation();
  const { id } = useParams(); // Se extrae el id de la URL
  const [noticiaData, setNoticiaData] = useState(location.state?.noticia || null);
  const [loading, setLoading] = useState(!noticiaData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!noticiaData) {
      // Consulta la API usando el id de la noticia
      api.get(`http://144.22.158.49:8080/v1/noticia?idNoticia=${id}`)
        .then(response => {
          // Se asume que la respuesta retorna la noticia en response.data.noticias
          console.log(response.data.noticias);
          const noticia = response.data.noticias; // Esto es un array
          if (noticia && noticia.length > 0) {
            setNoticiaData(noticia[0]); // Guardamos solo el primer objeto
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener la noticia:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [noticiaData, id]);

  if (loading) return <div>Cargando noticia...</div>;
  if (error) return <div>Hubo un error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 flex-1 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center" style={{ gap: '1cm' }}>
          <div className="flex-shrink-0">
            <img 
              src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" 
              alt="noticia" 
              className="w-full max-w-sm object-cover rounded-lg shadow-md aspect-[1.2]"
            />
          </div>
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-3xl font-bold mb-4">{noticiaData.titulo}</h1>
            <p className="text-gray-700 leading-relaxed">{noticiaData.contenido}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


// import React from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { useLocation } from 'react-router-dom';

// export default function Noticia() {
//     window.scrollTo(0, 0);

//     const location = useLocation();
//     const noticia = location.state.noticia;

//     return (
//         <div className="flex flex-col min-h-screen">
//             <NavBar />
//             <div className="container mx-auto p-4 flex-1 flex items-center justify-center">
//                 <div className="flex flex-col md:flex-row items-center" style={{ gap: '1cm' }}>
//                     <div className="flex-shrink-0">
//                         <img 
//                             src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" 
//                             alt="noticia" 
//                             className="w-full max-w-sm object-cover rounded-lg shadow-md aspect-[1.2]"
//                         />
//                     </div>
//                     <div className="max-w-xl text-center md:text-left">
//                         <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
//                         <p className="text-gray-700 leading-relaxed">{noticia.noticia}</p>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }