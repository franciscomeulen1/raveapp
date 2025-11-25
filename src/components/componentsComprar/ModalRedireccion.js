// ModalRedireccion.jsx
export default function ModalRedireccion({ open, onClose, onConfirm, confirmDisabled }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">Vas a ir a MercadoPago</h3>
        <p className="mb-6">
          Te vamos a redirigir a MercadoPago para completar tu compra. Al finalizar, volverás a RaveApp.
        </p>
        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-secondary"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmDisabled ? 'Creando pago...' : 'Ok'}
          </button>
        </div>
      </div>
    </div>
  );
}
