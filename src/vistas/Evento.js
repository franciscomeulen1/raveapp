import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TablaDeEntradas from '../components/TablaDeEntradas';
import Resenias from '../components/Resenias';
import { BsGeoAltFill } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai";
import RainbowIcon from "../iconos/rainbow.png";
import AfterIcon from "../iconos/confetti.png";

export default function Evento() {
  window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

  const location = useLocation();
  const evento = location.state.evento;
  const navigate = useNavigate();

  const handleComoLlegarClick = (nombreEvento, direccion) => {
    navigate(`/comollegar/${nombreEvento}`, { state: { nombreEvento, direccion } });
  };

  // Handler para el submit del formulario único de compra
  const handleComprarSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const purchaseItems = [];
    let subtotal = 0;

    // Recorremos cada día y cada entrada para extraer la cantidad seleccionada
    evento.dias.forEach((dia, diaIndex) => {
      dia.entradas.forEach((entrada, ticketIndex) => {
        const fieldName = `dia-${diaIndex}-entrada-${ticketIndex}`;
        const quantity = parseInt(formData.get(fieldName));
        if (quantity > 0) {
          const itemSubtotal = entrada.precio * quantity;
          subtotal += itemSubtotal;
          purchaseItems.push({
            dia: dia.fecha,
            tipo: entrada.tipo,
            precio: entrada.precio,
            cantidad: quantity,
            itemSubtotal,
          });
        }
      });
    });

    // Ejemplo: se agrega un cargo por servicio fijo (puedes calcularlo como necesites)
    const serviceFee = 1000;
    const total = subtotal + serviceFee;

    // Se redirige a la página de Comprar con los datos de la compra
    navigate('/comprar', { state: { evento, purchaseItems, subtotal, serviceFee, total } });
  };

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />

        <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>
          {evento.nombreEvento}
        </h1>

        <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
          {/* Sección de Imagen y Datos */}
          <div className='order-2 lg:order-1 row-span-2'>
            <div className='mb-6 flex justify-center'>
              <img
                src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"
                width="450"
                height="auto"
                alt="imagen de evento"
                className='rounded-xl'
              />
            </div>

            <div className='flex items-center gap-x-1 mb-4'>
              <AiFillSound style={{ color: "#080808" }} className='inline size-6' />
              <p className='font-bold'>
                <span className="underline underline-offset-4">Artistas:</span>
                <span className='text-lg'> {evento.artistas.join(' - ')} </span>
              </p>
            </div>

            {/* Se muestran los días del evento con fecha y horario */}
            {evento.dias.map((dia, index) => (
              <div key={index} className='flex flex-col mb-4'>
                <div className='flex items-center gap-x-2'>
                  <FaCalendarAlt style={{ color: "#080808" }} className='size-5' />
                  <p>
                    <span className='font-bold'>Fecha:</span> {dia.fecha} <br />
                    <span className='font-bold'>Horario:</span> {dia.horaInicio} - {dia.horaFin}
                  </p>
                </div>
              </div>
            ))}

            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-x-2'>
                <BsGeoAltFill style={{ color: "#080808" }} className='size-5' />
                <p className='font-semibold'>{evento.direccion}</p>
              </div>
              <button className='btn bg-cyan-600 rounded-full ml-3'
                onClick={() => handleComoLlegarClick(evento.nombreEvento, evento.direccion)}
              >
                Cómo llegar
              </button>
            </div>

            <div className="flex gap-x-5 mt-2">
              {evento.lgbt && (
                <div className='flex items-center gap-x-2'>
                  <img src={RainbowIcon} alt="Rainbow" className='w-6 h-6' />
                  <p className='font-bold'>LGBT</p>
                </div>
              )}
              {evento.after && (
                <div className='flex items-center gap-x-2'>
                  <img src={AfterIcon} alt="after" className='w-6 h-6' />
                  <p className='font-bold'>AFTER</p>
                </div>
              )}
            </div>

            {/* Sección de compra: se agrupan las tablas de entradas en un único formulario */}
            <form onSubmit={handleComprarSubmit} className='mt-5'>
              {evento.dias.map((dia, index) => (
                <div key={index} className="mb-6">
                  {evento.dias.length > 1 && (
                    <h2 className="text-xl font-bold mb-2">Entradas para el {dia.fecha}</h2>
                  )}
                  <TablaDeEntradas entradas={dia.entradas} diaIndex={index} />
                </div>
              ))}
              <div className="flex justify-end my-3">
                <button type="submit" className='btn btn-secondary'>Comprar</button>
              </div>
            </form>
          </div>

          {/* Sección de Descripción */}
          <div className='order-3 lg:order-2'>
            <div className='mb-6'>
              <p>{evento.descripcion}</p>
            </div>
          </div>

          {/* iframe SoundCloud */}
          <div className='order-4 lg:order-3'>
            <iframe
              title="musicaSoundCloud"
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              className='mb-6'
            ></iframe>
          </div>

          {/* iframe YouTube */}
          <div className='order-5 lg:order-4'>
            <iframe
              height="315"
              src="https://www.youtube.com/embed/zmqS5hEi_QI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className='w-full mb-6'
            ></iframe>
          </div>

          {/* Sección de Reviews */}
          <div className='order-6 lg:order-5'>
            <Resenias />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}




// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import TablaDeEntradas from '../components/TablaDeEntradas';
// import Resenias from '../components/Resenias';
// import { BsGeoAltFill } from "react-icons/bs";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaCalendarAlt } from "react-icons/fa";
// import { AiFillSound } from "react-icons/ai";
// import RainbowIcon from "../iconos/rainbow.png";
// import AfterIcon from "../iconos/confetti.png";

// export default function Evento() {
//     window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

//     const location = useLocation();
//     const evento = location.state.evento;

//     const navigate = useNavigate();
//     const handleComoLlegarClick = (nombreEvento, direccion) => {
//         navigate(`/comollegar/${nombreEvento}`, { state: { nombreEvento, direccion } });
//     };

//     return (
//         <div>
//             <div className="sm:px-10 mb-11">
//                 <NavBar />

//                 <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>{evento.nombreEvento}</h1>

//                 <div className='grid lg:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>
//                     {/* Image Section */}
//                     <div className='order-2 lg:order-1 row-span-2'>
//                         <div className='mb-6 flex justify-center'>
//                             <img src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg" width="450" height="auto" alt="imagen de evento" className='rounded-xl' />
//                         </div>

//                         <div className='flex items-center gap-x-1 mb-4'>
//                             <AiFillSound style={{ color: "#080808" }} className='inline size-6' />
//                             <p className='font-bold'>
//                                 <span class="underline underline-offset-4">Artistas:</span>
//                                 <span className='text-lg'> {evento.artistas.join(' - ')} </span></p>
//                         </div>

//                         <div className='flex items-center gap-x-2 mb-2'>
//                             <FaCalendarAlt style={{ color: "#080808" }} className='size-5' />
//                             <p><span className='font-bold'>Fecha y hora:</span> {evento.fecha} - {evento.horario}</p>
//                         </div>
//                         <div className='flex justify-between items-center'>
//                             <div className='flex items-center gap-x-2'>
//                                 <BsGeoAltFill style={{ color: "#080808" }} className='size-5' />
//                                 <p className='font-semibold'> {evento.direccion}</p>
//                             </div>
//                             <button className='btn bg-cyan-600 rounded-full ml-3' onClick={() => handleComoLlegarClick(evento.nombreEvento, evento.direccion)}>Cómo llegar</button>
//                         </div>

//                         <div className="flex gap-x-5 mt-2">
//                         {evento.lgbt ?
//                         <div className='flex items-center gap-x-2'>
//                             <img src={RainbowIcon} alt="Rainbow" className='w-6 h-6' />
//                             <p className='font-bold'>LGBT</p>
//                         </div> : ""
//                         }
//                         {evento.after ?
//                             <div className='flex items-center gap-x-2'>
//                             <img src={AfterIcon} alt="after" className='w-6 h-6' />
//                             <p className='font-bold'>AFTER</p>
//                         </div> : ""
//                         }
//                         </div>

//                         <div className='mt-5'>
//                         <TablaDeEntradas entradas={evento.entradas} />
//                         </div>
//                     </div>

//                     {/* Description Section */}
//                     <div className='order-3 lg:order-2'>
//                         <div className='mb-6'>
//                             <p>{evento.descripcion}</p>
//                         </div>
//                     </div>

//                     {/* SoundCloud iframe */}
//                     <div className='order-4 lg:order-3'>
//                         <iframe title="musicaSoundCloud" width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" className='mb-6'></iframe>
//                     </div>

//                     {/* YouTube iframe */}
//                     <div className='order-5 lg:order-4'>
//                         <iframe height="315" src="https://www.youtube.com/embed/zmqS5hEi_QI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className='w-full mb-6'></iframe>
//                     </div>

//                     {/* Reviews Section */}
//                     <div className='order-6 lg:order-5'>
//                         <Resenias />
//                     </div>

//                 </div>
//             </div>
//             <Footer />
//         </div>
//     )
// }