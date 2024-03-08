import React from 'react';
import { Link } from 'react-router-dom';

export default function AvatarArtista(props) {

    return (
        <div>
            <Link className='grid justify-items-center' to='/artista'>
                <div className="w-32">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                </div>
                <div><p className='font-bold'>{props.nombre}</p></div>
            </Link>
        </div>
    )
}
