import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const EditarNoticia = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [dtPublicado, setDtPublicado] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenUrl, setImagenUrl] = useState(null);
    const [idMediaActual, setIdMediaActual] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errorImagen, setErrorImagen] = useState('');
    const [urlEvento, setUrlEvento] = useState('');
    const [errorUrl, setErrorUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const obtenerNoticia = async () => {
            try {
                const response = await api.get(`/noticia?idNoticia=${id}`);
                const { noticias } = response.data;
                if (noticias && noticias.length > 0) {
                    const noticiaEncontrada = noticias[0];
                    setTitulo(noticiaEncontrada.titulo || '');
                    setContenido(noticiaEncontrada.contenido || '');
                    setDtPublicado(noticiaEncontrada.dtPublicado || '');
                    setUrlEvento(noticiaEncontrada.urlEvento || '');
                }
            } catch (error) {
                console.error('Error al obtener la noticia:', error);
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
            } catch (error) {
                console.error('Error al obtener imagen de la noticia:', error);
            }
        };

        obtenerNoticia();
        obtenerImagen();
    }, [id]);

    const esUrlValida = (url) => {
        const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
        return pattern.test(url);
    };

    const handleEditarNoticia = async () => {
        setErrorImagen('');
        setCargando(true);   // ⬅️ activar spinner

        // Validar imagen solo si el usuario cargó una nueva
        if (imagen) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(imagen.type)) {
                setErrorImagen('El archivo seleccionado no es una imagen válida (JPG, JPEG o PNG).');
                setCargando(false);
                return;
            }
            if (imagen.size > 2 * 1024 * 1024) {
                setErrorImagen('La imagen excede el tamaño máximo permitido de 2MB.');
                setCargando(false);
                return;
            }
        }

        if (urlEvento && !esUrlValida(urlEvento)) {
            setErrorUrl('La URL ingresada no es válida. Asegúrate de que comience con http:// o https://');
            setCargando(false);
            return;
        } else {
            setErrorUrl('');
        }

        try {
            await api.put('/noticia', {
                idNoticia: id,
                titulo,
                contenido,
                dtPublicado,
                urlEvento,
            });

            if (imagen) {
                if (idMediaActual) {
                    await api.delete(`/Media/${idMediaActual}`);
                }

                const formData = new FormData();
                formData.append('IdEntidadMedia', id);
                formData.append('File', imagen);

                await api.post('/Media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error al editar la noticia:', error);
        } finally {
            setCargando(false);  // ⬅️ desactivar spinner al terminar
        }
    };



    const handleImagenChange = (e) => {
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
    };


    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="max-w-4xl mx-auto p-6">
                        <h1 className="mb-8 text-3xl font-bold underline underline-offset-8">
                            Editar noticia:
                        </h1>

                        {/* Título */}
                        <label className="font-semibold">Título de la noticia:</label>
                        <input
                            type="text"
                            placeholder="Título de la noticia aquí"
                            className="w-full p-2 border rounded-md mb-4"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        {/* Imagen */}
                        <label className="font-semibold block mb-1">Editar imagen:</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full"
                            onChange={handleImagenChange}
                        />
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                            La imagen debe pesar menos de 2MB y se recomienda que tenga dimensiones cuadradas (alto = ancho).
                        </p>
                        {errorImagen && <p className="text-red-600 text-sm mt-1">{errorImagen}</p>}

                        {(preview || imagenUrl) && (
                            <div>
                                <p className="text-sm text-gray-600">Vista previa:</p>
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
                                        src={preview || imagenUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contenido */}
                        <label className="font-semibold mt-4">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Espacio para escribir la noticia"
                            rows="8"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                        />

                        {/* URL evento */}
                        <label className="font-semibold">
                            Editar URL del evento asociado: <span className="font-normal italic">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="https://evento.com/ejemplo"
                            className="w-full p-2 border rounded-md mb-6"
                            value={urlEvento}
                            onChange={(e) => setUrlEvento(e.target.value)}
                        />
                        {errorUrl && <p className="text-red-600 text-sm mb-4">{errorUrl}</p>}

                        <div>
                            <button
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                                onClick={handleEditarNoticia}
                            >
                                Confirmar edición
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {cargando && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
                    <div className="flex flex-col items-center">
                        <span className="loading loading-spinner loading-lg text-purple-600"></span>
                        <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                        <p className="text-white">Actualizando noticia...</p>
                    </div>
                </div>
            )}

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-xl font-bold mb-4 text-green-600">Modificación exitosa</h3>
                        <p className="mb-6">La modificación se ha realizado con éxito.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/modificar-eliminar-noticias')}
                                className="btn btn-primary"
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

export default EditarNoticia;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';

// const EditarNoticia = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [titulo, setTitulo] = useState('');
//     const [contenido, setContenido] = useState('');
//     const [dtPublicado, setDtPublicado] = useState('');
//     // Se inicializa la imagen como cadena vacía para evitar conflictos con null
//     // eslint-disable-next-line
//     const [imagen, setImagen] = useState('');
//     const [urlEvento, setUrlEvento] = useState('');
//     const [errorUrl, setErrorUrl] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     useEffect(() => {
//         const obtenerNoticia = async () => {
//             try {
//                 const response = await api.get(`/noticia?idNoticia=${id}`);
//                 const { noticias } = response.data;
//                 if (noticias && noticias.length > 0) {
//                     const noticiaEncontrada = noticias[0];
//                     setTitulo(noticiaEncontrada.titulo || '');
//                     setContenido(noticiaEncontrada.contenido || '');
//                     setDtPublicado(noticiaEncontrada.dtPublicado || '');
//                     setUrlEvento(noticiaEncontrada.urlEvento || '');
//                 }
//             } catch (error) {
//                 console.error('Error al obtener la noticia:', error);
//             }
//         };

//         obtenerNoticia();
//     }, [id]);

//     const esUrlValida = (url) => {
//         const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
//         return pattern.test(url);
//     };

//     const handleEditarNoticia = async () => {
//         // Validar URL solo si se ingresó algo
//         if (urlEvento && !esUrlValida(urlEvento)) {
//             setErrorUrl('La URL ingresada no es válida. Asegúrate de que comience con http:// o https://');
//             return;
//         } else {
//             setErrorUrl('');
//         }

//         try {
//             console.log('Actualizando noticia con datos:', {
//                 idNoticia: id,
//                 titulo,
//                 contenido,
//                 imagen,
//                 dtPublicado,
//                 urlEvento,
//             });

//             const response = await api.put('/noticia', {
//                 idNoticia: id,
//                 titulo,
//                 contenido,
//                 imagen,
//                 dtPublicado,
//                 urlEvento,
//             });

//             console.log('Respuesta del PUT:', response.data);

//             // Abrimos el modal de confirmación
//             setIsModalOpen(true);
//         } catch (error) {
//             console.error('Error al editar la noticia:', error);
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1">
//                 <div className="sm:px-10 mb-11">
//                     <NavBar />
//                     <div className="max-w-4xl mx-auto p-6">
//                         <h1 className="mb-8 text-3xl font-bold underline underline-offset-8">
//                             Editar noticia:
//                         </h1>

//                         {/* Título */}
//                         <label className="font-semibold">Título de la noticia:</label>
//                         <input
//                             type="text"
//                             placeholder="Título de la noticia aquí"
//                             className="w-full p-2 border rounded-md mb-4"
//                             value={titulo}
//                             onChange={(e) => setTitulo(e.target.value)}
//                         />

//                         {/* Imagen */}
//                         <label className="font-semibold">Editar imagen:</label>
//                         <div className="flex items-center gap-4 mb-4">
//                             <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
//                                 IMG
//                             </div>
//                             <button className="border px-4 py-2 rounded-md">Seleccionar imagen</button>
//                         </div>

//                         {/* Contenido */}
//                         <label className="font-semibold">Cuerpo de la noticia:</label>
//                         <textarea
//                             className="w-full p-2 border rounded-md mb-4"
//                             placeholder="Espacio para escribir la noticia"
//                             rows="4"
//                             value={contenido}
//                             onChange={(e) => setContenido(e.target.value)}
//                         />

//                         {/* URL evento */}
//                         <label className="font-semibold">
//                             Editar URL del evento asociado: <span className="font-normal italic">(opcional)</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="https://evento.com/ejemplo"
//                             className="w-full p-2 border rounded-md mb-6"
//                             value={urlEvento}
//                             onChange={(e) => setUrlEvento(e.target.value)}
//                         />
//                         {errorUrl && <p className="text-red-600 text-sm mb-4">{errorUrl}</p>}

//                         <div>
//                             <button
//                                 className="bg-purple-600 text-white px-4 py-2 rounded-md"
//                                 onClick={handleEditarNoticia}
//                             >
//                                 Confirmar edición
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />

//             {/* Modal de confirmación */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white rounded-lg p-6 w-80">
//                         <h3 className="text-xl font-bold mb-4">Modificación exitosa</h3>
//                         <p className="mb-6">La modificación se ha realizado con éxito.</p>
//                         <div className="flex justify-center">
//                             <button
//                                 onClick={() => navigate('/modificar-eliminar-noticias')}
//                                 className="btn btn-primary"
//                             >
//                                 Ok
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EditarNoticia;





// Se agregó const [isModalOpen, setIsModalOpen] = useState(false); para controlar la visibilidad del modal.
// Luego de realizar el PUT de forma exitosa, en lugar de redirigir inmediatamente, se ejecuta setIsModalOpen(true); para mostrar la ventana modal.
// El modal se renderiza condicionalmente. Tiene un mensaje de éxito y dos botones:
// "Ok": Cierra el modal (simplemente ejecuta setIsModalOpen(false)).
// "Volver al menú anterior": Utiliza navigate('/modificar-eliminar-noticias') para redirigir al usuario a la lista de noticias.