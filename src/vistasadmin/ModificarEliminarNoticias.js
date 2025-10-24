import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const ModificarEliminarNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isSuccessDeleteModalOpen, setIsSuccessDeleteModalOpen] = useState(false);
  const [selectedNoticiaId, setSelectedNoticiaId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerNoticias = async () => {
      try {
        const response = await api.get('/noticia');
        const noticiasApi = response.data.noticias;

        const noticiasConImagen = await Promise.all(
          noticiasApi.map(async (n) => {
            try {
              const mediaRes = await api.get(`/Media?idEntidadMedia=${n.idNoticia}`);
              const urlImagen =
                mediaRes.data.media?.[0]?.url ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

              return {
                id: n.idNoticia,
                fecha: new Date(n.dtPublicado),
                fechaTexto: new Date(n.dtPublicado).toLocaleDateString('es-AR'),
                titulo: n.titulo,
                imagen: urlImagen,
              };
            } catch (err) {
              console.error(`Error al obtener imagen de la noticia ${n.titulo}`, err);
              return {
                id: n.idNoticia,
                fecha: new Date(n.dtPublicado),
                fechaTexto: new Date(n.dtPublicado).toLocaleDateString('es-AR'),
                titulo: n.titulo,
                imagen:
                  'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp',
              };
            }
          })
        );

        // Ordenar por fecha descendente (más nueva primero)
        const noticiasOrdenadas = noticiasConImagen.sort((a, b) => b.fecha - a.fecha);

        setNoticias(noticiasOrdenadas);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las noticias:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerNoticias();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <NavBar />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-4 border-gray-600 border-b-transparent animate-spin mb-4" />
            <p className="text-gray-400">Cargando noticias...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <NavBar />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="text-red-500 font-semibold">Hubo un error al cargar las noticias</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handlers de eliminar
  const handleOpenConfirmDelete = (id) => {
    setSelectedNoticiaId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setSelectedNoticiaId(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNoticiaId) return;

    try {
      await api.delete(`/noticia/${selectedNoticiaId}`);
      setNoticias((prev) => prev.filter((n) => n.id !== selectedNoticiaId));
      setSelectedNoticiaId(null);
      setIsConfirmDeleteModalOpen(false);
      setIsSuccessDeleteModalOpen(true);
    } catch (error) {
      console.error('Error al eliminar la noticia:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessDeleteModalOpen(false);
  };

  // Filtro buscador
  const noticiasFiltradas = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-10 mb-11">
        <h1 className="mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
          Modificar noticias:
        </h1>

        {/* Buscador */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar noticia por título"
            className="input input-bordered bg-base-200 text-base-content placeholder:text-gray-400 w-full max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* === TABLA DESKTOP === */}
        <div className="hidden md:block rounded-xl overflow-hidden border border-base-300 bg-base-200/30 shadow-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-base-300 text-base-content text-sm uppercase tracking-wide">
                <th className="p-3 text-left w-1/2">Título de la noticia</th>
                <th className="p-3 text-left w-1/4">Fecha de creación</th>
                <th className="p-3 text-left w-1/4">Acción</th>
              </tr>
            </thead>

            <tbody>
              {noticiasFiltradas.map((noticia, idx) => (
                <tr
                  key={noticia.id}
                  className={`
                    text-base-content text-sm
                    ${idx % 2 === 0 ? 'bg-base-200/40' : 'bg-base-200/20'}
                    hover:bg-base-300 transition-colors
                  `}
                >
                  {/* Columna título + imagen */}
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={noticia.imagen}
                        alt={noticia.titulo}
                        className="w-16 h-16 rounded-full object-cover border border-base-300 flex-shrink-0"
                      />
                      <span className="font-medium break-words">{noticia.titulo}</span>
                    </div>
                  </td>

                  {/* Columna fecha */}
                  <td className="p-4 align-middle text-sm">
                    {noticia.fechaTexto}
                  </td>

                  {/* Columna acción */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg px-3"
                        onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                        onClick={() => handleOpenConfirmDelete(noticia.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === TARJETAS MOBILE === */}
        <div className="md:hidden flex flex-col gap-4">
          {noticiasFiltradas.map((noticia, idx) => (
            <div
              key={noticia.id}
              className={`
                rounded-xl border border-base-300 bg-base-200/30 shadow-md p-4
                ${idx % 2 === 0 ? 'bg-base-200/40' : 'bg-base-200/20'}
              `}
            >
              <img
                src={noticia.imagen}
                alt={noticia.titulo}
                className="w-full h-40 object-cover rounded mb-3 border border-base-300"
              />

              <p className="text-sm">
                Fecha de creación: {noticia.fechaTexto}
              </p>

              <p className="font-semibold mt-2 text-base-content">
                {noticia.titulo}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <button
                  className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg px-3"
                  onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                  onClick={() => handleOpenConfirmDelete(noticia.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* === MODAL CONFIRMAR ELIMINAR === */}
      {isConfirmDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={handleCloseConfirmDelete}
          />

          {/* card */}
          <div className="relative bg-base-200 text-base-content rounded-xl shadow-xl border border-base-300 w-80 p-6">
            <h2 className="text-lg font-semibold mb-3">
              ¿Estás seguro?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              ¿Querés eliminar esta noticia? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
              <button
                className="btn btn-sm bg-base-300 hover:bg-base-100 text-base-content border border-base-300 rounded-lg px-3"
                onClick={handleCloseConfirmDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL ÉXITO === */}
      {isSuccessDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={handleCloseSuccessModal}
          />

          {/* card */}
          <div className="relative bg-base-200 text-base-content rounded-xl shadow-xl border border-base-300 w-80 p-6">
            <h2 className="text-lg font-semibold mb-3">Eliminada</h2>
            <p className="text-sm text-gray-400 mb-6">
              La noticia se ha eliminado con éxito.
            </p>

            <div className="flex justify-end">
              <button
                className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg px-3"
                onClick={handleCloseSuccessModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModificarEliminarNoticias;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';

// const ModificarEliminarNoticias = () => {
//   const [noticias, setNoticias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');

//   const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
//   const [isSuccessDeleteModalOpen, setIsSuccessDeleteModalOpen] = useState(false);
//   const [selectedNoticiaId, setSelectedNoticiaId] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const obtenerNoticias = async () => {
//       try {
//         const response = await api.get('/noticia');
//         const noticiasApi = response.data.noticias;

//         const noticiasConImagen = await Promise.all(
//           noticiasApi.map(async (n) => {
//             try {
//               const mediaRes = await api.get(`/Media?idEntidadMedia=${n.idNoticia}`);
//               const urlImagen = mediaRes.data.media?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

//               return {
//                 id: n.idNoticia,
//                 fecha: new Date(n.dtPublicado),
//                 fechaTexto: new Date(n.dtPublicado).toLocaleDateString('es-AR'),
//                 titulo: n.titulo,
//                 imagen: urlImagen,
//               };
//             } catch (err) {
//               console.error(`Error al obtener imagen de la noticia ${n.titulo}`, err);
//               return {
//                 id: n.idNoticia,
//                 fecha: new Date(n.dtPublicado),
//                 fechaTexto: new Date(n.dtPublicado).toLocaleDateString('es-AR'),
//                 titulo: n.titulo,
//                 imagen: 'https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp',
//               };
//             }
//           })
//         );

//         // Ordenar por fecha descendente (más nueva primero)
//         const noticiasOrdenadas = noticiasConImagen.sort((a, b) => b.fecha - a.fecha);

//         setNoticias(noticiasOrdenadas);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error al obtener las noticias:', error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     obtenerNoticias();
//   }, []);

//   // Loading state con spinner bonito centrado en la pantalla
//     if (loading) {
//         return (
//             <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
//                 <NavBar />
//                 <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
//                         <p className="text-gray-600">Cargando noticias...</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
//                 <NavBar />
//                 <div className="flex flex-1 items-center justify-center px-4 py-20">
//                     <div className="text-center">
//                         <p className="text-red-500 font-semibold">Hubo un error al cargar las noticias</p>
//                         <p className="text-sm text-gray-500 mt-2">{error}</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//   const handleOpenConfirmDelete = (id) => {
//     setSelectedNoticiaId(id);
//     setIsConfirmDeleteModalOpen(true);
//   };

//   const handleCloseConfirmDelete = () => {
//     setSelectedNoticiaId(null);
//     setIsConfirmDeleteModalOpen(false);
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedNoticiaId) return;

//     try {
//       await api.delete(`/noticia/${selectedNoticiaId}`);
//       setNoticias((prev) =>
//         prev.filter((n) => n.id !== selectedNoticiaId)
//       );
//       setSelectedNoticiaId(null);
//       setIsConfirmDeleteModalOpen(false);
//       setIsSuccessDeleteModalOpen(true);
//     } catch (error) {
//       console.error('Error al eliminar la noticia:', error);
//     }
//   };

//   const handleCloseSuccessModal = () => {
//     setIsSuccessDeleteModalOpen(false);
//   };

//   const noticiasFiltradas = noticias.filter((n) =>
//     n.titulo.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-1 px-4 sm:px-10 mb-11">
//         <NavBar />
//         <div className="container mx-auto">
//           <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
//             Modificar noticias:
//           </h1>

//           {/* Buscador */}
//           <div className="flex justify-end mb-4">
//             <input
//               type="text"
//               placeholder="Buscar noticia por título"
//               className="input input-bordered w-full max-w-xs"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="overflow-x-auto">
//             {/* Tabla (desktop) */}
//             <table className="hidden md:table w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200 text-black">
//                   <th className="p-3 border border-gray-300">Título de la noticia</th>
//                   <th className="p-3 border border-gray-300">Fecha de creación</th>
//                   <th className="p-3 border border-gray-300">Acción</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {noticiasFiltradas.map((noticia) => (
//                   <tr key={noticia.id} className="hover:bg-gray-100">
//                     <td className="p-3 border border-gray-300 flex items-center gap-3">
//                       <img
//                         src={noticia.imagen}
//                         alt="Noticia"
//                         className="w-20 h-20 rounded-full object-cover border border-gray-300"
//                       />
//                       <span>{noticia.titulo}</span>
//                     </td>
//                     <td className="p-3 border border-gray-300">{noticia.fechaTexto}</td>
//                     <td className="p-3 border border-gray-300 flex gap-2">
//                       <button
//                         className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
//                         onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
//                       >
//                         Editar
//                       </button>
//                       <button
//                         className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
//                         onClick={() => handleOpenConfirmDelete(noticia.id)}
//                       >
//                         Eliminar
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Tarjetas (mobile) */}
//             <div className="md:hidden flex flex-col gap-4">
//               {noticiasFiltradas.map((noticia) => (
//                 <div
//                   key={noticia.id}
//                   className="border border-gray-300 p-4 rounded-lg shadow-md"
//                 >
//                   <img
//                     src={noticia.imagen}
//                     alt="Noticia"
//                     className="w-full h-40 object-cover rounded mb-3"
//                   />
//                   <p className="font-semibold">Fecha de creación:</p>
//                   <p>{noticia.fechaTexto}</p>
//                   <p className="font-semibold mt-2">Título de la noticia:</p>
//                   <p>{noticia.titulo}</p>
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
//                       onClick={() => navigate(`/editar-noticia/${noticia.id}`)}
//                     >
//                       Editar
//                     </button>
//                     <button
//                       className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
//                       onClick={() => handleOpenConfirmDelete(noticia.id)}
//                     >
//                       Eliminar
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />

//       {/* Modales */}
//       {isConfirmDeleteModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
//             <p className="text-lg mb-4">¿Estás seguro de que deseas eliminar la noticia?</p>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="bg-red-600 text-white px-4 py-2 rounded"
//                 onClick={handleConfirmDelete}
//               >
//                 Eliminar
//               </button>
//               <button
//                 className="bg-blue-200 text-black px-4 py-2 rounded"
//                 onClick={handleCloseConfirmDelete}
//               >
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isSuccessDeleteModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
//             <p className="text-lg mb-4">La noticia se ha eliminado con éxito</p>
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={handleCloseSuccessModal}
//             >
//               Ok
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModificarEliminarNoticias;





// Pantallas grandes (md:) > Se usa la tabla.
// Pantallas pequeñas (md:hidden) > Se usa el formato de tarjetas.
// Diseño limpio con shadow-md y rounded-lg en móviles.