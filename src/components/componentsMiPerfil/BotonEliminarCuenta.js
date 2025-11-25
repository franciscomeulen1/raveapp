// BotonEliminarCuenta.js – permite eliminar cuenta con confirmación
import { useState, useContext } from 'react';
import api from '../../componenteapi/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BotonEliminarCuenta() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            await api.delete(`/Usuario/DeleteUsuario/${user.id}`);
            logout(); // 🧼 Cierra sesión y limpia localStorage
            navigate('/'); // 🔁 Redirige al home
        } catch (err) {
            console.error('Error al eliminar cuenta:', err);
            alert('Ocurrió un error al eliminar tu cuenta.');
        }
    };

    return (
        <>
            <div className="flex justify-end mt-16">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition shadow-sm"
                >
                    Eliminar cuenta
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">¿Estás seguro?</h2>
                        <p className="text-center mb-6">
                            Esta acción eliminará tu cuenta permanentemente. <br />
                            <strong className="text-red-500">No se puede revertir.</strong>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Confirmo eliminar cuenta
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
