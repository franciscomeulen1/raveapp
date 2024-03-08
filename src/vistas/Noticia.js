import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Noticia(props) {
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />

                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Título de la noticia</h1>
                <div className='grid justify-center space-y-5'>

                    <div className='card'>
                        <figure><img src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="Shoes" /></figure>
                    </div>

                    <div className='mx-16'>
                        <p className='font-medium'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Venenatis cras sed felis eget velit aliquet sagittis id consectetur. Enim praesent elementum facilisis leo vel fringilla est. Tristique magna sit amet purus gravida quis. Amet purus gravida quis blandit turpis cursus in hac habitasse. Tristique et egestas quis ipsum. Mattis pellentesque id nibh tortor. Mi bibendum neque egestas congue. Suscipit adipiscing bibendum est ultricies integer quis. Nunc sed velit dignissim sodales ut. Sed lectus vestibulum mattis ullamcorper. Tristique nulla aliquet enim tortor at auctor urna. Eu sem integer vitae justo eget magna fermentum. Quam nulla porttitor massa id neque aliquam. Eget sit amet tellus cras adipiscing. Tellus id interdum velit laoreet id donec ultrices tincidunt. Sit amet consectetur adipiscing elit duis tristique sollicitudin. Nullam eget felis eget nunc lobortis mattis. Ultrices in iaculis nunc sed augue lacus viverra.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}