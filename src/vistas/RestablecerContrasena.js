// src/vistas/RestablecerContrasena.js
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function RestablecerContrasena() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ La URL real viene con query string: ?token=...&correo=...
  const token = searchParams.get('token') || '';
  const correo = searchParams.get('correo') || '';

  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal de éxito
  const [successOpen, setSuccessOpen] = useState(false);

  const validarFuerza = (pwd) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pwd);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !correo) {
      setError('El enlace es inválido o está incompleto. Volvé a solicitar la recuperación de contraseña.');
      return;
    }
    if (!validarFuerza(password)) {
      setError('La contraseña debe tener al menos 8 caracteres e incluir letras y números.');
      return;
    }
    if (password !== repeat) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const safeCorreo = (correo || '').trim();
      const safeToken = (token || '').trim();
      const safePass = (password || '').trim();

      // ⇩⇩ Enviar como query params, no en el body
      await api.put('/Usuario/RecoverPass', null, {
        params: {
          Correo: safeCorreo,
          NewPass: safePass,
          Token: safeToken,
        },
      });

      setDone(true);
      setSuccessOpen(true);
    } catch (err) {
      // (opcional) te deja ver qué está devolviendo el backend
      // console.log('RecoverPass error:', err?.response?.status, err?.response?.data);

      const status = err?.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        setError('El enlace venció o es inválido. Solicitá uno nuevo desde "¿Olvidaste tu contraseña?".');
      } else {
        setError('No pudimos completar la operación. Intentá nuevamente en unos minutos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeAndGoHome = () => {
    setSuccessOpen(false);
    navigate('/');
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
                  Restablecer contraseña
                </h1>
                <p className="text-center text-base mt-2 opacity-80">
                  Ingresá tu nueva contraseña y confirmala para continuar.
                </p>

                {(correo || token) && !done && (
                  <div className="mt-4 rounded-xl border border-base-300 bg-base-100 p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="opacity-70">Correo:</span>
                      <span className="rounded-full px-2 py-0.5 border border-base-300 bg-base-200 break-all">
                        {correo || '—'}
                      </span>
                    </div>
                  </div>
                )}

                {!done ? (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="btn btn-sm ml-2"
                          onClick={() => setShowPwd((v) => !v)}
                          disabled={loading}
                        >
                          {showPwd ? 'Ocultar' : 'Ver'}
                        </button>
                      </div>
                      <div className="mt-2">
                        <progress
                          className={`progress w-full ${strength <= 1
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
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="btn btn-sm ml-2"
                          onClick={() => setShowRepeat((v) => !v)}
                          disabled={loading}
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

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="loading loading-spinner mr-2" />
                          Guardando...
                        </>
                      ) : (
                        'Guardar nueva contraseña'
                      )}
                    </button>

                    {!token || !correo ? (
                      <div className="text-center text-sm opacity-70">
                        El enlace es inválido.{' '}
                        <Link className="link link-primary" to="/olvide-contrasena">
                          Solicitá uno nuevo
                        </Link>
                        .
                      </div>
                    ) : null}
                  </form>
                ) : (
                  // Si querés, podés dejar vacío porque el modal se ocupa del feedback.
                  <div className="mt-6 text-center text-sm opacity-70">
                    Procesando…
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

      {/*
        ✅ Modal DaisyUI (checkbox based):
        - Apariencia moderna y responsive
        - Botón OK que navega al inicio
      */}
      <input
        type="checkbox"
        id="modal-exito-reset"
        className="modal-toggle"
        checked={successOpen}
        onChange={() => setSuccessOpen(false)}
      />
      <div className="modal" role="dialog" aria-labelledby="reset-success-title" aria-modal="true">
        <div className="modal-box rounded-2xl">
          <div className="flex items-start gap-3">
            {/* Ícono de éxito */}
            <div className="mt-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-success"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <div>
              <h3 id="reset-success-title" className="text-lg font-semibold">
                ¡Contraseña actualizada!
              </h3>
              <p className="py-2 text-sm opacity-80">
                Tu contraseña se modificó con éxito. Ya podés ingresar con tus nuevas credenciales.
              </p>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary sm:btn-wide"
              onClick={closeAndGoHome}
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
        {/* Cierre al click fuera */}
        <label className="modal-backdrop" onClick={closeAndGoHome}>Cerrar</label>
      </div>
    </div>
  );
}




// import React, { useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// // import api from '../componenteapi/api';

// export default function RestablecerContrasena() {
//   const { token } = useParams(); // /restablecer-contrasena/:token
//   const navigate = useNavigate();

//   const [password, setPassword] = useState('');
//   const [repeat, setRepeat] = useState('');
//   const [showPwd, setShowPwd] = useState(false);
//   const [showRepeat, setShowRepeat] = useState(false);
//   const [error, setError] = useState('');
//   const [done, setDone] = useState(false);

//   // Versión simplificada: mínimo 8, al menos una letra y un número
//   const validarFuerza = (pwd) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pwd);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!validarFuerza(password)) {
//       setError('La contraseña debe tener al menos 8 caracteres e incluir letras y números.');
//       return;
//     }
//     if (password !== repeat) {
//       setError('Las contraseñas no coinciden.');
//       return;
//     }

//     // Simulación (conectar cuando esté el backend):
//     // try {
//     //   await api.post('/auth/reset-password', { token, password });
//     //   setDone(true);
//     // } catch (err) {
//     //   setError('El enlace puede haber expirado o ser inválido. Solicitá uno nuevo.');
//     // }
//     setDone(true);
//     // Opcional: redirigir al login después de unos segundos
//     // setTimeout(() => navigate('/login'), 2000);
//   };

//   const strength = (() => {
//     if (!password) return 0;
//     let s = 0;
//     if (password.length >= 8) s++;
//     if (/[A-Z]/.test(password)) s++;
//     if (/[a-z]/.test(password)) s++;
//     if (/\d/.test(password)) s++;
//     if (/[^A-Za-z0-9]/.test(password)) s++;
//     return Math.min(s, 4);
//   })();

//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex-1 sm:px-10 mb-11">
//         <NavBar />

//         <div className="flex items-center justify-center px-4 py-10">
//           <div className="w-full max-w-lg">
//             <div className="card bg-base-200 shadow-xl">
//               <div className="card-body">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-center">
//                   Restablecer contraseña
//                 </h1>
//                 <p className="text-center text-base mt-2 opacity-80">
//                   Ingresá tu nueva contraseña y confirmala para continuar.
//                 </p>

//                 {!done ? (
//                   <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//                     {token && (
//                       <div className="text-xs opacity-50 text-center">
//                         Token recibido.
//                       </div>
//                     )}

//                     {/* Nueva contraseña */}
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text">Nueva contraseña</span>
//                       </label>
//                       <div className="flex items-center">
//                         <input
//                           type={showPwd ? 'text' : 'password'}
//                           className="input input-bordered flex-1"
//                           placeholder="********"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                           autoComplete="new-password"
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-sm ml-2"
//                           onClick={() => setShowPwd((v) => !v)}
//                         >
//                           {showPwd ? 'Ocultar' : 'Ver'}
//                         </button>
//                       </div>
//                       <div className="mt-2">
//                         <progress
//                           className={`progress w-full ${
//                             strength <= 1
//                               ? 'progress-error'
//                               : strength === 2
//                               ? 'progress-warning'
//                               : 'progress-success'
//                           }`}
//                           value={strength}
//                           max="4"
//                         />
//                         <p className="text-xs opacity-70 mt-1">
//                           Requisitos: mínimo 8 caracteres, incluir letras y números.
//                         </p>
//                       </div>
//                     </div>

//                     {/* Confirmar contraseña */}
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text">Confirmar contraseña</span>
//                       </label>
//                       <div className="flex items-center">
//                         <input
//                           type={showRepeat ? 'text' : 'password'}
//                           className="input input-bordered flex-1"
//                           placeholder="********"
//                           value={repeat}
//                           onChange={(e) => setRepeat(e.target.value)}
//                           required
//                           autoComplete="new-password"
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-sm ml-2"
//                           onClick={() => setShowRepeat((v) => !v)}
//                         >
//                           {showRepeat ? 'Ocultar' : 'Ver'}
//                         </button>
//                       </div>
//                     </div>

//                     {error && (
//                       <div className="alert alert-error mt-2">
//                         <span>{error}</span>
//                       </div>
//                     )}

//                     <button type="submit" className="btn btn-primary w-full">
//                       Guardar nueva contraseña
//                     </button>

//                   </form>
//                 ) : (
//                   <div className="mt-6">
//                     <div className="alert alert-success">
//                       <span>¡Listo! Tu contraseña fue restablecida correctamente.</span>
//                     </div>
//                     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <button className="btn btn-outline w-full" onClick={() => navigate('/')}>
//                         Ir al inicio
//                       </button>
//                       <Link to="/login" className="btn btn-primary w-full">
//                         Iniciar sesión
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <p className="text-center text-xs opacity-60 mt-4">
//               Si no solicitaste este cambio, ignorá el enlace.
//             </p>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
