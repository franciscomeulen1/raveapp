import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

export default function Comprar() {
  window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
  const location = useLocation();
  const { evento, purchaseItems, subtotal, serviceFee, total } = location.state;

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />
        <h1 className='mx-10 sm:px-10 mt-2 mb-3 text-2xl font-bold'>Resumen de tu compra:</h1>
        
        {purchaseItems.length === 0 ? (
          <p className='mx-10 sm:px-10'>No seleccionaste entradas.</p>
        ) : (
          <div className="mx-10 sm:px-10">
            {purchaseItems.map((item, index) => (
              <div key={index} className="bg-base-100 shadow-xl my-3 p-3">
                <p className='text-lg font-semibold'>Evento: {evento.nombreEvento}</p>
                <p>
                  <strong>{item.cantidad} x {item.tipo}</strong> para el día <strong>{item.dia}</strong> a ${item.precio} c/u
                </p>
                <p>Subtotal: ${item.itemSubtotal}</p>
              </div>
            ))}
            <div className="my-5">
              <p className='text-lg font-semibold'>Subtotal: ${subtotal}</p>
              <p className='font-semibold text-green-700'>Cargo por servicio: ${serviceFee}</p>
              <p className='text-xl font-bold'>Total: ${total}</p>
            </div>
          </div>
        )}

        <h2 className='mx-10 sm:px-10 mt-4 mb-3 text-2xl font-bold'>Ingresa tus datos:</h2>
        <form className="grid sm:grid-cols-2 justify-center px-16 gap-x-3">
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Nombre:</span>
            </label>
            <input type='text'
              placeholder="Escribe tu nombre"
              className="input input-bordered w-full max-w-xs"
              autoFocus
            />
          </div>
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Apellido:</span>
            </label>
            <input type='text'
              placeholder="Escribe tu apellido"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Tipo de identificación:</span>
            </label>
            <select className="select select-bordered">
              <option defaultValue>DNI</option>
              <option>Pasaporte</option>
            </select>
          </div>
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Número de identificación:</span>
            </label>
            <input type='text'
              placeholder="Ejemplo: 36367878"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input type='email'
              placeholder="tumail@mail.com"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Confirmación de Email:</span>
            </label>
            <input type='email'
              placeholder="tumail@mail.com"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className='form-control'>
            <label className="label">
              <span className="label-text">Teléfono:</span>
            </label>
            <input type='text'
              placeholder="1155556666"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div></div>
          <div className='py-5'>
            <p className='text-sm'>** Al hacer clic en comprar, te redireccionaremos a MercadoPago para que puedas realizar el pago y finalizar la compra.</p>
          </div>
          <div>
            <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
