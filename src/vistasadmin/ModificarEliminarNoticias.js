import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const ModificarEliminarNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para controlar el modal de confirmación de eliminación
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  // Estado para controlar el modal de éxito tras la eliminación
  const [isSuccessDeleteModalOpen, setIsSuccessDeleteModalOpen] = useState(false);

  // Para saber cuál noticia se está intentando eliminar
  const [selectedNoticiaId, setSelectedNoticiaId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        const response = await api.get('/noticia');
        const noticiasApi = response.data.noticias.map((n) => ({
          id: n.idNoticia,
          fecha: new Date(n.dtPublicado).toLocaleDateString('es-AR'),
          titulo: n.titulo,
        }));
        setNoticias(noticiasApi);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las noticias:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerNoticias();
  }, []);

  if (loading) return <div>Cargando noticias...</div>;
  if (error) return <div>Hubo un error: {error}</div>;

  // Maneja la apertura del modal de confirmación, guardando el ID de la noticia que se quiere eliminar
  const handleOpenConfirmDelete = (id) => {
    setSelectedNoticiaId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  // Cierra el modal de confirmación sin eliminar
  const handleCloseConfirmDelete = () => {
    setSelectedNoticiaId(null);
    setIsConfirmDeleteModalOpen(false);
  };

  // Confirma la eliminación, hace el DELETE a la API y luego muestra el modal de éxito
  const handleConfirmDelete = async () => {
    if (!selectedNoticiaId) return;

    try {
      await api.delete(`/noticia/${selectedNoticiaId}`);
      // Actualiza el estado local removiendo la noticia eliminada
      setNoticias((prevNoticias) =>
        prevNoticias.filter((n) => n.id !== selectedNoticiaId)
      );
      setSelectedNoticiaId(null);
      setIsConfirmDeleteModalOpen(false);
      setIsSuccessDeleteModalOpen(true);
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
    }
  };

  // Cierra el modal de éxito
  const handleCloseSuccessModal = () => {
    setIsSuccessDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          <div className="container mx-auto">
            <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
              Modificar noticias:
            </h1>

            <div className="overflow-x-auto">
              {/* Tabla en pantallas grandes */}
              <table className="hidden md:table w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-black">
                    <th className="p-3 border border-gray-300">Fecha de creación</th>
                    <th className="p-3 border border-gray-300">Título de la noticia</th>
                    <th className="p-3 border border-gray-300">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {noticias.map((noticia) => (
                    <tr key={noticia.id} className="hover:bg-gray-100">
                      <td className="p-3 border border-gray-300">{noticia.fecha}</td>
                      <td className="p-3 border border-gray-300">{noticia.titulo}</td>
                      <td className="p-3 border border-gray-300 flex gap-2">
                        <button
                          className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
                          onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
                          onClick={() => handleOpenConfirmDelete(noticia.id)}
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
                {noticias.map((noticia) => (
                  <div
                    key={noticia.id}
                    className="border border-gray-300 p-4 rounded-lg shadow-md"
                  >
                    <p className="font-semibold">Fecha de creación:</p>
                    <p>{noticia.fecha}</p>
                    <p className="font-semibold mt-2">Título de la noticia:</p>
                    <p>{noticia.titulo}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
                        onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
                        onClick={() => handleOpenConfirmDelete(noticia.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de confirmación de eliminación */}
      {isConfirmDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
            <p className="text-lg mb-4">¿Estás seguro de que deseas eliminar la noticia?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
              <button
                className="bg-blue-200 text-black px-4 py-2 rounded"
                onClick={handleCloseConfirmDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito tras la eliminación */}
      {isSuccessDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
            <p className="text-lg mb-4">La noticia se ha eliminado con éxito</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCloseSuccessModal}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModificarEliminarNoticias;




// import React from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

// const ModificarEliminarNoticias = () => {

//     const noticias = [
//         {
//             id: 1,
//             fecha: "23/02/2025",
//             titulo: "Lorem Ipsum is simply dummy text of the printing and typesetting",
//         },
//         {
//             id: 2,
//             fecha: "23/02/2025",
//             titulo: "Lorem Ipsum is simply dummy text of the printing and typesetting",
//         },
//         {
//             id: 3,
//             fecha: "23/02/2025",
//             titulo: "Lorem Ipsum is simply dummy text of the printing and typesetting",
//         },
//         {
//             id: 4,
//             fecha: "23/02/2025",
//             titulo: "Lorem Ipsum is simply dummy text of the printing and typesetting",
//         },
//     ];

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1">
//                 <div className="sm:px-10 mb-11">
//                     <NavBar />
//                     <div className="container mx-auto">
//                         <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Modificar noticias:</h1>

//                          <div className="overflow-x-auto"> {/*overflow-x-auto evita que la tabla se desborde en dispositivos pequeños */}
//                             {/* Tabla en pantallas grandes */}
//                             <table className="hidden md:table w-full border-collapse border border-gray-300">
//                                 <thead>
//                                     <tr className="bg-gray-200 text-black">
//                                         <th className="p-3 border border-gray-300">Fecha de creación</th>
//                                         <th className="p-3 border border-gray-300">Título de la noticia</th>
//                                         <th className="p-3 border border-gray-300">Acción</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {noticias.map((noticia) => (
//                                         <tr key={noticia.id} className="hover:bg-gray-100">
//                                             <td className="p-3 border border-gray-300">{noticia.fecha}</td>
//                                             <td className="p-3 border border-gray-300">{noticia.titulo}</td>
//                                             <td className="p-3 border border-gray-300 flex gap-2">
//                                                 <button className="btn btn-sm bg-purple-600 text-white rounded-lg px-3">
//                                                     Editar
//                                                 </button>
//                                                 <button className="btn btn-sm bg-red-600 text-white rounded-lg px-3">
//                                                     Eliminar
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>

//                             {/* Vista en móvil (tarjetas) */}
//                             {/* En móviles, los datos se presentan en formato de tarjetas. */}
//                             <div className="md:hidden flex flex-col gap-4">
//                                 {noticias.map((noticia) => (
//                                     <div
//                                         key={noticia.id}
//                                         className="border border-gray-300 p-4 rounded-lg shadow-md"
//                                     >
//                                         <p className="font-semibold">Fecha de creación:</p>
//                                         <p>{noticia.fecha}</p>
//                                         <p className="font-semibold mt-2">Título de la noticia:</p>
//                                         <p>{noticia.titulo}</p>
//                                         <div className="flex gap-2 mt-3">
//                                             <button className="btn btn-sm bg-purple-600 text-white rounded-lg px-3">
//                                                 Editar
//                                             </button>
//                                             <button className="btn btn-sm bg-red-600 text-white rounded-lg px-3">
//                                                 Eliminar
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>


//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default ModificarEliminarNoticias;


// Pantallas grandes (md:) > Se usa la tabla.
// Pantallas pequeñas (md:hidden) > Se usa el formato de tarjetas.
// Diseño limpio con shadow-md y rounded-lg en móviles.