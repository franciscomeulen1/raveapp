import React from 'react';

export default function AvatarArtista({nombre, onClick}) {
    // console.log(nombre);
    return (
        <div>
            <button className='grid justify-items-center'  onClick={onClick}>
                <div className="w-32">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                </div>
                <div><p className='font-bold'>{nombre}</p></div>
            </button>
        </div>
    )
}
