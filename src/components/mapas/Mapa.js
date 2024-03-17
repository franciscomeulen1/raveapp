import React from 'react'
import { GoogleMap } from '@react-google-maps/api';

export default function Mapa(props) {
   const { isLoaded } = props;
   const containerStyle = {
    width: 'full',
    height: '400px'
  };
  
  const center = {
    lat: -34.61315,
    lng: -58.37723
  };
  return isLoaded && (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    >
      { /* Child components, such as markers, info windows, etc. */ }
      <></>
    </GoogleMap>
  )
}