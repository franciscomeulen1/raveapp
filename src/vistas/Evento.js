import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TablaDeEntradas from '../components/TablaDeEntradas';
import { BsGeoAltFill } from "react-icons/bs";

export default function Evento() {
    return (
        <div>
            <div className="sm:px-10 mb-11">
                <NavBar />

                <h1 className='mx-10 sm:px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Nombre del evento</h1>

                <div className='grid sm:grid-cols-2 gap-10 mb-6 px-5 sm:px-10'>

                    <div className='columns-1 pr-5'>
                        <div className='mb-6 flex justify-center'>
                            <img src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg" width="450" height="auto" alt="imagen de evento" className='rounded-xl' />
                        </div>
                        <div className='mb-2'>
                            <p><span className='font-bold'>Horario del evento:</span> 23:50hs a 07:00hs</p>
                        </div>
                        <div className='mb-6 flex justify-between items-center'>
                            <p className='font-semibold'><BsGeoAltFill className='inline' /> Av. Cnel. Niceto Vega 6599, CABA</p>
                            <button className='btn bg-cyan-600 rounded-full ml-3'>Cómo llegar</button>
                        </div>
                        <TablaDeEntradas />
                    </div>

                    <div className='columns-1 pr-5'>
                        <div className='mb-6'>
                            <p>DESCRIPCION DEL EVENTO, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. <br/> Voluptatum adipisci culpa itaque ab. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed laudantium culpa excepturi, qui vitae officia dolorem inventore voluptatem deserunt beatae? <br/> Incidunt corrupti fugiat ab vel eum voluptas odio quas voluptates</p>
                        </div>

                        <iframe title="musicaSoundCloud" width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1406208106&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true" className='mb-6'>
                        </iframe>

                        
                    </div>

                    <div className='columns-1 pr-5'>
                    <iframe height="315" src="https://www.youtube.com/embed/zmqS5hEi_QI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen className='w-full '></iframe>
                    </div>

                </div>

            </div>
            <Footer />
        </div>
    )
}