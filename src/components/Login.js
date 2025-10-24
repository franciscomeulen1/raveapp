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
        const shouldRedirect = redirectTo && window.location.pathname === '/precrearevento';

        // limpiar siempre para evitar claves viejas
        localStorage.removeItem('postLoginRedirect');

        if (shouldRedirect) {
          navigate(redirectTo, { replace: true });
        }
        // si no, NO navegamos: te quedás donde estabas

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