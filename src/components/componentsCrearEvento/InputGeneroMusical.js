import React, { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

const InputGeneroMusical = ({ onSeleccionGeneros }) => {
    const [generos, setGeneros] = useState([]);
    const [generosSeleccionados, setGenerosSeleccionados] = useState([]);

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const response = await api.get('/Evento/GetGeneros');
                setGeneros(response.data);
            } catch (error) {
                console.error('Error al obtener géneros:', error);
            }
        };
        fetchGeneros();
    }, []);

    useEffect(() => {
        onSeleccionGeneros(generosSeleccionados);
    }, [generosSeleccionados, onSeleccionGeneros]);

    const toggleGenero = (cdGenero) => {
        setGenerosSeleccionados((prev) =>
            prev.includes(cdGenero)
                ? prev.filter((id) => id !== cdGenero)
                : [...prev, cdGenero]
        );
    };

    return (
        <div>
            <h3 className='font-bold text-lg mb-2'>Género/s musical/es:</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                {generos.map(({ cdGenero, dsGenero }) => (
                    <label key={cdGenero} className='flex items-center'>
                        <input
                            type='checkbox'
                            className='mr-2'
                            checked={generosSeleccionados.includes(cdGenero)}
                            onChange={() => toggleGenero(cdGenero)}
                        />
                        {dsGenero}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default InputGeneroMusical;


// import React from 'react';

// const InputGeneroMusical = () => {

//     return (
//         <div>
//             <h3 className='font-bold text-lg mb-2'>Género/s musical/es:</h3>
//             <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
//                 {['Techno', 'Tech-House', 'House', 'Minimal Techno', 'Hard Techno', 'Acid Techno', 'Industrial Techno', 'Dub-Techno', 'Melodic Techno', 'Trance', 'Psytrance', 'Progressive', 'Tribal'].map(genre => (
//                     <label key={genre} className='flex items-center'><input type='checkbox' className='mr-2' />{genre}</label>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default InputGeneroMusical;