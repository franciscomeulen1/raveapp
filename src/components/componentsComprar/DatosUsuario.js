import React from 'react';

export default function DatosUsuario({ form, errors, isEditable, onChange }) {
  return (
    <>
      {/* Nombre y Apellido */}
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Nombre:</span></label>
        <input type="text" value={form.nombre} disabled className="input input-bordered w-full bg-gray-100" />
      </div>
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Apellido:</span></label>
        <input type="text" value={form.apellido} disabled className="input input-bordered w-full bg-gray-100" />
      </div>
      <div className="hidden lg:block" />

      {/* Email y Teléfono */}
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Email:</span></label>
        <input type="email" value={form.email} disabled className="input input-bordered w-full bg-gray-100" />
      </div>
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Teléfono:</span></label>
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          required
          disabled={!isEditable('telefono')}
          className={`input input-bordered w-full ${!isEditable('telefono') ? 'bg-gray-100' : ''} ${errors.telefono ? 'input-error' : ''}`}
        />
        {errors.telefono && <span className="text-error text-sm mt-1">{errors.telefono}</span>}
      </div>
      <div className="hidden lg:block" />

      {/* Tipo Id y Número */}
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Tipo de identificación:</span></label>
        <select
          className="select select-bordered w-full"
          name="tipoId"
          value={form.tipoId}
          onChange={onChange}
          disabled={!isEditable('numeroId')}
          required
        >
          <option value="DNI">DNI</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Número de identificación:</span></label>
        <input
          type="text"
          name="numeroId"
          value={form.numeroId}
          onChange={onChange}
          required
          disabled={!isEditable('dni')}
          className={`input input-bordered w-full ${!isEditable('dni') ? 'bg-gray-100' : ''} ${errors.numeroId ? 'input-error' : ''}`}
        />
        {errors.numeroId && <span className="text-error text-sm mt-1">{errors.numeroId}</span>}
      </div>
      <div className="hidden lg:block" />

      {/* Fecha de nacimiento */}
      <div className="form-control col-span-1">
        <label className="label"><span className="label-text">Fecha de nacimiento:</span></label>
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={onChange}
          required
          disabled={!isEditable('dtNacimiento')}
          className={`input input-bordered w-full ${!isEditable('dtNacimiento') ? 'bg-gray-100' : ''} ${errors.birthdate ? 'input-error' : ''}`}
        />
        {errors.birthdate && <span className="text-error text-sm mt-1">{errors.birthdate}</span>}
      </div>
      <div className="hidden lg:block" />
      <div className="hidden lg:block" />

      {/* Aviso edición en perfil */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-sm">
        <p className="text-gray-600">
          Si necesitas modificar alguno de tus datos personales, por favor, ingresa a{' '}
          <a href="/miperfil" className="text-blue-600 underline">tu perfil</a> para poder editarlos.
        </p>
      </div>
    </>
  );
}
