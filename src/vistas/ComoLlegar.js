import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import Mapa from '../components/mapas/Mapa';
import { useJsApiLoader } from '@react-google-maps/api';
import { mapOptions } from '../components/mapas/MapaConfiguracion';

export default function ComoLlegar() {

    const location = useLocation();
    const nombreEvento = location.state.nombreEvento;
    // const direccion = location.state.direccion;

    const { isLoaded } = useJsApiLoader({
        id: mapOptions.googleMapApiKey,
        googleMapsApiKey: mapOptions.googleMapApiKey
      })
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Cómo llegar a: {nombreEvento}</h1>
                <div className='grid grid-cols-3 mx-10'>
                    {/* IZQUIERDA */}
                    <div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text font-semibold text-lg">Dirección de origen:</span>
                            </div>
                            <input type="text" placeholder="Dirección origen" className="input input-bordered w-full max-w-xs" />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text font-semibold text-lg">Dirección de destino:</span>
                            </div>
                            <input type="text" placeholder="Dirección destino" className="input input-bordered w-full max-w-xs" />
                        </label>
                        <button className="btn btn-info btn-xs sm:btn-sm md:btn-md rounded-full font-bold my-4" type="submit">Buscar</button>
                    </div>
                    {/* DERECHA - MAPA */}
                    <div className='col-span-2'>
                      <Mapa isLoaded={isLoaded}/>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}