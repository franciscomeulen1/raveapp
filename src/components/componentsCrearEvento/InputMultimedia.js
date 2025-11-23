import React, { useState, useEffect } from 'react';

const InputMultimedia = ({ onMultimediaChange, onErrorChange, imagenInicial, videoInicial, soundCloudInicial }) => {
    const [soundCloud, setSoundCloud] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errorSoundCloud, setErrorSoundCloud] = useState('');
    const [errorVideo, setErrorVideo] = useState('');
    const [errorImagen, setErrorImagen] = useState('');

    const validarSoundCloud = (url) => {
        if (!url.trim()) return true;
        return url.includes('soundcloud.com');
    };

    const validarYouTube = (url) => {
        if (!url.trim()) return true;
        const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    };

    const validarImagen = (file) => {
        if (!file) return false;
        const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
        const pesoMaximo = 2 * 1024 * 1024; // 2MB
        return tiposValidos.includes(file.type) && file.size <= pesoMaximo;
    };

    useEffect(() => {
        setSoundCloud(soundCloudInicial || '');
        setVideoUrl(videoInicial || '');
        setPreviewUrl(imagenInicial || null);
    }, [soundCloudInicial, videoInicial, imagenInicial]);

    useEffect(() => {
        const soundCloudValido = validarSoundCloud(soundCloud);
        const videoValido = validarYouTube(videoUrl);
        const imagenValida = file ? validarImagen(file) : true; // ✅ sólo si hay nueva imagen

        onMultimediaChange({
            soundCloud: soundCloudValido ? soundCloud : null,
            videoUrl: videoValido ? videoUrl : null,
            file: file && imagenValida ? file : null,
        });

        const hayErrores = !soundCloudValido || !videoValido || (file && !imagenValida);
        onErrorChange && onErrorChange(hayErrores);
    }, [soundCloud, videoUrl, file, onMultimediaChange, onErrorChange]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);

        if (!selected) {
            setErrorImagen('Debes subir una imagen.');
            setPreviewUrl(null);
        } else if (!validarImagen(selected)) {
            setErrorImagen('La imagen debe ser JPG, JPEG o PNG y pesar menos de 2MB.');
            setPreviewUrl(null);
        } else {
            setErrorImagen('');
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleSoundCloudChange = (e) => {
        const value = e.target.value;
        setSoundCloud(value);
        setErrorSoundCloud(
            value && !validarSoundCloud(value) ? 'Debe ser un link válido de SoundCloud' : ''
        );
    };

    const handleVideoChange = (e) => {
        const value = e.target.value;
        setVideoUrl(value);
        setErrorVideo(
            value && !validarYouTube(value) ? 'Debe ser un link válido de YouTube' : ''
        );
    };

    return (
        <div>
            <h3 className="font-bold text-lg mt-4">Multimedia:</h3>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text font-semibold text-lg text-red-500">
                        Imagen (Obligatoria):
                    </span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleFileChange}
                />
                {errorImagen && (
                    <span className="text-red-500 text-sm mt-1">{errorImagen}</span>
                )}
                <span className="text-sm text-gray-500 mt-1">
                    La imagen debe pesar menos de 2MB y ser JPG, JPEG o PNG.
                </span>
                <p className='text-sm mt-2'><span className='font-semibold text-sky-600'>Recomendación:</span><br />
                    Usar imagen horizontal de 1200 × 600 px (relación 2:1).</p>

                {/* ✅ Previsualización similar a la card del inicio */}
                {previewUrl && (
                    <div className="mt-4 flex justify-start">
                        <div
                            className="
                                     w-full
                                     max-w-md        /* mismo ancho que en CardEvento */
                                     aspect-[1.4]    /* misma relación que la card del evento */
                                     bg-gray-100
                                     overflow-hidden
                                     flex items-center justify-center
                                     rounded-xl
                                     shadow-md
                                   "
                        >
                            <img
                                src={previewUrl}
                                alt="Previsualización"
                                className="
                                      block
                                      w-full h-full
                                      object-cover object-center
                                    "
                                width={448}
                                height={320}
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text font-semibold text-lg text-purple-500">
                        Agregar video (YouTube solamente):
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Pega el link de YouTube aquí"
                    className="input input-bordered w-full max-w-lg"
                    value={videoUrl}
                    onChange={handleVideoChange}
                />
                {errorVideo && (
                    <span className="text-red-500 text-sm mt-1">{errorVideo}</span>
                )}
            </div>

            <div className="form-control w-full mb-4">
                <label className="label">
                    <span className="label-text font-semibold text-lg text-purple-500">
                        Agregar música (SoundCloud solamente):
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Pega el link de SoundCloud aquí"
                    className="input input-bordered w-full max-w-lg"
                    value={soundCloud}
                    onChange={handleSoundCloudChange}
                />
                {errorSoundCloud && (
                    <span className="text-red-500 text-sm mt-1">{errorSoundCloud}</span>
                )}
            </div>
        </div>
    );
};

export default InputMultimedia;