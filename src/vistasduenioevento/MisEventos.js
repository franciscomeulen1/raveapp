import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import EventoItem from '../components/EventoItem';

const MisEventos = () => {
    const [eventos] = useState([
        { id: 1,
          nombre: "Nombre de evento 1",
          fecha: "10/05/2025",
          estado: "vigente",
          generos: ["Tech-House", "Techno"],
          artistas: ["Dich Brothers", "La Cintia", "Luana"],
          lgbt: true,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit.",
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
          estado: "vigente",
          generos: "Tech-House",
          artistas: ["Nico Moreno", "T78"],
          lgbt: false,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 2, dolor sit amet consectetur adipisicing elit.",
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
        { id: 3,
          nombre: "Nombre de evento 3",
          fecha: "16/10/2025",
          estado: "pendiente",
          generos: ["Tech-House", "Techno"],
          artistas: ["Juan Solis", "Kilah"],
          lgbt: false,
          after: true,
          horario: "07:00hs a 12:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit.",
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
        { id: 4,
          nombre: "Nombre de evento 4",
          fecha: "20/05/2025",
          estado: "finalizado",
          generos: "Tech-House",
          artistas: ["Dich Brothers", "La Cintia", "Luana"],
          lgbt: false,
          after: false,
          horario: "23:50hs a 07:00hs",
          direccion: " Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 4, dolor sit amet consectetur adipisicing elit.",
          finalizado: true,
          entradas: [{
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
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const ordenarEventos = (eventos, orden) => {
        return [...eventos].sort((a, b) => {
            return orden === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
        });
    };

    const eventosFiltrados = ordenarEventos(
        eventos.filter(evento => 
            evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
            (filtroEstado === 'todos' || evento.estado === filtroEstado)
        ),
        orden
    );

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <NavBar />
                <div className="container mx-auto">
                    <h1 className='mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8'>Mis eventos:</h1>
                    <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                        <select className="select select-bordered" value={orden} onChange={e => setOrden(e.target.value)}>
                            <option value="asc">Ordenar por fecha (ascendente)</option>
                            <option value="desc">Ordenar por fecha (descendente)</option>
                        </select>
                        <select className="select select-bordered" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="vigente">Vigente</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="finalizado">Finalizado</option>
                        </select>
                        <input type="text" className="input input-bordered" placeholder="Buscar evento..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                    </div>
                    <div className="space-y-4">{eventosFiltrados.map(evento => <EventoItem key={evento.id} evento={evento} />)}</div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MisEventos;