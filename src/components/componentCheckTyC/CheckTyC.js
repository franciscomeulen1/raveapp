import React, { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

function CheckTyC({ onChange }) {
  const [acepta, setAcepta] = useState(false);
  const [urlPdf, setUrlPdf] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  useEffect(() => {
    obtenerPdf(); // al cargar
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
      console.error('Error al obtener el PDF de TyC:', error);
    }
  };

  const abrirModal = async () => {
    const ahora = new Date();

    if (
      !ultimaActualizacion ||
      ahora - new Date(ultimaActualizacion) > 15 * 60 * 1000 // 15 minutos en ms
    ) {
      await obtenerPdf();
    }

    setMostrarModal(true);
  };

  const handleChange = (e) => {
    setAcepta(e.target.checked);
    onChange(e.target.checked); // comunica al padre
  };

  return (
    <>
      <div className="form-control mb-4">
        <label className="cursor-pointer label justify-start">
          <input
            type="checkbox"
            className="checkbox checkbox-accent mr-2"
            checked={acepta}
            onChange={handleChange}
          />
          <span className="label-text">
            Acepto{' '}
            {urlPdf ? (
              <button
                type="button"
                onClick={abrirModal}
                className="text-blue-600 underline"
              >
                términos y condiciones
              </button>
            ) : (
              'términos y condiciones'
            )}
          </span>
        </label>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl h-[90vh] rounded-lg shadow-lg overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Términos y Condiciones</h3>
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

export default CheckTyC;
