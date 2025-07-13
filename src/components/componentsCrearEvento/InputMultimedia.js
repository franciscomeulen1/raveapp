import React, { useState, useEffect } from 'react';

const InputMultimedia = ({ onMultimediaChange, onErrorChange, imagenInicial, videoInicial, soundCloudInicial}) => {
    const [soundCloud, setSoundCloud] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // NUEVO
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
        const imagenValida = validarImagen(file);

        onMultimediaChange({
            soundCloud: soundCloudValido ? soundCloud : null,
            videoUrl: videoValido ? videoUrl : null,
            file: imagenValida ? file : null
        });

        const hayErrores = !soundCloudValido || !videoValido || !imagenValida;
        onErrorChange && onErrorChange(hayErrores);
    }, [soundCloud, videoUrl, file, onMultimediaChange, onErrorChange]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);

        if (!selected) {
            setErrorImagen('Debes subir una imagen.');
            setPreviewUrl(null); // NUEVO
        } else if (!validarImagen(selected)) {
            setErrorImagen('La imagen debe ser JPG, JPEG o PNG y pesar menos de 2MB.');
            setPreviewUrl(null); // NUEVO
        } else {
            setErrorImagen('');
            setPreviewUrl(URL.createObjectURL(selected)); // NUEVO
        }
    };

    const handleSoundCloudChange = (e) => {
        const value = e.target.value;
        setSoundCloud(value);
        setErrorSoundCloud(value && !validarSoundCloud(value) ? 'Debe ser un link válido de SoundCloud' : '');
    };

    const handleVideoChange = (e) => {
        const value = e.target.value;
        setVideoUrl(value);
        setErrorVideo(value && !validarYouTube(value) ? 'Debe ser un link válido de YouTube' : '');
    };

    return (
        <div>
            <h3 className='font-bold text-lg mt-4'>Multimedia:</h3>

            <div className='form-control w-full mb-4'>
                <label className='label'>
                    <span className='label-text font-semibold text-lg text-red-500'>Foto (Obligatoria):</span>
                </label>
                <input
                    type='file'
                    accept="image/*"
                    className='file-input file-input-bordered w-full max-w-xs'
                    onChange={handleFileChange}
                />
                {errorImagen && <span className='text-red-500 text-sm mt-1'>{errorImagen}</span>}
                <span className='text-sm text-gray-500 mt-1'>La imagen debe pesar menos de 2MB y ser JPG, JPEG o PNG.</span>

                {/* ✅ Previsualización */}
                {previewUrl && (
                    <div className='mt-4'>
                        <p className='text-sm font-semibold mb-1'>Previsualización:</p>
                        <img
                            src={previewUrl}
                            alt="Previsualización"
                            className="rounded-lg border shadow-md max-w-xs max-h-64"
                        />
                    </div>
                )}
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'>
                    <span className='label-text font-semibold text-lg text-purple-500'>Agregar video (Opcional):</span>
                </label>
                <input
                    type='text'
                    placeholder='Pega el link de YouTube aquí'
                    className='input input-bordered w-full max-w-lg'
                    value={videoUrl}
                    onChange={handleVideoChange}
                />
                {errorVideo && <span className='text-red-500 text-sm mt-1'>{errorVideo}</span>}
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'>
                    <span className='label-text font-semibold text-lg text-purple-500'>Agregar música (SoundCloud solamente):</span>
                </label>
                <input
                    type='text'
                    placeholder='Pega el link de SoundCloud aquí'
                    className='input input-bordered w-full max-w-lg'
                    value={soundCloud}
                    onChange={handleSoundCloudChange}
                />
                {errorSoundCloud && <span className='text-red-500 text-sm mt-1'>{errorSoundCloud}</span>}
            </div>
        </div>
    );
};

export default InputMultimedia;



// import React, { useState, useEffect } from 'react';

// const InputMultimedia = ({ onMultimediaChange, onErrorChange }) => {
//     const [soundCloud, setSoundCloud] = useState('');
//     const [videoUrl, setVideoUrl] = useState('');
//     const [errorSoundCloud, setErrorSoundCloud] = useState('');

//     useEffect(() => {
//         const isValid = validarSoundCloud(soundCloud);
//         onMultimediaChange({
//             soundCloud: isValid ? soundCloud : null,
//             videoUrl
//         });
//         onErrorChange && onErrorChange(!isValid); // <-- notifica error
//     }, [soundCloud, videoUrl, onMultimediaChange, onErrorChange]);

//     const validarSoundCloud = (url) => {
//         if (!url.trim()) return true;
//         return url.includes('soundcloud.com');
//     };

//     const handleSoundCloudChange = (e) => {
//         const value = e.target.value;
//         setSoundCloud(value);

//         if (value && !value.includes('soundcloud.com')) {
//             setErrorSoundCloud('Debe ser un link válido de SoundCloud');
//         } else {
//             setErrorSoundCloud('');
//         }
//     };

//     return (
//         <div>
//             <h3 className='font-bold text-lg mt-4'>Multimedia:</h3>

//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-red-500'>Foto (Obligatoria):</span></label>
//                 <input type='file' className='file-input file-input-bordered w-full max-w-xs' />
//             </div>

//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar video (Opcional):</span></label>
//                 <input
//                     type='text'
//                     placeholder='Pega el link de YouTube aquí'
//                     className='input input-bordered w-full max-w-lg'
//                     value={videoUrl}
//                     onChange={(e) => setVideoUrl(e.target.value)}
//                 />
//             </div>

//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar música (SoundCloud solamente):</span></label>
//                 <input
//                     type='text'
//                     placeholder='Pega el link de SoundCloud aquí'
//                     className='input input-bordered w-full max-w-lg'
//                     value={soundCloud}
//                     onChange={handleSoundCloudChange}
//                 />
//                 {errorSoundCloud && (
//                     <span className='text-red-500 text-sm mt-1'>{errorSoundCloud}</span>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InputMultimedia;