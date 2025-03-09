import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FcGoogle } from "react-icons/fc";

export default function PreCrearEvento() {

    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página

    return (
        <div className="flex flex-col min-h-screen">
        {/* Las class del div principal hacen que ocupe toda la altura de la pantalla y permite que el Footer se mantenga en su lugar. */}
            <div className="flex-grow sm:px-10 mb-11">
            {/* El flex-grow hace que el contenido principal crezca y ocupe todo el espacio disponible, empujando al Footer hacia abajo, para que no quede separado del borde inferior de la pantalla. */}
                <NavBar />
                <div className="flex flex-col items-center justify-center bg-white p-4 mt-2">
                    <div className="w-full max-w-lg text-center">
                        <h1 className="text-2xl font-bold mb-2">Crear Evento</h1>
                        <hr className="border-black mb-4" />
                        <p className="text-lg font-semibold mb-6">
                            Para crear un evento, primero debes iniciar sesión o registrarte.
                        </p>

                        <div className="space-y-4">
                            <button className="w-full py-3 text-lg font-bold text-white bg-[#6FCFCE] rounded-md shadow-md hover:bg-[#5ABAB5]">
                                Iniciar sesión
                            </button>
                            <button className="w-full py-3 text-lg font-bold text-white bg-[#D96A99] rounded-md shadow-md hover:bg-[#C75988]">
                                Registrarme
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-400 rounded-md shadow-md hover:bg-gray-100">
                                <FcGoogle />
                                <span className="text-lg font-semibold text-gray-700">Login with Google</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}