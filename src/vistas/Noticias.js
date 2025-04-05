import React, { useState, useEffect } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';
import { useNavigate } from 'react-router-dom';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('http://144.22.158.49:8080/v1/noticia')
      .then(response => {
        const data = response.data;
        const noticiasMapeadas = data.noticias.map(item => ({
          id: item.idNoticia,
          titulo: item.titulo,
          contenido: item.contenido,
        }));
        setNoticias(noticiasMapeadas);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener noticias:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando noticias...</div>;
  if (error) return <div>Hubo un error: {error}</div>;

  const handleCardClick = (noticia) => {
    // Navegar usando el id en la URL y pasar la noticia en el state
    navigate(`/noticias/${noticia.id}`, { state: { noticia } });
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


// import React, { useState, useEffect } from 'react';
// import api from '../componenteapi/api';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import CardNoticia from '../components/CardNoticia';
// import { useNavigate } from 'react-router-dom';

// export default function Noticias() {
//   const [noticias, setNoticias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get('/noticia')
//       .then(response => {
//         const data = response.data;
//         const noticiasMapeadas = data.noticias.map(item => ({
//           id: item.idNoticia,
//           titulo: item.titulo,
//           noticia: item.contenido,
//         }));
//         setNoticias(noticiasMapeadas);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error al obtener noticias:', err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Cargando noticias...</div>;
//   if (error) return <div>Hubo un error: {error}</div>;

//   const handleCardClick = (noticia) => {
//     navigate(`/noticias/${noticia.titulo}`, { state: { noticia } });
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <NavBar />
//       <div className="flex-grow sm:px-10 mb-11">
//         <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 sm:px-20">
//           {noticias.map(noticia => (
//             <CardNoticia
//               key={noticia.id}
//               titulo={noticia.titulo}
//               onClick={() => handleCardClick(noticia)}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }