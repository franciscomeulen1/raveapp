import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import api from '../componenteapi/api';
import { FaSearch, FaTimes } from 'react-icons/fa';

const EventosAValidar = () => {
    const [eventos, setEventos] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await api.get('/Evento/GetEventos?Estado=0');
                const eventosAPI = response.data.eventos;

                const generosResponse = await api.get('/Evento/GetGeneros');
                const generosLista = generosResponse.data;
                setGeneros(generosLista);

                const eventosConInfo = await Promise.all(
                    eventosAPI.map(async (evento) => {
                        const idUsuario = evento.usuario?.idUsuario;
                        let nombre = '', apellido = '', correo = '';
                        if (idUsuario) {
                            try {
                                const usuarioResponse = await api.get(`/Usuario/GetUsuario?IdUsuario=${idUsuario}`);
                                const usuario = usuarioResponse.data.usuarios[0];
                                nombre = usuario.nombre || '';
                                apellido = usuario.apellido || '';
                                correo = usuario.correo || '';
                            } catch (error) {
                                console.error('Error al obtener usuario', error);
                            }
                        }

                        let imagen = null;
                        try {
                            const mediaRes = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
                            const media = mediaRes.data.media;
                            const imagenEncontrada = media.find((m) => m.url && m.url !== '');
                            if (imagenEncontrada) imagen = imagenEncontrada.url;
                        } catch (error) {
                            console.error('Error al obtener imagen del evento:', error);
                        }

                        return {
                            ...evento,
                            propietario: { nombre, apellido, correo },
                            imagen
                        };
                    })
                );

                const eventosOrdenados = eventosConInfo.sort((a, b) => {
                    const fechaA = new Date(a.fechas[0]?.inicio);
                    const fechaB = new Date(b.fechas[0]?.inicio);
                    return fechaA - fechaB;
                });

                setEventos(eventosOrdenados);
            } catch (error) {
                console.error('Error al obtener eventos a validar:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventos();
    }, []);

    const obtenerGenerosTexto = (codigos) => {
        return codigos
            .map((cd) => generos.find((g) => g.cdGenero === cd)?.dsGenero)
            .filter(Boolean)
            .join(', ');
    };

    const handleVerificar = (evento) => {
        navigate('/eventoavalidar', { state: { evento } });
    };

    const eventosFiltrados = eventos.filter((evento) => {
        const texto = searchTerm.toLowerCase();
        return (
            evento.nombre.toLowerCase().includes(texto) ||
            evento.propietario.nombre.toLowerCase().includes(texto) ||
            evento.propietario.apellido.toLowerCase().includes(texto) ||
            evento.propietario.correo.toLowerCase().includes(texto)
        );
    });

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />
                <main className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold underline underline-offset-8 mb-6">Eventos a validar:</h1>

                    {/* Buscador */}
                    <div className="relative mb-6 w-full sm:w-1/2">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre del evento o propietario..."
                            className="input input-bordered w-full pl-10 pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setSearchTerm('')}
                            >
                                <FaTimes size={16} />
                            </button>
                        )}
                    </div>

                    {/* Cargando */}
                    {isLoading ? (
                        <p className="text-center text-gray-600 mt-10">Cargando eventos...</p>
                    ) : eventosFiltrados.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">No se encontraron eventos que coincidan con la búsqueda.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventosFiltrados.map((evento) => (
                                <div key={evento.idEvento} className="bg-white shadow-md rounded-xl flex flex-col overflow-hidden">
                                    {evento.imagen ? (
                                        <img
                                            src={evento.imagen}
                                            alt="Imagen del evento"
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600">
                                            Sin imagen
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div className="mb-4">
                                            <h2 className="text-xl font-semibold mb-2">{evento.nombre}</h2>
                                            <p className="text-sm mb-1">
                                                <strong>Fecha(s):</strong>{' '}
                                                {evento.fechas.map(f => new Date(f.inicio).toLocaleDateString()).join(', ')}
                                            </p>
                                            <p className="text-sm mb-1">
                                                <strong>Género(s):</strong> {obtenerGenerosTexto(evento.genero)}
                                            </p>
                                            <p className="text-sm">
                                                <strong>Propietario:</strong> {evento.propietario.nombre} {evento.propietario.apellido}
                                                <br />
                                                <span className="text-gray-600">{evento.propietario.correo}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleVerificar(evento)}
                                            className="btn btn-primary bg-purple-500 hover:bg-purple-600 text-white"
                                        >
                                            Verificar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default EventosAValidar;
