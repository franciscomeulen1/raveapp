import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

export default function ComoLlegar() {
    const location = useLocation();
    // eslint-disable-next-line
    const idEvento = location.state.idEvento;
    // const direccionEvento = location.state.direccion; // A resolver despues en base a como recibo la dirección.

    const [directions, setDirections] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries // Aquí se incluye la librería de Autocompletado de Direcciones ('places')
    });

    if (loadError) {
        return <div>Error al cargar el mapa. Por favor, inténtalo de nuevo más tarde.</div>;
    }

    if (!isLoaded) {
        return <div>Cargando el mapa...</div>;
    }

    const autocompleteOrigin = () => {
        const autocompleteOrigin = new window.google.maps.places.Autocomplete(
            document.getElementById('origin'),
            { types: ['geocode'] }
        );
        autocompleteOrigin.addListener('place_changed', () => {
            const place = autocompleteOrigin.getPlace();
            if (!place.geometry) {
                console.error('No details available for input: ', place.name);
                return;
            }
            setOrigin(place.formatted_address);
        });
    };

    const autocompleteDestination = () => {
        const autocompleteDestination = new window.google.maps.places.Autocomplete(
            document.getElementById('destination'),
            { types: ['geocode'] }
        );
        autocompleteDestination.addListener('place_changed', () => {
            const place = autocompleteDestination.getPlace();
            if (!place.geometry) {
                console.error('No details available for input: ', place.name);
                return;
            }
            setDestination(place.formatted_address);
        });
    };

    const handleDirections = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: 'TRANSIT', // Modo de transporte público
                language: 'es',
                provideRouteAlternatives: true, // Obtener hasta 3 alternativas de ruta
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log(result);
                    setDirections(result);
                } else {
                    console.error(`Error al calcular la ruta: ${status}`);
                }
            }
        );
    };

    const handleRouteSelection = (index) => {
        setSelectedRouteIndex(index);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="sm:px-10 mb-11" style={{ flex: '1' }}>
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Cómo llegar a: NOMBRE DE EVENTO</h1>
                <div className='grid md:grid-cols-3 mx-10 gap-3'>
                    {/* IZQUIERDA */}
                    <div className='columns-1'>
                        <label className="form-control w-full max-w-xs" htmlFor="origin">
                            <div className="label">
                                <span className="label-text font-semibold text-lg">Dirección de origen:</span>
                            </div>
                            <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} onFocus={autocompleteOrigin} placeholder="Ingrese la dirección de origen" className="input input-bordered w-full max-w-xs" />
                        </label>


                        <label className="form-control w-full max-w-xs" htmlFor="destination">
                            <div className="label">
                                <span className="label-text font-semibold text-lg">Dirección de destino:</span>
                            </div>
                            <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} onFocus={autocompleteDestination} placeholder="Ingrese la dirección de destino" className="input input-bordered w-full max-w-xs" />
                        </label>
                        <button onClick={handleDirections} className="btn btn-info btn-sm md:btn-md rounded-full font-bold my-4">
                            Buscar rutas
                        </button>

                        <div>
                            <div className="mt-4">
                                {directions && directions.routes && (
                                    <div>
                                        <h3 className="label-text font-semibold text-lg">Alternativas de Ruta:</h3>
                                        {directions.routes
                                            .map((route, index) => ({
                                                index,
                                                duration: route.legs[0].duration.text, // Duración total del recorrido
                                                durationValue: route.legs[0].duration.value,
                                            }))
                                            .sort((a, b) => a.durationValue - b.durationValue) // Ordenar por duración ascendente
                                            .map(({ index, duration }, sortedIndex) => (
                                                <div key={index} className='my-1'>
                                                    <button onClick={() => handleRouteSelection(index)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                        Ruta {sortedIndex + 1} - Duración Total: {duration}
                                                    </button>
                                                    <br />
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                {selectedRouteIndex !== null && (
                                    <div>
                                        <h3 className="label-text font-semibold text-lg">Pasos:</h3>
                                        <ol>
                                            {directions.routes[selectedRouteIndex].legs[0].steps.map((step, index) => (
                                                <li key={index}>
                                                    {step.travel_mode === 'WALKING' ? "- " + step.instructions : ''}
                                                    {step.travel_mode === 'TRANSIT' && step.transit.line.vehicle.type === "SUBWAY" ? "- Subte " + step.transit.line.short_name + ": " + step.instructions :
                                                        (step.travel_mode === 'TRANSIT' && step.transit.line.vehicle.type === "BUS" ? "- Autobus " + step.transit.line.short_name + ": " + step.instructions :
                                                            (step.travel_mode === 'TRANSIT' ? "- " + step.transit.line.vehicle.name + " " + step.transit.line.name + ": " + step.instructions : ''))}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>
                    {/* DERECHA - MAPA */}
                    <div className='col-span-1 md:col-span-2'>
                        {isLoaded && (
                            <GoogleMap
                                mapContainerStyle={{ width: 'auto', height: '100vh' }}
                                center={{ lat: -34.61315, lng: -58.37723 }} // Coordenadas de Buenos Aires, Argentina
                                zoom={12}
                            >
                                {selectedRouteIndex !== null && <DirectionsRenderer directions={directions} routeIndex={selectedRouteIndex} />}
                            </GoogleMap>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}