import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function EntradasAdquiridas() {
 
    useEffect(() => {
        window.scrollTo(0, 0);
    })

    return (
        <div className="flex flex-col min-h-screen">
            <div className='sm:px-10 flex-grow'>
                <NavBar />
                <h1 className='px-10 mb-6 mt-2 text-3xl font-bold underline underline-offset-8'>Mis entradas:</h1>

            </div>
            <Footer />
        </div>
    );
}