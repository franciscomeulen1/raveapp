import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';
import { useNavigate } from "react-router-dom";

export default function Noticias() {

    // useState([]) inicializa el estado noticias como un array vacío.
    // En el useEffect, se hace el fetch a la URL (ajusta la URL si tu endpoint real es otro).
    // Cuando la respuesta llega, convertimos a JSON y luego mapeamos cada objeto para que coincida con { id, titulo, noticia }.

  const [noticias, setNoticias] = useState([]);

  // Para manejar casos de error o loading. De esta forma, mientras se cargan las noticias, mostrarás un mensaje de “Cargando…” y, si hay algún error, mostrarás un mensaje de error.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

   // axios.get('URL') devuelve una Promesa.
   // En then, response.data contiene la información de la respuesta (en tu caso, la lista de noticias).
   // Luego la guardamos en el estado con setNoticias.

  useEffect(() => {
    // Llamada GET con axios
    axios.get('/v1/noticia')
      .then(response => {
        // 'response.data' debe ser mi array de noticias
        const data = response.data;

        // Mapeamos los campos de la API a los que necesito
        const noticiasMapeadas = data.noticias.map(item => ({
          id: item.idNoticia,
          titulo: item.titulo,
          noticia: item.contenido,
        }));

        setNoticias(noticiasMapeadas);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener noticias:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando noticias...</div>;
  }
  
  if (error) {
    return <div>Hubo un error: {error}</div>;
  }

  const handleCardClick = (noticia) => {
    navigate(`/noticias/${noticia.titulo}`, { state: { noticia } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow sm:px-10 mb-11">
        <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 sm:px-20">
          {noticias.map(noticia => (
            <CardNoticia 
              key={noticia.id} 
              titulo={noticia.titulo} 
              onClick={() => handleCardClick(noticia)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}


// import React from 'react';
// import axios from 'axios';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import CardNoticia from '../components/CardNoticia';
// import { useNavigate } from "react-router-dom";

// export default function Noticias() {

//         window.scrollTo(0, 0);
    
//     const noticias = [
//         {
//             id: 1,
//             titulo: "Título de la noticia 1",
//             noticia: "Noticia 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
//         },
//         {
//             id: 2,
//             titulo: "Título de la noticia 2",
//             noticia: "Noticia 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
//         },
//         {
//             id: 3,
//             titulo: "Título de la noticia 3",
//             noticia: "Noticia 3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
//         }
//     ];

//     const navigate = useNavigate();
//     const handleCardClick = (noticia) => {
//         navigate(`/noticias/${noticia.titulo}`, { state: { noticia } });
//     };

//     return (
//         <div>
//             <NavBar />
//             <div className="container mx-auto p-4">
//                 <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 sm:px-20">
//                     {noticias.map(noticia => (
//                         <CardNoticia 
//                             key={noticia.id} 
//                             titulo={noticia.titulo} 
//                             onClick={() => handleCardClick(noticia)}
//                         />
//                     ))}
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }