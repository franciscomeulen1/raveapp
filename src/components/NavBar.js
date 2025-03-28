import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Filtros from './Filtros';
import Login from './Login';

function NavLink({ to, children }) {
  return (
    <li>
      <Link
        className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
        to={to}
      >
        {children}
      </Link>
    </li>
  );
}

function FiltrosButton() {
  return (
    <li>
      <label
        htmlFor="my-modal-filtros"
        className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
      >
        Filtros
      </label>
    </li>
  );
}

export default function NavBar({ onFilter }) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  // En commonLinks se renderiza el botón de Filtros si estamos en "/", y sino un botón "Eventos"
  const commonLinks = (
    <>
      {location.pathname === '/' ? (
        <FiltrosButton />
      ) : (
        <li>
          <Link
            to="/"
            className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
          >
            Eventos
          </Link>
        </li>
      )}
      <NavLink to="/artistas">Artistas</NavLink>
      <NavLink to="/noticias">Noticias</NavLink>
      <NavLink to="/crearevento">Crear Evento</NavLink>
    </>
  );

  const renderUserMenu = () => {
    if (!user) return null;
    if (user.rol === 'admin') {
      return (
        <>
          <li className="menu-title">
            <span>Administrador</span>
          </li>
          <li>
            <Link to="/validar-eventos">Validar eventos</Link>
          </li>
          <li>
            <Link to="/editar-artistas">Editar artistas</Link>
          </li>
          <li>
            <Link to="/editar-noticias">Editar noticias</Link>
          </li>
        </>
      );
    } else if (user.rol === 'duenioevento') {
      return (
        <>
          <li className="menu-title">
            <span>{user.name}</span>
          </li>
          <li>
            <Link to="/mis-entradas">Mis entradas</Link>
          </li>
          <li>
            <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
          </li>
          <li>
            <Link to="/datos-personales">Mis datos personales</Link>
          </li>
          <li className="menu-title">
            <span>Opciones de organizadores de eventos</span>
          </li>
          <li>
            <Link to="/eventos-creados">Mis eventos creados</Link>
          </li>
          <li>
            <Link to="/fiestas-recurrentes">Mis fiestas recurrentes</Link>
          </li>
          <li>
            <Link to="/entradas-vendidas">Entradas vendidas</Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="menu-title">
            <span>{user.name}</span>
          </li>
          <li>
            <Link to="/mis-entradas">Mis entradas</Link>
          </li>
          <li>
            <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
          </li>
          <li>
            <Link to="/datos-personales">Mis datos personales</Link>
          </li>
        </>
      );
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 object-top top-0 sticky z-10 mx-auto px-4 w-full">
        <div className="flex-1">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            {isDropdownOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                {commonLinks}
              </ul>
            )}
          </div>
          <Link className="btn btn-ghost normal-case text-xl" to="/">
            RaveApp
          </Link>
          <div className="gap-2 navbar hidden lg:flex">
            <ul className="mt-2 p-2">{commonLinks}</ul>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full max-w-md mt-1 lg:mt-0"
          />
          <button className="mr-2 btn btn-ghost btn-circle mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div>
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://i.pravatar.cc/300" alt="User avatar" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                {renderUserMenu()}
                <li>
                  <button onClick={() => setUser(null)}>Cerrar sesión</button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Login onLogin={handleLogin} />
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
        {/* Solo se muestra el componente Filtros (modal) si estamos en la página de inicio */}
        {location.pathname === '/' && <Filtros onFilter={onFilter} />}
      </div>

      <div className="block md:hidden">
        <div className="flex justify-end items-center">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered max-w-xs h-8"
          />
          <button className="mr-2 btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}



// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import Filtros from './Filtros';
// import Login from './Login';

// function NavLink({ to, children }) {
//   return (
//     <li>
//       <Link className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3" to={to}>
//         {children}
//       </Link>
//     </li>
//   );
// }

// function FiltrosButton() {
//   return (
//     <li>
//       <label htmlFor="my-modal-filtros" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">
//         Filtros
//       </label>
//     </li>
//   );
// }

// export default function NavBar({ onFilter }) {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null); // Estado para el usuario logueado

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleLogin = (userData) => {
//     setUser(userData);
//   };

//   const commonLinks = (
//     <>
//       <FiltrosButton />
//       <NavLink to="/artistas">Artistas</NavLink>
//       <NavLink to="/noticias">Noticias</NavLink>
//       <NavLink to="/crearevento">Crear Evento</NavLink>
//     </>
//   );

//   // Renderizamos el menú según el rol del usuario
//   const renderUserMenu = () => {
//     if (!user) return null;

//     switch (user.rol) {
//       case 'admin':
//         return (
//           <>
//             <li className="menu-title">
//               <span>Administrador</span>
//             </li>
//             <li>
//               <Link to="/validar-eventos">Validar eventos</Link>
//             </li>
//             <li>
//               <Link to="/editar-artistas">Editar artistas</Link>
//             </li>
//             <li>
//               <Link to="/editar-noticias">Editar noticias</Link>
//             </li>
//           </>
//         );
//       case 'duenioevento':
//         return (
//           <>
//             <li className="menu-title">
//               <span>{user.name}</span>
//             </li>
//             <li>
//               <Link to="/mis-entradas">Mis entradas</Link>
//             </li>
//             <li>
//               <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
//             </li>
//             <li>
//               <Link to="/datos-personales">Mis datos personales</Link>
//             </li>
//             <li className="menu-title">
//               <span>Opciones de organizadores de eventos</span>
//             </li>
//             <li>
//               <Link to="/eventos-creados">Mis eventos creados</Link>
//             </li>
//             <li>
//               <Link to="/fiestas-recurrentes">Mis fiestas recurrentes</Link>
//             </li>
//             <li>
//               <Link to="/entradas-vendidas">Entradas vendidas</Link>
//             </li>
//           </>
//         );
//       default:
//         // Rol normal u otro
//         return (
//           <>
//             <li className="menu-title">
//               <span>{user.name}</span>
//             </li>
//             <li>
//               <Link to="/mis-entradas">Mis entradas</Link>
//             </li>
//             <li>
//               <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
//             </li>
//             <li>
//               <Link to="/datos-personales">Mis datos personales</Link>
//             </li>
//           </>
//         );
//     }
//   };

//   return (
//     <div>
//       <div className="navbar bg-base-100 object-top top-0 sticky z-10 mx-auto px-4 w-full">
//         <div className="flex-1">
//           <div className="dropdown">
//             <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={toggleDropdown}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
//               </svg>
//             </label>
//             {isDropdownOpen && (
//               <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
//                 {commonLinks}
//               </ul>
//             )}
//           </div>
//           <Link className="btn btn-ghost normal-case text-xl" to="/">
//             RaveApp
//           </Link>
//           <div className="gap-2 navbar hidden lg:flex">
//             <ul className="mt-2 p-2">{commonLinks}</ul>
//           </div>
//         </div>
//         <div className="hidden md:flex items-center">
//           <input type="text" placeholder="Search" className="input input-bordered w-full max-w-md mt-1 lg:mt-0" />
//           <button className="mr-2 btn btn-ghost btn-circle mt-1">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </button>
//         </div>
//         <div>
//           {user ? (
//             <div className="dropdown dropdown-end">
//               <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//                 <div className="w-10 rounded-full">
//                   <img src="https://i.pravatar.cc/300" alt="User avatar" />
//                 </div>
//               </label>
//               <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
//                 {renderUserMenu()}
//                 <li>
//                   <button onClick={() => setUser(null)}>Cerrar sesión</button>
//                 </li>
//               </ul>
//             </div>
//           ) : (
//             <>
//               <Login onLogin={handleLogin} />
//               <Link to="/register" className="btn btn-primary">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//         <Filtros onFilter={onFilter} />
//       </div>

//       <div className="block md:hidden">
//         <div className="flex justify-end items-center">
//           <input type="text" placeholder="Search" className="input input-bordered max-w-xs h-8" />
//           <button className="mr-2 btn btn-ghost btn-circle">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }