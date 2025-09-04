// MiPerfil.js con campo CBU condicional para rol Organizador (cdRol === 2)
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
                    // ➕ Inicializamos CBU en el form
                    cbu: data.cbu || '',
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

        // 🚨 Regla CABA
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
            // 🔁 Tomamos CBU del form (no de userData)
            cbu: formData.cbu || '',
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

    // ✅ Detectamos si el usuario es Organizador (rol 2)
    const esOrganizador = userData?.roles?.some(r => r.cdRol === 2);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 sm:px-10 mb-11">
                <NavBar />
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
                    <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

                    <EditImagenDePerfil user={user} setUser={setUser} />

                    {/* Datos personales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {['nombre', 'apellido', 'dni', 'telefono', 'correo'].map(field => (
                            <EditableField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData[field] || ''}
                                onChange={value => handleChange(field, value)}
                            />
                        ))}

                        {/* Fecha de nacimiento -> derecha, misma fila que 'correo' en md+ */}
                        <div className="md:col-start-2 md:row-start-3">
                            <EditableField
                                label="Fecha de Nacimiento"
                                value={formData.dtNacimiento || ''}
                                onChange={value => handleChange('dtNacimiento', value)}
                                type="date"
                            />
                        </div>

                        {/* CBU -> debajo de Correo en md+, y después de Fecha en mobile por orden del DOM */}
                        {esOrganizador && (
                            <div className="md:col-start-1 md:row-start-4">
                                <EditableField
                                    label="CBU"
                                    value={formData.cbu || ''}
                                    onChange={value => handleChange('cbu', value)}
                                    type="text"
                                />
                            </div>
                        )}

                        {/* Botón cambiar contraseña -> derecha, debajo de Fecha en md+ */}
                        <div className="md:col-start-2 md:row-start-4">
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


// // MiPerfil.js con modal de éxito tras PUT exitoso
// import { useState, useEffect, useContext } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';
// import InputUbicacionUsuario from '../components/componentsMiPerfil/InputUbicacionUsuario';
// import { useNavigate } from 'react-router-dom';
// import EditImagenDePerfil from '../components/componentsMiPerfil/EditImagenDePerfil';
// import BotonCambiarContrasena from '../components/componentsMiPerfil/BotonCambiarContrasena';
// import EditableField from '../components/componentsMiPerfil/EditableField';
// import BotonEliminarCuenta from '../components/componentsMiPerfil/BotonEliminarCuenta';

// export default function MiPerfil() {
//     const { user, setUser } = useContext(AuthContext);
//     const [userData, setUserData] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     const [selectedProvincia, setSelectedProvincia] = useState(null);
//     const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//     const [selectedLocalidad, setSelectedLocalidad] = useState(null);

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
//                     dtNacimiento: data.dtNacimiento ? data.dtNacimiento.split('T')[0] : '',
//                     direccion: data.domicilio?.direccion || '',
//                 });
//                 setSelectedProvincia({ nombre: data.domicilio?.provincia?.nombre || '', id: data.domicilio?.provincia?.codigo || '' });
//                 setSelectedMunicipio({ nombre: data.domicilio?.municipio?.nombre || '', id: data.domicilio?.municipio?.codigo || '' });
//                 setSelectedLocalidad({ nombre: data.domicilio?.localidad?.nombre || '', id: data.domicilio?.localidad?.codigo || '' });
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

//         let provinciaPayload = { nombre: selectedProvincia?.nombre || '', codigo: selectedProvincia?.id || '' };
//         let municipioPayload = { nombre: selectedMunicipio?.nombre || '', codigo: selectedMunicipio?.id || '' };
//         let localidadPayload = { nombre: selectedLocalidad?.nombre || '', codigo: selectedLocalidad?.id || '' };

//         // 🚨 Si la provincia es CABA, forzamos que todo tenga ese valor
//         if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//             provinciaPayload = municipioPayload = localidadPayload = {
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

//     if (!userData) return <p className="p-10 animate-pulse text-center text-lg">Cargando datos...</p>;

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-50">
//             <div className="flex-1 sm:px-10 mb-11">
//                 <NavBar />
//                 <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
//                     <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

//                     <EditImagenDePerfil user={user} setUser={setUser} />

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
//                             <BotonCambiarContrasena userData={userData} />
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
//                     <BotonEliminarCuenta />
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
//         </div>
//     );
// }