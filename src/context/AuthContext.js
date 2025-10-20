// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../componenteapi/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1) Rehidratar user desde localStorage al arrancar
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, password, onBlocked }) => {
    try {
      // Comprueba credenciales
      const loginRes = await api.get('/Usuario/Login', {
        params: { Correo: email, Password: password }
      });

      if (loginRes.data !== true) {
        throw new Error('Credenciales inválidas');
      }

      // Trae datos de usuario
      const userRes = await api.get('/Usuario/GetUsuario', {
        params: { Mail: email }
      });

      const lista = userRes.data.usuarios;
      if (!Array.isArray(lista) || lista.length === 0) {
        throw new Error('No se encontró el usuario');
      }

      const userData = lista[0];
      const roles = userData.roles;

      // Bloquear si tiene rol de "Control de entrada"
      if (roles.some(r => r.cdRol === 3)) {
        onBlocked();
        return;
      }

      // Objeto base del usuario logueado (sin imagen)
      const logged = {
        id: userData.idUsuario,
        name: userData.nombre,
        email: userData.correo,
        roles,
      };

      // Guardar en estado y localStorage
      setUser(logged);
      localStorage.setItem('user', JSON.stringify(logged));

    } catch (err) {
      if (err.message === 'Credenciales inválidas') {
        throw err;
      }
      console.error(err);
      throw new Error('Error de conexión, intenta más tarde');
    }
  };

  const logout = () => {
    // (opcional) si en algún momento agregás auth por token:
    try {
      delete api.defaults.headers.common.Authorization;
    } catch (e) { }

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('postLoginRedirect'); // evita redirecciones “fantasma” tras el próximo login
  };


  // 3) Sincronizar user entre pestañas
  useEffect(() => {
    const onStorage = e => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}


// // context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import api from '../componenteapi/api';

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   // 1) Rehidratar user desde localStorage al arrancar
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem('user');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const login = async ({ email, password, onBlocked }) => {
//     try {
//       // Comprueba credenciales
//       const loginRes = await api.get('/Usuario/Login', {
//         params: { Correo: email, Password: password }
//       });

//       if (loginRes.data !== true) {
//         throw new Error('Credenciales inválidas');
//       }

//       // Trae datos de usuario
//       const userRes = await api.get('/Usuario/GetUsuario', {
//         params: { Mail: email }
//       });

//       const lista = userRes.data.usuarios;
//       if (!Array.isArray(lista) || lista.length === 0) {
//         throw new Error('No se encontró el usuario');
//       }

//       const userData = lista[0];
//       const roles = userData.roles; // array de objetos con cdRol y dsRol

//       // Bloquear si tiene rol de "Control de entrada"
//       if (roles.some(r => r.cdRol === 3)) {
//         onBlocked();
//         return;
//       }

//       // Objeto base del usuario logueado
//       const logged = {
//         id: userData.idUsuario,
//         name: userData.nombre,
//         email: userData.correo,
//         roles, // array de objetos con cdRol y dsRol
//       };

//       // Intenta traer imagen de perfil
//       try {
//         const resImg = await api.get('/Media', {
//           params: { IdEntidadMedia: userData.idUsuario }
//         });

//         const img = resImg.data.media?.find(m => !m.mdVideo); // solo imagen
//         if (img) {
//           logged.profileImage = img.url;
//           logged.profileImageId = img.idMedia;
//         }
//       } catch (err) {
//         console.warn('No se encontró imagen de perfil. Se usará ícono por defecto.');
//       }

//       // Guardar en estado y localStorage
//       setUser(logged);
//       localStorage.setItem('user', JSON.stringify(logged));

//     } catch (err) {
//       if (err.message === 'Credenciales inválidas') {
//         throw err;
//       }
//       console.error(err);
//       throw new Error('Error de conexión, intenta más tarde');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   // 3) Sincronizar user entre pestañas
//   useEffect(() => {
//     const onStorage = e => {
//       if (e.key === 'user') {
//         setUser(e.newValue ? JSON.parse(e.newValue) : null);
//       }
//     };
//     window.addEventListener('storage', onStorage);
//     return () => window.removeEventListener('storage', onStorage);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


