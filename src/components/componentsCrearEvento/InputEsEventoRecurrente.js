import React, { useState } from 'react';

const InputEsEventoRecurrente = () => {

    
    const [esRecurrente, setEsRecurrente] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [fiestasRecurrentes, setFiestasRecurrentes] = useState(["Fiesta X", "Club 69", "Techno Vibes"]); // Simulación de datos
    const [fiestaSeleccionada, setFiestaSeleccionada] = useState('');
    const [nuevaFiesta, setNuevaFiesta] = useState('');

    return (
        <div>
            <div className='form-control mb-4'>
                <label className='cursor-pointer label justify-start'>
                    <input
                        type='checkbox'
                        className='checkbox checkbox-accent mr-2'
                        checked={esRecurrente}
                        onChange={() => setEsRecurrente(!esRecurrente)}
                    />
                    <span className='label-text'>Este evento es recurrente</span>
                </label>
            </div>

            {esRecurrente && (
                <div className='mb-4'>
                    <label className='label'>
                        <span className='label-text font-semibold text-lg'>Selecciona una fiesta recurrente:</span>
                    </label>
                    <select
                        className='select select-bordered w-full max-w-lg'
                        value={fiestaSeleccionada}
                        onChange={(e) => setFiestaSeleccionada(e.target.value)}
                    >
                        <option value=''>Selecciona una opción</option>
                        {fiestasRecurrentes.map((fiesta, index) => (
                            <option key={index} value={fiesta}>{fiesta}</option>
                        ))}
                    </select>

                    <label className='label mt-2'>
                        <span className='label-text font-semibold text-lg'>O crea una nueva:</span>
                    </label>
                    <input
                        type='text'
                        placeholder='Nombre de la nueva fiesta'
                        className='input input-bordered w-full max-w-lg'
                        value={nuevaFiesta}
                        onChange={(e) => setNuevaFiesta(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default InputEsEventoRecurrente;