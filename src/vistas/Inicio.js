import { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import CardsEventos from '../components/CardsEventos';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

function Inicio() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);  // <-- Nuevo estado loading

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
    try {
    setLoading(true);
    const generosResponse = await api.get('/Evento/GetGeneros');
    const generosArray = generosResponse.data;
    const generosDict = {};
    generosArray.forEach(gen => {
      generosDict[gen.cdGenero] = gen.dsGenero;
    });

    // const eventosResponse = await api.get('/Evento/GetEventos?Estado=2');
    const eventosResponse = user
      ? await api.get(`/Evento/GetEventos?Estado=2&IdUsuarioFav=${user.id}`)
      : await api.get('/Evento/GetEventos?Estado=2');
    const eventosApi = eventosResponse.data.eventos;

    const eventosProcesados = eventosApi.map(evento => ({
      id: evento.idEvento,
      nombreEvento: evento.nombre,
      dias: evento.fechas.map(fecha => ({
        fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
        horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        entradas: fecha.entradas || []
      })),
      generos: evento.genero.map(genId => generosDict[genId] || 'Desconocido'),
      artistas: evento.artistas || [],
      lgbt: evento.isLgbt,
      after: evento.isAfter,
      provincia: evento.domicilio.provincia.nombre,
      municipio: evento.domicilio.municipio.nombre,
      localidad: evento.domicilio.localidad.nombre,
      direccion: evento.domicilio.direccion,
      descripcion: evento.descripcion,
      imagen: evento.media && evento.media.length > 0 ? evento.media[0].imagen : null,
      isFavorito: evento.isFavorito === 1 // booleano
    }));

    setEventos(eventosProcesados);
    setFilteredEventos(eventosProcesados);
  } catch (error) {
    console.error('Error al cargar eventos:', error);
  } finally {
    setLoading(false);
  }
};


    fetchData();
    window.scrollTo(0, 0);
  }, [user]);

  const filterEventos = (eventos, filtros) => {
    return eventos.filter(evento => {
      if (filtros.genero && filtros.genero !== 'Todos') {
        if (!evento.generos.includes(filtros.genero)) return false;
      }
      if (filtros.after && !evento.after) return false;
      if (filtros.lgbt && !evento.lgbt) return false;
      if (filtros.ubicacion) {
        const { provincia, municipio, localidad } = filtros.ubicacion;
        if (provincia && evento.provincia !== provincia) return false;
        if (municipio && evento.municipio !== municipio) return false;
        if (localidad && evento.localidad !== localidad) return false;
      }
      return true;
    });
  };

  const handleFilter = (filtros) => {
    const resultados = filterEventos(eventos, filtros);
    setFilteredEventos(resultados);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className='flex-1'>
        <div className='sm:px-10'>
          <NavBar onFilter={handleFilter} />
        </div>
        <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
          <Carousel />

          {loading ? (
            <div className="flex justify-center items-center my-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <span className="ml-3 text-lg">Cargando eventos...</span>
            </div>
          ) : filteredEventos.length === 0 ? (
            <div className="text-center my-10">
              <p className="text-xl font-semibold">No hay eventos en venta en este momento.</p>
              <p className="text-gray-500">¡Vuelve pronto para descubrir nuevas fiestas!</p>
            </div>
          ) : (
            <CardsEventos eventos={filteredEventos} user={user} />           
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Inicio;















// import React, {useState} from 'react'
// import NavBar from '../components/NavBar';
// import Cards from '../components/Cards';
// import Footer from '../components/Footer';
// import Carousel from '../components/Carousel';

// function Inicio() {
//   window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

//   // Objeto eventos con la nueva estructura (se muestran 3 eventos de ejemplo)
//   const eventos = [
//     {
//       id: 1,
//       nombreEvento: "Nombre de evento 1",
//       // Evento de 1 día
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
//       ],
//       generos: ["Tech-House", "Techno"],
//       artistas: ["Dich Brothers", "La Cintia", "Luana"],
//       lgbt: true,
//       after: false,
//       provincia: "Buenos Aires",
//       municipio: "Tres de Febrero",
//       localidad: "Villa Bosch",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//     },
//     {
//       id: 2,
//       nombreEvento: "Nombre de evento 2",
//       // Evento de 1 día
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
//       ],
//       generos: ["Tech-House"],
//       artistas: ["Nico Moreno", "T78"],
//       lgbt: false,
//       after: false,
//       provincia: "Ciudad Autónoma de Buenos Aires",
//       municipio: "",
//       localidad: "",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 2, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//     },
//     {
//       id: 3,
//       nombreEvento: "Nombre de evento 3",
//       // Evento de 2 días: cada día con sus propias entradas
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
//       ],
//       generos: ["Tech-House", "Techno"],
//       artistas: ["Juan Solis", "Kilah"],
//       lgbt: false,
//       after: true,
//       provincia: "Ciudad Autónoma de Buenos Aires",
//       municipio: "",
//       localidad: "",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//     },
//     {
//       id: 4,
//       nombreEvento: "Nombre de evento 4",
//       // Evento de 3 días: cada día con sus datos y entradas
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
//       ],
//       generos: ["Tech-House"],
//       artistas: ["Dich Brothers", "La Cintia", "Luana"],
//       lgbt: false,
//       after: false,
//       provincia: "Ciudad Autónoma de Buenos Aires",
//       municipio: "",
//       localidad: "",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 4, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
//     },
//     {
//       id: 5,
//       nombreEvento: "Nombre de evento 5",
//       // Evento de 1 día
//       dias: [
//         {
//           fecha: "22/10/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "05/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ],
//       generos: ["Techno"],
//       artistas: ["Amelie Lens", "Regal", "Adam Beyer"],
//       lgbt: false,
//       after: false,
//       provincia: "Buenos Aires",
//       municipio: "San Isidro",
//       localidad: "San Isidro",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 5, dolor sit amet consectetur adipisicing elit. Similique ullam..."
//     },
//     {
//       id: 6,
//       nombreEvento: "Nombre de evento 6",
//       // Evento de 1 día
//       dias: [
//         {
//           fecha: "22/10/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ],
//       generos: ["PsyTrance"],
//       artistas: ["Javier Busola"],
//       lgbt: false,
//       after: false,
//       provincia: "Buenos Aires",
//       municipio: "San Isidro",
//       localidad: "San Isidro",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 6, dolor sit amet consectetur adipisicing elit. Similique ullam..."
//     },
//     {
//       id: 7,
//       nombreEvento: "Nombre de evento 7",
//       // Evento de 2 días
//       dias: [
//         {
//           fecha: "25/10/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "15/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         },
//         {
//           fecha: "26/10/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "15/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ],
//       generos: ["Tech-House"],
//       artistas: ["Jay de Lys", "Ghezz", "Cadelago"],
//       lgbt: true,
//       after: true,
//       provincia: "Buenos Aires",
//       municipio: "Tres de Febrero",
//       localidad: "Santos Lugares",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 7, dolor sit amet consectetur adipisicing elit. Similique ullam..."
//     },
//     {
//       id: 8,
//       nombreEvento: "Nombre de evento 8",
//       // Evento de 1 día
//       dias: [
//         {
//           fecha: "30/10/2025",
//           horaInicio: "23:50hs",
//           horaFin: "07:00hs",
//           entradas: [
//             { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
//             { tipo: "General", precio: 5000, stock: 900 },
//             { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "30/10/2025" },
//             { tipo: "Vip", precio: 7000, stock: 400 }
//           ]
//         }
//       ],
//       generos: ["Techno"],
//       artistas: ["Enrico Sangiuliano", "Josefina Munoz", "999999999"],
//       lgbt: false,
//       after: false,
//       provincia: "Mendoza",
//       municipio: "Las Heras",
//       localidad: "Las Heras",
//       direccion: "Av. Cnel. Niceto Vega 6599, CABA",
//       descripcion: "DESCRIPCION DEL EVENTO 8, dolor sit amet consectetur adipisicing elit. Similique ullam..."
//     }
//   ];
  
//   // Verifica si el evento está finalizado (se toma la fecha del último día)
//   const esEventoFinalizado = (evento) => {
//     const dias = evento.dias;
//     const ultimaFechaStr = dias[dias.length - 1].fecha;
//     const fechaEvento = new Date(ultimaFechaStr.split('/').reverse().join('-'));
//     const fechaActual = new Date();
//     return fechaEvento < fechaActual;
//   };

//   // Filtrar los eventos que aún no finalizaron
//   const eventosNoFinalizados = eventos.filter(evento => !esEventoFinalizado(evento));

//   // Estado para los eventos que se mostrarán luego del filtrado
//   const [filteredEventos, setFilteredEventos] = useState(eventosNoFinalizados);

//   // Función que aplica los filtros a la lista de eventos
//   const filterEventos = (eventos, filtros) => {
//     return eventos.filter(evento => {
//       // Filtro por género musical (si no es "Todos")
//       if (filtros.genero && filtros.genero !== 'Todos') {
//         if (!evento.generos.includes(filtros.genero)) return false;
//       }
//       // Filtro por "After"
//       if (filtros.after && !evento.after) return false;
//       // Filtro por "LGBT"
//       if (filtros.lgbt && !evento.lgbt) return false;
//       // Filtro por ubicación (comparando provincia, municipio y localidad)
//       if (filtros.ubicacion) {
//         const { provincia, municipio, localidad } = filtros.ubicacion;
//         if (provincia && evento.provincia !== provincia) return false;
//         if (municipio && evento.municipio !== municipio) return false;
//         if (localidad && evento.localidad !== localidad) return false;
//       }
//       // Filtro por fecha
//       if (filtros.fechaOption && filtros.fechaOption !== 'todos') {
//         // Se comprueba si al menos uno de los días del evento cumple la condición
//         const cumpleFecha = evento.dias.some(dia => {
//           const parts = dia.fecha.split('/');
//           // Convertimos "dd/mm/yyyy" a "yyyy-mm-dd"
//           const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
//           if (filtros.fechaOption === 'especifica' && filtros.fechaEspecifica) {
//             return formattedDate === filtros.fechaEspecifica;
//           }
//           if (filtros.fechaOption === 'estaSemana') {
//             const eventDate = new Date(parts[2], parts[1] - 1, parts[0]);
//             const now = new Date();
//             // Suponiendo que la semana va de domingo a sábado
//             const startOfWeek = new Date(now);
//             startOfWeek.setDate(now.getDate() - now.getDay());
//             const endOfWeek = new Date(now);
//             endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
//             return eventDate >= startOfWeek && eventDate <= endOfWeek;
//           }
//           if (filtros.fechaOption === 'proximoFinDeSemana') {
//             const now = new Date();
//             // Definimos el próximo sábado y domingo
//             const nextSaturday = new Date(now);
//             nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
//             const nextSunday = new Date(nextSaturday);
//             nextSunday.setDate(nextSaturday.getDate() + 1);
//             const eventDate = new Date(parts[2], parts[1] - 1, parts[0]);
//             return eventDate.getTime() === nextSaturday.getTime() || eventDate.getTime() === nextSunday.getTime();
//           }
//           return false;
//         });
//         if (!cumpleFecha) return false;
//       }
//       return true;
//     });
//   };

//   // Callback que se pasará al componente Filtros (a través de NavBar)
//   const handleFilter = (filtros) => {
//     const resultados = filterEventos(eventosNoFinalizados, filtros);
//     setFilteredEventos(resultados);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className='flex-1'>
//         <div className='sm:px-10'>
//           <NavBar onFilter={handleFilter}/>
//         </div>
//         <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
//           <Carousel />
//           {/* <Cards eventos={eventosNoFinalizados} /> */}
//           <Cards eventos={filteredEventos}/>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Inicio;
