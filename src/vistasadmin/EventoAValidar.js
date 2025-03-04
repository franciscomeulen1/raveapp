import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { BsGeoAltFill } from 'react-icons/bs';
import { FaCalendarAlt, FaClock, FaMusic } from 'react-icons/fa';
import { AiFillSound, AiOutlineUser } from 'react-icons/ai';

const EventoAValidar = () => {
    return (
        <div>
            <div className="sm:px-10 mb-11">
                <NavBar />

                <h1 className="mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">Evento a validar</h1>

                {/* Información adicional en fila */}
                <div className="mx-10 sm:px-10 mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex items-center gap-x-2">
                        <AiOutlineUser style={{ color: '#080808' }} className="size-5" />
                        <p>
                            <span className="font-bold">Propietario:</span> underclub
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <FaCalendarAlt style={{ color: '#080808' }} className="size-5" />
                        <p>
                            <span className="font-bold">Fecha de creación:</span> 02/09/2022
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <FaMusic style={{ color: '#080808' }} className="size-5" />
                        <p>
                            <span className="font-bold">Género:</span> Techno
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10">
                    {/* Sección de imagen */}
                    <div className="order-2 lg:order-1 row-span-2">
                        <div className="mb-6 flex justify-center">
                            <img
                                src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"
                                width="450"
                                height="auto"
                                alt="imagen de evento"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="flex items-center gap-x-2 mb-4">
                            <AiFillSound style={{ color: '#080808' }} className="inline size-6" />
                            <p className="font-bold">
                                <span className="underline underline-offset-4">Artistas:</span>
                                <span className="text-lg"> Nombre del artista</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-x-2 mb-2">
                            <FaCalendarAlt style={{ color: '#080808' }} className="size-5" />
                            <p>
                                <span className="font-bold">Fecha del evento:</span> 10/10/2022
                            </p>
                        </div>

                        <div className="flex items-center gap-x-2 mb-2">
                            <FaClock style={{ color: '#080808' }} className="size-5" />
                            <p>
                                <span className="font-bold">Horario:</span> 23:50hs a 07:00hs
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-x-2">
                                <BsGeoAltFill style={{ color: '#080808' }} className="size-5" />
                                <p className="font-semibold"> Av. Cnel. Niceto Vega 6599 - Capital Federal</p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción del evento */}
                    <div className="order-3 lg:order-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Descripción del evento</h2>
                            <p className="text-gray-700 mt-2">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius, mauris at aliquet
                                euismod, justo urna efficitur nulla, vel vehicula libero nisl sed nulla.
                            </p>
                        </div>
                    </div>

                    {/* Detalles adicionales */}
                    <div className="order-4 lg:order-3">
                        <h3 className="text-xl font-semibold text-purple-700">Entradas</h3>
                        <p className="text-gray-700">
                            Entradas generales: <span className="font-medium">Precio: $1500</span> -{' '}
                            <span className="font-medium">Cantidad: 700</span>
                        </p>
                        <p className="text-gray-700">
                            Entradas VIP: <span className="font-medium">Precio: $2500</span> -{' '}
                            <span className="font-medium">Cantidad: 200</span>
                        </p>
                    </div>

                    {/* Iframes embebidos */}
                    <div className="order-5 lg:order-4">
                        <iframe
                            title="musicaSoundCloud"
                            width="100%"
                            height="315"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106"
                            className="mb-6 rounded"
                        ></iframe>
                    </div>
                    <div className="order-6 lg:order-5">
                        <iframe
                            height="315"
                            src="https://www.youtube.com/embed/zmqS5hEi_QI"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full mb-6 rounded"
                        ></iframe>
                    </div>

                    {/* Motivo de rechazo y acciones */}
                    <div className="order-7 lg:order-6">
                        <h3 className="text-lg font-medium">En caso de rechazar el evento, completar el motivo de rechazo:</h3>
                        <textarea
                            className="w-full mt-2 p-2 border border-gray-300 rounded"
                            rows="4"
                            placeholder="Motivo del rechazo..."
                        ></textarea>
                        <p className="text-sm text-gray-500 mt-2">* El motivo de rechazo se le enviará por mail al creador del evento.</p>

                        <div className="flex gap-4 mt-4">
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Validar</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Rechazar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventoAValidar;
