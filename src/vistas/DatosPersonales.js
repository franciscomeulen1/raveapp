import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa'; // Importa un ícono de edición

export default function DatosPersonales(props) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="sm:px-10 mb-11">
                    <NavBar />
                    <h1 className="px-10 mb-4 mt-2 text-3xl font-bold underline underline-offset-8">
                        Datos personales:
                    </h1>
                    
                    <div className="pl-10 mb-8">
                        <EditableProfilePicture />
                    </div>

                    <div className="space-y-4 pl-10">
                        <EditableField label="Nombre" initialValue="Juan" />
                        <EditableField label="Apellido" initialValue="Lopez" />
                        <EditableField label="DNI" initialValue="99889988" />
                        <EditableField label="Celular" initialValue="1165652121" />
                        <EditableField label="Email" initialValue="juanlopez@gmail.com" />
                        <EditablePasswordField label="Contraseña" />

                        <div className="border-t mt-4 pt-4">
                            <h3 className="text-xl font-semibold mb-4">Domicilio de facturación:</h3>
                            <EditableField label="Provincia" initialValue="Capital Federal" />
                            <EditableField label="Municipio" initialValue="Capital Federal" />
                            <EditableField label="Localidad" initialValue="Capital Federal" />
                            <EditableField label="Calle" initialValue="Malvinas Argentinas" />
                            <EditableField label="Número" initialValue="8890" />
                            <EditableField label="Piso/Depto" initialValue="5 B" />
                        </div>

                        <div className="flex justify-start space-x-4 mt-6">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                Confirmar
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

// Componente para foto de perfil editable
const EditableProfilePicture = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState("https://i.pravatar.cc/300");

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfilePic(imageUrl);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col items-start">
            {/* Título de la sección de foto */}
            <p className="font-semibold mb-2">Foto de perfil:</p>
            
            {/* Contenedor relativo para superponer el botón de edición sobre la imagen */}
            <div className="relative inline-block">
                <img 
                    src={profilePic} 
                    alt="Foto de perfil" 
                    className="w-32 h-32 rounded-full object-cover border border-gray-300"
                />
                
                {/* Botón circular con el ícono de edición */}
                <button
                    onClick={handleEditClick}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center rounded-full border border-gray-300 shadow"
                >
                    <FaEdit className="text-xl" />
                </button>
            </div>
            
            {/* Input para seleccionar la imagen, se muestra solo si isEditing es true */}
            {isEditing && (
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="mt-2"
                />
            )}
        </div>
    );
};

// Componente para campos editables
const EditableField = ({ label, initialValue, type = "text" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);  // Confirma la edición cuando se presiona Enter
        }
    };

    return (
        <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 flex items-center space-x-2">
                {isEditing ? (
                    <input
                        type={type}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                ) : (
                    <span>{value}</span>
                )}
                {!isEditing && (
                    <FaEdit
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={handleEditClick}
                    />
                )}
            </div>
        </div>
    );
};

// Componente para el campo de contraseña editable con funcionalidad adicional
const EditablePasswordField = ({ label }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChangePasswordClick = () => {
        // Lógica para cambiar la contraseña (e.g., validaciones)
        setIsEditing(false);
    };

    return (
        <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1 flex items-center space-x-2">
                {!isEditing ? (
                    <>
                        <span>**********</span>
                        <FaEdit
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={handleEditClick}
                        />
                    </>
                ) : (
                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="Contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                            type="password"
                            placeholder="Repetir nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                            onClick={handleChangePasswordClick}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};



// import React, { useState } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { FaEdit } from 'react-icons/fa'; // Importa un ícono de edición

// export default function DatosPersonales(props) {
//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex-1">
//                 <div className="sm:px-10 mb-11">
//                     <NavBar />
//                     <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>
//                         Datos personales:
//                     </h1>

//                     <div className="space-y-4 pl-10">
//                         <EditableField label="Nombre" initialValue="Juan" />
//                         <EditableField label="Apellido" initialValue="Lopez" />
//                         <EditableField label="DNI" initialValue="99889988" />
//                         <EditableField label="Celular" initialValue="1165652121" />
//                         <EditableField label="Email" initialValue="juanlopez@gmail.com" />
//                         <EditablePasswordField label="Contraseña" />

//                         <div className="border-t mt-4 pt-4">
//                             <h3 className="text-xl font-semibold mb-4">Domicilio de facturación:</h3>
//                             <EditableField label="Provincia" initialValue="Capital Federal" />
//                             <EditableField label="Municipio" initialValue="Capital Federal" />
//                             <EditableField label="Localidad" initialValue="Capital Federal" />
//                             <EditableField label="Calle" initialValue="Malvinas Argentinas" />
//                             <EditableField label="Número" initialValue="8890" />
//                             <EditableField label="Piso/Depto" initialValue="5 B" />
//                         </div>

//                         <div className="flex justify-start space-x-4 mt-6">
//                             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
//                                 Confirmar
//                             </button>
//                             <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
//                                 Cancelar
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// // Componente para campos editables
// const EditableField = ({ label, initialValue, type = "text" }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [value, setValue] = useState(initialValue);

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleInputChange = (e) => {
//         setValue(e.target.value);
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             setIsEditing(false);  // Confirma la edición cuando se presiona Enter
//         }
//     };

//     return (
//         <div className="max-w-xs">
//             <label className="block text-sm font-medium text-gray-700">
//                 {label}
//             </label>
//             <div className="mt-1 flex items-center space-x-2">
//                 {isEditing ? (
//                     <input
//                         type={type}
//                         value={value}
//                         onChange={handleInputChange}
//                         onBlur={handleBlur}
//                         onKeyDown={handleKeyDown} // Maneja el evento de tecla presionada
//                         autoFocus
//                         className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     />
//                 ) : (
//                     <span>{value}</span>
//                 )}
//                 {!isEditing && (
//                     <FaEdit
//                         className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                         onClick={handleEditClick}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// // Componente para el campo de contraseña editable con la funcionalidad adicional
// const EditablePasswordField = ({ label }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleChangePasswordClick = () => {
//         // Lógica para cambiar la contraseña (e.g., validaciones)
//         setIsEditing(false);
//     };

//     return (
//         <div className="max-w-xs">
//             <label className="block text-sm font-medium text-gray-700">
//                 {label}
//             </label>
//             <div className="mt-1 flex items-center space-x-2">
//                 {!isEditing ? (
//                     <>
//                         <span>**********</span>
//                         <FaEdit
//                             className="text-gray-500 hover:text-gray-700 cursor-pointer"
//                             onClick={handleEditClick}
//                         />
//                     </>
//                 ) : (
//                     <div className="space-y-4">
//                         <input
//                             type="password"
//                             placeholder="Contraseña actual"
//                             value={currentPassword}
//                             onChange={(e) => setCurrentPassword(e.target.value)}
//                             className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                         <input
//                             type="password"
//                             placeholder="Nueva contraseña"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                         <input
//                             type="password"
//                             placeholder="Repetir nueva contraseña"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                         <button
//                             onClick={handleChangePasswordClick}
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
//                         >
//                             Cambiar contraseña
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };