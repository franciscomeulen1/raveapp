import React from 'react';

export default function ModalReservaPendiente({
  open,
  onConfirm,
  onCancel,
  disabled = false,
  loadingPreview = false,
  preview = null,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar – Continuar con la compra actual',
}) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      {/* ancho cómodo para que entre el texto largo en una sola línea */}
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-lg">Compra pendiente detectada</h3>

        <p className="py-2">
          Tenés una reserva de entradas activa. ¿Querés continuar con esa compra pendiente?
        </p>

        {/* Preview */}
        <div className="mt-2 border rounded-lg p-3 bg-base-200">
          {loadingPreview ? (
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner" />
              <span>Cargando detalle…</span>
            </div>
          ) : preview ? (
            <>
              <p className="font-semibold mb-2">Evento: {preview.eventoNombre}</p>
              <ul className="list-disc pl-5 space-y-1">
                {preview.items.map((it, idx) => (
                  <li key={idx}>{it.linea}</li>
                ))}
              </ul>
              <div className="mt-3 text-right font-semibold">
                Subtotal: ${preview.subtotal}
              </div>
            </>
          ) : (
            <p className="italic">No se pudo cargar el detalle.</p>
          )}
        </div>

        {/* Botones apilados, centrados y con ancho según contenido */}
        <div className="modal-action flex flex-col items-center justify-center gap-2">
          <button
            className="btn btn-primary whitespace-nowrap px-3"
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </button>

          <button
            className="btn whitespace-nowrap px-3"
            onClick={onCancel}
            disabled={disabled}
            title={cancelLabel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}




// import React from 'react';

// /**
//  * ModalReservaPendiente
//  *
//  * Props:
//  * - open: boolean
//  * - onConfirm: () => void
//  * - onCancel: () => void
//  * - disabled?: boolean
//  * - loadingPreview?: boolean
//  * - preview?: {
//  *     eventoNombre: string,
//  *     items: Array<{ linea: string }>, // ya viene formateado para mostrar
//  *     subtotal: number
//  *   }
//  * - confirmLabel?: string
//  * - cancelLabel?: string
//  */
// export default function ModalReservaPendiente({
//   open,
//   onConfirm,
//   onCancel,
//   disabled = false,
//   loadingPreview = false,
//   preview = null,
//   confirmLabel = 'Confirmar',
//   cancelLabel = 'Cancelar – Continuar con la compra actual',
// }) {
//   if (!open) return null;

//   return (
//     <div className="modal modal-open">
//       <div className="modal-box">
//         <h3 className="font-bold text-lg">Compra pendiente detectada</h3>

//         <p className="py-2">
//           Tenés una reserva de entradas activa. ¿Querés continuar con esa compra pendiente?
//         </p>

//         {/* Preview */}
//         <div className="mt-2 border rounded-lg p-3 bg-base-200">
//           {loadingPreview ? (
//             <div className="flex items-center gap-2">
//               <span className="loading loading-spinner" />
//               <span>Cargando detalle…</span>
//             </div>
//           ) : preview ? (
//             <>
//               <p className="font-semibold mb-2">Evento: {preview.eventoNombre}</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 {preview.items.map((it, idx) => (
//                   <li key={idx}>{it.linea}</li>
//                 ))}
//               </ul>
//               <div className="mt-3 text-right font-semibold">
//                 Subtotal: ${preview.subtotal}
//               </div>
//             </>
//           ) : (
//             <p className="italic">No se pudo cargar el detalle.</p>
//           )}
//         </div>

//         <div className="modal-action flex flex-col gap-2 sm:flex-row sm:gap-3">
//           <button className="btn btn-primary" onClick={onConfirm} disabled={disabled}>
//             {confirmLabel}
//           </button>
//           <button className="btn" onClick={onCancel} disabled={disabled}>
//             {cancelLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }