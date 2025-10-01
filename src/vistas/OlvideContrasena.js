// src/pages/OlvideContrasena.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function OlvideContrasena() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validarEmail(email)) {
      setError('Ingresá un email válido.');
      return;
    }

    setLoading(true);
    try {
      // 1) Verificar si existe el usuario por mail
      const mail = email.trim();
      const getResp = await api.get(`/Usuario/GetUsuario?Mail=${encodeURIComponent(mail)}`);
      const usuario = getResp?.data?.usuarios?.[0];

      if (!usuario) {
        setError('No encontramos ese correo en RaveApp.');
        return;
      }

      // 2) Enviar email de recuperación
      await api.post('/Email/EnviarPassRecoveryEmail', {
        to: usuario.correo,
        templateData: {
          name: usuario.nombre || 'Usuario',
          recoveryUrl: 'http://localhost:3000/restablecer-contrasena',
        },
      });

      setSent(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setError('El correo electrónico ingresado no está registrado en RaveApp.');
      } else {
        setError('Ocurrió un problema al procesar tu solicitud. Intentá nuevamente en unos minutos.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 👉 Abrir modal de login
  const openLoginModal = () => {
    const modal = document.getElementById('my-modal-login');
    if (modal) {
      modal.checked = true; // DaisyUI: abre el modal
    } else {
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
                        disabled={loading}
                      />
                      {error && <span className="mt-2 text-red-600 text-sm">{error}</span>}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner mr-2" />
                          Enviando...
                        </>
                      ) : (
                        'Enviarme el enlace'
                      )}
                    </button>

                    <div className="text-center text-sm opacity-70">
                      ¿Recordaste tu contraseña?{' '}
                      <button
                        type="button"
                        className="link link-primary"
                        onClick={openLoginModal}
                        disabled={loading}
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  </form>
                ) : (
                  // ✅ Bloque mejorado y responsive para "correo enviado"
                  <div className="mt-6">
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-2xl border border-green-300 bg-success/15 text-green-900 p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        {/* Ícono */}
                        <div className="mt-0.5 shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="M22 4 12 14.01l-3-3" />
                          </svg>
                        </div>

                        {/* Texto */}
                        <div className="space-y-1.5 text-sm sm:text-base leading-relaxed w-full">
                          <p className="font-semibold">¡Correo enviado!</p>
                          <p className="text-green-900/90">
                            Si el correo{' '}
                            <span
                              className="inline-flex max-w-full items-center rounded-full bg-white/70 px-2 py-0.5 font-semibold text-green-800
                                         border border-green-200 align-middle break-all"
                              title={email}
                            >
                              {email}
                            </span>{' '}
                            está registrado, te enviamos un enlace para restablecer tu contraseña.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-base-content/70">
                      Revisá tu bandeja de entrada y también la carpeta de spam. El enlace tendrá una validez limitada.
                    </p>

                    <div className="mt-6 flex justify-center">
                      <Link to="/" className="btn btn-outline">
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



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

// export default function OlvideContrasena() {
//   const [email, setEmail] = useState('');
//   const [sent, setSent] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const validarEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!validarEmail(email)) {
//       setError('Ingresá un email válido.');
//       return;
//     }
//     setSent(true);
//   };

//   // 👉 Abrir modal de login
//   const openLoginModal = () => {
//     const modal = document.getElementById('my-modal-login');
//     if (modal) {
//       modal.checked = true; // DaisyUI: abre el modal
//     } else {
//       // Fallback por si el modal no está montado en esta vista
//       navigate('/');
//       setTimeout(() => {
//         const modalAfter = document.getElementById('my-modal-login');
//         if (modalAfter) modalAfter.checked = true;
//       }, 0);
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex-1 sm:px-10 mb-11">
//         <NavBar />

//         <div className="flex items-center justify-center px-4 py-10">
//           <div className="w-full max-w-lg">
//             <div className="card bg-base-200 shadow-xl">
//               <div className="card-body">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-center">
//                   ¿Olvidaste tu contraseña?
//                 </h1>
//                 <p className="text-center text-base mt-2 opacity-80">
//                   Ingresá tu correo y te enviaremos un enlace para restablecerla.
//                 </p>

//                 {!sent ? (
//                   <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text">Correo electrónico</span>
//                       </label>
//                       <input
//                         type="email"
//                         className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
//                         placeholder="tu@correo.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                       {error && <span className="mt-2 text-error text-sm">{error}</span>}
//                     </div>

//                     <button type="submit" className="btn btn-primary w-full">
//                       Enviarme el enlace
//                     </button>

//                     <div className="text-center text-sm opacity-70">
//                       ¿Recordaste tu contraseña?{' '}
//                       <button
//                         type="button"
//                         className="link link-primary"
//                         onClick={openLoginModal}
//                       >
//                         Iniciar sesión
//                       </button>
//                     </div>
//                   </form>
//                 ) : (
//                   <div className="mt-6">
//                     <div className="alert alert-success">
//                       <span>
//                         Si el correo <strong>{email}</strong> está registrado, te enviamos un enlace para restablecer tu contraseña.
//                       </span>
//                     </div>
//                     <p className="mt-4 text-sm opacity-75">
//                       Revisá tu bandeja de entrada y también la carpeta de spam. El enlace tendrá una validez limitada.
//                     </p>
//                     <div className="mt-6">
//                       <Link to="/" className="btn btn-outline w-full">
//                         Volver al inicio
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
