import React from "react";

export default function Buscador({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white 
            text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            placeholder:text-gray-400
          "
        />
      </div>
    </div>
  );
}
