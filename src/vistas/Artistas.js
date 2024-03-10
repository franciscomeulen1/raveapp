import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import AvatarArtista from '../components/AvatarArtista';
import { useNavigate } from "react-router-dom";

export default function Artistas() {

    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

    const artistas = [
        {
            id: 1,
            nombre: "Amelie Lens",
            descripcion: "INFORMACION DEL ARTISTA AMELIE LENS - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 2,
            nombre: "Charlotte de Wite",
            descripcion: "INFORMACION DEL ARTISTA CHARLOTTE DE WITE - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 3,
            nombre: "99999999999",
            descripcion: "INFORMACION DEL ARTISTA 99999999999 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 4,
            nombre: "T78",
            descripcion: "INFORMACION DEL ARTISTA T78 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 5,
            nombre: "Adam Beyer",
            descripcion: "INFORMACION DEL ARTISTA ADAM BEYER - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 6,
            nombre: "Boris Brejcha",
            descripcion: "INFORMACION DEL ARTISTA BORIS BREJCHA - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 7,
            nombre: "Regal",
            descripcion: "INFORMACION DEL ARTISTA REGAL - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 8,
            nombre: "Aly & Flia",
            descripcion: "INFORMACION DEL ARTISTA ALY & FLIA - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 9,
            nombre: "Anetha",
            descripcion: "INFORMACION DEL ARTISTA ANETHA - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 10,
            nombre: "Armin Van Buuren",
            descripcion: "INFORMACION DEL ARTISTA ARMIN VAN BUUREN - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }, {
            id: 11,
            nombre: "Above & Beyond",
            descripcion: "INFORMACION DEL ARTISTA ABOVE & BEYOND - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        }
    ]

    const nombresAgrupados = artistas.reduce((result, artista) => {
        const primeraLetra = /^[a-zA-Z]/.test(artista.nombre) ? artista.nombre[0].toUpperCase() : '#';
        if (!result[primeraLetra]) {
            result[primeraLetra] = [];
        }
        result[primeraLetra].push({ nombre: artista.nombre, descripcion: artista.descripcion });
        return result;
    }, {});
    
    const clavesOrdenadas = Object.keys(nombresAgrupados).sort((a, b) => (a === '#' ? -1 : a.localeCompare(b)));

    // console.log(nombresAgrupados);
    // console.log(clavesOrdenadas);

    const navigate = useNavigate();
    const handleCardClick = (nombre, descripcion) => {
        navigate(`/artistas/${nombre}`, { state: { descripcion } });
    };

    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Artistas</h1>
                <div className='mx-28'>

                    {clavesOrdenadas.map(letra => {
                        return <div key={letra}>
                            <div><p className='font-bold text-3xl'>{letra}</p></div>
                            <div class="grid grid-cols-4 gap-4 justify-items-center">
                                {nombresAgrupados[letra].map(artista => (
                                    <AvatarArtista key={artista.nombre} 
                                    nombre={artista.nombre} 
                                    descripcion={artista.descripcion}
                                    onClick={() => handleCardClick(artista.nombre, artista.descripcion)}/>
                                ))}
                            </div>
                            <div className="divider"></div>
                        </div>
                    })}



                    {/* CODIGO HARDCODEADO */}

                    {/* <div><p className='font-bold text-3xl'>#</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>
                    </div>

                    <div className="divider"></div>

                    <div><p className='font-bold text-3xl'>A</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">


                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                    </div> */}
                </div>
            </div>
            <Footer />
        </div>
    )
}