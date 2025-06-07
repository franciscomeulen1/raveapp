import React, { useState, useEffect } from 'react';

const InputDescripcionEvento = ({ onDescripcionChange }) => {
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        if (onDescripcionChange) {
            onDescripcionChange(descripcion);
        }
    }, [descripcion, onDescripcionChange]);

    return (
        <div>
            <label className="label font-semibold text-lg">Descripción del evento:</label>
            <textarea
                placeholder='La descripción de tu evento va aquí.'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="textarea textarea-bordered w-full md:w-1/2"
            />
        </div>
    );
};

export default InputDescripcionEvento;


// import React, { useState } from 'react';

// const InputDescripcionEvento = () => {
//     const [descripcion, setDescripcion] = useState('');

//     return (
//         <div>
//                 <label className="label font-semibold text-lg">Descripción del evento:</label>
//                 <textarea
//                     placeholder='La descripción de tu evento va aquí.'
//                     value={descripcion}
//                     onChange={(e) => setDescripcion(e.target.value)}
//                     className="textarea textarea-bordered w-full md:w-1/2"
//                 />
//             </div>
//     );
// };

// export default InputDescripcionEvento;