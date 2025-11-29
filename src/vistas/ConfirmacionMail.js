// src/vistas/ConfirmacionMail.js
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';

export default function ConfirmacionMail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const correo = searchParams.get('correo') || '';

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Estamos verificando tu correo. Esto puede tomar unos segundos...');

  // Estados para "reenviar verificación"
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const confirmationUrl = 'https://raveapp.com.ar/confirmacion-mail';

  const guessNameFromEmail = (email) => {
    if (!email) return 'Usuario';
    const local = email.split('@')[0] || '';
    const first = local.split(/[.\-_]/)[0] || 'Usuario';
    return first.charAt(0).toUpperCase() + first.slice(1);
  };

  useEffect(() => {
    const confirmar = async () => {
      if (!token || !correo) {
        setStatus('error');
        setMessage('Faltan datos para la verificación (token o correo).');
        return;
      }

      try {
        // 1) Confirmar cuenta
        await api.put('/Usuario/ConfirmarCuenta', { correo, token });

        // Si el backend llega hasta acá, ya setea isVerificado = true internamente.
        setStatus('success');
        setMessage('¡Tu correo fue verificado correctamente! Tu cuenta ya está activa y podés iniciar sesión.');
      } catch (err) {
        console.error('Error al confirmar cuenta:', err);
        const serverMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Hubo un problema al verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.';
        setStatus('error');
        setMessage(serverMsg);
      }
    };

    confirmar();
  }, [correo, token]);

  const openLoginModal = () => {
    const modal = document.getElementById('my-modal-login');
    if (modal) {
      modal.checked = true;
    } else {
      navigate('/');
      setTimeout(() => {
        const modalAfter = document.getElementById('my-modal-login');
        if (modalAfter) modalAfter.checked = true;
      }, 0);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setResendLoading(true);
    try {
      await api.put('/Email/EnviarConfirmarEmail', {
        to: correo,
        templateData: {
          name: guessNameFromEmail(correo),
          confirmationUrl,
        },
      });
      setResendMsg('Listo. Te enviamos un nuevo correo de verificación. Revisá tu bandeja de entrada o spam.');
    } catch (err) {
      console.error('Error al reenviar verificación:', err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'No pudimos reenviar el correo en este momento. Intentá nuevamente más tarde.';
      setResendMsg(serverMsg);
    } finally {
      setResendLoading(false);
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
                {status === 'loading' && (
                  <>
                    <span className="loading loading-spinner loading-lg" />
                    <h1 className="text-2xl font-bold mt-3">Verificando tu correo…</h1>
                    <p className="text-base mt-2 opacity-80">{message}</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="text-5xl">✅</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">¡Correo verificado!</h1>
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
                )}

                {status === 'error' && (
                  <>
                    <div className="text-5xl">⚠️</div>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                      No se pudo verificar tu correo
                    </h1>
                    <p className="text-base mt-2 opacity-80">{message}</p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <Link to="/" className="btn btn-outline w-full">
                        Volver al inicio
                      </Link>
                      <button
                        className={`btn w-full ${resendLoading ? 'btn-disabled' : ''}`}
                        onClick={handleResend}
                        disabled={resendLoading}
                      >
                        {resendLoading ? 'Reenviando…' : 'Reenviar verificación'}
                      </button>
                    </div>

                    {resendMsg && <p className="text-sm mt-4 opacity-80">{resendMsg}</p>}
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