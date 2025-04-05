import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Creamos el proveedor (Provider) del contexto
export const AuthProvider = ({ children }) => {
    // Guardamos el usuario en el estado
  const [user, setUser] = useState(null);

  // Cuando se monta el componente, intentamos cargar la sesión guardada en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para iniciar sesión: actualiza el estado y guarda en localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión: elimina el usuario del estado y de localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
 
  // El Provider envuelve a sus hijos y les pasa el valor (user, login y logout)
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
