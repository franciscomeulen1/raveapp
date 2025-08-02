// Evento.js
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TablaDeEntradas from '../components/componentsVistaEvento/TablaDeEntradas';
import Resenias from '../components/componentsVistaEvento/Resenias';
import ImagenEvento from '../components/componentsVistaEvento/ImagenEvento';
import DescripcionEvento from '../components/componentsVistaEvento/DescripcionEvento';
import SoundCloudEvento from '../components/componentsVistaEvento/SoundCloudEvento';
import YoutubeEvento from '../components/componentsVistaEvento/YoutubeEvento';
import ArtistasEvento from '../components/componentsVistaEvento/ArtistasEvento';
import FechasEvento from '../components/componentsVistaEvento/FechasEvento';
import UbicacionEvento from '../components/componentsVistaEvento/UbicacionEvento';
import EtiquetasEvento from '../components/componentsVistaEvento/EtiquetasEvento';
import GenerosEvento from '../components/componentsVistaEvento/GenerosEvento';

export default function Evento() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(location.state?.evento || null);
  const [loading, setLoading] = useState(!evento);
  const [comprarHabilitado, setComprarHabilitado] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvento = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/Evento/GetEventos?IdEvento=${id}`);
        const eventosApi = response.data.eventos;

        if (eventosApi && eventosApi.length > 0) {
          const eventoData = eventosApi[0];
          const procesado = {
            id: eventoData.idEvento,
            nombreEvento: eventoData.nombre,
            dias: eventoData.fechas.map(fecha => ({
              idFecha: fecha.idFecha,
              fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
              horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
              horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
            })),
            generos: eventoData.genero || [],
            artistas: eventoData.artistas || [],
            lgbt: eventoData.isLgbt,
            after: eventoData.isAfter,
            provincia: eventoData.domicilio.provincia.nombre,
            municipio: eventoData.domicilio.municipio.nombre,
            localidad: eventoData.domicilio.localidad.nombre,
            direccion: eventoData.domicilio.direccion,
            descripcion: eventoData.descripcion,
            soundcloud: eventoData.soundCloud,
            imagen: null,
            youtube: null
          };

          const mediaResponse = await api.get(`/Media?idEntidadMedia=${eventoData.idEvento}`);
          const mediaArray = mediaResponse.data.media || [];
          const imagenMedia = mediaArray.find(m => m.url && !m.mdVideo);
          const videoMedia = mediaArray.find(m => m.mdVideo && !m.url);
          procesado.imagen = imagenMedia?.url || null;
          procesado.youtube = videoMedia?.mdVideo || null;

          setEvento(procesado);
        } else {
          setEvento(null);
        }
      } catch (error) {
        console.error('Error al cargar evento:', error);
        setEvento(null);
      } finally {
        setLoading(false);
      }
    };

    if (!evento) {
      fetchEvento();
    }
  }, [id, evento]);

  const handleCantidadChange = (totalSeleccionadas) => {
    setComprarHabilitado(totalSeleccionadas > 0);
  };

  const handleComprarSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const purchaseItems = [];
    let subtotal = 0;

    evento.dias.forEach((dia, diaIndex) => {
      const entradasDia = document.querySelectorAll(`[name^="dia-${diaIndex}-entrada-"]`);
      entradasDia.forEach((select, ticketIndex) => {
        const quantity = parseInt(formData.get(select.name));
        if (quantity > 0) {
          const precio = parseInt(select.dataset.precio);
          const tipo = select.dataset.tipo;
          const itemSubtotal = precio * quantity;
          subtotal += itemSubtotal;
          purchaseItems.push({
            dia: dia.fecha,
            tipo,
            precio,
            cantidad: quantity,
            itemSubtotal
          });
        }
      });
    });

    const serviceFee = 1000;
    const total = subtotal + serviceFee;
    navigate('/comprar', { state: { evento, purchaseItems, subtotal, serviceFee, total } });
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span><span className="ml-3 text-lg">Cargando evento...</span></div>;
  if (!evento) return <div className="flex justify-center items-center h-screen"><p className="text-xl font-semibold">No se encontró el evento.</p></div>;

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />
        <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>{evento.nombreEvento}</h1>

        <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
          <div className='order-2 lg:order-1 row-span-2'>
            <ImagenEvento imagen={evento.imagen} />
            <ArtistasEvento artistas={evento.artistas} />
            <FechasEvento dias={evento.dias} />
            <UbicacionEvento nombreEvento={evento.nombreEvento} direccion={evento.direccion} localidad={evento.localidad} municipio={evento.localidad} provincia={evento.provincia} />
            <EtiquetasEvento lgbt={evento.lgbt} after={evento.after} />
            <GenerosEvento generos={evento.generos}/>

            <form onSubmit={handleComprarSubmit} className='mt-5'>
              {evento.dias.map((dia, index) => (
                <div key={index} className="mb-6">
                  {evento.dias.length > 1 && <h2 className="text-xl font-bold mb-2">Entradas para el {dia.fecha}</h2>}
                  <TablaDeEntradas idFecha={dia.idFecha} diaIndex={index} onCantidadChange={handleCantidadChange} />
                </div>
              ))}

              <div className="flex justify-end my-3">
                <button type="submit" className="btn btn-secondary" disabled={!comprarHabilitado}>
                  Comprar
                </button>
              </div>
            </form>
          </div>

          <div className='order-3 lg:order-2'><DescripcionEvento descripcion={evento.descripcion} /></div>
          <div className='order-4 lg:order-3'><SoundCloudEvento url={evento.soundcloud} /></div>
          <div className='order-5 lg:order-4'><YoutubeEvento url={evento.youtube} /></div>
          <div className='order-6 lg:order-5'><Resenias /></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import api from '../componenteapi/api';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import TablaDeEntradas from '../components/componentsVistaEvento/TablaDeEntradas';
// import Resenias from '../components/componentsVistaEvento/Resenias';

// import ImagenEvento from '../components/componentsVistaEvento/ImagenEvento';
// import DescripcionEvento from '../components/componentsVistaEvento/DescripcionEvento';
// import SoundCloudEvento from '../components/componentsVistaEvento/SoundCloudEvento';
// import YoutubeEvento from '../components/componentsVistaEvento/YoutubeEvento';
// import ArtistasEvento from '../components/componentsVistaEvento/ArtistasEvento';
// import FechasEvento from '../components/componentsVistaEvento/FechasEvento';
// import UbicacionEvento from '../components/componentsVistaEvento/UbicacionEvento';
// import EtiquetasEvento from '../components/componentsVistaEvento/EtiquetasEvento';

// export default function Evento() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [evento, setEvento] = useState(location.state?.evento || null);
//   const [loading, setLoading] = useState(!evento);
//   const [haySeleccion, setHaySeleccion] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const fetchEvento = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/Evento/GetEventos?IdEvento=${id}`);
//         const eventosApi = response.data.eventos;

