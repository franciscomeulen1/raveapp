import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { FaFileImage } from "react-icons/fa";

const EditarArtista = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [idMediaActual, setIdMediaActual] = useState(null);
  const [errorImagen, setErrorImagen] = useState("");
  const [instagram, setInstagram] = useState("");
  const [spotify, setSpotify] = useState("");
  const [soundcloud, setSoundcloud] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [errorInstagram, setErrorInstagram] = useState("");
  const [errorSpotify, setErrorSpotify] = useState("");
  const [errorSoundcloud, setErrorSoundcloud] = useState("");

  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!id) return;

    const obtenerArtista = async () => {
      try {
        const response = await api.get(`/Artista/GetArtista?idArtista=${id}&isActivo=true`);
        const { artistas } = response.data;
        if (artistas && artistas.length > 0) {
          const artista = artistas[0];
          setNombre(artista.nombre || "");
          setBio(artista.bio || "");
          if (artista.socials) {
            setInstagram(artista.socials.mdInstagram || "");
            setSpotify(artista.socials.mdSpotify || "");
            setSoundcloud(artista.socials.mdSoundcloud || "");
          }
        }
      } catch (err) {
        console.error("Error al obtener el artista:", err);
        setError(err.message);
      }
    };

    const obtenerImagen = async () => {
      try {
        const response = await api.get(`/Media?idEntidadMedia=${id}`);
        const media = response.data.media?.[0];
        if (media) {
          setImagenUrl(media.url);
          setIdMediaActual(media.idMedia);
        }
      } catch (err) {
        console.error("Error al obtener la imagen del artista:", err);
      } finally {
        setLoading(false);
      }
    };

    obtenerArtista();
    obtenerImagen();
  }, [id]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorImagen("La imagen debe ser JPG, JPEG o PNG.");
      setImagen(null);
      setPreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorImagen("La imagen no debe pesar más de 2MB.");
      setImagen(null);
      setPreview(null);
      return;
    }

    setImagen(file);
    setPreview(URL.createObjectURL(file));
    setErrorImagen("");
  };

  const handleEliminarImagen = async () => {
    if (!idMediaActual) return;

    try {
      await api.delete(`/Media/${idMediaActual}`);
      setIdMediaActual(null);
      setImagenUrl(null);
    } catch (error) {
      console.error("Error al eliminar la imagen del artista:", error);
    }
  };

  const handleConfirmClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCancelUpdate = () => {
    setIsConfirmModalOpen(false);
  };

  const esUrlValida = (url) => {
    const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    return pattern.test(url);
  };

  const handleUpdate = async () => {
    setIsConfirmModalOpen(false);
    setCargando(true);

    try {

      let hasError = false;

      if (instagram && !esUrlValida(instagram)) {
        setErrorInstagram("La URL de Instagram no es válida.");
        hasError = true;
      } else {
        setErrorInstagram("");
      }

      if (spotify && !esUrlValida(spotify)) {
        setErrorSpotify("La URL de Spotify no es válida.");
        hasError = true;
      } else {
        setErrorSpotify("");
      }

      if (soundcloud && !esUrlValida(soundcloud)) {
        setErrorSoundcloud("La URL de SoundCloud no es válida.");
        hasError = true;
      } else {
        setErrorSoundcloud("");
      }

      if (hasError) {
        setCargando(false);
        return; // Cancela el submit si hay errores
      } 

      const payload = {
        idArtista: id,
        nombre,
        bio,
        isActivo: true,
        socials: {
          idSocial: "",
          mdInstagram: instagram,
          mdSpotify: spotify,
          mdSoundcloud: soundcloud
        }
      };

      await api.put('/Artista/UpdateArtista', payload);

      // Subir nueva imagen si se seleccionó
      if (imagen) {
        try {
          if (idMediaActual) {
            await api.delete(`/Media/${idMediaActual}`);
          }

          const formData = new FormData();
          formData.append("IdEntidadMedia", String(id));
          formData.append("File", imagen);

          await api.post("/Media", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error al subir la imagen del artista:", error);
        }
      }

      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Error al actualizar el artista:", err);
      setIsConfirmModalOpen(false);
    } finally {
        setCargando(false);
    }
  };

  if (loading) return <div className="p-4">Cargando artista...</div>;
  if (error) return <div className="p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          <div className="max-w-4xl mx-auto p-6">
            <h1 className='mb-8 text-3xl font-bold underline underline-offset-8'>Editar artista:</h1>

            {/* Nombre */}
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

            {/* Imagen */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full max-w-[120px] h-[120px] bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mx-auto sm:mx-0">
                {(preview || imagenUrl) ? (
                  <img
                    src={preview || imagenUrl}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaFileImage className="text-3xl text-gray-500" />
                )}
              </div>
              <div className="w-full">
                <label className="block font-semibold">Foto del artista:</label>
                <input type="file" accept="image/*" onChange={handleImagenChange} />
                <p className="text-sm text-gray-600 mb-2">
                  Se permiten imágenes JPG, JPEG o PNG. Peso máximo: 2MB.
                </p>
                {errorImagen && <p className="text-red-600 text-sm mb-2">{errorImagen}</p>}

                {/* Botón eliminar imagen */}
                {idMediaActual && !preview && (
                  <button
                    type="button"
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    onClick={handleEliminarImagen}
                  >
                    Eliminar imagen actual
                  </button>
                )}
              </div>
            </div>


            {/* Bio */}
            <div className="mb-4">
              <label className="block font-semibold">Información sobre el artista:</label>
              <textarea
                className="w-full border rounded p-2"
                placeholder="Espacio para escribir información del artista"
                rows="8"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Instagram */}
            <div className="mb-4">
              <label className="block font-semibold">URL del Instagram del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2 mb-1"
                placeholder="https://instagram.com/artista"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
              {errorInstagram && <p className="text-red-600 text-sm">{errorInstagram}</p>}
            </div>

            {/* SoundCloud */}
            <div className="mb-4">
              <label className="block font-semibold">URL del SoundCloud del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2 mb-1"
                placeholder="https://soundcloud.com/artista"
                value={soundcloud}
                onChange={(e) => setSoundcloud(e.target.value)}
              />
              {errorSoundcloud && <p className="text-red-600 text-sm">{errorSoundcloud}</p>}
            </div>

            {/* Spotify */}
            <div className="mb-4">
              <label className="block font-semibold">URL del Spotify del artista:</label>
              <input
                type="text"
                className="w-full border rounded p-2 mb-1"
                placeholder="https://open.spotify.com/artist/..."
                value={spotify}
                onChange={(e) => setSpotify(e.target.value)}
              />
              {errorSpotify && <p className="text-red-600 text-sm">{errorSpotify}</p>}
            </div>



            {/* Botón confirmar */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleConfirmClick}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* Modal confirmación */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">¿Estás seguro de modificar los datos del artista?</h2>
            <div className="flex justify-end gap-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleUpdate}>
                Confirmar
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={handleCancelUpdate}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-green-600">¡La modificación se ha realizado con éxito!</h2>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate('/modificar-eliminar-artistas')}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {cargando && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p className="text-white">Actualizando artista...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarArtista;