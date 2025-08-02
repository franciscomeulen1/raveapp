import { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

export default function GenerosEvento({ generos }) {
  const [listaGeneros, setListaGeneros] = useState([]);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await api.get('/Evento/GetGeneros');
        setListaGeneros(response.data || []);
      } catch (error) {
        console.error('Error al obtener géneros:', error);
      }
    };

    fetchGeneros();
  }, []);

  const generosNombres = Array.isArray(generos)
    ? generos
        .map(id => {
          const genero = listaGeneros.find(g => g.cdGenero === id);
          return genero?.dsGenero || id;
        })
    : [];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {generosNombres.map((nombre, index) => (
        <div
          key={index}
          className="badge badge-outline rounded-lg font-semibold text-white bg-black"
        >
          {nombre}
        </div>
      ))}
    </div>
  );
}
