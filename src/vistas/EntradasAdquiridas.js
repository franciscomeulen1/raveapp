import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Cards from '../components/Cards';

export default function EntradasAdquiridas() {
    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

    const [filtro, setFiltro] = useState('todos'); // 'todos' | 'futuros' | 'pasados'

    const eventos = [
        {
            id: 1,
            nombreEvento: "Nombre de evento 1",
            dias: [
                {
                    fecha: "10/05/2025",
                    horaInicio: "23:50hs",
                    horaFin: "07:00hs",
                    entradas: [
                        { tipo: "General", precio: 5000, stock: 900 }
                    ]
                }
            ],
            generos: ["Tech-House", "Techno"],
            artistas: ["Dich Brothers", "La Cintia", "Luana"],
            lgbt: true,
            after: false,
            direccion: "Av. Cnel. Niceto Vega 6599, CABA",
            descripcion: "DESCRIPCION DEL EVENTO 1..."
        },
        {
            id: 2,
            nombreEvento: "Nombre de evento 2",
            dias: [
                {
                    fecha: "10/04/2024",
                    horaInicio: "22:00hs",
                    horaFin: "05:00hs",
                    entradas: [
                        { tipo: "General", precio: 5000, stock: 900 }
                    ]
                }
            ],
            generos: ["Techno"],
            artistas: ["Nico Moreno", "T78"],
            lgbt: false,
            after: false,
            direccion: "Av. Cnel. Niceto Vega 6599, CABA",
            descripcion: "DESCRIPCION DEL EVENTO 2..."
        },
        {
          id: 3,
          nombreEvento: "Nombre de evento 3",
          dias: [
              {
                  fecha: "16/10/2025",
                  horaInicio: "20:00hs",
                  horaFin: "02:00hs",
                  entradas: [
                      { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
                      { tipo: "General", precio: 5000, stock: 900 },
                      { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
                      { tipo: "Vip", precio: 7000, stock: 400 }
                  ]
              },
              {
                  fecha: "17/10/2025",
                  horaInicio: "20:00hs",
                  horaFin: "02:00hs",
                  entradas: [
                      { tipo: "Early Bird General", precio: 3000, stock: 100, fechaLimite: "10/04/2025" },
                      { tipo: "General", precio: 5000, stock: 900 },
                      { tipo: "Early Bird Vip", precio: 5000, stock: 100, fechaLimite: "10/04/2025" },
                      { tipo: "Vip", precio: 7000, stock: 400 }
                  ]
              }
          ],
          generos: ["Tech-House", "Techno"],
          artistas: ["Juan Solis", "Kilah"],
          lgbt: false,
          after: true,
          provincia: "Ciudad Autónoma de Buenos Aires",
          municipio: "",
          localidad: "",
          direccion: "Av. Cnel. Niceto Vega 6599, CABA",
          descripcion: "DESCRIPCION DEL EVENTO 3, dolor sit amet consectetur adipisicing elit. Similique ullam cumque..."
      }
    ];

    // Función auxiliar para saber si el evento está finalizado
    const esFinalizado = (evento) => {
        const ultimaFechaStr = evento.dias[evento.dias.length - 1].fecha;
        const fechaEvento = new Date(ultimaFechaStr.split('/').reverse().join('-'));
        const hoy = new Date();
        return fechaEvento < hoy;
    };

    // Filtramos según la selección
    const eventosFiltrados = eventos.filter(evento => {
        if (filtro === 'todos') return true;
        const finalizado = esFinalizado(evento);
        return filtro === 'futuros' ? !finalizado : finalizado;
    });

    return (
        <div className="flex flex-col min-h-screen">
            <div className='sm:px-10 flex-grow'>
                <NavBar />
                <h1 className='px-10 mb-6 mt-2 text-3xl font-bold underline underline-offset-8'>Entradas adquiridas:</h1>

                <div className="px-10 mb-4 flex flex-wrap gap-2">
                    <button onClick={() => setFiltro('todos')} className={`btn btn-sm ${filtro === 'todos' ? 'btn-primary' : 'btn-outline'}`}>Todos</button>
                    <button onClick={() => setFiltro('futuros')} className={`btn btn-sm ${filtro === 'futuros' ? 'btn-primary' : 'btn-outline'}`}>Próximos</button>
                    <button onClick={() => setFiltro('pasados')} className={`btn btn-sm ${filtro === 'pasados' ? 'btn-primary' : 'btn-outline'}`}>Finalizados</button>
                </div>

                <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
                    <Cards eventos={eventosFiltrados} />
                </div>
            </div>
            <Footer />
        </div>
    );
}




// hemos envuelto todo el contenido dentro de un contenedor <div> con la clase flex flex-col min-h-screen, lo que establece un contenedor de diseño de columna flexible que ocupa al menos toda la altura de la pantalla (min-h-screen). Luego, hemos usado flex-grow en el div que contiene el contenido principal para que este div crezca y ocupe todo el espacio disponible en la pantalla que no esté ocupado por el encabezado y el pie de página. Esto hará que el pie de página se mantenga siempre en la parte inferior de la pantalla, incluso si el contenido es insuficiente para llenarla.