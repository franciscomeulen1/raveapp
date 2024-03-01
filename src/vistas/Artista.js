import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Instagram from '../iconos/instagram.png';
import Spotify from "../iconos/spotify.png";
import Soundcloud from "../iconos/soundcloud.png";
import HeartNoLike from "../iconos/heart-nolike.png"
import AvatarGroup from '../components/AvatarGroup';

export default function Artista() {
    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <div className='flex'>
                    <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Nombre del artista</h1>
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
                 <p className='font-semibold text-lg ml-3'>A 98 personas les gusta esto.</p>
                 </div>
 
                {/* -------------------------------------------------------- */}

                <div className='md:flex sm:mx-28 mt-5 space-y-5'>
                <div className='image-full'>
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full md:max-w-sm' />
                </div>
                <div className='pl-5 font-medium'>
                    <p>INFORMACION DEL ARTISTA - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                </div>

            </div>
            <Footer />
        </div>
    )
}