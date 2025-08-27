import React from 'react';

export default function ModalRedireccion({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Redirección a MercadoPago</h3>
        <p>Se te redirigirá a MercadoPago para que puedas completar la compra de tu/s entrada/s.</p>
        <div className="mt-6 text-right">
          <button className="btn btn-primary" onClick={onClose}>Ok</button>
        </div>
      </div>
    </div>
  );
}
