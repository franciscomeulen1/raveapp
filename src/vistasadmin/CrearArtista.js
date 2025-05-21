import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../componenteapi/api";

const CrearArtista = () => {
    const [nombre, setNombre] = useState("");
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");
    const [spotify, setSpotify] = useState("");
    const [soundcloud, setSoundcloud] = useState("");

    const [errorInstagram, setErrorInstagram] = useState("");
    const [errorSpotify, setErrorSpotify] = useState("");
    const [errorSoundcloud, setErrorSoundcloud] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

    const handleCreateArtist = () => {
        if (!nombre.trim() || !bio.trim()) {
            alert("Los campos 'Nombre' e 'Información sobre el artista' son obligatorios.");
            return;
        }

        let hasError = false;
        if (instagram && !urlRegex.test(instagram)) {
            setErrorInstagram("La URL de Instagram no es válida. Debe comenzar con http:// o https://");
            hasError = true;
        } else {
            setErrorInstagram("");
        }

        if (spotify && !urlRegex.test(spotify)) {
            setErrorSpotify("La URL de Spotify no es válida. Debe comenzar con http:// o https://");
            hasError = true;
        } else {
            setErrorSpotify("");
        }

        if (soundcloud && !urlRegex.test(soundcloud)) {
            setErrorSoundcloud("La URL de SoundCloud no es válida. Debe comenzar con http:// o https://");
            hasError = true;
        } else {
            setErrorSoundcloud("");
        }

        if (hasError) return;

        setIsSubmitting(true);

        const payload = {
            nombre,
            bio,
            socials: {
                idSocial: "",
                mdInstagram: instagram,
                mdSpotify: spotify,
                mdSoundcloud: soundcloud
            },
            isActivo: true
        };

        api
            .post("/Artista/CreateArtista", payload)
            .then(() => {
                setIsSubmitting(false);
                setIsSuccessModalOpen(true);
                setNombre("");
                setBio("");
                setInstagram("");
                setSpotify("");
                setSoundcloud("");
                setErrorInstagram("");
                setErrorSpotify("");
                setErrorSoundcloud("");
            })
            .catch((err) => {
                console.error("Error al crear el artista:", err);
                setIsSubmitting(false);
                setIsErrorModalOpen(true);
            });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />

                    <div className="max-w-4xl mx-auto p-6">
                        <h1 className="mb-8 text-3xl font-bold underline underline-offset-8">
                            Ingresar nuevo artista
                        </h1>

                        {/* Nombre */}
                        <div className="mb-4">
                            <label className="block font-semibold">Nombre del artista:</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>

                        {/* Imagen (sin lógica por ahora) */}
                        <div className="mb-4 flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full font-bold">
                                IMG
                            </div>
                            <div>
                                <label className="block font-semibold">Foto del artista:</label>
                                <button className="border px-4 py-1 rounded bg-gray-200">
                                    Seleccionar imagen
                                </button>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-4">
                            <label className="block font-semibold">
                                Información sobre el artista:
                            </label>
                            <textarea
                                className="w-full border rounded p-2"
                                placeholder="Espacio para escribir información del artista"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>

                        {/* Redes sociales */}
                        <div className="mb-4">
                            <label className="block font-semibold">
                                URL del Instagram del artista:
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-1"
                                placeholder="URL de Instagram"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                            {errorInstagram && <p className="text-red-600 text-sm">{errorInstagram}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">
                                URL del SoundCloud del artista:
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-1"
                                placeholder="URL de SoundCloud"
                                value={soundcloud}
                                onChange={(e) => setSoundcloud(e.target.value)}
                            />
                            {errorSoundcloud && <p className="text-red-600 text-sm">{errorSoundcloud}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold">
                                URL del Spotify del artista:
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded p-2 mb-1"
                                placeholder="URL de Spotify"
                                value={spotify}
                                onChange={(e) => setSpotify(e.target.value)}
                            />
                            {errorSpotify && <p className="text-red-600 text-sm">{errorSpotify}</p>}
                        </div>

                        {/* Botón Crear */}
                        <button
                            className={`bg-green-500 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleCreateArtist}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creando..." : "Crear Artista"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Éxito */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">
                            ¡El artista se ha creado correctamente!
                        </h2>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsSuccessModalOpen(false)}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Error */}
            {isErrorModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">
                            Hubo un error al crear el artista.
                        </h2>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsErrorModalOpen(false)}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CrearArtista;
