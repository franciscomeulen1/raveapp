// ImagenDePerfil.js – gestión de imagen de perfil del usuario
import { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

export default function EditImagenDePerfil({ user, setUser }) {
    const [profileImage, setProfileImage] = useState(null); // url actual o null
    const [profileImageId, setProfileImageId] = useState(null); // idMedia actual si existe
    const [newImagePreview, setNewImagePreview] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [imageError, setImageError] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const resImg = await api.get('/Media', {
                    params: { IdEntidadMedia: user.id }
                });

                if (resImg.data.media && resImg.data.media.length > 0) {
                    const img = resImg.data.media.find(m => !m.mdVideo); // solo imagen
                    if (img) {
                        setProfileImage(img.url);
                        setProfileImageId(img.idMedia);
                    }
                }
            } catch (err) {
                if (err.response && err.response.status !== 404) {
                    console.error('Error al obtener imagen de perfil:', err);
                }
            }
        };

        fetchImage();
    }, [user]);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
                {newImagePreview || profileImage ? (
                    <img
                        src={newImagePreview || profileImage}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">Sin imagen</div>
                )}
            </div>

            <div className="flex flex-col items-start gap-2 w-full max-w-xs">
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm font-medium"
                >
                    Seleccionar imagen
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                            const maxSize = 2 * 1024 * 1024; // 2MB

                            if (!validTypes.includes(file.type)) {
                                setImageError('El archivo debe ser una imagen JPG, JPEG o PNG.');
                                setNewImageFile(null);
                                setNewImagePreview(null);
                                return;
                            }

                            if (file.size > maxSize) {
                                setImageError('La imagen no puede pesar más de 2MB.');
                                setNewImageFile(null);
                                setNewImagePreview(null);
                                return;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setNewImagePreview(reader.result);
                                setNewImageFile(file);
                                setImageError('');
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                <p className="text-xs text-gray-500">Formatos permitidos: JPG, JPEG o PNG. Máximo 2MB.</p>
                {imageError && <p className="text-sm text-red-600">{imageError}</p>}

                {profileImage && !newImagePreview && (
                    <button
                        onClick={async () => {
                            if (!profileImageId) return;
                            try {
                                await api.delete(`/Media/${profileImageId}`);
                                setProfileImage(null);
                                setProfileImageId(null);
                                alert('Imagen eliminada con éxito.');
                            } catch (err) {
                                console.error('Error al eliminar imagen:', err);
                                alert('Ocurrió un error al eliminar la imagen.');
                            }
                        }}
                        className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                    >
                        Eliminar imagen
                    </button>
                )}

                {newImagePreview && !imageError && (
                    <div className="flex gap-2 mt-2">
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                            onClick={async () => {
                                try {
                                    if (profileImageId) {
                                        await api.delete(`/Media/${profileImageId}`);
                                    }

                                    const formData = new FormData();
                                    formData.append('IdEntidadMedia', user.id);
                                    formData.append('File', newImageFile);

                                    await api.post('/Media', formData);

                                    const resImg = await api.get('/Media', {
                                        params: { IdEntidadMedia: user.id }
                                    });

                                    const nueva = resImg.data.media.find(m => !m.mdVideo);
                                    if (nueva) {
                                        setProfileImage(nueva.url);
                                        setProfileImageId(nueva.idMedia);

                                        // 🔁 Actualizamos la imagen en el contexto
                                        setUser(prev => ({
                                            ...prev,
                                            profileImage: nueva.url,
                                            profileImageId: nueva.idMedia,
                                        }));
                                    }

                                    setNewImagePreview(null);
                                    setNewImageFile(null);
                                    alert('Imagen de perfil actualizada con éxito.');
                                } catch (err) {
                                    console.error('Error al actualizar imagen:', err);
                                    alert('Error al actualizar imagen.');
                                }
                            }}
                        >
                            Aceptar
                        </button>
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                            onClick={() => {
                                setNewImagePreview(null);
                                setNewImageFile(null);
                                setImageError('');
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
