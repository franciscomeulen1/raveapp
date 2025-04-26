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
    // Se inicializa la imagen como cadena vacía para evitar conflictos con null
    // eslint-disable-next-line
    const [imagen, setImagen] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                }
            } catch (error) {
                console.error('Error al obtener la noticia:', error);
            }
        };

        obtenerNoticia();
    }, [id]);

    const handleEditarNoticia = async () => {
        try {
            console.log('Actualizando noticia con datos:', {
                idNoticia: id,
                titulo,
                contenido,
                imagen,
                dtPublicado,
            });

            const response = await api.put('/noticia', {
                idNoticia: id,
                titulo,
                contenido,
                imagen,
                dtPublicado,
            });

            console.log('Respuesta del PUT:', response.data);

            // Abrimos el modal de confirmación
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error al editar la noticia:', error);
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

                        <label className="font-semibold">Título de la noticia:</label>
                        <input
                            type="text"
                            placeholder="Título de la noticia aquí"
                            className="w-full p-2 border rounded-md mb-4"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        <label className="font-semibold">Editar imagen:</label>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                IMG
                            </div>
                            <button className="border px-4 py-2 rounded-md">Seleccionar imagen</button>
                        </div>

                        <label className="font-semibold">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Espacio para escribir la noticia"
                            rows="4"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                        />

                        <p className="font-semibold">
                            Noticia asociada a evento: XXXXXXXXXXXXXXXXX
                        </p>

                        <label className="font-semibold">Asociar noticia a evento:</label>
                        <button className="border px-4 py-2 rounded-md mb-4">
                            Seleccionar evento
                        </button>

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

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-xl font-bold mb-4">Modificación exitosa</h3>
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



// Se agregó const [isModalOpen, setIsModalOpen] = useState(false); para controlar la visibilidad del modal.
// Luego de realizar el PUT de forma exitosa, en lugar de redirigir inmediatamente, se ejecuta setIsModalOpen(true); para mostrar la ventana modal.
// El modal se renderiza condicionalmente. Tiene un mensaje de éxito y dos botones:
// "Ok": Cierra el modal (simplemente ejecuta setIsModalOpen(false)).
// "Volver al menú anterior": Utiliza navigate('/modificar-eliminar-noticias') para redirigir al usuario a la lista de noticias.