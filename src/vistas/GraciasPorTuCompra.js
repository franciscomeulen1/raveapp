import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function GraciasPorTuCompra() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1">
        <NavBar />

        <main className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur-sm sm:p-12">
              {/* Glow deco */}
              <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-green-100 blur-3xl opacity-60" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-emerald-100 blur-3xl opacity-70" />

              {/* Check icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    className="text-emerald-600"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                  <circle
                    className="text-emerald-600/30"
                    cx="12"
                    cy="12"
                    r="9"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>

              {/* Heading */}
              <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                ¡Gracias por tu compra!
              </h1>

              {/* Subtext with link */}
              <p className="mx-auto mt-4 max-w-xl text-center text-slate-600 sm:mt-5">
                Una vez que se procese el pago, recibirás por mail la entrada del evento, y también podrás ver tu entrada en la sección{' '}
                <Link to="/mis-entradas" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
                  mis entradas
                </Link>
                .
              </p>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
