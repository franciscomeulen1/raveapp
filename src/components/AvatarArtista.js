import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AvatarArtista({ nombre, imagenUrl, idArtista }) {
    const imagenDefault = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
    const [imagenCargada, setImagenCargada] = useState(false);

    const urlFinal = imagenUrl || imagenDefault;

    return (
        <div>
            <Link to={`/artistas/${idArtista}`} className="grid justify-items-center">
                <div
                    className="relative rounded-full overflow-hidden
                               w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                >
                    {/* Skeleton mientras carga */}
                    {!imagenCargada && (
                        <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300" />
                    )}

                    <img
                        src={urlFinal}
                        alt={`Imagen de ${nombre}`}
                        loading="lazy"                        // <-- 🚀 lazy load
                        width={112}                           // <-- pista de layout máx ancho/alto
                        height={112}                          // <-- pista de layout máx ancho/alto
                        className={`block w-full h-full object-cover object-center
                                   transition-opacity duration-300
                                   ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImagenCargada(true)}
                    />
                </div>

                <div className="mt-2 text-center">
                    <p className="font-bold text-sm sm:text-base text-center break-words max-w-[90px]">
                        {nombre}
                    </p>
                </div>
            </Link>
        </div>
    );
}


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function AvatarArtista({ nombre, imagenUrl, idArtista }) {
//     const imagenDefault = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
//     const [imagenCargada, setImagenCargada] = useState(false);

//     const urlFinal = imagenUrl || imagenDefault;

//     return (
//         <div>
//             <Link to={`/artistas/${idArtista}`} className="grid justify-items-center">
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative">
//                     {!imagenCargada && (
//                         <div className="absolute inset-0 animate-pulse rounded-full bg-gray-300"></div>
//                     )}
//                     <img
//                         src={urlFinal}
//                         alt={`Imagen de ${nombre}`}
//                         className={`rounded-full object-cover w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transition-opacity duration-300 ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
//                         onLoad={() => setImagenCargada(true)}
//                     />
//                 </div>
//                 <div className="mt-2 text-center">
//                     <p className="font-bold text-sm sm:text-base text-center break-words max-w-[90px]">{nombre}</p>
//                 </div>
//             </Link>
//         </div>
//     );
// }