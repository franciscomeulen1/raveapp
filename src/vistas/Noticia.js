import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

export default function Noticia() {
    window.scrollTo(0, 0);

    const location = useLocation();
    const noticia = location.state.noticia;

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="container mx-auto p-4 flex-1 flex items-center justify-center">
                <div className="flex flex-col md:flex-row items-center" style={{ gap: '1cm' }}>
                    <div className="flex-shrink-0">
                        <img 
                            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" 
                            alt="noticia" 
                            className="w-full max-w-sm object-cover rounded-lg shadow-md aspect-[1.2]"
                        />
                    </div>
                    <div className="max-w-xl text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
                        <p className="text-gray-700 leading-relaxed">{noticia.noticia}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}