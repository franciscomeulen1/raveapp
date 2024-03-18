import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

export default function ComoLlegar() {

    const location = useLocation();
    const nombreEvento = location.state.nombreEvento;

    const [directions, setDirections] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [routes, setRoutes] = useState([]);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'] // Aquí se incluye la librería de Autocompletado de Direcciones ('places')
    });

    const directionsCallback = (response) => {
        if (response !== null) {
            setDirections(response);
            extractRoutes(response);
        }
    };

    const handleSearch = () => {
        if (origin !== '' && destination !== '') {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.TRANSIT,
                },
                directionsCallback
            );
        }
    };

    const extractRoutes = (response) => {
        const newRoutes = response.routes.map((route, index) => {
            const steps = route.legs[0].steps.filter(step => step.travel_mode === 'TRANSIT');
            return {
                id: index,
                summary: route.summary,
                steps: steps
            };
        });
        setRoutes(newRoutes);
    };

    const originInputRef = React.useRef(null);
    const destinationInputRef = React.useRef(null);

    React.useEffect(() => {
        if (isLoaded) {
            const originAutocomplete = new window.google.maps.places.Autocomplete(originInputRef.current);
            const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInputRef.current);
    
            // Establecer tipos de dirección para el autocompletado
            originAutocomplete.setFields(['address_components', 'geometry']);
            destinationAutocomplete.setFields(['address_components', 'geometry']);
        }
    }, [isLoaded]);

    return isLoaded ? (
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
                            {/* <input type="text" placeholder="Dirección origen" className="input input-bordered w-full max-w-xs" /> */}
                            <input
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                placeholder="Ingrese la dirección de origen"
                                className="input input-bordered w-full max-w-xs"
                                ref={originInputRef} // Agregar referencia al campo de entrada de origen
                            />
                        </label>


                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text font-semibold text-lg">Dirección de destino:</span>
                            </div>
                            {/* <input type="text" placeholder="Dirección destino" className="input input-bordered w-full max-w-xs" /> */}
                            <input
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Ingrese la dirección de destino"
                                className="input input-bordered w-full max-w-xs"
                                ref={destinationInputRef} // Agregar referencia al campo de entrada de destino
                            />
                        </label>

                        <button className="btn btn-info btn-xs sm:btn-sm md:btn-md rounded-full font-bold my-4" onClick={handleSearch}>Buscar</button>

                        <div className="bg-gray-200">
                            {routes.map(route => (
                                <div key={route.id} className="route">
                                    <h2>{route.summary}</h2>
                                    <ul>
                                        {route.steps.map(step => (
                                            <li key={step.instructions}>{step.instructions}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </div>
                    {/* DERECHA - MAPA */}
                    <div className='col-span-2'>
                        <GoogleMap
                            id="map"
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            zoom={10}
                            center={{ lat: -34.61315, lng: -58.37723 }}
                        >
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    ) : (
        <div>
            {loadError ? (
                <div>Error al cargar el mapa. Por favor, intente nuevamente más tarde.</div>
            ) : (
                <div>Cargando mapa...</div>
            )}
        </div>
    );
}


// CODIGO ANTERIOR

// import React from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { useLocation } from 'react-router-dom';
// import Mapa from '../components/mapas/Mapa';
// import { useJsApiLoader } from '@react-google-maps/api';
// import { mapOptions } from '../components/mapas/MapaConfiguracion';

// export default function ComoLlegar() {

//     const location = useLocation();
//     const nombreEvento = location.state.nombreEvento;
//     // const direccion = location.state.direccion;

//     const { isLoaded } = useJsApiLoader({
//         id: mapOptions.googleMapApiKey,
//         googleMapsApiKey: mapOptions.googleMapApiKey
//       })
//     return (
//         <div>
//             <div className="px-10 mb-11">
//                 <NavBar />
//                 <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Cómo llegar a: {nombreEvento}</h1>
//                 <div className='grid grid-cols-3 mx-10'>
//                     {/* IZQUIERDA */}
//                     <div>
//                         <label className="form-control w-full max-w-xs">
//                             <div className="label">
//                                 <span className="label-text font-semibold text-lg">Dirección de origen:</span>
//                             </div>
//                             <input type="text" placeholder="Dirección origen" className="input input-bordered w-full max-w-xs" />
//                         </label>
//                         <label className="form-control w-full max-w-xs">
//                             <div className="label">
//                                 <span className="label-text font-semibold text-lg">Dirección de destino:</span>
//                             </div>
//                             <input type="text" placeholder="Dirección destino" className="input input-bordered w-full max-w-xs" />
//                         </label>
//                         <button className="btn btn-info btn-xs sm:btn-sm md:btn-md rounded-full font-bold my-4" type="submit">Buscar</button>
//                     </div>
//                     {/* DERECHA - MAPA */}
//                     <div className='col-span-2'>
//                       <Mapa isLoaded={isLoaded}/>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     )
// }