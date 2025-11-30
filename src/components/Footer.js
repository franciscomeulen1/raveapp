// src/components/Footer.js
import React, { useEffect, useState } from 'react';
import api from '../componenteapi/api';

function Footer() {
  const [urlPdf, setUrlPdf] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  useEffect(() => {
    obtenerPdf(); // al cargar el footer
  }, []);

  const obtenerPdf = async () => {
    try {
      const response = await api.get('/Media?idEntidadMedia=archivoTyC');
      const media = response.data.media?.[0];
      if (media?.url) {
        setUrlPdf(media.url);
        setUltimaActualizacion(new Date());
      }
    } catch (error) {
      console.error('Error al obtener el PDF de TyC desde Footer:', error);
    }
  };

  const abrirModal = async () => {
    const ahora = new Date();

    // Refresca el PDF si pasaron más de 15 minutos
    if (
      !ultimaActualizacion ||
      ahora - new Date(ultimaActualizacion) > 15 * 60 * 1000
    ) {
      await obtenerPdf();
    }

    setMostrarModal(true);
  };

  return (
    <>
      <footer className="footer footer-center p-4 bg-gray-200 inset-x-0 bottom-0">
        <div className="text-center text-sm md:text-base">
          <p>
            Copyright © 2025 - Todos los derechos reservados por Rave-App -{' '}
            {urlPdf ? (
              <button
                type="button"
                onClick={abrirModal}
                className="underline"
              >
                Ver Términos y Condiciones, y Política de Privacidad
              </button>
            ) : (
              <span className="underline">Ver Términos y Condiciones, y Política de Privacidad</span>
            )}
          </p>
        </div>
      </footer>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl h-[90vh] rounded-lg shadow-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Términos y Condiciones, y Política de Privacidad</h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-600 hover:text-black text-xl font-bold"
              >
                ×
              </button>
            </div>
            <iframe
              src={urlPdf}
              title="PDF de Términos y Condiciones"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;


// function Footer() {
//   return (
//     <footer className="footer footer-center p-4 bg-gray-200 inset-x-0 bottom-0">
//       <div>
//         <p>Copyright © 2025 - Todos los derechos reservados por Rave-App</p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
