import React from 'react';

/**
 * ModalTiempoExpirado
 *
 * Props:
 * - open: boolean
 * - onOk: () => void          // acción al confirmar (volver al evento)
 * - disabled?: boolean        // deshabilitar botón mientras se cancela en backend
 */
export default function ModalTiempoExpirado({ open, onOk, disabled = false }) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Tu reserva expiró</h3>
        <p className="py-4">
          Pasaron 10 minutos sin completar el pago y la reserva fue cancelada.
        </p>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onOk} disabled={disabled}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
