import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

// const listaArtistas = ['Amelie Lens', 'Charlotte de Wite', 'Adam Beyer', '99999999999', 'T78', 'Boris Brejcha', 'Regal', 'Enrico Sangiuliano'];

// const alfabeto = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function Artistas() {
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Artistas</h1>
                <div className='mx-28'>

                    {/* ARTISTAS QUE EMPIEZAN CON NUMEROS O CARACTERES ESPECIALES */}
                    <div><p className='font-bold text-3xl'>#</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>
                        
                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>
                    </div>

                    <div className="divider"></div>

                    {/* ARTISTAS QUE EMPIEZAN CON A */}
                    <div><p className='font-bold text-3xl'>A</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">


                    <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full'/>
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}