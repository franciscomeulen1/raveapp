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

      // Chequea rol de “Control de entrada”
      const roles = userData.roles.map(r => r.cdRol);
      if (roles.includes(3)) {
        onBlocked();
        return;
      }

      // 2) Login OK: setState y persiste en localStorage
      const logged = {
        id:    userData.idUsuario,
        name:  userData.nombre,
        email: userData.correo,
        roles,
      };
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
    setUser(null);
    localStorage.removeItem('user');
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}




// import React, { createContext, useState, useEffect } from 'react';

// // Creamos el contexto
// export const AuthContext = createContext();

// // Creamos el proveedor (Provider) del contexto
// export const AuthProvider = ({ children }) => {
//     // Guardamos el usuario en el estado
//   const [user, setUser] = useState(null);

//   // Cuando se monta el componente, intentamos cargar la sesión guardada en localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Función para iniciar sesión: actualiza el estado y guarda en localStorage
//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   // Función para cerrar sesión: elimina el usuario del estado y de localStorage
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };
 
//   // El Provider envuelve a sus hijos y les pasa el valor (user, login y logout)
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
