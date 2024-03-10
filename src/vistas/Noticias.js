import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';
import { useNavigate } from "react-router-dom";

export default function Noticias() {

    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
    
    const noticias = [
        {
            id: 1,
            titulo: "Título de la noticia 1",
            encabezado: "Encabezado de la noticia 1",
            noticia: "Noticia 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
        },
        {
            id: 2,
            titulo: "Título de la noticia 2",
            encabezado: "Encabezado de la noticia 2",
            noticia: "Noticia 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
        },
        {
            id: 3,
            titulo: "Título de la noticia 3",
            encabezado: "Encabezado de la noticia 3",
            noticia: "Noticia 3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra."
        }
    ];

    const navigate = useNavigate();
    const handleCardClick = (noticia) => {
        navigate(`/novedad-${noticia.titulo}`, { state: { noticia } });
    };

    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Novedades</h1>
                <div className='grid justify-center space-y-5'>
                {noticias.map(noticia => {
                    return <CardNoticia key={noticia.id} titulo={noticia.titulo} encabezado={noticia.encabezado} onClick={() => handleCardClick(noticia)}/>
                })}
                </div>
            </div>
            <Footer />
        </div>
    )
}