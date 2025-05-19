import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

export default function Comprar() {

  useEffect(() => {
    window.scrollTo(0, 0);  // Establece el scroll en la parte superior de la página
  }, []);

  const location = useLocation();
  const { evento, purchaseItems, subtotal, serviceFee, total } = location.state;

  // Estados para validaciones
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [errors, setErrors] = useState({});
  const [telefono, setTelefono] = useState('');
  const [tipoId, setTipoId] = useState('DNI');
  const [numeroId, setNumeroId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let currentErrors = {};

    // Validación de email
    if (email !== confirmEmail) {
      currentErrors.email = 'Los emails no coinciden.';
    }

    // Validación de edad
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const isUnderage = m < 0 || (m === 0 && today.getDate() < birth.getDate());

    if (isNaN(birth.getTime()) || age < 18 || (age === 18 && isUnderage)) {
      currentErrors.birthdate = 'Debés tener al menos 18 años para comprar entradas.';
    }

    // Validación de teléfono
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(telefono)) {
      currentErrors.telefono = 'El teléfono debe contener al menos 8 dígitos numéricos sin espacios ni símbolos.';
    }

    // Validación de DNI o PASAPORTE
    if (tipoId === 'DNI') {
      const dniRegex = /^[0-9]{7,9}$/;
      if (!dniRegex.test(numeroId)) {
        currentErrors.numeroId = 'El DNI debe tener entre 7 y 9 dígitos, sin puntos ni letras.';
      }
    } else if (tipoId === 'Pasaporte') {
      const passRegex = /^[A-Za-z0-9]{6,12}$/;
      if (!passRegex.test(numeroId)) {
        currentErrors.numeroId = 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.';
      }
    }

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      // Enviar datos o redireccionar a MercadoPago
      console.log('Formulario válido. Continuar con la compra.');
    }
  };


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
        {/* <form className="grid sm:grid-cols-2 justify-center px-16 gap-x-3"> */}
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 justify-center px-16 gap-x-3">

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Nombre:</span>
            </label>
            <input type='text'
              placeholder="Escribe tu nombre"
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Apellido:</span>
            </label>
            <input type='text'
              placeholder="Escribe tu apellido"
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Tipo de identificación:</span>
            </label>
            <select
              className="select select-bordered"
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
              required
            >
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Número de identificación:</span>
            </label>
            <input
              type='text'
              placeholder={tipoId === 'DNI' ? "Ejemplo: 36367878" : "Ejemplo: X123456"}
              className={`input input-bordered w-full max-w-xs ${errors.numeroId ? 'input-error' : ''}`}
              value={numeroId}
              onChange={(e) => setNumeroId(e.target.value)}
              required
            />
            {errors.numeroId && <span className="text-error text-sm mt-1">{errors.numeroId}</span>}
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input
              type='email'
              placeholder="tumail@mail.com"
              className="input input-bordered w-full max-w-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Confirmación de Email:</span>
            </label>
            <input
              type='email'
              placeholder="Reingresá tu email"
              className={`input input-bordered w-full max-w-xs ${errors.email ? 'input-error' : ''}`}
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
            />
            {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Teléfono:</span>
            </label>
            <input
              type='tel'
              placeholder="1155556666"
              className={`input input-bordered w-full max-w-xs ${errors.telefono ? 'input-error' : ''}`}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            {errors.telefono && <span className="text-error text-sm mt-1">{errors.telefono}</span>}
          </div>

          <div className='form-control'>
            <label className="label">
              <span className="label-text">Fecha de nacimiento:</span>
            </label>
            <input
              type='date'
              className={`input input-bordered w-full max-w-xs ${errors.birthdate ? 'input-error' : ''}`}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
            {errors.birthdate && <span className="text-error text-sm mt-1">{errors.birthdate}</span>}
          </div>

          <div className="form-control col-span-2 mt-2">
            <div className="flex items-center">
              <input type="checkbox" className="checkbox checkbox-secondary mt-1" required />
              <span className="ml-2 text-sm">
                Acepto los <a href="/terminos" className="link link-secondary">Términos y Condiciones</a> y la <a href="/privacidad" className="link link-secondary">Política de Privacidad</a>.
              </span>
            </div>
          </div>

          <div className='col-span-2 py-5'>
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
