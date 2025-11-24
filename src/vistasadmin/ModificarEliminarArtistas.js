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

  // modal eliminar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [modalPhase, setModalPhase] = useState('confirm'); // 'confirm' | 'success'

  const navigate = useNavigate();

  // === CARGA DE DATOS ===
  useEffect(() => {
    const fetchArtistas = async () => {
      try {
        const response = await api.get('/Artista/GetArtista?isActivo=true');
        const artistasRaw = response.data.artistas;

        const artistasConImagen = await Promise.all(
          artistasRaw.map(async (artista) => {
            try {
              const mediaRes = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
              const urlImagen =
                mediaRes.data.media?.[0]?.url ||
                'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

              return {
                id: artista.idArtista,
                nombre: artista.nombre,
                fecha: new Date(artista.dtAlta).toLocaleDateString(),
                imagen: urlImagen,
              };
            } catch (err) {
              console.error(`Error al obtener imagen del artista ${artista.nombre}`, err);
              return {
                id: artista.idArtista,
                nombre: artista.nombre,
                fecha: new Date(artista.dtAlta).toLocaleDateString(),
                imagen:
                  'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
              };
            }
          })
        );

        // Ordenar: numéricos primero, luego alfa
        const artistasOrdenados = artistasConImagen.sort((a, b) => {
          const isANumeric = /^\d/.test(a.nombre);
          const isBNumeric = /^\d/.test(b.nombre);
          if (isANumeric && !isBNumeric) return -1;
          if (!isANumeric && isBNumeric) return 1;
          return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
        });

        setArtistas(artistasOrdenados);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los artistas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArtistas();
  }, []);

  // === HANDLERS MODAL ELIMINAR ===
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
    api
      .delete(`/Artista/DeleteArtista/${artistToDelete}`)
      .then(() => {
        setArtistas((prev) => prev.filter((a) => a.id !== artistToDelete));
        setModalPhase('success');
      })
      .catch((err) => {
        console.error('Error al eliminar artista:', err);
        // acá podrías setear algún mensaje de error en el modal si querés
      });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setArtistToDelete(null);
  };

  // === ESTADOS ESPECIALES (LOADING / ERROR) ===
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <NavBar />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-4 border-gray-600 border-b-transparent animate-spin mb-4" />
            <p className="text-gray-400">Cargando artistas...</p>
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
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // === FILTRO BUSCADOR ===
  const artistasFiltrados = artistas.filter((artista) =>
    artista.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
    <div className="flex-1 sm:px-10 mb-11">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-10 mb-11">
        <h1 className="mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
          Modificar artistas:
        </h1>

        {/* Buscador */}
        <div className="flex justify-end mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscador de artistas"
              className="input input-bordered bg-base-200 text-base-content placeholder:text-gray-400 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* === TABLA DESKTOP === */}
        <div className="hidden md:block rounded-xl overflow-hidden border border-base-300 bg-base-200/30 shadow-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-base-300 text-base-content text-sm uppercase tracking-wide">
                <th className="p-3 text-left w-1/2">Artista</th>
                <th className="p-3 text-left w-1/4">Fecha de creación</th>
                <th className="p-3 text-left w-1/4">Acción</th>
              </tr>
            </thead>

            <tbody>
              {artistasFiltrados.map((artista, idx) => (
                <tr
                  key={artista.id}
                  className={`
                    text-base-content text-sm
                    ${idx % 2 === 0 ? 'bg-base-200/40' : 'bg-base-200/20'}
                    hover:bg-base-300 transition-colors
                  `}
                >
                  {/* Columna Artista */}
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={artista.imagen}
                        alt={artista.nombre}
                        className="w-16 h-16 rounded-full object-cover border border-base-300 flex-shrink-0"
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                      <span className="font-medium">{artista.nombre}</span>
                    </div>
                  </td>

                  {/* Columna Fecha */}
                  <td className="p-4 align-middle text-sm">{artista.fecha}</td>

                  {/* Columna Acción */}
                  <td className="p-4 align-middle">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg px-3"
                        onClick={() => navigate(`/editar-artista/${artista.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                        onClick={() => handleDeleteClick(artista.id)}
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

        {/* === LISTA MOBILE === */}
        <div className="md:hidden flex flex-col gap-4">
          {artistasFiltrados.map((artista, idx) => (
            <div
              key={artista.id}
              className={`
                rounded-xl border border-base-300 bg-base-200/30 shadow-md p-4 flex flex-col items-center text-center
                ${idx % 2 === 0 ? 'bg-base-200/40' : 'bg-base-200/20'}
              `}
            >
              <img
                src={artista.imagen}
                alt={artista.nombre}
                className="w-24 h-24 rounded-full object-cover border border-base-300"
              />
              <p className="font-semibold mt-3 text-base-content">{artista.nombre}</p>
              <p className="text-sm">Fecha de creación: {artista.fecha}</p>

              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <button
                  className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg px-3"
                  onClick={() => navigate(`/editar-artista/${artista.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                  onClick={() => handleDeleteClick(artista.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>

      <Footer />

      {/* === MODAL ELIMINAR === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={modalPhase === 'confirm' ? handleCancel : handleOk}
          />

          {/* card */}
          <div className="relative bg-base-200 text-base-content rounded-xl shadow-xl border border-base-300 w-80 p-6">
            {modalPhase === 'confirm' ? (
              <>
                <h2 className="text-lg font-semibold mb-3">¿Estás seguro?</h2>
                <p className="text-sm text-gray-400 mb-6">
                  ¿Querés eliminar este artista? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleConfirmDelete}
                    className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-3"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-sm bg-base-300 hover:bg-base-100 text-base-content border border-base-300 rounded-lg px-3"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-3">Eliminado</h2>
                <p className="text-sm text-gray-400 mb-6">
                  El artista ha sido eliminado exitosamente.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleOk}
                    className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg px-3"
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
  );
};

export default ModificarEliminarArtistas;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';

// const ModificarEliminarArtistas = () => {
//   const [search, setSearch] = useState('');
//   const [artistas, setArtistas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [artistToDelete, setArtistToDelete] = useState(null);
//   const [modalPhase, setModalPhase] = useState('confirm'); // 'confirm' or 'success'
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get('/Artista/GetArtista?isActivo=true')
//       .then(async response => {
//         const artistasRaw = response.data.artistas;

//         const artistasConImagen = await Promise.all(
//           artistasRaw.map(async (artista) => {
//             try {
//               const mediaRes = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
//               const urlImagen = mediaRes.data.media?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

//               return {
//                 id: artista.idArtista,
//                 nombre: artista.nombre,
//                 fecha: new Date(artista.dtAlta).toLocaleDateString(),
//                 imagen: urlImagen
//               };
//             } catch (err) {
//               console.error(`Error al obtener imagen del artista ${artista.nombre}`, err);
//               return {
//                 id: artista.idArtista,
//                 nombre: artista.nombre,
//                 fecha: new Date(artista.dtAlta).toLocaleDateString(),
//                 imagen: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
//               };
//             }
//           })
//         );

//         // Ordenar: numéricos primero, luego alfabéticamente
//         const artistasOrdenados = artistasConImagen.sort((a, b) => {
//           const isANumeric = /^\d/.test(a.nombre);
//           const isBNumeric = /^\d/.test(b.nombre);
//           if (isANumeric && !isBNumeric) return -1;
//           if (!isANumeric && isBNumeric) return 1;
//           return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
//         });

//         setArtistas(artistasOrdenados);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error al obtener los artistas:', error);
//         setError(error.message);
//         setLoading(false);
//       });
//   }, []);


//   const handleDeleteClick = (id) => {
//     setArtistToDelete(id);
//     setModalPhase('confirm');
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setArtistToDelete(null);
//   };

//   const handleConfirmDelete = () => {
//     api.delete(`/Artista/DeleteArtista/${artistToDelete}`)
//       .then(() => {
//         setArtistas(prev => prev.filter(a => a.id !== artistToDelete));
//         setModalPhase('success');
//       })
//       .catch(err => {
//         console.error('Error al eliminar artista:', err);
//         // Puedes agregar manejo de errores aquí
//       });
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//     setArtistToDelete(null);
//   };

//   // Loading state con spinner bonito centrado en la pantalla
//     if (loading) {
//         return (
//             <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
//                 <NavBar />
//                 <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
//                         <p className="text-gray-600">Cargando artistas...</p>
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
//                         <p className="text-red-500 font-semibold">Hubo un error al cargar los artistas</p>
//                         <p className="text-sm text-gray-500 mt-2">{error}</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//   const artistasFiltrados = artistas.filter(artista =>
//     artista.nombre.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-1 px-4 sm:px-10 mb-11">
//         <NavBar />
//         <div className="container mx-auto">
//           <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
//             Modificar artistas:
//           </h1>

//           <div className="overflow-x-auto">
//             {/* Buscador */}
//             <div className="flex justify-end mb-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Buscador de artistas"
//                   className="input input-bordered pr-10"
//                   value={search}
//                   onChange={e => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Tabla en pantallas grandes */}
//             <table className="hidden md:table w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200 text-black">
//                   <th className="p-3 border border-gray-300">Artista</th>
//                   <th className="p-3 border border-gray-300">Fecha de creación</th>
//                   <th className="p-3 border border-gray-300">Acción</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {artistasFiltrados.map(artista => (
//                   <tr key={artista.id} className="hover:bg-gray-100">
//                     <td className="p-3 border border-gray-300 flex items-center gap-3">
//                       <img
//                         src={artista.imagen}
//                         alt="Artista"
//                         className="w-20 h-20 rounded-full object-cover border border-gray-300"
//                       />
//                       <span>{artista.nombre}</span>
//                     </td>
//                     <td className="p-3 border border-gray-300">{artista.fecha}</td>
//                     <td className="p-3 border border-gray-300 flex gap-2">
//                       <button
//                         className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
//                         onClick={() => navigate(`/editar-artista/${artista.id}`)}
//                       >
//                         Editar
//                       </button>
//                       <button
//                         className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
//                         onClick={() => handleDeleteClick(artista.id)}
//                       >
//                         Eliminar
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Vista en móvil (tarjetas) */}
//             <div className="md:hidden flex flex-col gap-4">
//               {artistasFiltrados.map(artista => (
//                 <div
//                   key={artista.id}
//                   className="border border-gray-300 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
//                 >
//                   <img
//                     src={artista.imagen}
//                     alt="Artista"
//                     className="w-28 h-28 rounded-full object-cover border border-gray-300"
//                   />
//                   <p className="font-semibold mt-2">{artista.nombre}</p>
//                   <p className="text-gray-600">Fecha de creación: {artista.fecha}</p>
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       className="btn btn-sm bg-purple-600 text-white rounded-lg px-3"
//                       onClick={() => navigate(`/editar-artista/${artista.id}`)}
//                     >
//                       Editar
//                     </button>
//                     <button
//                       className="btn btn-sm bg-red-600 text-white rounded-lg px-3"
//                       onClick={() => handleDeleteClick(artista.id)}
//                     >
//                       Eliminar
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Modal de confirmación y éxito */}
//             {isModalOpen && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                 <div className="bg-white rounded-lg p-6 w-80">
//                   {modalPhase === 'confirm' ? (
//                     <>
//                       <h2 className="text-xl font-semibold mb-4">¿Estás seguro?</h2>
//                       <p className="mb-6">¿Quieres eliminar este artista?</p>
//                       <div className="flex justify-end gap-2">
//                         <button
//                           onClick={handleConfirmDelete}
//                           className="btn btn-sm bg-red-600 text-white"
//                         >
//                           Eliminar
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           className="btn btn-sm btn-neutral"
//                         >
//                           Cancelar
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <h2 className="text-xl font-semibold mb-4">Eliminado</h2>
//                       <p className="mb-6">El artista ha sido eliminado exitosamente.</p>
//                       <div className="flex justify-end">
//                         <button
//                           onClick={handleOk}
//                           className="btn btn-sm bg-blue-600 text-white"
//                         >
//                           Ok
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ModificarEliminarArtistas;