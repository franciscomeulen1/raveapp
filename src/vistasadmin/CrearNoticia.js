import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const CrearNoticia = () => {
    
    // Estados para almacenar la información de la nueva noticia
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    // Se mantiene la propiedad imagen (se puede personalizar la lógica para subir archivos)
    // eslint-disable-next-line
    const [imagen, setImagen] = useState('');
    
    // Para controlar la apertura/cierre del modal de confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función que se encarga de crear la noticia usando POST
    const handleCrearNoticia = async () => {
        try {
            // Se genera la fecha y hora actual en formato ISO
            const fechaActualISO = new Date().toISOString();

            // console.log("Creando noticia con datos:", {
            //     titulo,
            //     contenido,
            //     imagen,
            //     dtpublicado: fechaActualISO,
            // });

            await api.post('/noticia', {
                titulo,
                contenido,
                imagen,
                dtpublicado: fechaActualISO, // Se envía la propiedad con la fecha y hora actual en formato ISO
            });

            // console.log("Respuesta del POST:", response.data);

            // Si la creación fue exitosa, se muestra el modal de confirmación
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error al crear la noticia:', error);
        }
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

                        {/* Campo para el título */}
                        <label className="font-semibold">Título de la noticia:</label>
                        <input
                            type="text"
                            placeholder="Título de la noticia aquí"
                            className="w-full p-2 border rounded-md mb-4"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        {/* Sección para la imagen */}
                        <label className="font-semibold">Subir imagen:</label>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                IMG
                            </div>
                            <button className="border px-4 py-2 rounded-md">
                                Seleccionar imagen
                            </button>
                        </div>

                        {/* Campo para el contenido de la noticia */}
                        <label className="font-semibold">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Espacio para escribir la noticia"
                            rows="4"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                        />

                        {/* Simulación de asociación a evento */}
                        <p className="font-semibold">Noticia asociada a evento: XXXXXXXXXXXXXXXXX</p>

                        <label className="font-semibold">Asociar noticia a evento:</label>
                        <button className="border px-4 py-2 rounded-md mb-4">
                            Seleccionar evento
                        </button>

                        {/* Botón para enviar el POST y crear la noticia */}
                        <div>
                            <button
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                                onClick={handleCrearNoticia}
                            >
                                Crear noticia
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
                        <h3 className="text-xl font-bold mb-4">Creación exitosa</h3>
                        <p className="mb-6">La noticia se ha creado correctamente.</p>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setIsModalOpen(false)}
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
