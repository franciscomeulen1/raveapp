import React from 'react'
import '../index.css';
import NavBar from '../components/NavBar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';

function Inicio() {
  window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

  const eventos = [
    {
      id: 1,
      nombreEvento: "Nombre de evento 1",
      fecha: "10/05/2024",
      generos: ["Tech-House", "Techno"],
      artistas: ["Dich Brothers", "La Cintia", "Luana"],
      lgbt: true,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 1, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 2,
      nombreEvento: "Nombre de evento 2",
      fecha: "15/05/2024",
      generos: "Tech-House",
      artistas: ["Nico Moreno", "T78"],
      lgbt: false,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 2, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 3,
      nombreEvento: "Nombre de evento 3",
      fecha: "16/05/2024",
      generos: ["Tech-House", "Techno"],
      artistas: ["Juan Solis", "Kilah"],
      lgbt: false,
      after: true,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    },
    {
      id: 4,
      nombreEvento: "Nombre de evento 4",
      fecha: "20/05/2024",
      generos: "Tech-House",
      artistas: ["Dich Brothers", "La Cintia", "Luana"],
      lgbt: false,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 4, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 5,
      nombreEvento: "Nombre de evento 5",
      fecha: "22/05/2024",
      generos: "Techno",
      artistas: ["Amelie Lens", "Regal", "Adam Beyer"],
      lgbt: false,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 5, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 6,
      nombreEvento: "Nombre de evento 6",
      fecha: "22/05/2024",
      generos: "PsyTrance",
      artistas: "Javier Busola",
      lgbt: false,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 6, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 7,
      nombreEvento: "Nombre de evento 7",
      fecha: "25/05/2024",
      generos: "Tech-House",
      artistas: ["Jay de Lys", "Ghezz", "Cadelago"],
      lgbt: true,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 7, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }, {
      id: 8,
      nombreEvento: "Nombre de evento 8",
      fecha: "30/05/2024",
      generos: "Techno",
      artistas: ["Enrico Sangiuliano", "Josefina Munoz", "999999999"],
      lgbt: false,
      after: false,
      horario: "23:50hs a 07:00hs",
      direccion: " Av. Cnel. Niceto Vega 6599, CABA",
      descripcion: "DESCRIPCION DEL EVENTO 8, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates",
      entradas: [{ // entradas: tipo precio cantidad.
        tipo: "Early Bird - Entrada general",
        precio: 3000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada general",
        precio: 5000,
        cantidad: 900
      }, {
        tipo: "Early Bird - Entrada VIP",
        precio: 5000,
        cantidad: 100,
        fechaLimite: "10/04/2024"
      }, {
        tipo: "Entrada VIP",
        precio: 7000,
        cantidad: 400
      }]
    }
  ]

  // Función para verificar si el evento está finalizado
  const esEventoFinalizado = (fecha) => {
    const fechaEvento = new Date(fecha.split('/').reverse().join('-'));
    const fechaActual = new Date();
    return fechaEvento < fechaActual;
  };

  // Filtrar los eventos que no están finalizados
  const eventosNoFinalizados = eventos.filter(evento => !esEventoFinalizado(evento.fecha));

  return (
    <div>
      <div className='sm:px-10'>
        <NavBar />
      </div>
      <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
        <Carousel />
        <Cards eventos={eventosNoFinalizados} />
      </div>
      <Footer />
    </div>
  );
}

export default Inicio