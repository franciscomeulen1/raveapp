import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
// import api from '../componenteapi/api'; // <- descomentar cuando conectes verificación real

export default function ConfirmacionMail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Permite que el backend redirija con ?status=success|error&msg=...
  const params = new URLSearchParams(location.search);
  const qsStatus = params.get('status'); // "success" | "error" | null
  const qsMsg = params.get('msg');

  // eslint-disable-next-line
  const [status, setStatus] = useState(qsStatus || 'success'); // por defecto "success"
  // eslint-disable-next-line
  const [message, setMessage] = useState(
    qsMsg ||
      '¡Tu correo fue verificado correctamente! Tu cuenta ya está activa y podés iniciar sesión.'
  );

  // Si en el futuro querés validar un token aquí, ejemplo:
  // useEffect(() => {
  //   const token = params.get('token');
  //   if (!token) return;
  //   (async () => {
  //     try {
  //       await api.post('/auth/verify-email', { token });
  //       setStatus('success');
  //       setMessage('¡Tu correo fue verificado correctamente! Tu cuenta ya está activa.');
  //     } catch (err) {
  //       setStatus('error');
  //       setMessage('El enlace es inválido o ha expirado. Solicitá uno nuevo.');
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 👉 Abrir modal de login (DaisyUI)
  const openLoginModal = () => {
    const modal = document.getElementById('my-modal-login');
    if (modal) {
      modal.checked = true;
    } else {
      // Fallback por si el modal vive en la home
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
              <div className="card-body items-center text-center">
                {status === 'success' ? (
                  <>
                    <div className="text-5xl">✅</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                      ¡Correo verificado!
                    </h1>
                    <p className="text-base mt-2 opacity-80">{message}</p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <Link to="/" className="btn btn-outline w-full">
                        Ir al inicio
                      </Link>
                      <button className="btn btn-primary w-full" onClick={openLoginModal}>
                        Iniciar sesión
                      </button>
                    </div>

                    <p className="text-xs opacity-60 mt-4">
                      Si no solicitaste esta verificación, podés ignorar este mensaje.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">⚠️</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                      No se pudo verificar tu correo
                    </h1>
                    <p className="text-base mt-2 opacity-80">
                      {message || 'El enlace puede haber expirado o ser inválido. Probá solicitar uno nuevo.'}
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <Link to="/" className="btn btn-outline w-full">
                        Volver al inicio
                      </Link>
                      <Link to="/olvide-contrasena" className="btn w-full">
                        Solicitar nuevo enlace
                      </Link>
                    </div>
                  </>
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
