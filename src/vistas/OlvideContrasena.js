import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function OlvideContrasena() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validarEmail(email)) {
      setError('Ingresá un email válido.');
      return;
    }
    setSent(true);
  };

  // 👉 Abrir modal de login
  const openLoginModal = () => {
    const modal = document.getElementById('my-modal-login');
    if (modal) {
      modal.checked = true; // DaisyUI: abre el modal
    } else {
      // Fallback por si el modal no está montado en esta vista
      navigate('/'); 
      setTimeout(() => {
        const modalAfter = document.getElementById('my-modal-login');
        if (modalAfter) modalAfter.checked = true;
      }, 0);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 sm:px-10 mb-11">
        <NavBar />

        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-center text-base mt-2 opacity-80">
                  Ingresá tu correo y te enviaremos un enlace para restablecerla.
                </p>

                {!sent ? (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Correo electrónico</span>
                      </label>
                      <input
                        type="email"
                        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {error && <span className="mt-2 text-error text-sm">{error}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                      Enviarme el enlace
                    </button>

                    <div className="text-center text-sm opacity-70">
                      ¿Recordaste tu contraseña?{' '}
                      <button
                        type="button"
                        className="link link-primary"
                        onClick={openLoginModal}
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-6">
                    <div className="alert alert-success">
                      <span>
                        Si el correo <strong>{email}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
                      </span>
                    </div>
                    <p className="mt-4 text-sm opacity-75">
                      Revisá tu bandeja de entrada y también la carpeta de spam. El enlace tendrá una validez limitada.
                    </p>
                    <div className="mt-6">
                      <Link to="/" className="btn btn-outline w-full">
                        Volver al inicio
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
