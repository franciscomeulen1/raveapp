import { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BotonGoogleLogin from '../components/BotonGoogleLogin';

const Register = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    password: '',
    confirmPassword: '',
    dni: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
  });

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const esPasswordSegura = (password) => {
    const tieneLongitud = password.length >= 8;
    const tieneLetra = /[A-Za-z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    return tieneLongitud && tieneLetra && tieneNumero;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!esPasswordSegura(formData.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una letra y un número.');
      return;
    }
    if (!formData.fechaNacimiento) {
      setError('Debes ingresar tu fecha de nacimiento');
      return;
    }

    const payload = {
      domicilio: {
        localidad: { nombre: '', codigo: '' },
        municipio: { nombre: '', codigo: '' },
        provincia: { nombre: '', codigo: '' },
        direccion: '',
        latitud: 0,
        longitud: 0,
      },
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      cbu: '',
      dni: formData.dni,
      telefono: formData.telefono,
      bio: '0',
      password: formData.password,
      socials: {
        idSocial: '',
        mdInstagram: '',
        mdSpotify: '',
        mdSoundcloud: '',
      },
      dtNacimiento: new Date(formData.fechaNacimiento).toISOString(),
    };

    try {
      setSending(true);
      // 1) Crear usuario
      await api.post('/Usuario/CreateUsuario', payload);

      // 2) Enviar correo de confirmación
      const emailBody = {
        to: formData.correo,
        templateData: {
          name: formData.nombre,
          confirmationUrl: 'http://raveapp.com.ar/confirmacion-mail',
        },
      };
      try {
        await api.post('/Email/EnviarConfirmarEmail', emailBody);
      } catch (emailErr) {
        // No bloqueamos el flujo si falla el envío, pero lo registramos
        console.error('Fallo al enviar email de confirmación:', emailErr);
      }

      // 3) Mostrar modal de éxito
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError('Error al registrarse, intenta más tarde');
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async () => {
    try {
      await login({
        email: formData.correo,
        password: formData.password,
        onBlocked: () => { },
      });
      navigate('/');
    } catch (err) {
      console.error('Error al iniciar sesión automáticamente:', err);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sm:px-10 mb-11">
        <header>
          <NavBar />
        </header>

        <div className="flex flex-col items-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-bold mb-4">Registrarse</h1>
            <p className="mb-4">Completa tus datos, o regístrate con Google:</p>
            <BotonGoogleLogin setError={setError} />

            {error && <div className="text-red-500 mb-3">{error}</div>}

            <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
              <label className="block">
                <span>Tu nombre:</span>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Tu nombre"
                  required
                />
              </label>

              <label className="block">
                <span>Tu apellido:</span>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Tu apellido"
                  required
                />
              </label>

              <label className="block">
                <span>Crea una contraseña:</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Tu password"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.
                </p>
              </label>

              <label className="block">
                <span>Confirma tu contraseña:</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Repite tu password"
                  required
                />
              </label>

              <label className="block">
                <span>Tu DNI/Pasaporte:</span>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="123456789"
                  required
                />
              </label>

              <label className="block">
                <span>Tu fecha de nacimiento:</span>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </label>

              <label className="block">
                <span>Tu correo electrónico:</span>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Tu email"
                  required
                />
              </label>

              <label className="block">
                <span>Tu teléfono (sin 0 ni 15):</span>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Tu número de celular"
                  required
                />
              </label>

              <button type="submit" className="btn btn-primary w-full" disabled={sending}>
                {sending ? 'Procesando...' : 'Registrarme'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-green-600 font-bold text-xl mb-3">¡Registro exitoso!</h2>
            <p className="text-gray-700 mb-6">
              Tu registro se realizó con éxito. Te enviamos un correo a <span className="font-semibold">{formData.correo}</span> para
              confirmar tu email. Si no lo ves, revisá la carpeta de spam/promociones.
            </p>
            <button
              className="btn btn-success w-full"
              onClick={handleAccept}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;


// import { useEffect, useState, useContext } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import BotonGoogleLogin from '../components/BotonGoogleLogin';


// const Register = () => {

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//   }, [user, navigate]);

//   const [formData, setFormData] = useState({
//     nombre: '',
//     apellido: '',
//     password: '',
//     confirmPassword: '',
//     dni: '',
//     correo: '',
//     telefono: '',
//     fechaNacimiento: '', // nuevo campo
//   });

//   const [error, setError] = useState('');
//   const [showSuccessModal, setShowSuccessModal] = useState(false);


//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const esPasswordSegura = (password) => {
//     const tieneLongitud = password.length >= 8;
//     const tieneLetra = /[A-Za-z]/.test(password);
//     const tieneNumero = /[0-9]/.test(password);
//     return tieneLongitud && tieneLetra && tieneNumero;
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Las contraseñas no coinciden');
//       return;
//     }

//     if (!esPasswordSegura(formData.password)) {
//       setError('La contraseña debe tener al menos 8 caracteres, una letra y un número.');
//       return;
//     }

//     if (!formData.fechaNacimiento) {
//       setError('Debes ingresar tu fecha de nacimiento');
//       return;
//     }

//     const payload = {
//       domicilio: {
//         localidad: { nombre: '', codigo: '' },
//         municipio: { nombre: '', codigo: '' },
//         provincia: { nombre: '', codigo: '' },
//         direccion: '',
//         latitud: 0,
//         longitud: 0,
//       },
//       nombre: formData.nombre,
//       apellido: formData.apellido,
//       correo: formData.correo,
//       cbu: '',
//       dni: formData.dni,
//       telefono: formData.telefono,
//       // nombreFantasia: formData.nombreFantasia,
//       bio: '0',
//       password: formData.password,
//       socials: {
//         idSocial: '',
//         mdInstagram: '',
//         mdSpotify: '',
//         mdSoundcloud: '',
//       },
//       dtNacimiento: new Date(formData.fechaNacimiento).toISOString(), // fecha de nacimiento del usuario
//     };

//     try {
//       await api.post('/Usuario/CreateUsuario', payload);
//       setShowSuccessModal(true); // mostramos el modal de éxito
//     } catch (err) {
//       console.error(err);
//       setError('Error al registrarse, intenta más tarde');
//     }
//   };

//   const handleAccept = async () => {
//     try {
//       await login({
//         email: formData.correo,
//         password: formData.password,
//         onBlocked: () => { },
//       });
//       navigate('/');
//     } catch (err) {
//       console.error('Error al iniciar sesión automáticamente:', err);
//       navigate('/');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <div className="sm:px-10 mb-11">
//         <header>
//           <NavBar />
//         </header>

//         <div className="flex flex-col items-center">
//           <div className="max-w-md w-full p-6">
//             <h1 className="text-3xl font-bold mb-4">Registrarse</h1>
//             <p className="mb-4">Completa tus datos, o regístrate con Google:</p>
//             {/* <button className="btn btn-outline w-full mb-4">Login with Google</button> */}
//             <BotonGoogleLogin setError={setError} />

//             {error && <div className="text-red-500 mb-3">{error}</div>}

//             <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
//               <label className="block">
//                 <span>Tu nombre:</span>
//                 <input
//                   type="text"
//                   name="nombre"
//                   value={formData.nombre}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Tu nombre"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Tu apellido:</span>
//                 <input
//                   type="text"
//                   name="apellido"
//                   value={formData.apellido}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Tu apellido"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Crea una contraseña:</span>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Tu password"
//                   required
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.
//                 </p>
//               </label>

//               <label className="block">
//                 <span>Confirma tu contraseña:</span>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Repite tu password"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Tu DNI/Pasaporte:</span>
//                 <input
//                   type="text"
//                   name="dni"
//                   value={formData.dni}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="123456789"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Tu fecha de nacimiento:</span>
//                 <input
//                   type="date"
//                   name="fechaNacimiento"
//                   value={formData.fechaNacimiento}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Tu correo electrónico:</span>
//                 <input
//                   type="email"
//                   name="correo"
//                   value={formData.correo}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Tu email"
//                   required
//                 />
//               </label>

//               <label className="block">
//                 <span>Tu teléfono (sin 0 ni 15):</span>
//                 <input
//                   type="text"
//                   name="telefono"
//                   value={formData.telefono}
//                   onChange={handleChange}
//                   className="input input-bordered w-full"
//                   placeholder="Tu número de celular"
//                   required
//                 />
//               </label>

//               <button type="submit" className="btn btn-primary w-full">
//                 Registrarme
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />

//       {/* Modal de éxito */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
//             <h2 className="text-green-600 font-bold text-xl mb-4">¡Registro exitoso!</h2>
//             <button
//               className="btn btn-success w-full"
//               onClick={handleAccept}
//             >
//               Aceptar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Register;