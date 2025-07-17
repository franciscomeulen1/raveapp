import React, { useState } from 'react';

export default function AvatarArtista({ nombre, imagenUrl, onClick }) {
    const imagenDefault = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    const [imagenCargada, setImagenCargada] = useState(false);

    const urlFinal = imagenUrl || imagenDefault;

    return (
        <div>
            <button className='grid justify-items-center' onClick={onClick}>
                <div className="w-32 h-32 relative">
                    {!imagenCargada && (
                        <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300"></div>
                    )}
                    <img
                        src={urlFinal}
                        alt={`Imagen de ${nombre}`}
                        className={`rounded-full object-cover w-32 h-32 transition-opacity duration-300 ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImagenCargada(true)}
                    />
                </div>
                <div className="mt-2 text-center">
                    <p className="font-bold">{nombre}</p>
                </div>
            </button>
        </div>
    );
}



// import React from 'react';

// export default function AvatarArtista({nombre, onClick}) {
//     // console.log(nombre);
//     return (
//         <div>
//             <button className='grid justify-items-center'  onClick={onClick}>
//                 <div className="w-32">
//                     <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="dj" className='rounded-full' />
//                 </div>
//                 <div><p className='font-bold'>{nombre}</p></div>
//             </button>
//         </div>
//     )
// }
