import React from 'react';

const InputGeneroMusical = () => {

    return (
        <div>
            <h3 className='font-bold text-lg mb-2'>Género/s musical/es:</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                {['Techno', 'Tech-House', 'House', 'Minimal Techno', 'Hard Techno', 'Acid Techno', 'Industrial Techno', 'Dub-Techno', 'Melodic Techno', 'Trance', 'Psytrance', 'Progressive', 'Tribal'].map(genre => (
                    <label key={genre} className='flex items-center'><input type='checkbox' className='mr-2' />{genre}</label>
                ))}
            </div>
        </div>
    );
};

export default InputGeneroMusical;