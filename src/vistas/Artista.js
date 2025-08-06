import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import Instagram from '../iconos/instagram.png';
import Spotify from "../iconos/spotify.png";
import Soundcloud from "../iconos/soundcloud.png";
import AvatarGroup from '../components/AvatarGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as whiteHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as redHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';

export default function Artista() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [artista, setArtista] = useState(null);
    const [imagenUrl, setImagenUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagenCargada, setImagenCargada] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [refreshAvatars, setRefreshAvatars] = useState(false);

    useEffect(() => {
        const fetchArtista = async () => {
            try {
                const url = user
                    ? `/Artista/GetArtista?idArtista=${id}&idUsuario=${user.id}`
                    : `/Artista/GetArtista?idArtista=${id}`;

                const response = await api.get(url);
                const data = response.data.artistas;

                if (data && data.length > 0) {
                    const artistaData = data[0];
                    setArtista(artistaData);
                    setIsLiked(artistaData.isFavorito === 1);
                    setLikesCount(artistaData.likes || 0);
                } else {
                    setError("Artista no encontrado");
                }
            } catch (err) {
                console.error("Error al obtener el artista:", err);
                setError("Hubo un problema al cargar el artista.");
            } finally {
                setLoading(false);
            }
        };

        fetchArtista();
        window.scrollTo(0, 0);
    }, [id, user]);

    useEffect(() => {
        const fetchImagen = async () => {
            try {
                const mediaRes = await api.get(`/Media?idEntidadMedia=${id}`);
                const url = mediaRes.data.media?.[0]?.url || null;
                setImagenUrl(url);
            } catch (err) {
                console.warn('No se pudo cargar la imagen del artista', err);
                setImagenUrl(null);
            }
        };

        fetchImagen();
    }, [id]);

    const handleLikeClick = async () => {
        try {
            await api.put('/Usuario/ArtistaFavorito', {
                idUsuario: user.id,
                idArtista: artista.idArtista
            });

            setIsLiked(prev => !prev);
            setLikesCount(prev => isLiked ? Math.max(prev - 1, 0) : prev + 1);
            setRefreshAvatars(prev => !prev);
        } catch (error) {
            console.error('Error al hacer like al artista:', error);
            alert('Ocurrió un error al intentar guardar tu favorito.');
        }
    };

    if (loading) return <div className="text-center mt-20">Cargando artista...</div>;
    if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

    const { nombre, socials, bio, idArtista } = artista;
    const instagramUrl = socials?.mdInstagram;
    const spotifyUrl = socials?.mdSpotify;
    const soundcloudUrl = socials?.mdSoundcloud;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />

                <div className="px-4 mt-2 sm:mt-4 sm:px-10 mb-6 flex flex-wrap items-center gap-4">
                    <h1 className='text-2xl sm:text-3xl font-bold underline underline-offset-8'>{nombre}</h1>
                    <div className="flex gap-3 flex-wrap">
                        <a href={spotifyUrl || "#"} target="_blank" rel="noreferrer">
                            <img src={Spotify} alt="spotify" className={`w-8 sm:w-10 ${!spotifyUrl ? 'grayscale opacity-50' : ''}`} />
                        </a>
                        <a href={soundcloudUrl || "#"} target="_blank" rel="noreferrer">
                            <img src={Soundcloud} alt="soundcloud" className={`w-8 sm:w-10 ${!soundcloudUrl ? 'grayscale opacity-50' : ''}`} />
                        </a>
                        <a href={instagramUrl || "#"} target="_blank" rel="noreferrer">
                            <img src={Instagram} alt="instagram" className={`w-8 sm:w-10 ${!instagramUrl ? 'grayscale opacity-50' : ''}`} />
                        </a>
                    </div>
                </div>

                {/* Likes y avatar group */}
                <div className='flex px-10 items-center gap-3'>
                    {user && (
                        <button
                            onClick={handleLikeClick}
                            className="w-15 h-15 flex items-center justify-center"
                        >
                            <FontAwesomeIcon
                                icon={isLiked ? redHeart : whiteHeart}
                                size="2x"
                                className={`transition-transform duration-200 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:scale-110`}
                            />
                        </button>
                    )}
                    <AvatarGroup idArtista={idArtista} refreshTrigger={refreshAvatars} />
                    {likesCount > 0 && (
                        <p className='font-medium text-sm sm:text-base'>
                            A {likesCount} {likesCount === 1 ? 'persona le gusta esto.' : 'personas les gusta esto.'}
                        </p>
                    )}
                </div>

                {/* Imagen + bio */}
                <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-y-6 sm:px-8 px-4 mt-5'>
                    <div className="sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-center">
                        <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-100">
                            {imagenUrl === null && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold text-center px-4 text-sm">
                                    Artista sin foto
                                </div>
                            )}
                            {imagenUrl && (
                                <>
                                    {!imagenCargada && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <img
                                        src={imagenUrl}
                                        alt={`Imagen de ${nombre}`}
                                        onLoad={() => setImagenCargada(true)}
                                        className={`rounded-full object-cover w-full h-full transition-opacity duration-500 ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className='md:col-span-2 lg:col-span-2 pl-5 font-medium'>
                        <p>{bio}</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}


// import React, { useEffect, useState, useContext } from 'react';
// import { useLocation, useParams } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import Instagram from '../iconos/instagram.png';
// import Spotify from "../iconos/spotify.png";
// import Soundcloud from "../iconos/soundcloud.png";
// import AvatarGroup from '../components/AvatarGroup';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart as whiteHeart } from '@fortawesome/free-regular-svg-icons';
// import { faHeart as redHeart } from '@fortawesome/free-solid-svg-icons';
// import { AuthContext } from '../context/AuthContext';


// export default function Artista() {
//     const location = useLocation();
//     const { id } = useParams();

//     const { user } = useContext(AuthContext);

//     const [artista, setArtista] = useState(location.state?.artista || null);
//     const [imagenUrl, setImagenUrl] = useState(null);
//     const [loading, setLoading] = useState(!artista);
//     const [error, setError] = useState(null);
//     const [imagenCargada, setImagenCargada] = useState(false);
//     const [isLiked, setIsLiked] = useState(false);
//     const [likesCount, setLikesCount] = useState(0);
//     const [refreshAvatars, setRefreshAvatars] = useState(false);


//     useEffect(() => {
//         const fetchArtista = async () => {
//             try {
//                 setLoading(true);

//                 const url = user
//                     ? `/Artista/GetArtista?idArtista=${id}&idUsuario=${user.id}`
//                     : `/Artista/GetArtista?idArtista=${id}`;

//                 const response = await api.get(url);
//                 const data = response.data.artistas;

//                 if (data && data.length > 0) {
//                     setArtista(data[0]);
//                     setIsLiked(data[0].isFavorito === 1);
//                     setLikesCount(data[0].likes || 0);
//                 } else {
//                     setError("Artista no encontrado");
//                 }
//             } catch (err) {
//                 console.error("Error al obtener el artista:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchArtista();
//         window.scrollTo(0, 0);
//     }, [id, user]); // 👈 Importante: solo depende de id y user

//     useEffect(() => {
//         const fetchImagen = async () => {
//             try {
//                 const mediaRes = await api.get(`/Media?idEntidadMedia=${id}`);
//                 const url = mediaRes.data.media?.[0]?.url || null;
//                 setImagenUrl(url);
//             } catch (err) {
//                 console.warn('No se pudo cargar la imagen del artista', err);
//                 setImagenUrl(null);
//             }
//         };

//         fetchImagen();
//     }, [id]); // ✅ Solo depende del ID del artista



//     if (loading) return <div className="text-center mt-20">Cargando artista...</div>;
//     if (error) return <div className="text-center mt-20 text-red-600">Hubo un error: {error}</div>;


//     const instagramUrl = artista.socials?.mdInstagram;
//     const spotifyUrl = artista.socials?.mdSpotify;
//     const soundcloudUrl = artista.socials?.mdSoundcloud;


//     const handleLikeClick = async () => {
//         try {
//             await api.put('/Usuario/ArtistaFavorito', {
//                 idUsuario: user.id,
//                 idArtista: artista.idArtista
//             });

//             if (isLiked) {
//                 setIsLiked(false);
//                 setLikesCount(prev => Math.max(prev - 1, 0));
//             } else {
//                 setIsLiked(true);
//                 setLikesCount(prev => prev + 1);
//             }

//             setRefreshAvatars(prev => !prev); // 👈 Fuerza el refresco del avatar group

//         } catch (error) {
//             console.error('Error al hacer like al artista:', error);
//             alert('Ocurrió un error al intentar guardar tu favorito.');
//         }
//     };




//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1 sm:px-10 mb-11">
//                 <NavBar />
//                 <div className="px-4 mt-2 sm:mt-4 sm:px-10 mb-6 flex flex-wrap items-center gap-4">
//                     <h1 className='text-2xl sm:text-3xl font-bold underline underline-offset-8'>{artista.nombre}</h1>

//                     <div className="flex gap-3 flex-wrap">
//                         <a href={spotifyUrl || "#"} target="_blank" rel="noreferrer">
//                             <img src={Spotify} alt="spotify" className={`w-8 sm:w-10 ${!spotifyUrl ? 'grayscale opacity-50' : ''}`} />
//                         </a>
//                         <a href={soundcloudUrl || "#"} target="_blank" rel="noreferrer">
//                             <img src={Soundcloud} alt="soundcloud" className={`w-8 sm:w-10 ${!soundcloudUrl ? 'grayscale opacity-50' : ''}`} />
//                         </a>
//                         <a href={instagramUrl || "#"} target="_blank" rel="noreferrer">
//                             <img src={Instagram} alt="instagram" className={`w-8 sm:w-10 ${!instagramUrl ? 'grayscale opacity-50' : ''}`} />
//                         </a>
//                     </div>
//                 </div>


//                 {/* Likes y avatar group */}
//                 <div className='flex px-10 items-center gap-3'>
//                     {user && (
//                         <button
//                             onClick={handleLikeClick}
//                             className="w-15 h-15 flex items-center justify-center"
//                         >
//                             <FontAwesomeIcon
//                                 icon={isLiked ? redHeart : whiteHeart}
//                                 size="2x"
//                                 className={`transition-transform duration-200 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:scale-110`}
//                             />
//                         </button>
//                     )}
//                     <AvatarGroup idArtista={artista.idArtista} refreshTrigger={refreshAvatars} />
//                     {likesCount > 0 && (
//                         <p className='font-medium text-sm sm:text-base'>
//                             A {likesCount} {likesCount === 1 ? 'persona le gusta esto.' : 'personas les gusta esto.'}
//                         </p>
//                     )}
//                 </div>

//                 {/* Imagen + bio */}
//                 <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-y-6 sm:px-8 px-4 mt-5'>
//                     <div className="sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-center">
//                         <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-100">

//                             {/* Si NO hay imagen, mostrar círculo con texto */}
//                             {imagenUrl === null && (
//                                 <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold text-center px-4 text-sm">
//                                     Artista sin foto
//                                 </div>
//                             )}

//                             {/* Si HAY imagen, mostrarla con spinner hasta que cargue */}
//                             {imagenUrl && (
//                                 <>
//                                     {!imagenCargada && (
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
//                                         </div>
//                                     )}
//                                     <img
//                                         src={imagenUrl}
//                                         alt={`Imagen de ${artista.nombre}`}
//                                         onLoad={() => setImagenCargada(true)}
//                                         className={`rounded-full object-cover w-full h-full transition-opacity duration-500 ${imagenCargada ? 'opacity-100' : 'opacity-0'}`}
//                                     />
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     <div className='md:col-span-2 lg:col-span-2 pl-5 font-medium'>
//                         <p>{artista.bio}</p>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }