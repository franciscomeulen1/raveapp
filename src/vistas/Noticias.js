import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardNoticia from '../components/CardNoticia';

export default function Noticias() {
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Novedades</h1>
                <div className='grid justify-center space-y-5'>
                    <CardNoticia />
                    <CardNoticia />
                    <CardNoticia />
                    <CardNoticia />
                </div>
            </div>
            <Footer />
        </div>
    )
}