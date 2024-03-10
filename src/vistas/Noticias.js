import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';

export default function Noticias() {

    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
    
    const noticias = [
        {
            id: 1,
            titulo: "Título de la noticia 1",
            encabezado: "Encabezado de la noticia 1"
        },
        {
            id: 2,
            titulo: "Título de la noticia 2",
            encabezado: "Encabezado de la noticia 2"
        },
        {
            id: 3,
            titulo: "Título de la noticia 3",
            encabezado: "Encabezado de la noticia 3"
        }
    ];
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Novedades</h1>
                <div className='grid justify-center space-y-5'>
                {noticias.map(noticia => {
                    return <CardNoticia key={noticia.id} titulo={noticia.titulo} encabezado={noticia.encabezado}/>
                })}
                </div>
            </div>
            <Footer />
        </div>
    )
}