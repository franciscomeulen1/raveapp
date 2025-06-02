// components/Login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // estado local para el modal de bloqueo
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login({
        email,
        password,
        onBlocked: () => setBlocked(true),
      });
      // si no fue bloqueado, limpio campos y cierro modal
      if (!blocked) {
        setEmail('');
        setPassword('');
        document.getElementById('my-modal-login').checked = false;

        // Redirige si había un destino guardado
        const redirectTo = localStorage.getItem('postLoginRedirect');
        if (redirectTo) {
          localStorage.removeItem('postLoginRedirect');
          navigate(redirectTo);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Botón que abre el modal. Si estamos parados en la pagina de register, redirecciona al inicio */}
      <label
        htmlFor="my-modal-login"
        className="btn modal-button btn-primary"
        onClick={() => {
          if (window.location.pathname === '/register') {
            localStorage.setItem('postLoginRedirect', '/');
          }
        }}
      >
        Ingresar
      </label>

      {/* Modal */}
      <input type="checkbox" id="my-modal-login" className="modal-toggle" />
      <label htmlFor="my-modal-login" className="modal cursor-pointer">
        <form className="modal-box" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">Iniciar Sesión</h3>

          <input
            type="email"
            placeholder="Tu email"
            className="input input-bordered w-full mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Tu contraseña"
            className="input input-bordered w-full mb-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {blocked && (
            <p className="text-yellow-600 mb-2">
              Tus credenciales son válidas únicamente para la app de validación de entradas.
            </p>
          )}

          <div className="modal-action justify-between">
            <button type="submit" className="btn">Ingresar</button>
            <button type="button" className="btn btn-ghost">Olvidaste la contraseña?</button>
          </div>
        </form>
      </label>
    </>
  );
}

export default Login;


// // Login.js
// import { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const dummyUsers = [
//   { name: 'Usuario Uno', email: 'user1@example.com', password: 'password1', rol: 'normal' },
//   { name: 'Usuario Dos', email: 'user2@example.com', password: 'password2', rol: 'duenioevento' },
//   { name: 'Usuario Tres', email: 'user3@example.com', password: 'password3', rol: 'admin' },
// ];

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const foundUser = dummyUsers.find(
//       (user) => user.email === email && user.password === password
//     );
//     if (foundUser) {
//       login(foundUser);
//       setEmail('');
//       setPassword('');
//       setError('');
//       // Cierra el modal (según la implementación actual con checkbox)
//       document.getElementById('my-modal-login').checked = false;
//     } else {
//       setError('Datos incorrectos, por favor revisa tu email y contraseña.');
//     }
//   };

//   return (
//     <div>
//       <label htmlFor="my-modal-login" className="btn modal-button btn-primary hover:bg-indigo-400 hover:text-cyan-200 mx-2 btn-sm md:btn-md">
//         Ingresar
//       </label>

//       <input type="checkbox" id="my-modal-login" className="modal-toggle" />
//       <label htmlFor="my-modal-login" className="modal modal-middle">
//         <form className="modal-box" onSubmit={handleSubmit}>
//           <div className="flex justify-center mb-2">
//             <button className="btn" type="button">
//               Iniciar sesión con Google
//             </button>
//           </div>

//           <h2 className="font-bold text-3xl mt-3 mb-2">Iniciar Sesión</h2>

//           <div className="form-control w-full max-w-xs">
//             <label className="label">
//               <span className="label-text">Tu email:</span>
//             </label>
//             <input
//               type="email"
//               placeholder="Tu email"
//               className="input input-bordered w-full max-w-xs"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoFocus
//             />
//           </div>

//           <div className="form-control w-full max-w-xs">
//             <label className="label">
//               <span className="label-text">Tu contraseña:</span>
//             </label>
//             <input
//               type="password"
//               placeholder="Tu contraseña"
//               className="input input-bordered w-full max-w-xs"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//           <div className="modal-action justify-between">
//             <button type="submit" className="btn">
//               Ingresar
//             </button>
//             <button type="button" className="text-indigo-900 font-medium">
//               Olvidaste la contraseña?
//             </button>
//           </div>
//         </form>
//       </label>
//     </div>
//   );
// }

// export default Login;