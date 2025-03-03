import React from 'react';
import { useState } from "react";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const ModificarEliminarArtistas = () => {

    const [search, setSearch] = useState("");

    const artistas = [
        {
            id: 1,
            nombre: "Nombre Artista 1",
            fecha: "23/02/2025",
            imagen: "https://via.placeholder.com/50", // Reemplázalo con la URL real
        },
        {
            id: 2,
            nombre: "Nombre Artista 2",
            fecha: "23/02/2025",
            imagen: "https://via.placeholder.com/50",
        },
        {
            id: 3,
            nombre: "Nombre Artista 3",
            fecha: "23/02/2025",
            imagen: "https://via.placeholder.com/50",
        },
        {
            id: 4,
            nombre: "Nombre Artista 5",
            fecha: "23/02/2025",
            imagen: "https://via.placeholder.com/50",
        },
    ];

    // Filtrado por nombre de artista
    const artistasFiltrados = artistas.filter((artista) =>
        artista.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Modificar artistas:</h1>

                        <div className="overflow-x-auto">
                            {/* Buscador */}
                            <div className="flex justify-end mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscador de artistas"
                                        className="input input-bordered pr-10"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Tabla en pantallas grandes */}
                            <table className="hidden md:table w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200 text-black">
                                        <th className="p-3 border border-gray-300">Artista</th>
                                        <th className="p-3 border border-gray-300">Fecha de creación</th>
                                        <th className="p-3 border border-gray-300">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artistasFiltrados.map((artista) => (
                                        <tr key={artista.id} className="hover:bg-gray-100">
                                            <td className="p-3 border border-gray-300 flex items-center gap-3">
                                                <img
                                                    src={artista.imagen}
                                                    alt="Artista"
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                                />
                                                <span>{artista.nombre}</span>
                                            </td>
                                            <td className="p-3 border border-gray-300">{artista.fecha}</td>
                                            <td className="p-3 border border-gray-300 flex gap-2">
                                                <button className="btn btn-sm bg-purple-600 text-white rounded-lg px-3">
                                                    Editar
                                                </button>
                                                <button className="btn btn-sm bg-red-600 text-white rounded-lg px-3">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Vista en móvil (tarjetas) */}
                            <div className="md:hidden flex flex-col gap-4">
                                {artistasFiltrados.map((artista) => (
                                    <div
                                        key={artista.id}
                                        className="border border-gray-300 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
                                    >
                                        <img
                                            src={artista.imagen}
                                            alt="Artista"
                                            className="w-16 h-16 rounded-full object-cover border border-gray-300"
                                        />
                                        <p className="font-semibold mt-2">{artista.nombre}</p>
                                        <p className="text-gray-600">{artista.fecha}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button className="btn btn-sm bg-purple-600 text-white rounded-lg px-3">
                                                Editar
                                            </button>
                                            <button className="btn btn-sm bg-red-600 text-white rounded-lg px-3">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ModificarEliminarArtistas;