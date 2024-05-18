import React from 'react';

const InputFechaHora = ({ label, value, onChange }) => {

  return (
    <div className='form-control'>
      <label className='label'>
        <span className='label-text font-semibold text-lg'>{label}</span>
      </label>
      <input
        type='datetime-local'
        value={value}
        onChange={onChange}
        className='input input-bordered w-full max-w-md'
      />
    </div>
  );
};

export default InputFechaHora;