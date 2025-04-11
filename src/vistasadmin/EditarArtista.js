import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const EditarArtista = () => {
  // Tomamos el 'id' del artista desde los parámetros de la URL:
  // /editar-artista/:id
  const { id } = useParams();

  // Estados para manejar los campos del formulario:
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");

  // Estados para controlar la carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 1. Al montar el componente, obtenemos los datos del artista desde la API
  useEffect(() => {
    if (!id) return;

    // Ajusta el endpoint según corresponda en tu API
    // Por ejemplo: /Artista/GetArtistaById?id={id}
    api.get(`/Artista/GetArtista?idArtista=${id}&isActivo=true`)
      .then(response => {
        // Ajusta la forma en la que accedes a la data según tu respuesta
        const { artistas } = response.data;
        console.log(artistas);
        if (artistas && artistas.length > 0) {
            const artistaEncontrado = artistas[0];
            setNombre(artistaEncontrado.nombre || "");
            setBio(artistaEncontrado.bio || "");
            setLoading(false);
        }
        
      })
      .catch(error => {
        console.error("Error al obtener el artista:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // 2. Manejo de carga y error
  if (loading) return <div className="p-4">Cargando artista...</div>;
  if (error) return <div className="p-4">Hubo un error: {error}</div>;

  // 3. Función para abrir el modal de confirmación
  const handleConfirmClick = () => {
    setIsConfirmModalOpen(true);
  };

  // 4. Función para cancelar la edición (cerrar modal sin hacer nada)
  const handleCancelUpdate = () => {
    setIsConfirmModalOpen(false);
  };

  // 5. Función para realizar el PUT en la API
  const handleUpdate = () => {

    const payload = {
      idArtista: id,
      nombre,  // Equivalente a: nombre: nombre,
      bio: bio, // Equivalente a: bio: bio,
      isActivo: 1 // Ajusta según corresponda
    };

    api.put('/Artista/UpdateArtista', payload)
      .then(() => {
        // Cierra el modal de confirmación
        setIsConfirmModalOpen(false);
        // Abre el modal de éxito
        setIsSuccessModalOpen(true);
      })
      .catch(error => {
        console.error("Error al actualizar el artista:", error);
        // En caso de error, podrías mostrar otro modal o un mensaje.
        // Por ahora, solo cerramos el modal de confirmación.
        setIsConfirmModalOpen(false);
      });
  };

  // 6. Función para cerrar el modal de éxito
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />

          <div className="max-w-4xl mx-auto p-6">
            <h1 className='mb-8 text-3xl font-bold underline underline-offset-8'>
              Editar artista:
            </h1>

            {/* Campo: Nombre del artista */}
            <div className="mb-4">
              <label className="block font-semibold">Nombre del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Campo: (imagen) - Actualmente no proveniente de la API */}
            <div className="mb-4 flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full font-bold">
                IMG
              </div>
              <div>
                <label className="block font-semibold">Foto del artista:</label>
                <button className="border px-4 py-1 rounded bg-gray-200">
                  Seleccionar imagen
                </button>
              </div>
            </div>

            {/* Campo: Información del artista (bio) */}
            <div className="mb-4">
              <label className="block font-semibold">Información sobre el artista:</label>
              <textarea
                className="w-full border rounded p-2"
                placeholder="Espacio para escribir información del artista"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Las URL de las redes siguen vacías ya que la API no las provee por el momento */}
            <div className="mb-4">
              <label className="block font-semibold">URL del Instagram del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="URL de Instagram"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">URL del SoundCloud del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="URL de SoundCloud"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">URL del Spotify del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="URL de Spotify"
                disabled
              />
            </div>

            {/* Botón: "Confirmar" que abre el modal de confirmación */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleConfirmClick}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL de confirmación */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              ¿Estás seguro de modificar los datos del artista?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={handleCancelUpdate}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL de éxito */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              ¡La modificación del artista se ha realizado con éxito!
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCloseSuccessModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EditarArtista;