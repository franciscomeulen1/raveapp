import React from "react";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const EditarNoticia = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="max-w-4xl mx-auto p-6">
                        <h1 className='mb-8 text-3xl font-bold underline underline-offset-8'>Editar noticia:</h1>

                        <label className="font-semibold">Título de la noticia:</label>
                        <input
                            type="text"
                            placeholder="Título de la noticia aquí"
                            className="w-full p-2 border rounded-md mb-4"
                        />

                        <label className="font-semibold">Editar imagen:</label>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">IMG</div>
                            <button className="border px-4 py-2 rounded-md">Seleccionar imagen</button>
                        </div>

                        <label className="font-semibold">Cuerpo de la noticia:</label>
                        <textarea
                            className="w-full p-2 border rounded-md mb-4"
                            placeholder="Espacio para escribir la noticia"
                            rows="4"
                        ></textarea>

                        <p className="font-semibold">Noticia asociada a evento: XXXXXXXXXXXXXXXXX</p>

                        <label className="font-semibold">Asociar noticia a evento:</label>
                        <button className="border px-4 py-2 rounded-md mb-4">Seleccionar evento</button>
                         
                         <div>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">Editar noticia</button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditarNoticia;