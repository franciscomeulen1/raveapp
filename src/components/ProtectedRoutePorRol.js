// components/ProtectedRoutePorRol.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoutePorRol({ children, rolesPermitidos = [] }) {
  const { user } = useContext(AuthContext);

  // No logueado
  if (!user) return <Navigate to="/" replace />;

  // Extraer códigos de roles
  const codigosDelUsuario = user.roles.map(r => r.cdRol);

  // Verificar si al menos un rol coincide
  const tieneRolPermitido = rolesPermitidos.some(rol => codigosDelUsuario.includes(rol));

  if (!tieneRolPermitido) return <Navigate to="/" replace />;

  return children;
}
