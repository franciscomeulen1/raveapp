import React, { useState, useEffect } from 'react';

const InputMultimedia = ({ onMultimediaChange, onErrorChange }) => {
    const [soundCloud, setSoundCloud] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [errorSoundCloud, setErrorSoundCloud] = useState('');

    useEffect(() => {
        const isValid = validarSoundCloud(soundCloud);
        onMultimediaChange({
            soundCloud: isValid ? soundCloud : null,
            videoUrl
        });
        onErrorChange && onErrorChange(!isValid); // <-- notifica error
    }, [soundCloud, videoUrl, onMultimediaChange, onErrorChange]);

    const validarSoundCloud = (url) => {
        if (!url.trim()) return true;
        return url.includes('soundcloud.com');
    };

    const handleSoundCloudChange = (e) => {
        const value = e.target.value;
        setSoundCloud(value);

        if (value && !value.includes('soundcloud.com')) {
            setErrorSoundCloud('Debe ser un link válido de SoundCloud');
        } else {
            setErrorSoundCloud('');
        }
    };

    return (
        <div>
            <h3 className='font-bold text-lg mt-4'>Multimedia:</h3>

            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-red-500'>Foto (Obligatoria):</span></label>
                <input type='file' className='file-input file-input-bordered w-full max-w-xs' />
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar video (Opcional):</span></label>
                <input
                    type='text'
                    placeholder='Pega el link de YouTube aquí'
                    className='input input-bordered w-full max-w-lg'
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                />
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar música (SoundCloud solamente):</span></label>
                <input
                    type='text'
                    placeholder='Pega el link de SoundCloud aquí'
                    className='input input-bordered w-full max-w-lg'
                    value={soundCloud}
                    onChange={handleSoundCloudChange}
                />
                {errorSoundCloud && (
                    <span className='text-red-500 text-sm mt-1'>{errorSoundCloud}</span>
                )}
            </div>
        </div>
    );
};

export default InputMultimedia;




// import React from 'react';

// const InputMultimedia = () => {

//     return (
//         <div>
//             <h3 className='font-bold text-lg mt-4'>Multimedia:</h3>
//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-red-500'>Foto (Obligatoria):</span></label>
//                 <input type='file' className='file-input file-input-bordered w-full max-w-xs' />
//             </div>

//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar video (Opcional):</span></label>
//                 <input type='text' placeholder='Pega el link de YouTube aquí' className='input input-bordered w-full max-w-lg' />
//             </div>

//             <div className='form-control w-full mb-4'>
//                 <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar música (Opcional):</span></label>
//                 <input type='text' placeholder='Pega el link de Spotify o SoundCloud aquí' className='input input-bordered w-full max-w-lg' />
//             </div>
//         </div>
//     );
// };

// export default InputMultimedia;