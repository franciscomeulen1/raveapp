import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

export default function MisFiestasRecurrentes() {
    const { user: loggedUser } = useContext(AuthContext);
    const idUsuario = loggedUser.id;

    const [fiestas, setFiestas] = useState([]);
    const [newFiestaName, setNewFiestaName] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [fiestaAEliminar, setFiestaAEliminar] = useState(null);

    const fetchFiestas = useCallback(async () => {
        try {
            const response = await api.get(`/Fiesta/GetFiestas?IdUsuario=${idUsuario}`);
            const fiestasActivas = (response.data.fiestas || [])
                .filter(f => f.isActivo)
                .sort((a, b) => a.dsNombre.localeCompare(b.dsNombre));
            setFiestas(fiestasActivas);
        } catch (error) {
            console.error('Error al obtener las fiestas:', error);
        }
    }, [idUsuario]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFiestas();
    }, [fetchFiestas]);

    const handleAddFiesta = async (e) => {
        e.preventDefault();
        const fiestaName = newFiestaName.trim();
        if (!fiestaName) return;

        const existe = fiestas.some(f => f.dsNombre.toLowerCase() === fiestaName.toLowerCase());
        if (existe) {
            alert('La fiesta ya se encuentra en la lista.');
            return;
        }

        try {
            await api.post('/Fiesta/CrearFiesta', {
                nombre: fiestaName,
                idUsuario
            });
            setNewFiestaName('');
            fetchFiestas();
        } catch (error) {
            console.error('Error al crear la fiesta:', error);
        }
    };

    const handleEditSave = async () => {
        if (!editingValue.trim()) return;

        const fiesta = fiestas[editingIndex];
        try {
            await api.put('/Fiesta/UpdateFiesta', {
                nombre: editingValue.trim(),
                idFiesta: fiesta.idFiesta
            });
            setEditingIndex(null);
            setEditingValue('');
            fetchFiestas();
        } catch (error) {
            console.error('Error al actualizar la fiesta:', error);
        }
    };

    const handleDelete = (index) => {
        setFiestaAEliminar(fiestas[index]);
        setShowModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await api.delete(`/Fiesta/DeleteFiesta?id=${fiestaAEliminar.idFiesta}`);
            setShowModal(false);
            setFiestaAEliminar(null);
            fetchFiestas();
        } catch (error) {
            console.error('Error al eliminar la fiesta:', error);
        }
    };

    const handleEditCancel = () => {
        setEditingIndex(null);
        setEditingValue('');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow sm:px-10 mb-11">
                <NavBar />
                <div className="px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <h1 className="mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
                            Mis Fiestas Recurrentes:
                        </h1>

                        <p className="mb-4">
                            Las fiestas recurrentes, como su nombre indica, son aquellas que organizas de manera regular.
                            Pueden ser semanales, mensuales o con la frecuencia que tú elijas.
                        </p>
                        <p className="mb-4">
                            Si una fiesta se va a hacer una sola vez, o si es una fiesta única que se hace porque viene
                            determinado DJ a la Argentina, NO es una fiesta recurrente.
                        </p>
                        <p className="mb-4">
                            En esta sección podrás agregar, editar o eliminar los nombres de las fiestas que realices
                            de manera continua para mantener un registro actualizado.
                        </p>
                        <p className="mb-4">
                            Además, las fiestas recurrentes podrán ser calificadas por aquellos usuarios que hayan
                            adquirido una entrada para dicho evento. Van a poder puntuar la fiesta e incluso dejar un
                            comentario si así lo desean.
                        </p>

                        <hr className="mt-7 mb-4" />

                        <h2 className="mb-5 text-xl font-bold underline underline-offset-8">Agregar fiesta recurrente:</h2>
                        <form onSubmit={handleAddFiesta} className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                placeholder="Nombre de la fiesta"
                                value={newFiestaName}
                                onChange={(e) => setNewFiestaName(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">Confirmar</button>
                        </form>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Listado de mis fiestas recurrentes:</h2>
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Fiesta</th>
                                        <th>Ver calificaciones</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fiestas.map((fiesta, index) => (
                                        <tr key={fiesta.idFiesta}>
                                            <td>
                                                {editingIndex === index ? (
                                                    <input
                                                        type="text"
                                                        className="input input-bordered"
                                                        value={editingValue}
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleEditSave();
                                                        }}
                                                    />
                                                ) : (
                                                    fiesta.dsNombre
                                                )}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/resenias-de-la-fiesta/${fiesta.idFiesta}`}
                                                    state={{ nombreFiesta: fiesta.dsNombre }}
                                                    className="link link-primary"
                                                >
                                                    Ver calificaciones
                                                </Link>
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <>
                                                        <button className="btn btn-xs btn-secondary mr-2" onClick={handleEditSave}>Guardar</button>
                                                        <button className="btn btn-xs btn-warning" onClick={handleEditCancel}>Cancelar</button>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn btn-xs btn-secondary"
                                                        onClick={() => {
                                                            setEditingIndex(index);
                                                            setEditingValue(fiesta.dsNombre);
                                                        }}
                                                    >
                                                        Editar
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => handleDelete(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {/* Tercera columna vacía */}
                    </div>
                </div>
            </div>
            <Footer />

            {/* Modal de confirmación */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">¿Eliminar fiesta?</h3>
                        <p className="mb-6">
                            ¿Estás seguro de que querés eliminar <strong>{fiestaAEliminar?.dsNombre}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowModal(false);
                                    setFiestaAEliminar(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmarEliminacion}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

// export default function MisFiestasRecurrentes() {

//     // Ejecuta scrollTo solo una vez al montar el componente
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     const [fiestas, setFiestas] = useState([]);
//     const [newFiestaName, setNewFiestaName] = useState('');

//     // Estados para manejar la edición inline
//     const [editingIndex, setEditingIndex] = useState(null);
//     const [editingValue, setEditingValue] = useState('');

//     const handleAddFiesta = (e) => {
//         e.preventDefault();
//         const fiestaName = newFiestaName.trim();
//         if (!fiestaName) return;

//         // Verificar si el nombre ya existe (comparación case insensitive)
//         const existe = fiestas.some(f => f.toLowerCase() === fiestaName.toLowerCase());
//         if (existe) {
//             alert('La fiesta ya se encuentra en la lista.');
//             return;
//         }

//         setFiestas([...fiestas, fiestaName]);
//         setNewFiestaName('');
//     };

//     // Guarda el nuevo nombre y finaliza el modo edición
//     const handleEditSave = () => {
//         if (editingValue.trim()) {
//             const updatedFiestas = [...fiestas];
//             updatedFiestas[editingIndex] = editingValue.trim();
//             setFiestas(updatedFiestas);
//             setEditingIndex(null);
//             setEditingValue('');
//         }
//     };

//     // Cancela la edición sin guardar cambios
//     const handleEditCancel = () => {
//         setEditingIndex(null);
//         setEditingValue('');
//     };

//     const handleDelete = (index) => {
//         if (window.confirm('¿Estás seguro de que deseas eliminar la fiesta?')) {
//             const updatedFiestas = fiestas.filter((_, i) => i !== index);
//             setFiestas(updatedFiestas);
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-grow sm:px-10 mb-11">
//                 <NavBar />
//                 <div className="px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="md:col-span-2">
//                         <h1 className="mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
//                             Mis Fiestas Recurrentes:
//                         </h1>

//                         <p className="mb-4">
//                             Las fiestas recurrentes, como su nombre indica, son aquellas que organizas de manera regular.
//                             Pueden ser semanales, mensuales o con la frecuencia que tú elijas.
//                         </p>
//                         <p className="mb-4">
//                             Si una fiesta se va a hacer una sola vez, o si es una fiesta única que se hace porque viene
//                             determinado DJ a la Argentina, NO es una fiesta recurrente.
//                         </p>
//                         <p className="mb-4">
//                             En esta sección podrás agregar, editar o eliminar los nombres de las fiestas que realices
//                             de manera continua para mantener un registro actualizado.
//                         </p>
//                         <p className="mb-4">
//                             Además, las fiestas recurrentes podrán ser calificadas por aquellos usuarios que hayan
//                             adquirido una entrada para dicho evento. Van a poder puntuar la fiesta e incluso dejar un
//                             comentario si así lo desean.
//                         </p>

//                         <hr className="mt-7 mb-4" />

//                         <h2 className="mb-5 text-xl font-bold underline underline-offset-8">Agregar fiesta recurrente:</h2>
//                         <form onSubmit={handleAddFiesta} className="flex items-center space-x-2">
//                             <input
//                                 type="text"
//                                 className="input input-bordered w-full max-w-xs"
//                                 placeholder="Nombre de la fiesta"
//                                 value={newFiestaName}
//                                 onChange={(e) => setNewFiestaName(e.target.value)}
//                             />
//                             <button type="submit" className="btn btn-primary">
//                                 Confirmar
//                             </button>
//                         </form>

//                         <div className="mt-6">
//                             <h2 className="text-xl font-semibold mb-4">Listado de mis fiestas recurrentes:</h2>
//                             <table className="table w-full">
//                                 <thead>
//                                     <tr>
//                                         <th>Fiesta</th>
//                                         <th>Ver calificaciones</th>
//                                         <th>Editar</th>
//                                         <th>Eliminar</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {fiestas.map((fiesta, index) => (
//                                         <tr key={index}>
//                                             <td>
//                                                 {editingIndex === index ? (
//                                                     <input
//                                                         type="text"
//                                                         className="input input-bordered"
//                                                         value={editingValue}
//                                                         onChange={(e) => setEditingValue(e.target.value)}
//                                                         onKeyDown={(e) => {
//                                                             if (e.key === 'Enter') handleEditSave();
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     fiesta
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <Link to="/resenias-de-la-fiesta" className="link link-primary">
//                                                     Ver calificaciones
//                                                 </Link>
//                                             </td>
//                                             <td>
//                                                 {editingIndex === index ? (
//                                                     <>
//                                                         <button
//                                                             className="btn btn-xs btn-secondary mr-2"
//                                                             onClick={handleEditSave}
//                                                         >
//                                                             Guardar
//                                                         </button>
//                                                         <button
//                                                             className="btn btn-xs btn-warning"
//                                                             onClick={handleEditCancel}
//                                                         >
//                                                             Cancelar
//                                                         </button>
//                                                     </>
//                                                 ) : (
//                                                     <button
//                                                         className="btn btn-xs btn-secondary"
//                                                         onClick={() => {
//                                                             setEditingIndex(index);
//                                                             setEditingValue(fiestas[index]);
//                                                         }}
//                                                     >
//                                                         Editar
//                                                     </button>
//                                                 )}
//                                             </td>
//                                             <td>
//                                                 <button
//                                                     className="btn btn-xs btn-error"
//                                                     onClick={() => handleDelete(index)}
//                                                 >
//                                                     Eliminar
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="hidden md:block">
//                         {/* Tercera columna: contenido adicional o vacío */}
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }