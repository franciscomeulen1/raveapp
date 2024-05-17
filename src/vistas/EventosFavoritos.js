import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Cards from '../components/Cards';

export default function EventosFavoritos() {

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

    return (

        <div className="flex flex-col min-h-screen">
            <div className='sm:px-10 flex-grow'>

                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Eventos Favoritos:</h1>

                <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
                    <Cards eventos={eventos} />

                </div>
            </div>
            <Footer />
        </div>
    )
}