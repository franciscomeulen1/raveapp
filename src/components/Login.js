import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BotonGoogleLogin from '../components/BotonGoogleLogin';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login({
        email,
        password,
        onBlocked: () => setBlocked(true),
      });

      if (!blocked) {
        setEmail('');
        setPassword('');
        document.getElementById('my-modal-login').checked = false;

        const redirectTo = localStorage.getItem('postLoginRedirect');
        if (redirectTo) {
          localStorage.removeItem('postLoginRedirect');
          navigate(redirectTo);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOlvideContrasena = () => {
    navigate(`/olvide-contrasena`);
  };

  return (
    <>
      <label
        htmlFor="my-modal-login"
        className="btn btn-xs sm:btn-sm md:btn-md modal-button btn-primary"
        onClick={() => {
          if (window.location.pathname === '/register') {
            localStorage.setItem('postLoginRedirect', '/');
          }
        }}
      >
        Ingresar
      </label>

      <input type="checkbox" id="my-modal-login" className="modal-toggle" />
      <label htmlFor="my-modal-login" className="modal cursor-pointer">
        <form className="modal-box" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">Iniciar Sesión</h3>

          <input
            type="email"
            placeholder="Tu email"
            className="input input-bordered w-full mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Tu contraseña"
            className="input input-bordered w-full mb-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {blocked && (
            <p className="text-yellow-600 mb-2">
              Tus credenciales son válidas únicamente para la app de validación de entradas.
            </p>
          )}

          <div className="modal-action flex-col gap-3 items-center">
            <button type="submit" className="btn w-full">Ingresar</button>
            <BotonGoogleLogin setError={setError} />
            <button type="button" className="btn btn-ghost" onClick={handleOlvideContrasena}>¿Olvidaste la contraseña?</button>
          </div>
        </form>
      </label>
    </>
  );
}

export default Login;



// import { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import api from '../componenteapi/api';

// function Login() {
//   const { login, setUser } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [blocked, setBlocked] = useState(false);
//   const [error, setError] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setError('');
//     try {
//       await login({
//         email,
//         password,
//         onBlocked: () => setBlocked(true),
//       });
//       if (!blocked) {
//         setEmail('');
//         setPassword('');
//         document.getElementById('my-modal-login').checked = false;

//         const redirectTo = localStorage.getItem('postLoginRedirect');
//         if (redirectTo) {
//           localStorage.removeItem('postLoginRedirect');
//           navigate(redirectTo);
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const generateRandomPassword = (length = 16) => {
//     const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//       const randomIdx = Math.floor(Math.random() * charset.length);
//       password += charset[randomIdx];
//     }
//     return password;
//   };


//   const handleGoogleSuccess = async credentialResponse => {
//     const decoded = jwtDecode(credentialResponse.credential);
//     const { email, given_name, family_name } = decoded;

//     try {
//       const res = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
//       const usuarios = res.data.usuarios;

//       let usuario;

//       if (usuarios.length > 0) {
//         usuario = usuarios[0];
//       } else {
//         const payload = {
//           domicilio: {
//             localidad: { nombre: '', codigo: '' },
//             municipio: { nombre: '', codigo: '' },
//             provincia: { nombre: '', codigo: '' },
//             direccion: '',
//             latitud: 0,
//             longitud: 0,
//           },
//           nombre: given_name,
//           apellido: family_name,
//           correo: email,
//           cbu: '',
//           dni: '',
//           telefono: '',
//           bio: '',
//           password: generateRandomPassword(),
//           socials: {
//             idSocial: '',
//             mdInstagram: '',
//             mdSpotify: '',
//             mdSoundcloud: '',
//           },
//           dtNacimiento: new Date().toISOString(),
//         };


//         try {
//           const crearRes = await api.post('/Usuario/CreateUsuario', payload);
//           console.log('Respuesta del POST CreateUsuario:', crearRes.data);
//         } catch (error) {
//           console.error('Error al crear usuario con Google:', error.response?.data || error.message);
//           setError('Error al crear el usuario. Intente más tarde.');
//           return;
//         }


//         // ahora buscás al usuario ya creado
//         const buscarRes = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
//         const encontrados = buscarRes.data.usuarios;

//         if (!encontrados || encontrados.length === 0) {
//           throw new Error('Usuario creado pero no encontrado');
//         }

//         usuario = encontrados[0];

//       }

//       const logged = {
//         id: usuario.idUsuario,
//         name: usuario.nombre,
//         email: usuario.correo,
//         roles: usuario.roles || [{ cdRol: 0, dsRol: 'Usuario' }],
//       };

//       setUser(logged);
//       localStorage.setItem('user', JSON.stringify(logged));
//       document.getElementById('my-modal-login').checked = false;
//       navigate('/');
//     } catch (err) {
//       console.error('Error en login con Google:', err);
//       setError('No se pudo iniciar sesión con Google');
//     }
//   };

//   return (
//     <>
//       <label
//         htmlFor="my-modal-login"
//         className="btn modal-button btn-primary"
//         onClick={() => {
//           if (window.location.pathname === '/register') {
//             localStorage.setItem('postLoginRedirect', '/');
//           }
//         }}
//       >
//         Ingresar
//       </label>

//       <input type="checkbox" id="my-modal-login" className="modal-toggle" />
//       <label htmlFor="my-modal-login" className="modal cursor-pointer">
//         <form className="modal-box" onSubmit={handleSubmit}>
//           <h3 className="font-bold text-lg mb-4">Iniciar Sesión</h3>

//           <input
//             type="email"
//             placeholder="Tu email"
//             className="input input-bordered w-full mb-2"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Tu contraseña"
//             className="input input-bordered w-full mb-2"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//           />

//           {error && <p className="text-red-500 mb-2">{error}</p>}
//           {blocked && (
//             <p className="text-yellow-600 mb-2">
//               Tus credenciales son válidas únicamente para la app de validación de entradas.
//             </p>
//           )}

//           <div className="modal-action flex-col gap-3 items-center">
//             <button type="submit" className="btn w-full">Ingresar</button>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => setError('Falló el inicio con Google')}
//             />

//             <button type="button" className="btn btn-ghost">¿Olvidaste la contraseña?</button>
//           </div>
//         </form>
//       </label>
//     </>
//   );
// }

// export default Login;