//         if (eventosApi && eventosApi.length > 0) {
//           const eventoData = eventosApi[0];

//           const procesado = {
//             id: eventoData.idEvento,
//             nombreEvento: eventoData.nombre,
//             dias: eventoData.fechas.map(fecha => ({
//               idFecha: fecha.idFecha,
//               fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
//               horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//               horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
//             })),
//             generos: eventoData.genero || [],
//             artistas: eventoData.artistas || [],
//             lgbt: eventoData.isLgbt,
//             after: eventoData.isAfter,
//             provincia: eventoData.domicilio.provincia.nombre,
//             municipio: eventoData.domicilio.municipio.nombre,
//             localidad: eventoData.domicilio.localidad.nombre,
//             direccion: eventoData.domicilio.direccion,
//             descripcion: eventoData.descripcion,
//             soundcloud: eventoData.soundCloud,
//             imagen: null,
//             youtube: null
//           };

//           const mediaResponse = await api.get(`/Media?idEntidadMedia=${eventoData.idEvento}`);
//           const mediaArray = mediaResponse.data.media || [];

//           const imagenMedia = mediaArray.find(m => m.url && !m.mdVideo);
//           const videoMedia = mediaArray.find(m => m.mdVideo && !m.url);

//           procesado.imagen = imagenMedia?.url || null;
//           procesado.youtube = videoMedia?.mdVideo || null;

//           setEvento(procesado);
//         } else {
//           setEvento(null);
//         }
//       } catch (error) {
//         console.error('Error al cargar evento:', error);
//         setEvento(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!evento) {
//       fetchEvento();
//     }
//   }, [id, evento]);

//   const handleComprarSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const purchaseItems = [];
//     let subtotal = 0;

//     evento.dias.forEach((dia, diaIndex) => {
//       dia.entradas?.forEach((entrada, ticketIndex) => {
//         const fieldName = `dia-${diaIndex}-entrada-${ticketIndex}`;
//         const quantity = parseInt(formData.get(fieldName));
//         if (quantity > 0) {
//           const itemSubtotal = entrada.precio * quantity;
//           subtotal += itemSubtotal;
//           purchaseItems.push({
//             dia: dia.fecha,
//             tipo: entrada.tipo,
//             precio: entrada.precio,
//             cantidad: quantity,
//             itemSubtotal,
//           });
//         }
//       });
//     });

