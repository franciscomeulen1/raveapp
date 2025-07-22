import React, { useEffect, useState } from 'react';
import api from '../componenteapi/api';

export default function AvatarGroup({ idArtista, refreshTrigger }) {
    const [imagenesUsuarios, setImagenesUsuarios] = useState([]);

    useEffect(() => {
        const fetchImagenesUsuarios = async () => {
            try {
                const res = await api.get(`/Artista/GetImgLikesArtista?id=${idArtista}`);
                const idsUsuarios = res.data || [];

                const idsLimitados = idsUsuarios.slice(0, 4);

                const promesas = idsLimitados.map(async (idUsuario) => {
                    try {
                        const imgRes = await api.get(`/Media?idEntidadMedia=${idUsuario}`);
                        const url = imgRes.data.media?.[0]?.url;
                        return url ? { id: idUsuario, url } : null;
                    } catch {
                        return null;
                    }
                });

                const resultados = await Promise.all(promesas);
                const urlsFiltradas = resultados.filter(Boolean);

                setImagenesUsuarios(urlsFiltradas);
            } catch (error) {
                if (error.response?.status === 404) {
                    // No hay usuarios con foto => limpiar lista
                    setImagenesUsuarios([]);
                } else {
                    console.error('Error al obtener imágenes de usuarios que dieron like:', error);
                }
            }
        };

        if (idArtista) {
            fetchImagenesUsuarios();
        }
    }, [idArtista, refreshTrigger]); // 👈 Se vuelve a ejecutar si refreshTrigger cambia

    if (imagenesUsuarios.length === 0) return null;

    return (
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
            {imagenesUsuarios.map((usuario) => (
                <div key={usuario.id} className="avatar">
                    <div className="w-12">
                        <img src={usuario.url} alt="Foto de perfil" />
                    </div>
                </div>
            ))}
        </div>
    );
}



// import React from 'react';

// export default function AvatarGroup() {
//     return (
//         <div>
//             <div className="avatar-group -space-x-6 rtl:space-x-reverse">
//                 <div className="avatar">
//                     <div className="w-12">
//                         <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="imagen de perfil miniatura"/>
//                     </div>
//                 </div>
//                 <div className="avatar">
//                     <div className="w-12">
//                         <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="imagen de perfil miniatura"/>
//                     </div>
//                 </div>
//                 <div className="avatar">
//                     <div className="w-12">
//                         <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="imagen de perfil miniatura"/>
//                     </div>
//                 </div>
//                 <div className="avatar">
//                     <div className="w-12">
//                         <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="imagen de perfil miniatura"/>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }