// src/components/componentsMiPerfil/EditableField.js
import { useEffect, useState } from 'react';

export default function EditableField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  useEffect(() => {
    setTempValue(value || '');
  }, [value]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
     setTempValue(value || '');
     setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label className="text-sm font-semibold text-gray-800">
        {label}
      </label>

      {/* Contenedor */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex-1 flex gap-2 items-center">
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm bg-white"
              placeholder={placeholder}
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition"
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-900">
              {value && value !== '' ? value : <span className="text-gray-400">Sin datos</span>}
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg border border-indigo-100 bg-white text-indigo-500 hover:bg-indigo-50 transition"
              aria-label={`Editar ${label}`}
            >
              {/* Ícono lápiz SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487l2.651 2.651m-2.651-2.651L9.75 10.6a2.25 2.25 0 00-.553.96l-.447 1.789 1.79-.447a2.25 2.25 0 00.96-.553l7.112-7.113zm0 0L19.5 6.138"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// // EditableField.js – campo editable reutilizable
// import { useEffect, useState } from 'react';

// export default function EditableField({ label, value, onChange, type = 'text' }) {
//     const [isEditing, setIsEditing] = useState(false);
//     const [tempValue, setTempValue] = useState(value);

//     useEffect(() => {
//         setTempValue(value);
//     }, [value]);

//     const handleBlur = () => {
//         setIsEditing(false);
//         onChange(tempValue);
//     };

//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <div className="flex items-center space-x-2">
//                 {isEditing ? (
//                     <input
//                         type={type}
//                         value={tempValue}
//                         onChange={e => setTempValue(e.target.value)}
//                         onBlur={handleBlur}
//                         autoFocus
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                     />
//                 ) : (
//                     <span className="text-gray-800 text-sm">{value}</span>
//                 )}
//                 <span
//                     className="text-indigo-500 hover:text-indigo-700 cursor-pointer"
//                     onClick={() => setIsEditing(true)}
//                 >
//                     ✏️
//                 </span>
//             </div>
//         </div>
//     );
// }