//     const serviceFee = 1000;
//     const total = subtotal + serviceFee;

//     navigate('/comprar', { state: { evento, purchaseItems, subtotal, serviceFee, total } });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//         <span className="ml-3 text-lg">Cargando evento...</span>
//       </div>
//     );
//   }

//   if (!evento) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl font-semibold">No se encontró el evento.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />
//         <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>
//           {evento.nombreEvento}
//         </h1>

//         <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
//           <div className='order-2 lg:order-1 row-span-2'>
//             <ImagenEvento imagen={evento.imagen} />
//             <ArtistasEvento artistas={evento.artistas} />
//             <FechasEvento dias={evento.dias} />
//             <UbicacionEvento nombreEvento={evento.nombreEvento} direccion={evento.direccion} />
//             <EtiquetasEvento lgbt={evento.lgbt} after={evento.after} />

//             <form onSubmit={handleComprarSubmit} onChange={() => setHaySeleccion(true)} className='mt-5'>
//               {evento.dias.map((dia, index) => (
//                 <div key={index} className="mb-6">
//                   {evento.dias.length > 1 && (
//                     <h2 className="text-xl font-bold mb-2">Entradas para el {dia.fecha}</h2>
//                   )}
//                   <TablaDeEntradas idFecha={dia.idFecha} diaIndex={index} />
//                 </div>
//               ))}

//               <div className="flex justify-end my-3">
//                 <button
//                   type="submit"
//                   className="btn btn-secondary"
//                   disabled={!haySeleccion}
//                 >
//                   Comprar
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className='order-3 lg:order-2'>
//             <DescripcionEvento descripcion={evento.descripcion} />
//           </div>

//           <div className='order-4 lg:order-3'>
//             <SoundCloudEvento url={evento.soundcloud} />
//           </div>

//           <div className='order-5 lg:order-4'>
//             <YoutubeEvento url={evento.youtube} />
//           </div>

//           <div className='order-6 lg:order-5'>
//             <Resenias />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }




// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import api from '../componenteapi/api';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import TablaDeEntradas from '../components/TablaDeEntradas';
// import Resenias from '../components/Resenias';
// import { BsGeoAltFill } from "react-icons/bs";
// import { FaCalendarAlt } from "react-icons/fa";
// import { AiFillSound } from "react-icons/ai";
// import RainbowIcon from "../iconos/rainbow.png";
// import AfterIcon from "../iconos/confetti.png";

// export default function Evento() {
//   window.scrollTo(0, 0); // Siempre arranca arriba
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [evento, setEvento] = useState(location.state?.evento || null);
//   const [loading, setLoading] = useState(!evento);

//   useEffect(() => {
//     const fetchEvento = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/Evento/GetEventos?IdEvento=${id}`);
//         const eventosApi = response.data.eventos;

//         if (eventosApi && eventosApi.length > 0) {
//           const eventoData = eventosApi[0];

//           const procesado = {
//             id: eventoData.idEvento,
//             nombreEvento: eventoData.nombre,
//             dias: eventoData.fechas.map(fecha => ({
//               fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
//               horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//               horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
//               entradas: fecha.entradas || []
//             })),
//             generos: eventoData.genero || [],
//             artistas: eventoData.artistas || [],
//             lgbt: eventoData.isLgbt,
//             after: eventoData.isAfter,
//             provincia: eventoData.domicilio.provincia.nombre,
//             municipio: eventoData.domicilio.municipio.nombre,
//             localidad: eventoData.domicilio.localidad.nombre,
//             direccion: eventoData.domicilio.direccion,
//             descripcion: eventoData.descripcion,
//             imagen: eventoData.media && eventoData.media.length > 0 ? eventoData.media[0].imagen : null,
//             soundcloud: eventoData.soundCloud
//           };

//           setEvento(procesado);
//         } else {
//           setEvento(null);
//         }
//       } catch (error) {
//         console.error('Error al cargar evento:', error);
//         setEvento(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!evento) {
//       fetchEvento();
//     }
//   }, [id, evento]);

//   const handleComoLlegarClick = (nombreEvento, direccion) => {
//     navigate(`/comollegar/${nombreEvento}`, { state: { nombreEvento, direccion } });
//   };

//   const handleComprarSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const purchaseItems = [];
//     let subtotal = 0;

