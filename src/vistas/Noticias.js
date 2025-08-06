import React, { useState, useEffect } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      const cachedNoticias = sessionStorage.getItem('noticias');

      if (cachedNoticias) {
        const parsed = JSON.parse(cachedNoticias);
        setNoticias(parsed);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/noticia');
        const noticiasCrudas = response.data.noticias;

        const noticiasConImagen = await Promise.all(
          noticiasCrudas.map(async (item) => {
            const id = item.idNoticia;
            let imagenUrl = sessionStorage.getItem(`noticia-img-${id}`) || null;

            if (!imagenUrl) {
              try {
                const resMedia = await api.get(`/Media?idEntidadMedia=${id}`);
                if (resMedia.data.media.length > 0) {
                  imagenUrl = resMedia.data.media[0].url;
                  sessionStorage.setItem(`noticia-img-${id}`, imagenUrl);
                }
              } catch (e) {
                if (e.response?.status !== 404) {
                  console.warn('Error al obtener imagen para noticia:', id, e);
                }
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
        sessionStorage.setItem('noticias', JSON.stringify(noticiasConImagen));
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener noticias:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading) return <div>Cargando noticias...</div>;
  if (error) return <div>Hubo un error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow sm:px-10 mb-11">
        <h1 className="text-3xl font-bold underline mb-8 text-center">Novedades</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 sm:px-20">
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
      </div>
      <Footer />
    </div>
  );
}