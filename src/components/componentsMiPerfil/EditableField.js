// EditableField.js – campo editable reutilizable
import { useEffect, useState } from 'react';

export default function EditableField({ label, value, onChange, type = 'text' }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(tempValue);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <input
                        type={type}
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                ) : (
                    <span className="text-gray-800 text-sm">{value}</span>
                )}
                <span
                    className="text-indigo-500 hover:text-indigo-700 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                >
                    ✏️
                </span>
            </div>
        </div>
    );
}
