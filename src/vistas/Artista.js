import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Instagram from '../iconos/instagram.png';
import Spotify from "../iconos/spotify.png";
import Soundcloud from "../iconos/soundcloud.png";
import HeartNoLike from "../iconos/heart-nolike.png"
import AvatarGroup from '../components/AvatarGroup';
import { useParams, useLocation } from 'react-router-dom';

export default function Artista(props) {
    
    const location = useLocation();
    const { nombre } = useParams();
    const descripcion = location.state.descripcion;
    const likes = location.state.likes;

    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <div className="sm:px-10 mb-11"  style={{ paddingBottom: '60px' }}>
                <NavBar />
                <div className='flex'>
                    {/* <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Nombre del artista</h1> */}
                    <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>{nombre}</h1>
                    <div className='mt-4'>
                        <a href="https://www.spotify.com" target="_blank" rel='noreferrer'>
                            <img src={Spotify} alt="spotify" width="55%" />
                        </a>
                    </div>
                    <div className='mt-4'>
                        <a href="https://www.soundcloud.com" target="_blank" rel='noreferrer'>
                            <img src={Soundcloud} alt="soundcloud" width="55%" />
                        </a>
                    </div>
                    <div className='mt-4'>
                        <a href="https://www.instagram.com" target="_blank" rel='noreferrer'>
                            <img src={Instagram} alt="instagram" width="55%" />
                        </a>
                    </div>
                </div>

                {/* -------------------------------------------------------- */}

                 <div className='flex px-10 items-center'>
                <div><img src={HeartNoLike} alt="heart" width="80%" /></div>
                 <AvatarGroup />
                 <p className='font-semibold text-lg ml-3'>A {likes} personas les gusta esto.</p>
                 </div>
 
                {/* -------------------------------------------------------- */}

                <div className='grid md:grid-cols-4 lg:grid-cols-3 sm:mx-28 mt-5 space-y-5'>
                <div className='image-full sm:col-span-3 md:col-span-2 lg:col-span-1'>
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="dj" className='rounded-full sm:w-full md:max-w-sm' />
                </div>
                <div className='md:col-span-2 lg:col-span-2 pl-5 font-medium'>
                    {/* <p>INFORMACION DEL ARTISTA - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> */}
                    <p>{descripcion}</p>
                </div>

                </div>

            </div>
            <Footer style={{ position: 'absolute', bottom: 0, width: '100%' }}/>
        </div>
    )
    }