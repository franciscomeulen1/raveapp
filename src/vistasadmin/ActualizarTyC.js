import React, { useEffect, useState } from 'react';
import api from '../componenteapi/api';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const archivoTyC = "archivoTyC";

function ActualizarTyC() {
    const [archivoActual, setArchivoActual] = useState(null);
    const [archivoNuevo, setArchivoNuevo] = useState(null);
    const [idMediaActual, setIdMediaActual] = useState(null);
    const [subiendo, setSubiendo] = useState(false);

    useEffect(() => {
        obtenerArchivoActual();
    }, []);

    const obtenerArchivoActual = async () => {
        try {
            const response = await api.get(`/Media?idEntidadMedia=${archivoTyC}`);
            if (response.data.media && response.data.media.length > 0) {
                const media = response.data.media[0];
                setArchivoActual(media.url);
                setIdMediaActual(media.idMedia);
            }
        } catch (error) {
            console.error("Error al obtener el archivo de TyC:", error);
        }
    };

    const handleSeleccionArchivo = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("El archivo debe ser un PDF.");
            return;
        }

        setArchivoNuevo(file);
    };

    const handleActualizar = async () => {
        if (!archivoNuevo) {
            alert("Debe seleccionar un archivo PDF antes de actualizar.");
            return;
        }

        try {
            setSubiendo(true);

            // 1. Eliminar archivo actual si existe
            if (idMediaActual) {
                await api.delete(`/Media/${idMediaActual}`);
            }

            // 2. Subir nuevo archivo
            const formData = new FormData();
            formData.append("IdEntidadMedia", archivoTyC);
            formData.append("File", archivoNuevo);

            await api.post('/Media', formData);

            alert("Archivo actualizado correctamente.");
            setArchivoNuevo(null);
            obtenerArchivoActual(); // Refresca la vista
        } catch (error) {
            console.error("Error al actualizar el archivo:", error);
            alert("Ocurrió un error al actualizar el archivo.");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10">
                    <NavBar />
                </div>
                <div className="p-4 sm:p-6 max-w-full sm:max-w-4xl mx-auto w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Términos y Condiciones, y Política de Privacidad</h2>

                    {archivoActual && (
                        <div className="mb-6">
                            <p className="font-semibold mb-2">Archivo actual:</p>
                            <iframe
                                src={archivoActual}
                                title="Términos y Condiciones"
                                className="w-full h-[500px] border rounded-md"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block font-medium mb-2">Seleccionar nuevo archivo PDF:</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleSeleccionArchivo}
                            className="file-input file-input-bordered w-full max-w-md"
                        />
                    </div>

                    <button
                        onClick={handleActualizar}
                        disabled={subiendo}
                        className="btn btn-primary mt-4"
                    >
                        {subiendo ? "Actualizando..." : "Actualizar Archivo"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ActualizarTyC;
