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
              horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
              estado: fecha.estado
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

    fetchEvento(); // <--- SIEMPRE

  }, [id]);

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
            <UbicacionEvento idEvento={evento.id} direccion={evento.direccion} localidad={evento.localidad} municipio={evento.municipio} provincia={evento.provincia} />
            <EtiquetasEvento lgbt={evento.lgbt} after={evento.after} />
            <GenerosEvento generos={evento.generos} />

            <form onSubmit={handleComprarSubmit} className='mt-5'>
              {evento.dias.map((dia, index) => (
                <div key={index} className="mb-6">
                  {evento.dias.length > 1 && (
                    <h2 className="text-xl font-bold mb-2">
                      Entradas para el {dia.fecha}
                    </h2>
                  )}

                  {/* Título según el estado de la fecha */}
                  {dia.estado === 1 && (
                    <p className="mb-2 font-medium text-warning">
                      Entradas aún no disponibles para la venta
                    </p>
                  )}

                  {dia.estado === 3 && (
                    <p className="mb-2 font-medium text-error">
                      Venta de entradas finalizada
                    </p>
                  )}

                  <TablaDeEntradas
                    idFecha={dia.idFecha}
                    diaIndex={index}
                    estadoFecha={dia.estado}   // <-- NUEVO
                    onCantidadChange={handleCantidadChange}
                  />
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




// // Evento.js
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
// import GenerosEvento from '../components/componentsVistaEvento/GenerosEvento';

// export default function Evento() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [evento, setEvento] = useState(location.state?.evento || null);
//   const [loading, setLoading] = useState(!evento);
//   const [comprarHabilitado, setComprarHabilitado] = useState(false);

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

//   const handleCantidadChange = (totalSeleccionadas) => {
//     setComprarHabilitado(totalSeleccionadas > 0);
//   };

//   const handleComprarSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const purchaseItems = [];
//     let subtotal = 0;

//     evento.dias.forEach((dia, diaIndex) => {
//       const entradasDia = document.querySelectorAll(`[name^="dia-${diaIndex}-entrada-"]`);
//       entradasDia.forEach((select, ticketIndex) => {
//         const quantity = parseInt(formData.get(select.name));
//         if (quantity > 0) {
//           const precio = parseInt(select.dataset.precio);
//           const tipo = select.dataset.tipo;
//           const itemSubtotal = precio * quantity;
//           subtotal += itemSubtotal;
//           purchaseItems.push({
//             dia: dia.fecha,
//             tipo,
//             precio,
//             cantidad: quantity,
//             itemSubtotal
//           });
//         }
//       });
//     });

//     const serviceFee = 1000;
//     const total = subtotal + serviceFee;
//     navigate('/comprar', { state: { evento, purchaseItems, subtotal, serviceFee, total } });
//   };

//   if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-primary"></span><span className="ml-3 text-lg">Cargando evento...</span></div>;
//   if (!evento) return <div className="flex justify-center items-center h-screen"><p className="text-xl font-semibold">No se encontró el evento.</p></div>;

//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />
//         <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>{evento.nombreEvento}</h1>

//         <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
//           <div className='order-2 lg:order-1 row-span-2'>
//             <ImagenEvento imagen={evento.imagen} />
//             <ArtistasEvento artistas={evento.artistas} />
//             <FechasEvento dias={evento.dias} />
//             <UbicacionEvento idEvento={evento.id} direccion={evento.direccion} localidad={evento.localidad} municipio={evento.localidad} provincia={evento.provincia} />
//             <EtiquetasEvento lgbt={evento.lgbt} after={evento.after} />
//             <GenerosEvento generos={evento.generos}/>

//             <form onSubmit={handleComprarSubmit} className='mt-5'>
//               {evento.dias.map((dia, index) => (
//                 <div key={index} className="mb-6">
//                   {evento.dias.length > 1 && <h2 className="text-xl font-bold mb-2">Entradas para el {dia.fecha}</h2>}
//                   <TablaDeEntradas idFecha={dia.idFecha} diaIndex={index} onCantidadChange={handleCantidadChange} />
//                 </div>
//               ))}

//               <div className="flex justify-end my-3">
//                 <button type="submit" className="btn btn-secondary" disabled={!comprarHabilitado}>
//                   Comprar
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className='order-3 lg:order-2'><DescripcionEvento descripcion={evento.descripcion} /></div>
//           <div className='order-4 lg:order-3'><SoundCloudEvento url={evento.soundcloud} /></div>
//           <div className='order-5 lg:order-4'><YoutubeEvento url={evento.youtube} /></div>
//           <div className='order-6 lg:order-5'><Resenias /></div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
