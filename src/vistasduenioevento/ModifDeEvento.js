import React, { useState, useEffect } from 'react';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
import InputFechaHora from '../components/componentsCrearEvento/InputFechaHora';
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';

const ModifDeEvento = ({ evento, onSave, onCancel }) => {
    // Inicializamos los estados con los valores del objeto evento completo
    const [nombre, setNombre] = useState(evento?.nombre || '');
    const [descripcion, setDescripcion] = useState(evento?.descripcion || '');
    const [fechaHora, setFechaHora] = useState(evento?.fecha || '');
    const [artistas, setArtistas] = useState(evento?.artistas || []);
    const [ubicacion, setUbicacion] = useState(evento?.ubicacion || {});

    // UseEffect para actualizar el estado en caso de que el evento cambie
    useEffect(() => {
        if (evento) {
            setNombre(evento.nombre || '');
            setDescripcion(evento.descripcion || '');
            setFechaHora(evento.fecha || '');
            setArtistas(evento.artistas || []);
            setUbicacion(evento.ubicacion || {});
        }
    }, [evento]);

    const handleSave = () => {
        // Creando el objeto de evento actualizado con los valores modificados
        const updatedEvento = { ...evento, nombre, descripcion, fechaHora, artistas, ubicacion };
        onSave(updatedEvento); // Llamando a la función onSave con el evento actualizado
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 underline underline-offset-8">Modificar Evento</h2>
            <p className='font-bold'><span className='text-red-700'>* Importante:</span> Si debes modificar la dirección, la fecha, el horario, o los artistas que toquen en la fiesta, se le enviará un mail automáticamente a los usuarios que ya hayan adquirido una entrada, para notificarles de los cambios, con la opción de devolución/reembolso de la entrada.</p>
            <div className="form-control mb-4">
                <label className="label font-semibold text-lg">Nombre del Evento:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>
            
            <div className="form-control mb-4">
                <label className="label font-semibold text-lg">Descripción:</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="textarea textarea-bordered w-full"
                />
            </div>
            
            <InputFechaHora label="Fecha y Hora" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />
            
            <InputDeArtistas selectedArtists={artistas} setSelectedArtists={setArtistas} />
            
            <InputUbicacionEvento selectedUbicacion={ubicacion} setSelectedUbicacion={setUbicacion} />
            
            <div className="flex justify-end mt-4">
                <button onClick={onCancel} className="btn btn-secondary mr-2">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Guardar cambios</button>
            </div>
        </div>
    );
};

export default ModifDeEvento;
