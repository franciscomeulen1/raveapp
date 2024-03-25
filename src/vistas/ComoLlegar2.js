// CODIGO PROTOTIPO

import React, { useState } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { useLocation } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

export default function ComoLlegar2() {

    //const location = useLocation();
    //const nombreEvento = location.state.nombreEvento;

    const [directions, setDirections] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
    // const [routes, setRoutes] = useState([]);

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
                    // console.log(result);
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
        <div className="flex">
            <div className="w-1/2 p-4">
                <div className="mb-4">
                    <label htmlFor="origin">Origen:</label>
                    <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} onFocus={autocompleteOrigin} />
                </div>
                <div className="mb-4">
                    <label htmlFor="destination">Destino:</label>
                    <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} onFocus={autocompleteDestination} />
                </div>
                <button onClick={handleDirections} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Calcular Ruta
                </button>
                <div className="mt-4">
                    {directions && directions.routes && (
                        <div>
                            <h3>Alternativas de Ruta:</h3>
                            {directions.routes
                                .map((route, index) => ({
                                    index,
                                    duration: route.legs[0].duration.text, // Duración total del recorrido
                                }))
                                .sort((a, b) => a.duration - b.duration) // Ordenar por duración ascendente
                                .map(({ index, duration }) => (
                                    <div key={index}>
                                        <button onClick={() => handleRouteSelection(index)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Ruta {index + 1} - Duración Total: {duration}
                                        </button>
                                        <br />
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    {selectedRouteIndex !== null && (
                        <div>
                            <h3>Pasos:</h3>
                            <ol>
                                {directions.routes[selectedRouteIndex].legs[0].steps.map((step, index) => (
                                    <li key={index}>
                                        {step.travel_mode === 'WALKING' ? "- " + step.instructions : ''}
                                        {step.travel_mode === 'TRANSIT' && step.transit.line.vehicle.type === "SUBWAY" ? "- Subte " + step.transit.line.short_name + ": " + step.instructions :
                                        (step.travel_mode === 'TRANSIT' ? "- " + step.transit.line.vehicle.name + " " + step.transit.line.name + ": " + step.instructions : '')}
                                    </li> 
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-1/2 h-screen">
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={{ lat: -34.603722, lng: -58.381592 }} // Coordenadas de Buenos Aires, Argentina
                        zoom={12}
                    >
                        {selectedRouteIndex !== null && <DirectionsRenderer directions={directions} routeIndex={selectedRouteIndex} />}
                    </GoogleMap>
                )}
            </div>
        </div>
    );
}