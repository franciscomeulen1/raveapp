import React from 'react';

const InputMultimedia = () => {

    return (
        <div>
            <h3 className='font-bold text-lg mt-4'>Multimedia:</h3>
            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-red-500'>Foto (Obligatoria):</span></label>
                <input type='file' className='file-input file-input-bordered w-full max-w-xs' />
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar video (Opcional):</span></label>
                <input type='text' placeholder='Pega el link de YouTube aquí' className='input input-bordered w-full max-w-lg' />
            </div>

            <div className='form-control w-full mb-4'>
                <label className='label'><span className='label-text font-semibold text-lg text-purple-500'>Agregar música (Opcional):</span></label>
                <input type='text' placeholder='Pega el link de Spotify o SoundCloud aquí' className='input input-bordered w-full max-w-lg' />
            </div>
        </div>
    );
};

export default InputMultimedia;