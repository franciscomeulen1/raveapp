// COMPONENTE PARA botón de “Crear Evento”, modificando la navegación al hacer clic en él para que primero verifique si el usuario está logueado. Si lo está, va a /crearevento; si no lo está, va a /precrearevento.

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function ProtectedLink({ to, fallback = '/precrearevento', children, ...props }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate(to);
    } else {
      // Guarda la intención de navegar al destino
      localStorage.setItem('postLoginRedirect', to);
      navigate(fallback);
    }
  };

  return (
    <li>
      <a
        href={to}
        onClick={handleClick}
        className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
        {...props}
      >
        {children}
      </a>
    </li>
  );
}
