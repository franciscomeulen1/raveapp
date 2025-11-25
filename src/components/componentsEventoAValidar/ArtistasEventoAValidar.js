// components/evento/ArtistasEventoValidar.js
import React, { useState } from 'react';
import { AiFillSound } from "react-icons/ai";
import { FaCheckCircle } from 'react-icons/fa';
import ModalEditarArtista from './ModalEditarArtista';

export default function ArtistasEventoValidar({ artistas, onUpdateArtista }) {
    const [artistaSeleccionado, setArtistaSeleccionado] = useState(null);

    if (!artistas || artistas.length === 0) return null;

    return (
        <div className='mb-6'>
            <div className='flex items-center gap-x-1 mb-2'>
                <AiFillSound className='inline size-6 text-black' />
                <p className='font-bold underline underline-offset-4 text-lg'>Artistas:</p>
            </div>

            <ul className='space-y-2'>
                {artistas.map((a) => (
                    <li key={a.idArtista} className='bg-gray-100 p-3 rounded-md shadow-sm'>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">{a.nombre}</span>
                                {a.isActivo === 1 ? (
                                    <FaCheckCircle className="text-green-500" title="Artista activo" />
                                ) : (
                                    <span className="text-red-600 text-sm">(Artista no activo en BBDD)</span>
                                )}
                            </div>


                            {a.isActivo === 0 && !a.descartado && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setArtistaSeleccionado(a)}
                                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Activar
                                    </button>
                                    <button
                                        onClick={() => onUpdateArtista({ idArtista: a.idArtista, descartado: true })}
                                        className="bg-gray-400 text-white text-sm px-3 py-1 rounded hover:bg-gray-500"
                                    >
                                        No Activar
                                    </button>
                                </div>
                            )}

                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal para editar y activar artista */}
            {artistaSeleccionado && (
                <ModalEditarArtista
                    artista={artistaSeleccionado}
                    onClose={() => setArtistaSeleccionado(null)}
                    onUpdate={(nuevo) => {
                        onUpdateArtista(nuevo);
                        setArtistaSeleccionado(null);
                    }}
                />

            )}
        </div>
    );
}
