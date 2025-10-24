import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const ModificarEliminarArtistas = () => {
  const [search, setSearch] = useState('');
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [modalPhase, setModalPhase] = useState('confirm'); // 'confirm' or 'success'
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/Artista/GetArtista?isActivo=true')
      .then(async response => {
        const artistasRaw = response.data.artistas;

        const artistasConImagen = await Promise.all(
          artistasRaw.map(async (artista) => {
            try {
              const mediaRes = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
              const urlImagen = mediaRes.data.media?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

              return {
                id: artista.idArtista,
                nombre: artista.nombre,
                fecha: new Date(artista.dtAlta).toLocaleDateString(),
                imagen: urlImagen
              };
            } catch (err) {
              console.error(`Error al obtener imagen del artista ${artista.nombre}`, err);
              return {
                id: artista.idArtista,
                nombre: artista.nombre,
                fecha: new Date(artista.dtAlta).toLocaleDateString(),
                imagen: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              };
            }
          })
        );

        // Ordenar: numéricos primero, luego alfabéticamente
        const artistasOrdenados = artistasConImagen.sort((a, b) => {
          const isANumeric = /^\d/.test(a.nombre);
          const isBNumeric = /^\d/.test(b.nombre);
          if (isANumeric && !isBNumeric) return -1;
          if (!isANumeric && isBNumeric) return 1;
          return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
        });

        setArtistas(artistasOrdenados);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los artistas:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);


  const handleDeleteClick = (id) => {
    setArtistToDelete(id);
    setModalPhase('confirm');
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setArtistToDelete(null);
  };

  const handleConfirmDelete = () => {
    api.delete(`/Artista/DeleteArtista/${artistToDelete}`)
      .then(() => {
        setArtistas(prev => prev.filter(a => a.id !== artistToDelete));
        setModalPhase('success');
      })
      .catch(err => {
        console.error('Error al eliminar artista:', err);
        // Puedes agregar manejo de errores aquí
      });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setArtistToDelete(null);
  };

  // Loading state con spinner bonito centrado en la pantalla
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                        <p className="text-gray-600">Cargando artistas...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
                <NavBar />
                <div className="flex flex-1 items-center justify-center px-4 py-20">
                    <div className="text-center">
                        <p className="text-red-500 font-semibold">Hubo un error al cargar los artistas</p>
                        <p className="text-sm text-gray-500 mt-2">{error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

  const artistasFiltrados = artistas.filter(artista =>
    artista.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-10 mb-11">
        <NavBar />
        <div className="container mx-auto">
          <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
            Modificar artistas:
          </h1>

          <div className="overflow-x-auto">
            {/* Buscador */}
            <div className="flex justify-end mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscador de artistas"
                  className="input input-bordered pr-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Tabla en pantallas grandes */}
            <table className="hidden md:table w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="p-3 border border-gray-300">Artista</th>
                  <th className="p-3 border border-gray-300">Fecha de creación</th>
                  <th className="p-3 border border-gray-300">Acción</th>
                </tr>
              </thead>
              <tbody>
                {artistasFiltrados.map(artista => (
                  <tr key={artista.id} className="hover:bg-gray-100">
                    <td className="p-3 border border-gray-300 flex items-center gap-3">
                      <img
                        src={artista.imagen}
                        alt="Artista"
                        className="w-20 h-20 rounded-full object-cover border border-gray-300"
                      />
                      <span>{artista.nombre}</span>
                    </td>
                    <td className="p-3 border border-gray-300">{artista.fecha}</td>
                    <td className="p-3 border border-gray-300 flex gap-2">
                      <button
                        className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
                        onClick={() => navigate(`/editar-artista/${artista.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
                        onClick={() => handleDeleteClick(artista.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Vista en móvil (tarjetas) */}
            <div className="md:hidden flex flex-col gap-4">
              {artistasFiltrados.map(artista => (
                <div
                  key={artista.id}
                  className="border border-gray-300 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
                >
                  <img
                    src={artista.imagen}
                    alt="Artista"
                    className="w-28 h-28 rounded-full object-cover border border-gray-300"
                  />
                  <p className="font-semibold mt-2">{artista.nombre}</p>
                  <p className="text-gray-600">Fecha de creación: {artista.fecha}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
                      onClick={() => navigate(`/editar-artista/${artista.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
                      onClick={() => handleDeleteClick(artista.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de confirmación y éxito */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 w-80">
                  {modalPhase === 'confirm' ? (
                    <>
                      <h2 className="text-xl font-semibold mb-4">¿Estás seguro?</h2>
                      <p className="mb-6">¿Quieres eliminar este artista?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleConfirmDelete}
                          className="btn btn-sm bg-red-600 text-white"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn btn-sm btn-neutral"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Eliminado</h2>
                      <p className="mb-6">El artista ha sido eliminado exitosamente.</p>
                      <div className="flex justify-end">
                        <button
                          onClick={handleOk}
                          className="btn btn-sm bg-blue-600 text-white"
                        >
                          Ok
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModificarEliminarArtistas;