// components/evento/ModalEditarArtista.js
import React, { useEffect, useState } from 'react';
import api from '../../componenteapi/api';
import { FaFileImage } from 'react-icons/fa';

export default function ModalEditarArtista({ artista, onClose, onUpdate }) {

    const [nombre, setNombre] = useState(artista.nombre || '');
    const [bio, setBio] = useState(artista.bio || '');
    const [instagram, setInstagram] = useState(artista.socials?.mdInstagram || '');
    const [spotify, setSpotify] = useState(artista.socials?.mdSpotify || '');
    const [soundcloud, setSoundcloud] = useState(artista.socials?.mdSoundcloud || '');

    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imagenUrl, setImagenUrl] = useState(null);
    const [idMediaActual, setIdMediaActual] = useState(null);

    const [errorInstagram, setErrorInstagram] = useState('');
    const [errorSpotify, setErrorSpotify] = useState('');
    const [errorSoundcloud, setErrorSoundcloud] = useState('');
    const [errorImagen, setErrorImagen] = useState('');

    useEffect(() => {
        const obtenerImagen = async () => {
            try {
                const res = await api.get(`/Media?idEntidadMedia=${artista.idArtista}`);
                const media = res.data.media?.[0];
                if (media?.url) {
                    setImagenUrl(media.url);
                    setIdMediaActual(media.idMedia);
                }
            } catch (err) {
                console.warn('No se pudo obtener imagen actual del artista.');
            }
        };

        obtenerImagen();
    }, [artista.idArtista]);

    const esUrlValida = (url) => /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i.test(url);

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setErrorImagen('La imagen debe ser JPG, JPEG o PNG.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setErrorImagen('La imagen no debe pesar más de 2MB.');
            return;
        }

        setImagen(file);
        setPreview(URL.createObjectURL(file));
        setErrorImagen('');
    };

    const handleGuardar = async () => {
        let hasError = false;

        if (instagram && !esUrlValida(instagram)) {
            setErrorInstagram('URL de Instagram no válida.');
            hasError = true;
        } else setErrorInstagram('');

        if (spotify && !esUrlValida(spotify)) {
            setErrorSpotify('URL de Spotify no válida.');
            hasError = true;
        } else setErrorSpotify('');

        if (soundcloud && !esUrlValida(soundcloud)) {
            setErrorSoundcloud('URL de SoundCloud no válida.');
            hasError = true;
        } else setErrorSoundcloud('');

        if (hasError) return;

        const payload = {
            idArtista: artista.idArtista,
            nombre,
            bio,
            isActivo: true,
            socials: {
                idSocial: '',
                mdInstagram: instagram,
                mdSpotify: spotify,
                mdSoundcloud: soundcloud,
            },
        };

        try {
            await api.put('/Artista/UpdateArtista', payload);

            // Imagen nueva
            if (imagen) {
                if (idMediaActual) await api.delete(`/Media/${idMediaActual}`);

                const formData = new FormData();
                formData.append('IdEntidadMedia', artista.idArtista);
                formData.append('File', imagen);
                await api.post('/Media', formData);
            }

            alert('Artista activado correctamente.');

            onUpdate({
                ...artista,
                ...payload,
                isActivo: 1, // <<--- forzamos a que se actualice el estado como activo
                socials: payload.socials,
            }); // Esto actualiza el estado en EventoAValidar

            onClose();
        } catch (err) {
            console.error('Error al actualizar artista:', err);
            alert('Error al activar el artista.');
        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-4">Activar artista</h2>

                <div className="mb-4">
                    <label className="block font-semibold">Nombre del artista:</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                {/* Imagen */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                        {(preview || imagenUrl) ? (
                            <img src={preview || imagenUrl} alt="preview" className="object-cover w-full h-full" />
                        ) : (
                            <FaFileImage className="text-2xl text-gray-500" />
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold">Foto del artista:</label>
                        <input type="file" accept="image/*" onChange={handleImagenChange} />
                        <p className="text-sm text-gray-600">JPG, JPEG o PNG. Máx 2MB.</p>
                        {errorImagen && <p className="text-sm text-red-600">{errorImagen}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Bio:</label>
                    <textarea
                        className="w-full border rounded p-2"
                        rows="3"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Instagram:</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                    />
                    {errorInstagram && <p className="text-sm text-red-600">{errorInstagram}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Spotify:</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={spotify}
                        onChange={(e) => setSpotify(e.target.value)}
                    />
                    {errorSpotify && <p className="text-sm text-red-600">{errorSpotify}</p>}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">SoundCloud:</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={soundcloud}
                        onChange={(e) => setSoundcloud(e.target.value)}
                    />
                    {errorSoundcloud && <p className="text-sm text-red-600">{errorSoundcloud}</p>}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={handleGuardar}
                    >
                        Confirmar activación
                    </button>
                </div>
            </div>
        </div>
    );
}
