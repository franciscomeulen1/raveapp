import React from "react";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const EditarArtista = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="max-w-4xl mx-auto p-6">
                        <h1 className='mb-8 text-3xl font-bold underline underline-offset-8'>Editar artista:</h1>

                        <div className="mb-4">
                            <label className="block font-semibold">Nombre del artista:</label>
                            <input type="text" className="w-full border rounded p-2" placeholder="Nombre" />
                        </div>

                        <div className="mb-4 flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full font-bold">
                                IMG
                            </div>
                            <div>
                                <label className="block font-semibold">Foto del artista:</label>
                                <button className="border px-4 py-1 rounded bg-gray-200">Seleccionar imagen</button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">Información sobre el artista:</label>
                            <textarea className="w-full border rounded p-2" placeholder="Espacio para escribir información del artista"></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">URL del Instagram del artista:</label>
                            <input type="text" className="w-full border rounded p-2" placeholder="URL de Instagram" />
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">URL del SoundCloud del artista:</label>
                            <input type="text" className="w-full border rounded p-2" placeholder="URL de SoundCloud" />
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">URL del Spotify del artista:</label>
                            <input type="text" className="w-full border rounded p-2" placeholder="URL de Spotify" />
                        </div>

                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditarArtista;