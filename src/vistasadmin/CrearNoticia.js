import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { useNavigate } from 'react-router-dom';

const CrearNoticia = () => {

    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [urlEvento, setUrlEvento] = useState('');
    const [errorTitulo, setErrorTitulo] = useState('');
    const [errorContenido, setErrorContenido] = useState('');
    const [errorUrl, setErrorUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mensajeError, setMensajeError] = useState('');
    const [errorImagen, setErrorImagen] = useState('');
    const [cargando, setCargando] = useState(false);

    const esUrlValida = (url) => {
        const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
        return pattern.test(url);
    };

    const handleCrearNoticia = async () => {
        setCargando(true);

        setErrorImagen('');
        let esValido = true;

        if (!titulo.trim()) {
            setErrorTitulo('El título es obligatorio.');
            esValido = false;
        } else {
            setErrorTitulo('');
        }

        if (!contenido.trim()) {
            setErrorContenido('El cuerpo de la noticia es obligatorio.');
            esValido = false;
        } else {
            setErrorContenido('');
        }

        if (urlEvento && !esUrlValida(urlEvento)) {
            setErrorUrl('La URL ingresada no es válida. Asegúrate de que comience con http:// o https://');
            esValido = false;
        } else {
            setErrorUrl('');
        }

        if (!esValido) {
            setCargando(false);
            return;
        }

        if (!imagen) {
            setMensajeError('La imagen es obligatoria para crear la noticia.');
            setCargando(false);
            return;
        } else {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(imagen.type)) {
                setMensajeError('No se pudo crear la noticia. El archivo debe ser una imagen JPG, JPEG o PNG.');
                setCargando(false);
                return;
            }
            if (imagen.size > 2 * 1024 * 1024) {
                setMensajeError('No se pudo crear la noticia. La imagen excede los 2MB.');
                setCargando(false);
                return;
            }
        }

        try {
            const fechaActualISO = new Date().toISOString();

            const res = await api.post('/noticia', {
                titulo,
                contenido,
                dtPublicado: fechaActualISO,
                urlEvento,
            });

            const idNoticia = res.data.idNoticia;

            if (imagen) {
                const formData = new FormData();
                formData.append('IdEntidadMedia', idNoticia);
                formData.append('File', imagen);

                await api.post('/Media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setTitulo('');
            setContenido('');
            setUrlEvento('');
            setImagen(null);
            setPreview(null);
            setIsModalOpen(true);
            setMensajeError('');

        } catch (error) {
            console.error('Error al crear la noticia o subir la imagen:', error);
            setMensajeError('En estos momentos no es posible crear la noticia. Intenta nuevamente más tarde.');
        } finally {
            setCargando(false);
        }
    };


    const handleCerrarModal = () => {
        setIsModalOpen(false);
        navigate('/modificar-eliminar-noticias');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />

                    <div className="max-w-4xl mx-auto p-6">
                        <h1 className="mb-8 text-3xl font-bold underline underline-offset-8">
                            Crear noticia:
                        </h1>

                        {/* Título */}
                        <label className="font-semibold">Título de la noticia:</label>
                        <input
                            type="text"
                            placeholder="Título de la noticia aquí"
                            className="w-full p-2 border rounded-md mb-1"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                        {errorTitulo && <p className="text-red-600 text-sm mb-4">{errorTitulo}</p>}

                        {/* Imagen */}
                        <div className="mt-4 mb-4">
                            <label className="font-semibold block mb-1">Seleccionar imagen para la noticia:</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                                        if (!validTypes.includes(file.type)) {
                                            setErrorImagen('Solo se permiten imágenes en formato JPG, JPEG o PNG.');
                                            setImagen(null);
                                            setPreview(null);
                                            return;
                                        }

                                        if (file.size > 2 * 1024 * 1024) {
                                            setErrorImagen('La imagen debe pesar 2MB o menos.');
                                            setImagen(null);
                                            setPreview(null);
                                            return;
                                        }

                                        setImagen(file);
                                        setPreview(URL.createObjectURL(file));
                                        setErrorImagen('');
                                    }
                                }}

                            />
                            <p className="text-sm text-gray-600 mt-1">
                                La imagen debe pesar menos de 2MB y se recomienda que tenga dimensiones cuadradas (alto = ancho).
                            </p>
                            {errorImagen && <p className="text-red-600 text-sm mt-1">{errorImagen}</p>}

                            {preview && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Vista previa (así se verá en Noticias):</p>

                                    <div
                                        className="
                                                   w-full
                                                   max-w-[396px]
                                                   h-[300px]
                                                   overflow-hidden
                                                   rounded-md
                                                   border
                                                   bg-gray-200
                                                "
                                    >
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>


                        {/* Contenido */}
                        <label className="font-semibold">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-1"
                            placeholder="Espacio para escribir la noticia"
                            rows="8"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                        />
                        {errorContenido && <p className="text-red-600 text-sm mb-4">{errorContenido}</p>}

                        {/* URL evento */}
                        <label className="font-semibold">
                            Ingresar URL del evento a asociar a esta noticia: <span className="font-normal italic">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="https://evento.com/ejemplo"
                            className="w-full p-2 border rounded-md mb-1"
                            value={urlEvento}
                            onChange={(e) => setUrlEvento(e.target.value)}
                        />
                        {errorUrl && <p className="text-red-600 text-sm mb-4">{errorUrl}</p>}

                        {/* Botón */}
                        <div>
                            <button
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                                onClick={handleCrearNoticia}
                            >
                                Crear noticia
                            </button>
                        </div>

                        {mensajeError && (
                            <p className="text-red-600 text-sm mt-4">{mensajeError}</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {cargando && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
                    <div className="flex flex-col items-center">
                        <span className="loading loading-spinner loading-lg text-purple-600"></span>
                        <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                        <p className="text-white">Creando noticia...</p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-xl font-bold mb-4 text-green-600">Creación exitosa</h3>
                        <p className="mb-6">La noticia se ha creado correctamente.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCerrarModal}
                                className="btn btn-secondary"
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

export default CrearNoticia;
