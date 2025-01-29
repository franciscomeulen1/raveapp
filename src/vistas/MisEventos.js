import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import EventoItem from '../components/EventoItem';

const MisEventos = () => {
    const [eventos] = useState([
        { id: 1,
          nombre: "Nombre de evento 1",
          fecha: "10/05/2025",
          generos: ["Tech-House", "Techno"],
          artistas: ["Dich Brothers", "La Cintia", "Luana"],
          lgbt: true,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
          finalizado: false,
          entradas: [{
            tipo: "Early Bird - Entrada general",
            precio: 3000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada general",
            precio: 5000,
            cantidad: 900
          }, {
            tipo: "Early Bird - Entrada VIP",
            precio: 5000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada VIP",
            precio: 7000,
            cantidad: 400
          }] 
        },
        { id: 2,
          nombre: "Nombre de evento 2",
          fecha: "15/05/2025",
          generos: "Tech-House",
          artistas: ["Nico Moreno", "T78"],
          lgbt: false,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 2, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
          finalizado: false,
          entradas: [{ // entradas: tipo precio cantidad.
            tipo: "Early Bird - Entrada general",
            precio: 3000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada general",
            precio: 5000,
            cantidad: 900
          }, {
            tipo: "Early Bird - Entrada VIP",
            precio: 5000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada VIP",
            precio: 7000,
            cantidad: 400
          }]  
        },
        { id: 3,
          nombre: "Nombre de evento 3",
          fecha: "16/10/2025",
          generos: ["Tech-House", "Techno"],
          artistas: ["Juan Solis", "Kilah"],
          lgbt: false,
          after: true,
          horario: "07:00hs a 12:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
          finalizado: false,
          entradas: [{ // entradas: tipo precio cantidad.
            tipo: "Early Bird - Entrada general",
            precio: 3000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada general",
            precio: 5000,
            cantidad: 900
          }, {
            tipo: "Early Bird - Entrada VIP",
            precio: 5000,
            cantidad: 100,
            fechaLimite: "10/04/2025"
          }, {
            tipo: "Entrada VIP",
            precio: 7000,
            cantidad: 400
          }] 
        },
        { id: 4,
          nombre: "Nombre de evento 4",
          fecha: "20/05/2025",
          generos: "Tech-House",
          artistas: ["Dich Brothers", "La Cintia", "Luana"],
          lgbt: false,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 4, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
          finalizado: true,
          entradas: [{ // entradas: tipo precio cantidad.
            tipo: "Early Bird - Entrada general",
            precio: 3000,
            cantidad: 100,
            fechaLimite: "10/10/2025"
          }, {
            tipo: "Entrada general",
            precio: 5000,
            cantidad: 900
          }, {
            tipo: "Early Bird - Entrada VIP",
            precio: 5000,
            cantidad: 100,
            fechaLimite: "10/10/2025"
          }, {
            tipo: "Entrada VIP",
            precio: 7000,
            cantidad: 400
          }] },
    ]);

    const [orden, setOrden] = useState('asc');
    const [busqueda, setBusqueda] = useState('');

    const ordenarEventos = (eventos, orden) => {
        return [...eventos].sort((a, b) => {
            if (orden === 'asc') {
                return new Date(a.fecha) - new Date(b.fecha);
            } else {
                return new Date(b.fecha) - new Date(a.fecha);
            }
        });
    };

    const eventosFiltrados = ordenarEventos(
        eventos.filter(evento => evento.nombre.toLowerCase().includes(busqueda.toLowerCase())),
        orden
    );

    const handleOrdenChange = (e) => {
        setOrden(e.target.value);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <div className="container mx-auto">
                        <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Mis eventos:</h1>
                        <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between">
                            <select className="select select-bordered mb-4 sm:mb-0" value={orden} onChange={handleOrdenChange}>
                                <option value="asc">Ordenar por fecha (ascendente)</option>
                                <option value="desc">Ordenar por fecha (descendente)</option>
                            </select>
                            <input 
                                type="text" 
                                className="input input-bordered" 
                                placeholder="Buscar evento..." 
                                value={busqueda} 
                                onChange={handleBusquedaChange} 
                            />
                        </div>
                        <div className="space-y-4">
                            {eventosFiltrados.map((evento, index) => (
                                <EventoItem key={evento.id} evento={evento} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MisEventos;