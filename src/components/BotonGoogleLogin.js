// src/components/BotonGoogleLogin.js
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../componenteapi/api';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BotonGoogleLogin = ({ setError }) => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const generateRandomPassword = (length = 16) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  };

  const handleGoogleSuccess = async credentialResponse => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, given_name, family_name } = decoded;

    let usuario = null;

    try {
      // Intentamos obtener el usuario
      const res = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
      const usuarios = res.data.usuarios;
      if (usuarios.length > 0) {
        usuario = usuarios[0];
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Usuario no encontrado → lo creamos
        const payload = {
          domicilio: {
            localidad: { nombre: '', codigo: '' },
            municipio: { nombre: '', codigo: '' },
            provincia: { nombre: '', codigo: '' },
            direccion: '',
            latitud: 0,
            longitud: 0,
          },
          nombre: given_name,
          apellido: family_name,
          correo: email,
          cbu: '',
          dni: '',
          telefono: '',
          bio: '1',
          password: generateRandomPassword(),
          socials: { idSocial: '', mdInstagram: '', mdSpotify: '', mdSoundcloud: '' },
          dtNacimiento: null,
        };

        try {
          await api.post('/Usuario/CreateUsuario', payload);
          const buscarRes = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
          const encontrados = buscarRes.data.usuarios;
          if (!encontrados || encontrados.length === 0) {
            throw new Error('Usuario creado pero no encontrado');
          }
          usuario = encontrados[0];
        } catch (createErr) {
          console.error('Error al crear usuario con Google:', createErr);
          setError('Error al crear el usuario. Intente más tarde.');
          return;
        }
      } else {
        // Otro error inesperado
        console.error('Error al buscar usuario con Google:', err);
        setError('Error al buscar el usuario. Intente más tarde.');
        return;
      }
    }

    // Finalmente, si tenemos un usuario, lo seteamos
    if (usuario) {
      const logged = {
        id: usuario.idUsuario,
        name: usuario.nombre,
        email: usuario.correo,
        roles: usuario.roles || [{ cdRol: 0, dsRol: 'Usuario' }],
      };

      setUser(logged);
      localStorage.setItem('user', JSON.stringify(logged));

      // Cerrar modal de login
      const cb = document.getElementById('my-modal-login');
      if (cb) cb.checked = false;

      const redirectTo = localStorage.getItem('postLoginRedirect');
      const shouldRedirect = redirectTo && window.location.pathname === '/precrearevento';

      // limpiar siempre
      localStorage.removeItem('postLoginRedirect');

      if (shouldRedirect) {
        navigate(redirectTo, { replace: true });
      } else if (window.location.pathname === '/register') {
        navigate('/');
      }
      // caso contrario: te quedás en la página actual

    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => setError('Falló el inicio con Google')}
    />
  );
};

export default BotonGoogleLogin;


// // src/componentes/BotonGoogleLogin.js
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import api from '../componenteapi/api';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const BotonGoogleLogin = ({ setError }) => {
//     const { setUser } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const generateRandomPassword = (length = 16) => {
//         const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
//         let password = '';
//         for (let i = 0; i < length; i++) {
//             password += charset[Math.floor(Math.random() * charset.length)];
//         }
//         return password;
//     };

//     const handleGoogleSuccess = async credentialResponse => {
//         const decoded = jwtDecode(credentialResponse.credential);
//         const { email, given_name, family_name } = decoded;

//         let usuario = null;

//         try {
//             // Intentamos obtener el usuario
//             const res = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
//             const usuarios = res.data.usuarios;

//             if (usuarios.length > 0) {
//                 usuario = usuarios[0];
//             }
//         } catch (err) {
//             if (err.response?.status === 404) {
//                 // Usuario no encontrado → lo creamos
//                 const payload = {
//                     domicilio: {
//                         localidad: { nombre: '', codigo: '' },
//                         municipio: { nombre: '', codigo: '' },
//                         provincia: { nombre: '', codigo: '' },
//                         direccion: '',
//                         latitud: 0,
//                         longitud: 0,
//                     },
//                     nombre: given_name,
//                     apellido: family_name,
//                     correo: email,
//                     cbu: '',
//                     dni: '',
//                     telefono: '',
//                     bio: '',
//                     password: generateRandomPassword(),
//                     socials: {
//                         idSocial: '',
//                         mdInstagram: '',
//                         mdSpotify: '',
//                         mdSoundcloud: '',
//                     },
//                     dtNacimiento: null,
//                 };

//                 try {
//                     await api.post('/Usuario/CreateUsuario', payload);
//                     const buscarRes = await api.get('/Usuario/GetUsuario', { params: { Mail: email } });
//                     const encontrados = buscarRes.data.usuarios;
//                     if (!encontrados || encontrados.length === 0) {
//                         throw new Error('Usuario creado pero no encontrado');
//                     }
//                     usuario = encontrados[0];
//                 } catch (createErr) {
//                     console.error('Error al crear usuario con Google:', createErr);
//                     setError('Error al crear el usuario. Intente más tarde.');
//                     return;
//                 }
//             } else {
//                 // Otro error inesperado
//                 console.error('Error al buscar usuario con Google:', err);
//                 setError('Error al buscar el usuario. Intente más tarde.');
//                 return;
//             }
//         }

//         // Finalmente, si tenemos un usuario, lo seteamos
//         if (usuario) {
//             const logged = {
//                 id: usuario.idUsuario,
//                 name: usuario.nombre,
//                 email: usuario.correo,
//                 roles: usuario.roles || [{ cdRol: 0, dsRol: 'Usuario' }],
//             };

//             setUser(logged);
//             localStorage.setItem('user', JSON.stringify(logged));
//             document.getElementById('my-modal-login').checked = false;
//             navigate('/');
//         }
//     };


//     return (
//         <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => setError('Falló el inicio con Google')}
//         />
//     );
// };

// export default BotonGoogleLogin;