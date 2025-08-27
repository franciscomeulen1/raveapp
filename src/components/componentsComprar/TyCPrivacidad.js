import React from 'react';

export default function TyCPrivacidad() {
  return (
    <div className="form-control col-span-1 sm:col-span-2 lg:col-span-3 mt-2">
      <div className="flex items-center">
        <input type="checkbox" className="checkbox checkbox-secondary mt-1" required />
        <span className="ml-2 text-sm">
          Acepto los <a href="/terminos" className="link link-secondary">Términos y Condiciones</a> y la{' '}
          <a href="/privacidad" className="link link-secondary">Política de Privacidad</a>.
        </span>
      </div>
    </div>
  );
}
