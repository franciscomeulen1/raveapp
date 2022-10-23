import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TablaDeEntradas from '../components/TablaDeEntradas';
import { BsGeoAltFill } from "react-icons/bs";

export default function Evento() {
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />

                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Nombre del evento</h1>

                <div className='grid sm:grid-cols-2 gap-10 mb-6 px-10'>
                    <div className='sm:columns-1'>
                        <div>
                            <p>DESCRIPCION DEL EVENTO, dolor sit amet consectetur adipisicing elit. Similique ullam cumque, necessitatibus delectus id rerum voluptates doloremque quidem debitis blanditiis. Itaque laudantium dolores laboriosam quas. Voluptatum adipisci culpa itaque ab.</p>
                        </div>
                        <div>
                            <p><span className='font-bold'>Horario del evento:</span> 23:50hs a 07:00hs</p>
                        </div>
                        <div>
                            <p className='font-semibold'><BsGeoAltFill className='inline'/> Direccion</p>
                        </div>
                        <TablaDeEntradas />


                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}