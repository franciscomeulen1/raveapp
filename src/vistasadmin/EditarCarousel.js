import React, { useEffect, useState } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const idsCarousel = ['idCarousel1', 'idCarousel2', 'idCarousel3', 'idCarousel4'];

function EditarCarousel() {
    const [imagenes, setImagenes] = useState({});
    const [previews, setPreviews] = useState({});
    const [archivos, setArchivos] = useState({});
    const [cargando, setCargando] = useState(false);
    const [mensajes, setMensajes] = useState({});

    useEffect(() => {
        const fetchImagenes = async () => {
            const nuevasImagenes = {};
            for (const id of idsCarousel) {
                try {
                    const res = await api.get(`/Media?idEntidadMedia=${id}`);
                    nuevasImagenes[id] = res.data.media?.[0]?.url || null;
                } catch (error) {
                    nuevasImagenes[id] = null;
                }
            }
            setImagenes(nuevasImagenes);
        };

        fetchImagenes();
    }, []);



    const handleSeleccion = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen debe pesar menos de 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [id]: reader.result }));
        };
        reader.readAsDataURL(file);
        setArchivos(prev => ({ ...prev, [id]: file }));
        setMensajes(prev => ({ ...prev, [id]: null }));
    };

    const handleConfirmar = async (id) => {
        const file = archivos[id];
        if (!file) return;

        setCargando(true);
        try {
            // Eliminar anterior
            const resExistente = await api.get(`/Media?idEntidadMedia=${id}`);
            const mediaActual = resExistente.data?.media?.[0];
            if (mediaActual?.idMedia) {
                await api.delete(`/Media/${mediaActual.idMedia}`);
            }

            // Subir nueva
            const formData = new FormData();
            formData.append('idEntidadMedia', id);
            formData.append('File', file);
            await api.post('/Media', formData);

            // Obtener nueva desde el GET
            const nuevaRes = await api.get(`/Media?idEntidadMedia=${id}`);
            const nuevaUrl = nuevaRes.data?.media?.[0]?.url || null;

            setImagenes(prev => ({ ...prev, [id]: nuevaUrl }));
            setPreviews(prev => ({ ...prev, [id]: null }));
            setArchivos(prev => ({ ...prev, [id]: null }));
            setMensajes(prev => ({ ...prev, [id]: '✅ Imagen actualizada con éxito' }));
        } catch (err) {
            console.error('Error al subir la imagen', err);
            alert('Error al subir la imagen');
        } finally {
            setCargando(false);
        }
    };


    const handleEliminar = async (id) => {
        if (!imagenes[id]) return;
        const confirmar = window.confirm('¿Seguro que quieres eliminar esta imagen?');
        if (!confirmar) return;

        setCargando(true);
        try {
            const res = await api.get(`/Media?idEntidadMedia=${id}`);
            const media = res.data?.media?.[0];
            if (media?.idMedia) {
                await api.delete(`/Media/${media.idMedia}`);
                setImagenes(prev => ({ ...prev, [id]: null }));
                setPreviews(prev => ({ ...prev, [id]: null }));
                setArchivos(prev => ({ ...prev, [id]: null }));
                setMensajes(prev => ({ ...prev, [id]: null }));
            }
        } catch (err) {
            console.error('Error al eliminar la imagen', err);
            alert('Error al eliminar la imagen');
        } finally {
            setCargando(false);
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10">
                    <NavBar />
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Editar Carrusel</h2>

                    {idsCarousel.map((id, index) => (
                        <div key={id} className="mb-8 border-b pb-6">
                            <h3 className="text-lg font-semibold mb-2">Imagen de carrusel {index + 1}</h3>

                            {imagenes[id] && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500">Imagen actual:</p>
                                    <img
                                        src={imagenes[id]}
                                        alt={`carousel-${index + 1}`}
                                        className="w-full h-48 object-cover rounded shadow"
                                    />
                                </div>
                            )}

                            {previews[id] && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500">Vista previa:</p>
                                    <img
                                        src={previews[id]}
                                        alt={`preview-${id}`}
                                        className="w-full h-48 object-cover rounded border"
                                    />
                                </div>
                            )}

                            {mensajes[id] && (
                                <p className="text-green-600 font-semibold mb-2">{mensajes[id]}</p>
                            )}

                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleSeleccion(e, id)}
                                    className="file-input file-input-bordered file-input-sm"
                                />
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleConfirmar(id)}
                                    disabled={!archivos[id] || cargando}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleEliminar(id)}
                                    disabled={!imagenes[id] || cargando}
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        </div>
                    ))}

                    {cargando && (
                        <div className="mt-4 flex justify-center items-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <span className="ml-3">Procesando...</span>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditarCarousel;
