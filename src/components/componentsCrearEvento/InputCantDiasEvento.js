import React, { useState } from 'react';

const InputCantDiasEvento = ({ onDiasChange }) => {
    const [diasEvento, setDiasEvento] = useState(1);

    const handleChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setDiasEvento(value);
        onDiasChange(value);
    };

    return (
        <div className='mb-4'>
            <h3 className='font-bold text-lg mb-2'>Tipo de evento:</h3>
            <label className='block'><input type='radio' name='tipoEvento' value={1} checked={diasEvento === 1} onChange={handleChange} className='mr-2' />Evento común de 1 día.</label>
            <label className='block'><input type='radio' name='tipoEvento' value={2} checked={diasEvento === 2} onChange={handleChange} className='mr-2' />Evento/festival de 2 días.</label>
            <label className='block'><input type='radio' name='tipoEvento' value={3} checked={diasEvento === 3} onChange={handleChange} className='mr-2' />Evento/festival de 3 días.</label>
        </div>
    );
};

export default InputCantDiasEvento;

// import React from 'react';

// const InputCantDiasEvento = () => {

//     return (
//         <div className='mb-4'>
//             <h3 className='font-bold text-lg'>Tipo de evento:</h3>
//             <label className='block'><input type='radio' name='tipoEvento' className='mr-2' />Evento común de 1 día.</label>
//             <label className='block'><input type='radio' name='tipoEvento' className='mr-2' />Evento/festival de 2 días.</label>
//             <label className='block'><input type='radio' name='tipoEvento' className='mr-2' />Evento/festival de 3 días.</label>
//         </div>
//     );
// };

// export default InputCantDiasEvento;