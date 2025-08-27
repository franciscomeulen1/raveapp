import React from 'react';

export default function ResumenCompra({ evento, purchaseItems, subtotal, serviceFee, total, imagenEvento }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Imagen */}
        <div className="flex justify-center lg:justify-start">
          <img
            src={imagenEvento}
            alt="Imagen del evento"
            className="rounded-xl shadow-md object-contain h-40 sm:h-48 md:h-56 lg:h-64 w-[90%] sm:w-80 md:w-96 lg:w-full"
          />
        </div>

        {/* Items */}
        <div className="flex flex-col gap-4 lg:col-span-1 self-center">
          {purchaseItems.map((item, index) => (
            <div key={index} className="bg-base-100 shadow-xl p-4">
              <p className="text-sm md:text-base font-semibold">Evento: {evento.nombreEvento}</p>
              <p className="text-sm md:text-base">
                <strong>{item.cantidad} x {item.tipo}</strong> para el día <strong>{item.dia}</strong> a ${item.precio} c/u
              </p>
              <p className="text-sm md:text-base">Subtotal: ${item.itemSubtotal}</p>
            </div>
          ))}
        </div>

        {/* Col vacía (solo lg) */}
        <div className="hidden lg:block" />
      </div>

      <div className="my-5 text-sm md:text-base">
        <p className="font-semibold">Subtotal: ${subtotal}</p>
        <p className="font-semibold text-green-700">Cargo por servicio: ${serviceFee}</p>
        <p className="text-lg md:text-xl font-bold">Total: ${total}</p>
      </div>
    </>
  );
}
