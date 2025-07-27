// MiPerfil.js con modal de éxito tras PUT exitoso
import { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import InputUbicacionUsuario from '../components/componentsMiPerfil/InputUbicacionUsuario';
import { useNavigate } from 'react-router-dom';
import EditImagenDePerfil from '../components/componentsMiPerfil/EditImagenDePerfil';
import BotonCambiarContrasena from '../components/componentsMiPerfil/BotonCambiarContrasena';
import EditableField from '../components/componentsMiPerfil/EditableField';
import BotonEliminarCuenta from '../components/componentsMiPerfil/BotonEliminarCuenta';

export default function MiPerfil() {
    const { user, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [selectedProvincia, setSelectedProvincia] = useState(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const res = await api.get('/Usuario/GetUsuario', {
                    params: { IdUsuario: user.id }
                });
                const data = res.data.usuarios[0];
                setUserData(data);
                setFormData({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    dni: data.dni || '',
                    telefono: data.telefono || '',
                    correo: data.correo || '',
                    dtNacimiento: data.dtNacimiento ? data.dtNacimiento.split('T')[0] : '',
                    direccion: data.domicilio?.direccion || '',
                });
                setSelectedProvincia({ nombre: data.domicilio?.provincia?.nombre || '', id: data.domicilio?.provincia?.codigo || '' });
                setSelectedMunicipio({ nombre: data.domicilio?.municipio?.nombre || '', id: data.domicilio?.municipio?.codigo || '' });
                setSelectedLocalidad({ nombre: data.domicilio?.localidad?.nombre || '', id: data.domicilio?.localidad?.codigo || '' });
            } catch (err) {
                console.error('Error al traer los datos:', err);
            }
        };

        fetchUserData();
    }, [user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!userData) return;

        const socialsSafe = {
            idSocial: userData.socials?.idSocial ?? 'string',
            mdInstagram: userData.socials?.mdInstagram ?? 'string',
            mdSpotify: userData.socials?.mdSpotify ?? 'string',
            mdSoundcloud: userData.socials?.mdSoundcloud ?? 'string',
        };

        let provinciaPayload = { nombre: selectedProvincia?.nombre || '', codigo: selectedProvincia?.id || '' };
        let municipioPayload = { nombre: selectedMunicipio?.nombre || '', codigo: selectedMunicipio?.id || '' };
        let localidadPayload = { nombre: selectedLocalidad?.nombre || '', codigo: selectedLocalidad?.id || '' };

        // 🚨 Si la provincia es CABA, forzamos que todo tenga ese valor
        if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
            provinciaPayload = municipioPayload = localidadPayload = {
                nombre: 'Ciudad Autónoma de Buenos Aires',
                codigo: '02'
            };
        }

        const payload = {
            idUsuario: user.id,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.correo,
            cbu: userData.cbu || '',
            dni: formData.dni,
            telefono: formData.telefono,
            dtNacimiento: formData.dtNacimiento ? new Date(formData.dtNacimiento).toISOString() : null,
            bio: userData.bio || '',
            cdRoles: userData.roles ? userData.roles.map(r => r.cdRol) : [],
            socials: socialsSafe,
            domicilio: {
                provincia: provinciaPayload,
                municipio: municipioPayload,
                localidad: localidadPayload,
                direccion: formData.direccion,
                latitud: 0,
                longitud: 0,
            },
        };

        console.log('Payload que se enviará al PUT:', payload);

        try {
            await api.put('/Usuario/UpdateUsuario', payload);
            setShowSuccessModal(true);
        } catch (err) {
            console.error('Error al actualizar datos:', err);
            alert('Error al actualizar los datos. Intenta más tarde.');
        }
    };

    if (!userData) return <p className="p-10 animate-pulse text-center text-lg">Cargando datos...</p>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
                    <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

                    <EditImagenDePerfil user={user} setUser={setUser} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['nombre', 'apellido', 'dni', 'telefono', 'correo'].map(field => (
                            <EditableField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData[field] || ''}
                                onChange={value => handleChange(field, value)}
                            />
                        ))}
                        <div className="flex flex-col">
                            <EditableField
                                label="Fecha de Nacimiento"
                                value={formData.dtNacimiento || ''}
                                onChange={value => handleChange('dtNacimiento', value)}
                                type="date"
                            />
                            <BotonCambiarContrasena userData={userData} />
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">Tu domicilio:</h2>
                        <InputUbicacionUsuario
                            initialProvincia={userData.domicilio?.provincia?.nombre || ''}
                            initialMunicipio={userData.domicilio?.municipio?.nombre || ''}
                            initialLocalidad={userData.domicilio?.localidad?.nombre || ''}
                            onUbicacionChange={({ provincia, municipio, localidad }) => {
                                setSelectedProvincia(provincia);
                                setSelectedMunicipio(municipio);
                                setSelectedLocalidad(localidad);
                            }}
                        />
                        <div className="mt-4">
                            <EditableField
                                label="Dirección"
                                value={formData.direccion || ''}
                                onChange={value => handleChange('direccion', value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg"
                        >
                            Confirmar cambios
                        </button>
                    </div>
                    <BotonEliminarCuenta />
                </div>
            </div>
            <Footer />

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                        <h2 className="text-green-600 text-2xl font-bold mb-4">¡Cambios guardados!</h2>
                        <p className="mb-4">Tus datos fueron actualizados exitosamente.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


// // DatosPersonales.js con modal de éxito tras PUT exitoso
// import { useState, useEffect, useContext } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';
// import InputUbicacionUsuario from '../components/InputUbicacionUsuario';
// import { useNavigate } from 'react-router-dom';

// export default function MiPerfil() {
//     const { user, setUser } = useContext(AuthContext);
//     const [userData, setUserData] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     const [selectedProvincia, setSelectedProvincia] = useState(null);
//     const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//     const [selectedLocalidad, setSelectedLocalidad] = useState(null);

//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [passwordData, setPasswordData] = useState({
//         oldPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//     });

//     const [profileImage, setProfileImage] = useState(null); // url actual o null
//     const [profileImageId, setProfileImageId] = useState(null); // idMedia actual si existe
//     const [newImagePreview, setNewImagePreview] = useState(null);
//     const [newImageFile, setNewImageFile] = useState(null);
//     const [imageError, setImageError] = useState('');


//     const navigate = useNavigate();

//     useEffect(() => {
//         if (user === null) {
//             navigate('/');
//         }
//     }, [user, navigate]);

//     useEffect(() => {
//         if (!user) return;

//         const fetchUserData = async () => {
//             try {
//                 // 1. Traer datos personales del usuario
//                 const res = await api.get('/Usuario/GetUsuario', {
//                     params: { IdUsuario: user.id }
//                 });
//                 const data = res.data.usuarios[0];
//                 setUserData(data);
//                 setFormData({
//                     nombre: data.nombre || '',
//                     apellido: data.apellido || '',
//                     dni: data.dni || '',
//                     telefono: data.telefono || '',
//                     correo: data.correo || '',
//                     // nombreFantasia: data.nombreFantasia || '',
//                     dtNacimiento: data.dtNacimiento ? data.dtNacimiento.split('T')[0] : '',
//                     direccion: data.domicilio?.direccion || '',
//                 });
//                 setSelectedProvincia({ nombre: data.domicilio?.provincia?.nombre || '', id: data.domicilio?.provincia?.codigo || '' });
//                 setSelectedMunicipio({ nombre: data.domicilio?.municipio?.nombre || '', id: data.domicilio?.municipio?.codigo || '' });
//                 setSelectedLocalidad({ nombre: data.domicilio?.localidad?.nombre || '', id: data.domicilio?.localidad?.codigo || '' });

//                 // 2. Traer imagen de perfil del usuario (si existe)
//                 try {
//                     const resImg = await api.get('/Media', {
//                         params: { IdEntidadMedia: user.id }
//                     });

//                     if (resImg.data.media && resImg.data.media.length > 0) {
//                         const img = resImg.data.media.find(m => !m.mdVideo); // solo imagen
//                         if (img) {
//                             setProfileImage(img.url);
//                             setProfileImageId(img.idMedia);
//                         }
//                     }
//                 } catch (err) {
//                     // Si es 404 (sin imagen), ignoramos. Si no, lo mostramos.
//                     if (err.response && err.response.status !== 404) {
//                         console.error('Error al obtener imagen de perfil:', err);
//                     }
//                 }

//             } catch (err) {
//                 console.error('Error al traer los datos:', err);
//             }
//         };

//         fetchUserData();
//     }, [user]);


//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleSubmit = async () => {
//         if (!userData) return;

//         const socialsSafe = {
//             idSocial: userData.socials?.idSocial ?? 'string',
//             mdInstagram: userData.socials?.mdInstagram ?? 'string',
//             mdSpotify: userData.socials?.mdSpotify ?? 'string',
//             mdSoundcloud: userData.socials?.mdSoundcloud ?? 'string',
//         };

//         let provinciaPayload = {
//             nombre: selectedProvincia?.nombre || '',
//             codigo: selectedProvincia?.id || ''
//         };
//         let municipioPayload = {
//             nombre: selectedMunicipio?.nombre || '',
//             codigo: selectedMunicipio?.id || ''
//         };
//         let localidadPayload = {
//             nombre: selectedLocalidad?.nombre || '',
//             codigo: selectedLocalidad?.id || ''
//         };

//         // 🚨 Si la provincia es CABA, forzamos que todo tenga ese valor
//         if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//             provinciaPayload = {
//                 nombre: 'Ciudad Autónoma de Buenos Aires',
//                 codigo: '02'
//             };
//             municipioPayload = {
//                 nombre: 'Ciudad Autónoma de Buenos Aires',
//                 codigo: '02'
//             };
//             localidadPayload = {
//                 nombre: 'Ciudad Autónoma de Buenos Aires',
//                 codigo: '02'
//             };
//         }

//         const payload = {
//             idUsuario: user.id,
//             nombre: formData.nombre,
//             apellido: formData.apellido,
//             correo: formData.correo,
//             cbu: userData.cbu || '',
//             dni: formData.dni,
//             telefono: formData.telefono,
//             // nombreFantasia: formData.nombreFantasia,
//             dtNacimiento: formData.dtNacimiento ? new Date(formData.dtNacimiento).toISOString() : null,
//             bio: userData.bio || '',
//             cdRoles: userData.roles ? userData.roles.map(r => r.cdRol) : [],
//             socials: socialsSafe,
//             domicilio: {
//                 provincia: provinciaPayload,
//                 municipio: municipioPayload,
//                 localidad: localidadPayload,
//                 direccion: formData.direccion,
//                 latitud: 0,
//                 longitud: 0,
//             },
//         };

//         console.log('Payload que se enviará al PUT:', payload);

//         try {
//             await api.put('/Usuario/UpdateUsuario', payload);
//             setShowSuccessModal(true);
//         } catch (err) {
//             console.error('Error al actualizar datos:', err);
//             alert('Error al actualizar los datos. Intenta más tarde.');
//         }
//     };

//     const handlePasswordChange = async () => {
//         const { oldPassword, newPassword, confirmPassword } = passwordData;

//         if (!oldPassword || !newPassword || !confirmPassword) {
//             return alert('Por favor completá todos los campos.');
//         }

//         if (newPassword !== confirmPassword) {
//             return alert('Las nuevas contraseñas no coinciden.');
//         }

//         try {
//             // Paso 1: Validar la contraseña actual
//             const loginRes = await api.get('/Usuario/Login', {
//                 params: {
//                     Correo: userData.correo,
//                     Password: oldPassword,
//                 }
//             });

//             if (loginRes.data !== true) {
//                 return alert('La contraseña actual es incorrecta.');
//             }

//             // Paso 2: Cambiar contraseña si la anterior es correcta
//             await api.put(`/Usuario/RecoverPass`, null, {
//                 params: {
//                     Correo: userData.correo,
//                     NewPass: newPassword,
//                 }
//             });

//             alert('Contraseña actualizada con éxito.');
//             setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
//             setShowPasswordModal(false);
//         } catch (err) {
//             console.error('Error al cambiar contraseña:', err);
//             alert('Ocurrió un error al cambiar la contraseña.');
//         }
//     };



//     if (!userData) return <p className="p-10 animate-pulse text-center text-lg">Cargando datos...</p>;

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-50">
//             <div className="flex-1 sm:px-10 mb-11">
//                 <NavBar />
//                 <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
//                     <h1 className="text-3xl font-bold mb-6 text-center">Mis Datos Personales</h1>

//                     <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-6">
//                         <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
//                             {newImagePreview || profileImage ? (
//                                 <img
//                                     src={newImagePreview || profileImage}
//                                     alt="Foto de perfil"
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="absolute inset-0 flex items-center justify-center text-gray-500">Sin imagen</div>
//                             )}
//                         </div>

//                         <div className="flex flex-col items-start gap-2 w-full max-w-xs">
//                             <label
//                                 htmlFor="fileInput"
//                                 className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm font-medium"
//                             >
//                                 Seleccionar imagen
//                             </label>
//                             <input
//                                 id="fileInput"
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={(e) => {
//                                     const file = e.target.files[0];
//                                     if (file) {
//                                         const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//                                         const maxSize = 2 * 1024 * 1024; // 2MB

//                                         if (!validTypes.includes(file.type)) {
//                                             setImageError('El archivo debe ser una imagen JPG, JPEG o PNG.');
//                                             setNewImageFile(null);
//                                             setNewImagePreview(null);
//                                             return;
//                                         }

//                                         if (file.size > maxSize) {
//                                             setImageError('La imagen no puede pesar más de 2MB.');
//                                             setNewImageFile(null);
//                                             setNewImagePreview(null);
//                                             return;
//                                         }

//                                         const reader = new FileReader();
//                                         reader.onloadend = () => {
//                                             setNewImagePreview(reader.result);
//                                             setNewImageFile(file);
//                                             setImageError('');
//                                         };
//                                         reader.readAsDataURL(file);
//                                     }
//                                 }}
//                             />
//                             <p className="text-xs text-gray-500">Formatos permitidos: JPG, JPEG o PNG. Máximo 2MB.</p>
//                             {imageError && <p className="text-sm text-red-600">{imageError}</p>}

//                             {profileImage && !newImagePreview && (
//                                 <button
//                                     onClick={async () => {
//                                         if (!profileImageId) return;
//                                         try {
//                                             await api.delete(`/Media/${profileImageId}`);
//                                             setProfileImage(null);
//                                             setProfileImageId(null);
//                                             alert('Imagen eliminada con éxito.');
//                                         } catch (err) {
//                                             console.error('Error al eliminar imagen:', err);
//                                             alert('Ocurrió un error al eliminar la imagen.');
//                                         }
//                                     }}
//                                     className="text-sm text-red-600 hover:text-red-800 underline mt-1"
//                                 >
//                                     Eliminar imagen
//                                 </button>
//                             )}

//                             {newImagePreview && !imageError && (
//                                 <div className="flex gap-2 mt-2">
//                                     <button
//                                         className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
//                                         onClick={async () => {
//                                             try {
//                                                 if (profileImageId) {
//                                                     await api.delete(`/Media/${profileImageId}`);
//                                                 }

//                                                 const formData = new FormData();
//                                                 formData.append('IdEntidadMedia', user.id);
//                                                 formData.append('File', newImageFile);

//                                                 await api.post('/Media', formData);

//                                                 const resImg = await api.get('/Media', {
//                                                     params: { IdEntidadMedia: user.id }
//                                                 });

//                                                 const nueva = resImg.data.media.find(m => !m.mdVideo);
//                                                 if (nueva) {
//                                                     setProfileImage(nueva.url);
//                                                     setProfileImageId(nueva.idMedia);

//                                                     // 🔁 Actualizamos la imagen en el contexto
//                                                     setUser(prev => ({
//                                                         ...prev,
//                                                         profileImage: nueva.url,
//                                                         profileImageId: nueva.idMedia,
//                                                     }));
//                                                 }


//                                                 setNewImagePreview(null);
//                                                 setNewImageFile(null);
//                                                 alert('Imagen de perfil actualizada con éxito.');
//                                             } catch (err) {
//                                                 console.error('Error al actualizar imagen:', err);
//                                                 alert('Error al actualizar imagen.');
//                                             }
//                                         }}
//                                     >
//                                         Aceptar
//                                     </button>
//                                     <button
//                                         className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
//                                         onClick={() => {
//                                             setNewImagePreview(null);
//                                             setNewImageFile(null);
//                                             setImageError('');
//                                         }}
//                                     >
//                                         Cancelar
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>




//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {['nombre', 'apellido', 'dni', 'telefono', 'correo'].map(field => (
//                             <EditableField
//                                 key={field}
//                                 label={field.charAt(0).toUpperCase() + field.slice(1)}
//                                 value={formData[field] || ''}
//                                 onChange={value => handleChange(field, value)}
//                             />
//                         ))}
//                         <div className="flex flex-col">
//                             <EditableField
//                                 label="Fecha de Nacimiento"
//                                 value={formData.dtNacimiento || ''}
//                                 onChange={value => handleChange('dtNacimiento', value)}
//                                 type="date"
//                             />
//                             <button
//                                 onClick={() => setShowPasswordModal(true)}
//                                 className="mt-6 self-start bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-200 transition text-sm font-medium shadow-sm"
//                             >
//                                 Cambiar contraseña
//                             </button>
//                         </div>
//                     </div>

//                     <div className="mt-8">
//                         <h2 className="text-xl font-semibold mb-2">Tu domicilio:</h2>
//                         <InputUbicacionUsuario
//                             initialProvincia={userData.domicilio?.provincia?.nombre || ''}
//                             initialMunicipio={userData.domicilio?.municipio?.nombre || ''}
//                             initialLocalidad={userData.domicilio?.localidad?.nombre || ''}
//                             onUbicacionChange={({ provincia, municipio, localidad }) => {
//                                 setSelectedProvincia(provincia);
//                                 setSelectedMunicipio(municipio);
//                                 setSelectedLocalidad(localidad);
//                             }}
//                         />
//                         <div className="mt-4">
//                             <EditableField
//                                 label="Dirección"
//                                 value={formData.direccion || ''}
//                                 onChange={value => handleChange('direccion', value)}
//                             />
//                         </div>
//                     </div>


//                     <div className="flex justify-center mt-8">
//                         <button
//                             onClick={handleSubmit}
//                             className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg"
//                         >
//                             Confirmar cambios
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <Footer />

//             {showSuccessModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
//                         <h2 className="text-green-600 text-2xl font-bold mb-4">¡Cambios guardados!</h2>
//                         <p className="mb-4">Tus datos fueron actualizados exitosamente.</p>
//                         <button
//                             onClick={() => setShowSuccessModal(false)}
//                             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//                         >
//                             Aceptar
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {showPasswordModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
//                         <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Cambiar contraseña</h2>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
//                                 <input
//                                     type="password"
//                                     value={passwordData.oldPassword}
//                                     onChange={e => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
//                                     className="w-full px-3 py-2 border rounded-md text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
//                                 <input
//                                     type="password"
//                                     value={passwordData.newPassword}
//                                     onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
//                                     className="w-full px-3 py-2 border rounded-md text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
//                                 <input
//                                     type="password"
//                                     value={passwordData.confirmPassword}
//                                     onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
//                                     className="w-full px-3 py-2 border rounded-md text-sm"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                             <button
//                                 onClick={() => setShowPasswordModal(false)}
//                                 className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
//                             >
//                                 Cancelar
//                             </button>
//                             <button
//                                 onClick={handlePasswordChange}
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                             >
//                                 Confirmar
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }

// const EditableField = ({ label, value, onChange, type = 'text' }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [tempValue, setTempValue] = useState(value);

//     useEffect(() => {
//         setTempValue(value);
//     }, [value]);

//     const handleBlur = () => {
//         setIsEditing(false);
//         onChange(tempValue);
//     };

//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <div className="flex items-center space-x-2">
//                 {isEditing ? (
//                     <input
//                         type={type}
//                         value={tempValue}
//                         onChange={e => setTempValue(e.target.value)}
//                         onBlur={handleBlur}
//                         autoFocus
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                     />
//                 ) : (
//                     <span className="text-gray-800 text-sm">{value}</span>
//                 )}
//                 <span
//                     className="text-indigo-500 hover:text-indigo-700 cursor-pointer"
//                     onClick={() => setIsEditing(true)}
//                 >✏️</span>
//             </div>
//         </div>
//     );
// };