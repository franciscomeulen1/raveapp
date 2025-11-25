// src/vistas/MiPerfil.js
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

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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
          params: { IdUsuario: user.id },
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
          cbu: data.cbu || '',
        });

        setSelectedProvincia({
          nombre: data.domicilio?.provincia?.nombre || '',
          id: data.domicilio?.provincia?.codigo || '',
        });
        setSelectedMunicipio({
          nombre: data.domicilio?.municipio?.nombre || '',
          id: data.domicilio?.municipio?.codigo || '',
        });
        setSelectedLocalidad({
          nombre: data.domicilio?.localidad?.nombre || '',
          id: data.domicilio?.localidad?.codigo || '',
        });
      } catch (err) {
        console.error('Error al traer los datos:', err);
      }
    };

    fetchUserData();
  }, [user]);

  // Capitaliza cada palabra (solo para nombre, apellido y dirección)
  const toTitleCase = (str) => {
    return str.replace(/\b\w+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  const handleChange = (field, value) => {
    if (field === 'nombre' || field === 'apellido' || field === 'direccion') {
      const capitalizado = toTitleCase(value);
      setFormData((prev) => ({ ...prev, [field]: capitalizado }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!userData) return;

    const socialsSafe = {
      idSocial: userData.socials?.idSocial ?? 'string',
      mdInstagram: userData.socials?.mdInstagram ?? 'string',
      mdSpotify: userData.socials?.mdSpotify ?? 'string',
      mdSoundcloud: userData.socials?.mdSoundcloud ?? 'string',
    };

    let provinciaPayload = {
      nombre: selectedProvincia?.nombre || '',
      codigo: selectedProvincia?.id || '',
    };
    let municipioPayload = {
      nombre: selectedMunicipio?.nombre || '',
      codigo: selectedMunicipio?.id || '',
    };
    let localidadPayload = {
      nombre: selectedLocalidad?.nombre || '',
      codigo: selectedLocalidad?.id || '',
    };

    // Caso especial CABA
    if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
      provinciaPayload = municipioPayload = localidadPayload = {
        nombre: 'Ciudad Autónoma de Buenos Aires',
        codigo: '02',
      };
    }

    // --- isVerificado ---
    // Del GET viene 0/1 → lo convertimos a boolean
    let isVerificadoActualizado = Boolean(userData.isVerificado);

    // Si el usuario cambió el correo, consideramos que queda no verificado
    if (formData.correo && formData.correo !== userData.correo) {
      isVerificadoActualizado = false;
    }

    const payload = {
      idUsuario: user.id,
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      cbu: formData.cbu || '',
      dni: formData.dni,
      telefono: formData.telefono,
      dtNacimiento: formData.dtNacimiento
        ? new Date(formData.dtNacimiento).toISOString()
        : null,
      // ⬇️ IMPORTANTE: el backend espera true/false
      isVerificado: isVerificadoActualizado,
      cdRoles: userData.roles ? userData.roles.map((r) => r.cdRol) : [],
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

  const handleSendVerificationEmail = async () => {
    const correo = formData.correo || userData?.correo;
    const nombre = formData.nombre || userData?.nombre;

    if (!correo) return;

    setIsSendingEmail(true);
    try {
      const emailBody = {
        to: correo,
        templateData: {
          name: nombre,
          confirmationUrl: 'https://raveapp.com.ar/confirmacion-mail',
        },
      };

      // Mantengo POST como tenías originalmente
      await api.post('/Email/EnviarConfirmarEmail', emailBody);
      setShowEmailModal(true);
    } catch (err) {
      console.error('Fallo al enviar email de confirmación:', err);
      alert('No se pudo enviar el correo de verificación. Intentá de nuevo más tarde.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Usuario organizador (rol 2)
  const esOrganizador = userData?.roles?.some((r) => r.cdRol === 2);

  // Usamos isVerificado (0/1) y lo convertimos a boolean
  const correoVerificado = Boolean(userData?.isVerificado);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 sm:px-10 mb-11">
        <NavBar />
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-3">
          <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

          <EditImagenDePerfil user={user} setUser={setUser} />

          <p className="text-xs mb-5 text-cyan-600">
            Si modificas algun dato personal tuyo, debes clicar el botón{' '}
            <span className="font-semibold">'Confirmar cambios'</span> que se encuentra al final
            de esta página, para que queden tus cambios registrados.
          </p>

          {/* Datos personales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Nombre */}
            <EditableField
              label="Nombre"
              value={formData.nombre || ''}
              onChange={(value) => handleChange('nombre', value)}
            />

            {/* Apellido */}
            <EditableField
              label="Apellido"
              value={formData.apellido || ''}
              onChange={(value) => handleChange('apellido', value)}
            />

            {/* DNI */}
            <EditableField
              label="DNI"
              value={formData.dni || ''}
              onChange={(value) => handleChange('dni', value)}
            />

            {/* Teléfono */}
            <EditableField
              label="Teléfono"
              value={formData.telefono || ''}
              onChange={(value) => handleChange('telefono', value)}
            />

            {/* Correo + estado verificación */}
            <div className="flex flex-col gap-1">
              <EditableField
                label="Correo"
                value={formData.correo || ''}
                onChange={(value) => handleChange('correo', value)}
                type="email"
              />

              {correoVerificado ? (
                <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Correo verificado
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <p className="text-sm text-red-600">Correo aun no verificado</p>
                  <button
                    onClick={handleSendVerificationEmail}
                    disabled={isSendingEmail}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                      isSendingEmail
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {isSendingEmail ? 'Enviando...' : 'Verificar correo'}
                  </button>
                </div>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div className="md:col-start-2 md:row-start-3">
              <EditableField
                label="Fecha de Nacimiento"
                value={formData.dtNacimiento || ''}
                onChange={(value) => handleChange('dtNacimiento', value)}
                type="date"
              />
            </div>

            {/* CBU si es organizador */}
            {esOrganizador && (
              <div className="md:col-start-1 md:row-start-4">
                <EditableField
                  label="CBU"
                  value={formData.cbu || ''}
                  onChange={(value) => handleChange('cbu', value)}
                  type="text"
                />
              </div>
            )}

            {/* Botón cambiar contraseña */}
            <div className="md:col-start-2 md:row-start-4">
              <BotonCambiarContrasena userData={userData} />
            </div>
          </div>

          {/* Domicilio */}
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
                onChange={(value) => handleChange('direccion', value)}
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

      {/* Modal éxito actualización */}
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

      {/* Modal mail de verificación enviado */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-indigo-600 text-2xl font-bold mb-3">Correo enviado</h2>
            <p className="mb-4 text-gray-700">
              Te enviamos un correo electrónico para que puedas verificar tu dirección.
            </p>
            <button
              onClick={() => setShowEmailModal(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



// // MiPerfil.js ...
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

//     const [showEmailModal, setShowEmailModal] = useState(false);
//     const [isSendingEmail, setIsSendingEmail] = useState(false);

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
//                     cbu: data.cbu || '',
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

//     // 👇 agregamos esta función para capitalizar sin perder espacios
//     const toTitleCase = (str) => {
//         return str.replace(/\b\w+/g, (word) => {
//             return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//         });
//     };

//     // 👇 modificamos handleChange para aplicar solo a nombre, apellido y direccion
//     const handleChange = (field, value) => {
//         if (field === 'nombre' || field === 'apellido' || field === 'direccion') {
//             const capitalizado = toTitleCase(value);
//             setFormData(prev => ({ ...prev, [field]: capitalizado }));
//         } else {
//             setFormData(prev => ({ ...prev, [field]: value }));
//         }
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

//         // CABA
//         if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//             provinciaPayload = municipioPayload = localidadPayload = {
//                 nombre: 'Ciudad Autónoma de Buenos Aires',
//                 codigo: '02'
//             };
//         }

//         // si cambió correo, bio = 0
//         let bioActualizada = userData.bio || '';
//         if (formData.correo && formData.correo !== userData.correo) {
//             bioActualizada = '0';
//         }

//         const payload = {
//             idUsuario: user.id,
//             nombre: formData.nombre,
//             apellido: formData.apellido,
//             correo: formData.correo,
//             cbu: formData.cbu || '',
//             dni: formData.dni,
//             telefono: formData.telefono,
//             dtNacimiento: formData.dtNacimiento ? new Date(formData.dtNacimiento).toISOString() : null,
//             bio: bioActualizada,
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

//     const handleSendVerificationEmail = async () => {
//         const correo = formData.correo || userData.correo;
//         const nombre = formData.nombre || userData.nombre;

//         if (!correo) return;

//         setIsSendingEmail(true);
//         try {
//             const emailBody = {
//                 to: correo,
//                 templateData: {
//                     name: nombre,
//                     confirmationUrl: 'http://raveapp.com.ar/confirmacion-mail',
//                 },
//             };

//             await api.post('/Email/EnviarConfirmarEmail', emailBody);
//             setShowEmailModal(true);
//         } catch (err) {
//             console.error('Fallo al enviar email de confirmación:', err);
//             alert('No se pudo enviar el correo de verificación. Intentá de nuevo más tarde.');
//         } finally {
//             setIsSendingEmail(false);
//         }
//     };


//     if (!userData) {
//         return (
//             <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
//                 <NavBar />
//                 <div className="flex-grow flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
//                         <p className="text-gray-600">Cargando datos...</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }

//     // ✅ Detectamos si el usuario es Organizador (rol 2)
//     const esOrganizador = userData?.roles?.some(r => r.cdRol === 2);

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-50">
//             <div className="flex-1 sm:px-10 mb-11">
//                 <NavBar />
//                 <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-3">
//                     <h1 className="text-3xl font-bold mb-6 text-center">Mi Perfil</h1>

//                     <EditImagenDePerfil user={user} setUser={setUser} />

//                     <p className='text-xs mb-5 text-cyan-600'>Si modificas algun dato personal tuyo, debes clicar el botón 'Confirmar cambios' que se encuentra al final de esta página, para que queden tus cambios registrados.</p>

//                     {/* Datos personales */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//                         {/* Nombre */}
//                         <EditableField
//                             label="Nombre"
//                             value={formData.nombre || ''}
//                             onChange={value => handleChange('nombre', value)}
//                         />

//                         {/* Apellido */}
//                         <EditableField
//                             label="Apellido"
//                             value={formData.apellido || ''}
//                             onChange={value => handleChange('apellido', value)}
//                         />

//                         {/* DNI */}
//                         <EditableField
//                             label="DNI"
//                             value={formData.dni || ''}
//                             onChange={value => handleChange('dni', value)}
//                         />

//                         {/* Teléfono */}
//                         <EditableField
//                             label="Teléfono"
//                             value={formData.telefono || ''}
//                             onChange={value => handleChange('telefono', value)}
//                         />

//                         {/* Correo + estado de verificación */}
//                         <div className="flex flex-col gap-1">
//                             <EditableField
//                                 label="Correo"
//                                 value={formData.correo || ''}
//                                 onChange={value => handleChange('correo', value)}
//                                 type="email"
//                             />

//                             {/* chequeamos el bio */}
//                             {userData.bio === '1' ? (
//                                 <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
//                                     {/* tilde */}
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-4 w-4"
//                                         viewBox="0 0 20 20"
//                                         fill="currentColor"
//                                     >
//                                         <path
//                                             fillRule="evenodd"
//                                             d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
//                                             clipRule="evenodd"
//                                         />
//                                     </svg>
//                                     Correo verificado
//                                 </p>
//                             ) : (
//                                 <div className="flex flex-wrap items-center gap-3 mt-1">
//                                     <p className="text-sm text-red-600">
//                                         Correo aun no verificado
//                                     </p>
//                                     <button
//                                         onClick={handleSendVerificationEmail}
//                                         disabled={isSendingEmail}
//                                         className={`px-3 py-1 rounded-md text-xs font-medium transition ${isSendingEmail
//                                             ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                             : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
//                                             }`}
//                                     >
//                                         {isSendingEmail ? 'Enviando...' : 'Verificar correo'}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Fecha de nacimiento */}
//                         <div className="md:col-start-2 md:row-start-3">
//                             <EditableField
//                                 label="Fecha de Nacimiento"
//                                 value={formData.dtNacimiento || ''}
//                                 onChange={value => handleChange('dtNacimiento', value)}
//                                 type="date"
//                             />
//                         </div>

//                         {/* CBU si es organizador */}
//                         {esOrganizador && (
//                             <div className="md:col-start-1 md:row-start-4">
//                                 <EditableField
//                                     label="CBU"
//                                     value={formData.cbu || ''}
//                                     onChange={value => handleChange('cbu', value)}
//                                     type="text"
//                                 />
//                             </div>
//                         )}

//                         {/* Botón cambiar contraseña */}
//                         <div className="md:col-start-2 md:row-start-4">
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

//             {showEmailModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
//                         <h2 className="text-indigo-600 text-2xl font-bold mb-3">Correo enviado</h2>
//                         <p className="mb-4 text-gray-700">
//                             Te enviamos un correo electrónico para que puedas verificar tu dirección.
//                         </p>
//                         <button
//                             onClick={() => setShowEmailModal(false)}
//                             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//                         >
//                             Aceptar
//                         </button>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }