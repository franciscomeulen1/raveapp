import React, { useEffect, useState } from 'react';
import api from '../componenteapi/api';

function MiniAvatar({ url, alt }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="avatar">
            <div className="w-12 rounded-full overflow-hidden bg-gray-200">
                <img
                    src={url}
                    alt={alt}
                    width={48}           // w-12 = 3rem = 48px
                    height={48}
                    onLoad={() => setLoaded(true)}
                    className={`
                        block w-full h-full object-cover object-center
                        transition-all duration-500
                        ${loaded
                            ? 'opacity-100 blur-0 scale-100'
                            : 'opacity-50 blur-md scale-110'
                        }
                    `}
                />
            </div>
        </div>
    );
}

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
                    setImagenesUsuarios([]);
                } else {
                    console.error('Error al obtener imágenes de usuarios que dieron like:', error);
                }
            }
        };

        if (idArtista) {
            fetchImagenesUsuarios();
        }
    }, [idArtista, refreshTrigger]);

    if (imagenesUsuarios.length === 0) return null;

    return (
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
            {imagenesUsuarios.map((usuario) => (
                <MiniAvatar
                    key={usuario.id}
                    url={usuario.url}
                    alt="Foto de perfil"
                />
            ))}
        </div>
    );
}

