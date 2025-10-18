// src/routes/RequireAuthCrearEvento.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function RequireAuthCrearEvento({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Guarda a dónde quería ir para usarlo post-login si querés
    localStorage.setItem('postLoginRedirect', location.pathname);
    return <Navigate to="/precrearevento" replace />;
  }

  return children;
}
