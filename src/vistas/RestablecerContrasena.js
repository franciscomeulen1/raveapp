import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
// import api from '../componenteapi/api';

export default function RestablecerContrasena() {
  const { token } = useParams(); // /restablecer-contrasena/:token
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Versión simplificada: mínimo 8, al menos una letra y un número
  const validarFuerza = (pwd) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFuerza(password)) {
      setError('La contraseña debe tener al menos 8 caracteres e incluir letras y números.');
      return;
    }
    if (password !== repeat) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Simulación (conectar cuando esté el backend):
    // try {
    //   await api.post('/auth/reset-password', { token, password });
    //   setDone(true);
    // } catch (err) {
    //   setError('El enlace puede haber expirado o ser inválido. Solicitá uno nuevo.');
    // }
    setDone(true);
    // Opcional: redirigir al login después de unos segundos
    // setTimeout(() => navigate('/login'), 2000);
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 4);
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 sm:px-10 mb-11">
        <NavBar />

        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h1 className="text-3xl sm:text-4xl font-bold text-center">
                  Restablecer contraseña
                </h1>
                <p className="text-center text-base mt-2 opacity-80">
                  Ingresá tu nueva contraseña y confirmala para continuar.
                </p>

                {!done ? (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {token && (
                      <div className="text-xs opacity-50 text-center">
                        Token recibido.
                      </div>
                    )}

                    {/* Nueva contraseña */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Nueva contraseña</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type={showPwd ? 'text' : 'password'}
                          className="input input-bordered flex-1"
                          placeholder="********"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn btn-sm ml-2"
                          onClick={() => setShowPwd((v) => !v)}
                        >
                          {showPwd ? 'Ocultar' : 'Ver'}
                        </button>
                      </div>
                      <div className="mt-2">
                        <progress
                          className={`progress w-full ${
                            strength <= 1
                              ? 'progress-error'
                              : strength === 2
                              ? 'progress-warning'
                              : 'progress-success'
                          }`}
                          value={strength}
                          max="4"
                        />
                        <p className="text-xs opacity-70 mt-1">
                          Requisitos: mínimo 8 caracteres, incluir letras y números.
                        </p>
                      </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Confirmar contraseña</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type={showRepeat ? 'text' : 'password'}
                          className="input input-bordered flex-1"
                          placeholder="********"
                          value={repeat}
                          onChange={(e) => setRepeat(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn btn-sm ml-2"
                          onClick={() => setShowRepeat((v) => !v)}
                        >
                          {showRepeat ? 'Ocultar' : 'Ver'}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-error mt-2">
                        <span>{error}</span>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full">
                      Guardar nueva contraseña
                    </button>

                  </form>
                ) : (
                  <div className="mt-6">
                    <div className="alert alert-success">
                      <span>¡Listo! Tu contraseña fue restablecida correctamente.</span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button className="btn btn-outline w-full" onClick={() => navigate('/')}>
                        Ir al inicio
                      </button>
                      <Link to="/login" className="btn btn-primary w-full">
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-xs opacity-60 mt-4">
              Si no solicitaste este cambio, ignorá el enlace.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