//     evento.dias.forEach((dia, diaIndex) => {
//       dia.entradas.forEach((entrada, ticketIndex) => {
//         const fieldName = `dia-${diaIndex}-entrada-${ticketIndex}`;
//         const quantity = parseInt(formData.get(fieldName));
//         if (quantity > 0) {
//           const itemSubtotal = entrada.precio * quantity;
//           subtotal += itemSubtotal;
//           purchaseItems.push({
//             dia: dia.fecha,
//             tipo: entrada.tipo,
//             precio: entrada.precio,
//             cantidad: quantity,
//             itemSubtotal,
//           });
//         }
//       });
//     });

//     const serviceFee = 1000;
//     const total = subtotal + serviceFee;

//     navigate('/comprar', { state: { evento, purchaseItems, subtotal, serviceFee, total } });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//         <span className="ml-3 text-lg">Cargando evento...</span>
//       </div>
//     );
//   }

//   if (!evento) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl font-semibold">No se encontró el evento.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />

//         <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>
//           {evento.nombreEvento}
//         </h1>

//         <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
//           {/* Sección de Imagen y Datos */}
//           <div className='order-2 lg:order-1 row-span-2'>
//             <div className='mb-6 flex justify-center'>
//               <img
//                 src={evento.imagen || "https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"}
//                 width="450"
//                 height="auto"
//                 alt="imagen de evento"
//                 className='rounded-xl'
//               />
//             </div>

//             <div className='flex items-center gap-x-1 mb-4'>
//               <AiFillSound style={{ color: "#080808" }} className='inline size-6' />
//               <p className='font-bold'>
//                 <span className="underline underline-offset-4">Artistas:</span><span> </span>
//                 <span className='text-lg'>
//                   {evento.artistas.map(a => a.nombre).join(' - ')}
//                 </span>
//               </p>
//             </div>

//             {evento.dias.map((dia, index) => (
//               <div key={index} className='flex flex-col mb-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <FaCalendarAlt style={{ color: "#080808" }} className='size-5' />
//                   <p>
//                     <span className='font-bold'>Fecha:</span> {dia.fecha} <br />
//                     <span className='font-bold'>Horario:</span> {dia.horaInicio} - {dia.horaFin}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             <div className='flex justify-between items-center'>
//               <div className='flex items-center gap-x-2'>
//                 <BsGeoAltFill style={{ color: "#080808" }} className='size-5' />
//                 <p className='font-semibold'>{evento.direccion}</p>
//               </div>
//               <button className='btn bg-cyan-600 rounded-full ml-3'
//                 onClick={() => handleComoLlegarClick(evento.nombreEvento, evento.direccion)}
//               >
//                 Cómo llegar
//               </button>
//             </div>

//             <div className="flex gap-x-5 mt-2">
//               {evento.lgbt && (
//                 <div className='flex items-center gap-x-2'>
//                   <img src={RainbowIcon} alt="Rainbow" className='w-6 h-6' />
//                   <p className='font-bold'>LGBT</p>
//                 </div>
//               )}
//               {evento.after && (
//                 <div className='flex items-center gap-x-2'>
//                   <img src={AfterIcon} alt="after" className='w-6 h-6' />
//                   <p className='font-bold'>AFTER</p>
//                 </div>
//               )}
//             </div>

//             <form onSubmit={handleComprarSubmit} className='mt-5'>
//               {evento.dias.map((dia, index) => (
//                 <div key={index} className="mb-6">
//                   {evento.dias.length > 1 && (
//                     <h2 className="text-xl font-bold mb-2">Entradas para el {dia.fecha}</h2>
//                   )}
//                   <TablaDeEntradas entradas={dia.entradas} diaIndex={index} />
//                 </div>
//               ))}
//               <div className="flex justify-end my-3">
//                 <button type="submit" className='btn btn-secondary'>Comprar</button>
//               </div>
//             </form>
//           </div>

//           <div className='order-3 lg:order-2'>
//             <div className='mb-6'>
//               <p>{evento.descripcion}</p>
//             </div>
//           </div>

//           <div className='order-4 lg:order-3'>
//             <iframe
//               title="musicaSoundCloud"
//               width="100%"
//               height="450"
//               scrolling="no"
//               frameBorder="no"
//               allow="autoplay"
//               src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
//               className='mb-6'
//             ></iframe>
//           </div>

//           <div className='order-5 lg:order-4'>
//             <iframe
//               height="315"
//               src="https://www.youtube.com/embed/zmqS5hEi_QI"
//               title="YouTube video player"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               className='w-full mb-6'
//             ></iframe>
//           </div>

//           <div className='order-6 lg:order-5'>
//             <Resenias />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
