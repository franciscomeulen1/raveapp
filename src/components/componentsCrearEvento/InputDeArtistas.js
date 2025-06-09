import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import api from '../../componenteapi/api';

const InputDeArtistas = ({ onSeleccionarArtistas }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [artistas, setArtistas] = useState([]);

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await api.get('/Artista/GetArtista');
                setArtistas(response.data.artistas);
            } catch (error) {
                console.error('Error al cargar artistas:', error);
            }
        };
        fetchArtistas();
    }, []);

    useEffect(() => {
        // Devolvemos objetos con nombre, id (si hay) y flag de si es nuevo
        onSeleccionarArtistas(selectedArtists);
    }, [selectedArtists, onSeleccionarArtistas]);

    // Filtrar artistas disponibles: no repetir seleccionados y matchear por el input
    const filteredOptions = artistas
        .filter(artist => !selectedArtists.find(a => a.id === artist.idArtista))
        .filter(artist => artist.nombre.toLowerCase().startsWith(inputValue.toLowerCase()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setShowMenu(event.target.value.length > 0);
    };

    // Capitaliza las primeras letras de cada palabra del string
    const toTitleCase = (str) =>
        str
            .toLowerCase()
            .split(' ')
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            event.preventDefault(); // evitar que se envíe un form

            const textoIngresado = inputValue.trim();

            // Buscar si ya existe en la base
            const artistExistente = artistas.find(
                a => a.nombre.trim().toLowerCase() === textoIngresado.toLowerCase()
            );

            // Buscar si ya está seleccionado, sea nuevo o existente
            const yaSeleccionado = selectedArtists.find(
                a => a.nombre.trim().toLowerCase() === textoIngresado.toLowerCase()
            );

            if (yaSeleccionado) {
                // Ya está en la lista seleccionada, no se agrega de nuevo
                setInputValue('');
                setShowMenu(false);
                return;
            }

            if (artistExistente) {
                // Si existe, lo agregamos con su ID y marcamos como no nuevo
                setSelectedArtists([
                    ...selectedArtists,
                    {
                        id: artistExistente.idArtista,
                        nombre: artistExistente.nombre,
                        esNuevo: false
                    }
                ]);
            } else {
                // Artista nuevo: capitalizamos su nombre y lo marcamos como nuevo
                const nombreNormalizado = toTitleCase(textoIngresado);
                setSelectedArtists([
                    ...selectedArtists,
                    {
                        id: null,
                        nombre: nombreNormalizado,
                        esNuevo: true
                    }
                ]);
            }

            setInputValue('');
            setShowMenu(false);
        }
    };

    const handleSelectChange = (artist) => {
        setSelectedArtists([
            ...selectedArtists,
            {
                id: artist.idArtista,
                nombre: artist.nombre,
                esNuevo: false
            }
        ]);
        setInputValue('');
        setShowMenu(false);
    };

    const removeArtist = (artistToRemove) => {
        setSelectedArtists(selectedArtists.filter(artist => artist.nombre !== artistToRemove.nombre));
    };

    return (
        <div>
            <h3 className='font-bold text-lg mb-2'>Artista/s:</h3>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Escribe el nombre del artista"
                onKeyDown={handleKeyDown}
                className="input input-bordered w-full max-w-xs mb-2"
            />
            {showMenu && (
                <div className="bg-white border rounded shadow w-full max-w-xs max-h-60 overflow-y-auto z-10">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className='cursor-pointer p-1 hover:bg-gray-100'
                            onClick={() => handleSelectChange(option)}
                        >
                            {option.nombre}
                        </div>
                    ))}
                </div>
            )}
            <div>
                {selectedArtists.map((artist, index) => (
                    <div key={index} className="flex items-center mt-1">
                        <FontAwesomeIcon icon={faCheck} className='mr-2 text-green-600' />
                        <span className='font-semibold text-lg mr-2'>{artist.nombre}</span>
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            onClick={() => removeArtist(artist)}
                            className='text-red-600 cursor-pointer'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputDeArtistas;





// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

// const InputDeArtistas = () => {
//     const [inputValue, setInputValue] = useState('');
//     const [selectedArtists, setSelectedArtists] = useState([]);
//     const [showMenu, setShowMenu] = useState(false);

//     const artistas = ["Amelie Lens", "Nico Moreno", "Adam Beyer"];
//     const filteredOptions = artistas
//         .filter(artist => !selectedArtists.find(selectedArtist => selectedArtist.value === artist))
//         .filter(artist => artist.toLowerCase().startsWith(inputValue.toLowerCase()))
//         .map(artist => ({ value: artist, label: artist }));

//     const handleInputChange = (event) => {
//         setInputValue(event.target.value);
//         setShowMenu(event.target.value.length > 0); // Mostrar el menú solo si hay texto en el input
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter' && inputValue.trim() !== '') {
//             const artistToAdd = inputValue.trim();
//             if (!selectedArtists.some(artist => artist.value.toLowerCase() === artistToAdd.toLowerCase())) {
//                 const newArtist = { value: artistToAdd, label: artistToAdd };
//                 setSelectedArtists([...selectedArtists, newArtist]);
//             }
//             setInputValue('');
//             setShowMenu(false); // Ocultar el menú después de seleccionar un artista
//         }
//     };

//     const removeArtist = (artistToRemove) => {
//         setSelectedArtists(selectedArtists.filter(artist => artist.value !== artistToRemove.value));
//     };

//     const handleSelectChange = (selectedOption) => {
//         if (selectedOption) {
//             setSelectedArtists([...selectedArtists, selectedOption]);
//             setInputValue(''); // Limpiar el input después de seleccionar un artista de la lista de sugerencias
//             setShowMenu(false); // Ocultar el menú después de seleccionar un artista
//         }
//     };

//     return (
//         <div>
//             <h3 className='font-bold text-lg mb-2'>Artista/s:</h3>
//             <input
//                 type="text"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Escribe el nombre del artista"
//                 onKeyDown={handleKeyDown}
//                 className="input input-bordered w-full max-w-xs mb-2"
//             />
//             {showMenu && (
//                 <div>
//                     {filteredOptions.map((option, index) => (
//                         <div key={index} className='cursor-pointer text-lg' onClick={() => handleSelectChange(option)}>{option.label}</div>
//                     ))}
//                 </div>
//             )}
//             <div>
//                 {selectedArtists.map((artist, index) => (
//                     <div key={index} className="flex items-center cursor-default">
//                         <FontAwesomeIcon icon={faCheck} size='xl' style={{ color: "#209d28", }} className='mr-2' />
//                         <span className='font-semibold text-lg mr-2'>{artist.label}</span>
//                         <FontAwesomeIcon onClick={() => removeArtist(artist)} icon={faCircleXmark} style={{ color: "#b00303", }} size='lg' className='cursor-pointer' />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default InputDeArtistas;