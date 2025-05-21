import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

const CrearNoticia = () => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [urlEvento, setUrlEvento] = useState('');
    const [errorTitulo, setErrorTitulo] = useState('');
    const [errorContenido, setErrorContenido] = useState('');
    const [errorUrl, setErrorUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const esUrlValida = (url) => {
        const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
        return pattern.test(url);
    };

    const handleCrearNoticia = async () => {
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

        if (!esValido) return;

        try {
            const fechaActualISO = new Date().toISOString();

            await api.post('/noticia', {
                titulo,
                contenido,
                dtPublicado: fechaActualISO,
                urlEvento,
            });

            setTitulo('');
            setContenido('');
            setUrlEvento('');
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

                        {/* Contenido */}
                        <label className="font-semibold">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-1"
                            placeholder="Espacio para escribir la noticia"
                            rows="4"
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
                    </div>
                </div>
            </div>

            <Footer />

            {/* Modal */}
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