// BotonCambiarContrasena.js – botón + modal de cambio de contraseña
import { useState } from 'react';
import api from '../../componenteapi/api';

export default function BotonCambiarContrasena({ userData }) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return alert('Por favor completá todos los campos.');
        }

        if (newPassword !== confirmPassword) {
            return alert('Las nuevas contraseñas no coinciden.');
        }

        try {
            // Paso 1: Validar la contraseña actual
            const loginRes = await api.get('/Usuario/Login', {
                params: {
                    Correo: userData.correo,
                    Password: oldPassword,
                }
            });

            if (loginRes.data !== true) {
                return alert('La contraseña actual es incorrecta.');
            }

            // Paso 2: Cambiar contraseña si la anterior es correcta
            await api.put(`/Usuario/RecoverPass`, null, {
                params: {
                    Correo: userData.correo,
                    NewPass: newPassword,
                }
            });

            alert('Contraseña actualizada con éxito.');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordModal(false);
        } catch (err) {
            console.error('Error al cambiar contraseña:', err);
            alert('Ocurrió un error al cambiar la contraseña.');
        }
    };

    return (
        <>
            <button
                onClick={() => setShowPasswordModal(true)}
                className="mt-6 self-start bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-200 transition text-sm font-medium shadow-sm"
            >
                Cambiar contraseña
            </button>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Cambiar contraseña</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
