import React, { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import EventoItem from '../components/EventoItem';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const MisEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [estadosEvento, setEstadosEvento] = useState([]);
  const [orden, setOrden] = useState('asc');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventosRes = await api.get('/Evento/GetEventos', {
          params: { IdUsuario: user.id },
        });
        const estadosRes = await api.get('/Evento/GetEstadosEvento');

        setEventos(eventosRes.data.eventos || []);
        setEstadosEvento(estadosRes.data || []);
      } catch (error) {
        console.error('Error al cargar los eventos o estados:', error);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  const getEarliestDate = (evento) => {
    const fechas = evento.fechas.map(f => new Date(f.inicio));
    return new Date(Math.min(...fechas));
  };

  const ordenarEventos = (listaEventos, orden) => {
    return [...listaEventos].sort((a, b) => {
      const earliestA = getEarliestDate(a);
      const earliestB = getEarliestDate(b);
      return orden === 'asc' ? earliestA - earliestB : earliestB - earliestA;
    });
  };

  const getEstadoTexto = (cdEstado) => {
    const estado = estadosEvento.find(e => e.cdEstado === cdEstado);
    return estado ? estado.dsEstado : 'Desconocido';
  };

  const eventosFiltrados = ordenarEventos(
    eventos.filter(evento => {
      const nombreMatch = evento.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const estadoMatch = filtroEstado === 'todos' || evento.cdEstado === parseInt(filtroEstado);
      return nombreMatch && estadoMatch;
    }),
    orden
  );

  return (
    <div className="flex flex-col min-h-screen sm:px-10">
      <div className="flex-1">
        <NavBar />
        <div className="container mx-auto">
          <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
            Mis eventos:
          </h1>

          <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <select
              className="select select-bordered"
              value={orden}
              onChange={e => setOrden(e.target.value)}
            >
              <option value="asc">Ordenar por fecha (ascendente)</option>
              <option value="desc">Ordenar por fecha (descendente)</option>
            </select>

            <select
              className="select select-bordered"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              {estadosEvento.map(estado => (
                <option key={estado.cdEstado} value={estado.cdEstado}>
                  {estado.dsEstado}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input input-bordered"
              placeholder="Buscar evento..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {eventosFiltrados.map(evento => (
              <EventoItem
                key={evento.idEvento}
                evento={evento} // 👉 pasamos el objeto completo
                estadoTexto={getEstadoTexto(evento.cdEstado)} // 👉 para mostrar en UI
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MisEventos;





// import React, { useState } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import EventoItem from '../components/EventoItem';

// const MisEventos = () => {

//   const [eventos] = useState([
//     {
//       id: 1,
//       nombre: "Nombre de evento 1",
//       estado: "vigente",
//       generos: ["Tech-House", "Techno"],
//       artistas: ["Dich Brothers", "La Cintia", "Luana"],
//       lgbt: true,
//       after: false,
//       direccion: " Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit.",
//       finalizado: false,
//       dias: [
//         {
//           fecha: "10/05/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ]
//     },
//     {
//       id: 2,
//       nombre: "Nombre de evento 2",
//       estado: "vigente",
//       generos: "Tech-House",
//       artistas: ["Nico Moreno", "T78"],
//       lgbt: false,
//       after: false,
//       direccion: " Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 2, dolor sit amet consectetur adipisicing elit.",
//       finalizado: false,
//       dias: [
//         {
//           fecha: "15/05/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ]
//     },
//     {
//       id: 3,
//       nombre: "Nombre de evento 3",
//       estado: "pendiente",
//       generos: ["Tech-House", "Techno"],
//       artistas: ["Juan Solis", "Kilah"],
//       lgbt: false,
//       after: true,
//       direccion: " Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit.",
//       finalizado: false,
//       dias: [
//         {
//           fecha: "16/10/2025",
//           horaInicio: "20:00hs",
//           horaFin: "02:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         },
//         {
//           fecha: "17/10/2025",
//           horaInicio: "20:00hs",
//           horaFin: "02:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ]
//     },
//     {
//       id: 4,
//       nombre: "Nombre de evento 4",
//       estado: "finalizado",
//       generos: "Tech-House",
//       artistas: ["Dich Brothers", "La Cintia", "Luana"],
//       lgbt: false,
//       after: false,
//       direccion: " Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 4, dolor sit amet consectetur adipisicing elit.",
//       finalizado: true,
//       dias: [
//         {
//           fecha: "20/05/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         },
//         {
//           fecha: "21/05/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         },
//         {
//           fecha: "22/05/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ]
//     },
//   ]);

//   const [orden, setOrden] = useState('asc');
//   const [busqueda, setBusqueda] = useState('');
//   const [filtroEstado, setFiltroEstado] = useState('todos');

//   /**
//  * Parsea un string "DD/MM/YYYY" a un Date válido en formato día-mes-año
//  */
// function parseFechaDDMMYYYY(fechaStr) {
//   const [day, month, year] = fechaStr.split('/').map(Number);
//   return new Date(year, month - 1, day);
// };

// /**
//    * Retorna la fecha más temprana (más próxima) del array `dias` de un evento
//    */
// const getEarliestDate = (evento) => {
//   const fechas = evento.dias.map(dia => parseFechaDDMMYYYY(dia.fecha));
//   return new Date(Math.min(...fechas));
// };

// /**
//  * Ordena los eventos por la fecha más temprana de sus días
//  */
// const ordenarEventos = (listaEventos, orden) => {
//   return [...listaEventos].sort((a, b) => {
//     const earliestA = getEarliestDate(a);
//     const earliestB = getEarliestDate(b);

//     return orden === 'asc'
//       ? earliestA - earliestB
//       : earliestB - earliestA;
//   });
// };

// /**
//  * Aplica búsqueda, filtra por estado, y ordena
//  */
// const eventosFiltrados = ordenarEventos(
//   eventos.filter(evento =>
//     evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
//     (filtroEstado === 'todos' || evento.estado === filtroEstado)
//   ),
//   orden
// );


// return (
//   <div className="flex flex-col min-h-screen sm:px-10">
//     <div className="flex-1">
//       <NavBar />
//       <div className="container mx-auto">
//         <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
//           Mis eventos:
//         </h1>

//         <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
//           <select
//             className="select select-bordered"
//             value={orden}
//             onChange={e => setOrden(e.target.value)}
//           >
//             <option value="asc">Ordenar por fecha (ascendente)</option>
//             <option value="desc">Ordenar por fecha (descendente)</option>
//           </select>

//           <select
//             className="select select-bordered"
//             value={filtroEstado}
//             onChange={e => setFiltroEstado(e.target.value)}
//           >
//             <option value="todos">Todos</option>
//             <option value="vigente">Vigente</option>
//             <option value="pendiente">Pendiente</option>
//             <option value="finalizado">Finalizado</option>
//           </select>

//           <input
//             type="text"
//             className="input input-bordered"
//             placeholder="Buscar evento..."
//             value={busqueda}
//             onChange={e => setBusqueda(e.target.value)}
//           />
//         </div>

//         <div className="space-y-4">
//           {eventosFiltrados.map(evento => (
//             <EventoItem key={evento.id} evento={evento} />
//           ))}
//         </div>
//       </div>
//     </div>
//     <Footer />
//   </div>
// );
// };

// export default MisEventos;