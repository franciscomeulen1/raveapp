import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Cards from '../components/Cards';

export default function EntradasAdquiridas() {
    return (

        <div className="flex flex-col min-h-screen">
            <div className='sm:px-10 flex-grow'>

                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Entradas adquiridas:</h1>

                <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
                <Cards />

                </div>
            </div>
            <Footer />
        </div>
    )
}


// hemos envuelto todo el contenido dentro de un contenedor <div> con la clase flex flex-col min-h-screen, lo que establece un contenedor de diseño de columna flexible que ocupa al menos toda la altura de la pantalla (min-h-screen). Luego, hemos usado flex-grow en el div que contiene el contenido principal para que este div crezca y ocupe todo el espacio disponible en la pantalla que no esté ocupado por el encabezado y el pie de página. Esto hará que el pie de página se mantenga siempre en la parte inferior de la pantalla, incluso si el contenido es insuficiente para llenarla.