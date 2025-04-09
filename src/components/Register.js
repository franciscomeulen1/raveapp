import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
     <div className="sm:px-10 mb-11">
      <header>
        <NavBar />
      </header>

      <div className="flex flex-col items-center">

      <div className="max-w-md w-full p-6">
        <h1 className="text-3xl font-bold mb-4">Registrarse</h1>
        <p className="mb-4">Completa tus datos, o registrate con Google:</p>
        <button className="btn btn-outline w-full mb-4">Login with Google</button>

        <form className="space-y-3">
          <label className="block">
            <span>Tu nombre:</span>
            <input type="text" className="input input-bordered w-full" placeholder="Tu nombre" />
          </label>

          <label className="block">
            <span>Tu apellido:</span>
            <input type="text" className="input input-bordered w-full" placeholder="Tu apellido" />
          </label>

          <label className="block">
            <span>Crea un usuario:</span>
            <input type="text" className="input input-bordered w-full" placeholder="Ej: usuario1" />
          </label>

          <label className="block">
            <span>Crea una contraseña:</span>
            <input type="password" className="input input-bordered w-full" placeholder="Tu password" />
          </label>

          <label className="block">
            <span>Tu fecha de nacimiento:</span>
            <input type="date" className="input input-bordered w-full" />
          </label>

          <label className="block">
            <span>Tu DNI/Pasaporte:</span>
            <input type="text" className="input input-bordered w-full" placeholder="123456789" />
          </label>

          <label className="block">
            <span>Tu correo electrónico:</span>
            <input type="email" className="input input-bordered w-full" placeholder="Tu email" />
          </label>

          <label className="block">
            <span>Tu teléfono: (sin 0 ni 15)</span>
            <input type="email" className="input input-bordered w-full" placeholder="Tu número de celular" />
          </label>

          <button className="btn btn-primary w-full">Registrarme</button>
        </form>
      </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

// function Register() {
//     return (
//         <div>
//             <label htmlFor="my-modal-register" className="btn modal-button btn-info hover:bg-indigo-400 hover:text-cyan-200 mx-2 btn-sm md:btn-md">Registrarme</label>


//             <input type="checkbox" id="my-modal-register" className="modal-toggle" />
//             <label htmlFor="my-modal-register" className="modal modal-middle">

//                 <form className="modal-box">

//                     <div className="flex justify-center mb-2">
//                         <button className="btn">Registrate con Google</button>
//                     </div>

//                     <h2 className="font-bold text-3xl mt-3 mb-2">Registrarse</h2>

//                     <div className='form-control w-full max-w-xs'>
//                         <label className="label">
//                             <span className="label-text">Tu nombre:</span>
//                         </label>
//                         <input type='email'
//                             placeholder="Tu email"
//                             className="input input-bordered w-full max-w-xs"
//                             autoFocus
//                         />
//                     </div>

//                     <div className='form-control w-full max-w-xs'>
//                         <label className="label">
//                             <span className="label-text">Tu apellido:</span>
//                         </label>
//                         <input type='email'
//                             placeholder="Tu email"
//                             className="input input-bordered w-full max-w-xs"
//                             autoFocus
//                         />
//                     </div>

//                     <div className='form-control w-full max-w-xs'>
//                         <label className="label">
//                             <span className="label-text">Tu email:</span>
//                         </label>
//                         <input type='email'
//                             placeholder="Tu email"
//                             className="input input-bordered w-full max-w-xs"
//                             autoFocus
//                         />
//                     </div>

//                     <div className='form-control w-full max-w-xs'>
//                         <label className="label">
//                             <span className="label-text">Tu constraseña:</span>
//                         </label>
//                         <input type='password'
//                             placeholder="Tu constraseña"
//                             className="input input-bordered w-full max-w-xs"
//                             autoFocus
//                         />
//                     </div>

//                     <div className="modal-action justify-start">
//                         <button type="submit" htmlFor="my-modal-2" className="btn">Registrarme</button>
//                     </div>

//                 </form>
//             </label>

//         </div>
//     );
// }

// export default Register;