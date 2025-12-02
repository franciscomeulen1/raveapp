// src/vistas/MpReturn.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function MpReturnMobile() {
  const [searchParams] = useSearchParams();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');

    // Deep link base que usa la app mobile
    let target = 'raveapp:///tickets/screens/BackBuyScreen';
    if (id) {
      target += `?id=${encodeURIComponent(id)}`;
    }

    // Intentar abrir la app apenas carga la página
    window.location.href = target;

    // Fallback: si en ~2 segundos no pasó nada, mostramos un botón
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1 sm:px-10">
        <NavBar />

        <main className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-sm sm:p-12">
              <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-emerald-100 blur-3xl opacity-60" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-emerald-100 blur-3xl opacity-70" />

              <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Volviendo a la app…
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-center text-slate-600 sm:mt-5">
                Estamos intentando abrir la app de RaveApp para mostrarte el estado de tu compra.
                Si no pasa nada en unos segundos, usá el botón de abajo.
              </p>

              {showFallback && (
                <div className="mt-8 flex justify-center">
                  <button
                    className="btn btn-secondary rounded-xl"
                    onClick={() => {
                      const id = searchParams.get('id');
                      let target = 'raveapp:///tickets/screens/BackBuyScreen';
                      if (id) {
                        target += `?id=${encodeURIComponent(id)}`;
                      }
                      window.location.href = target;
                    }}
                  >
                    Abrir RaveApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
