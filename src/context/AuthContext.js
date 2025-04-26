// context/AuthContext.js
import React, { createContext, useState } from 'react';
import api from '../componenteapi/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email, password, onBlocked }) => {
    try {
      // 1) Compruebo credenciales (boolean)
      const loginRes = await api.get('/Usuario/Login', {
        params: { Correo: email, Password: password }
      });
      if (loginRes.data !== true) {
        throw new Error('Credenciales inválidas');
      }
  
      // 2) TRAER EL USUARIO (array en .usuarios)
      const userRes = await api.get('/Usuario/GetUsuario', {
        params: { Mail: email }
      });
      const lista = userRes.data.usuarios;
      if (!Array.isArray(lista) || lista.length === 0) {
        throw new Error('No se encontró el usuario');
      }
      const userData = lista[0];
  
      // 3) Chequeo rol “Control de entrada”
      const roles = userData.roles.map(r => r.cdRol);
      if (roles.includes(3)) {
        onBlocked();
        return;
      }
  
      // 4) Login OK
      setUser({
        id:    userData.idUsuario,
        name:  userData.nombre,
        email: userData.correo,
        roles,
      });
    } catch (err) {
      if (err.message === 'Credenciales inválidas') {
        throw err;
      }
      console.error(err);
      throw new Error('Error de conexión, intenta más tarde');
    }
  };

  const logout = () => setUser(null);

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
