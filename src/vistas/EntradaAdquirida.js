import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AiFillSound } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { BsGeoAltFill } from "react-icons/bs";
import Resenias from "../components/componentsVistaEvento/Resenias";

const datosEntrada = {
    nombreEvento: "Nombre del evento",
    ticketTipo: "Entrada General",
    precio: 3000,
    fecha: "25/10/2025",
    horario: "23:59hs a 07:00hs",
    direccion: "Cnel. Niceto Vega 6899 - Capital Federal",
    artistas: ["Artista 1", "Artista 2", "Artista 3"],
    descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean semper bibendum ante...",
    soundCloudURL:
        "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106",
    youtubeURL: "https://www.youtube.com/embed/zmqS5hEi_QI",
    qrURL: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EntradaEjemplo",
    imagenEvento: "https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"
};

export default function ReseniasDeLaFiesta() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <div className="flex-grow px-10 sm:px-20 mb-11">
                <h1 className="mb-2 mt-2 text-3xl font-bold">
                    Entrada a: <span className="italic">'{datosEntrada.nombreEvento}'</span>
                </h1>

                {/* Grid principal (similar a Evento.js) */}
                <div className="grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10">

                    {/* Columna izquierda: Imagen + QR + Datos del ticket */}
                    <div className="order-2 lg:order-1 row-span-2">
                        <h2 className="text-xl font-bold mb-4">Tu entrada QR:</h2>

                        {/* Aquí el cambio para mantener imagen y QR siempre en la misma fila */}
                        <div className="grid grid-cols-2 gap-6 items-center mb-6">
                            <img
                                src={datosEntrada.imagenEvento}
                                alt="Imagen del evento"
                                className="rounded-xl w-full h-auto"
                            />
                            <img
                                src={datosEntrada.qrURL}
                                alt="Código QR"
                                className="w-56 h-56 rounded-xl mx-auto"
                            />
                        </div>

                        <div className="mb-4">
                            <p className="font-bold">
                                Ticket: <span className="font-normal">{datosEntrada.ticketTipo}</span>
                            </p>
                            <p className="font-bold">
                                Valor: <span className="font-normal">${datosEntrada.precio}</span>
                            </p>
                            <div className="flex items-center gap-x-2 mb-2">
                                <FaCalendarAlt style={{ color: "#080808" }} className="size-5" />
                                <p>
                                    <span className="font-bold">Fecha y hora:</span>{" "}
                                    {datosEntrada.fecha} - {datosEntrada.horario}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2 mb-2">
                                <BsGeoAltFill style={{ color: "#080808" }} className="size-5" />
                                <p className="font-semibold">{datosEntrada.direccion}</p>
                            </div>
                            <div className="flex items-center gap-x-1 mb-4">
                                <AiFillSound style={{ color: "#080808" }} className="inline size-6" />
                                <p className="font-bold">
                                    <span className="underline underline-offset-4">Artistas:</span>
                                    <span className="text-lg"> {datosEntrada.artistas.join(" - ")} </span>
                                </p>
                            </div>
                        </div>

                        <div className='flex justify-between'>
                            <button className="btn btn-secondary rounded-full mb-4">
                                Descargar entrada
                            </button>
                            <button className="btn bg-cyan-600 rounded-full mb-4">
                                Cómo llegar
                            </button>

                        </div>

                    </div>

                    {/* Columna derecha: descripción + iframes + reseñas */}
                    <div className="order-3 lg:order-2">
                        <h2 className="text-xl font-bold mb-2">Descripción del evento</h2>
                        <p>{datosEntrada.descripcion}</p>
                    </div>

                    <div className="order-5 lg:order-4">
                        <div className="my-6">
                            <iframe
                                title="musicaSoundCloud"
                                width="100%"
                                height="200"
                                scrolling="no"
                                frameBorder="no"
                                allow="autoplay"
                                src={datosEntrada.soundCloudURL}
                            ></iframe>
                        </div>
                    </div>

                    <div className="order-6 lg:order-5">
                        <div className="my-6">
                            <iframe
                                height="315"
                                src={datosEntrada.youtubeURL}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full"
                            ></iframe>
                        </div>
                    </div>

                    <div className="order-7 lg:order-6">
                        <p className="text-sm italic text-gray-700">
                            ¡Una vez finalizado el evento, podés dejar tu reseña!
                        </p>
                        <Resenias />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
