// components/NavBar.js
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Filtros from './Filtros';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import ProtectedLink from './componentsCrearEvento/ProtectedLink';

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
  const { user, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(open => !open);
  };

  // Helpers para chequear roles
  const roles = user?.roles ?? [];
  const isAdmin       = roles.some(r => r.cdRol === 1);
  const isOrganizador = roles.some(r => r.cdRol === 2);
  const isNormal      = roles.some(r => r.cdRol === 0);


  const renderUserMenu = () => {
    if (!user) return null;

    // Si es admin, muestro solo el menú de admin
    if (isAdmin) {
      return (
        <>
          <li className="menu-title"><span>Administrador</span></li>
          <li><Link to="/eventosavalidar">Validar eventos</Link></li>
          <li><Link to="/crear-artista">Crear artista</Link></li>
          <li><Link to="/modificar-eliminar-artistas">Editar artistas</Link></li>
          <li><Link to="/crear-noticia">Crear noticia</Link></li>
          <li><Link to="/modificar-eliminar-noticias">Editar noticias</Link></li>
        </>
      );
    }

    // Si no es admin, voy acumulando secciones según roles
    const items = [];

    if (isNormal) {
      items.push(
        <li key="u-title" className="menu-title"><span>{user.name}</span></li>,
        <li key="u-entradas"><Link to="/mis-entradas">Mis entradas</Link></li>,
        <li key="u-fav"><Link to="/eventos-favoritos">Mis eventos favoritos</Link></li>,
        <li key="u-datos"><Link to="/datospersonales">Mis datos personales</Link></li>
      );
    }

    if (isOrganizador) {
      items.push(
        <li key="o-title" className="menu-title"><span>Opciones de organizador</span></li>,
        <li key="o-eventos"><Link to="/mis-eventos-creados">Mis eventos creados</Link></li>,
        <li key="o-recurrentes"><Link to="/mis-fiestas-recurrentes">Mis fiestas recurrentes</Link></li>,
        <li key="o-vendidas"><Link to="/entradas-vendidas">Entradas vendidas</Link></li>
      );
    }

    return items;
  };

  return (
    <div>
      {/* Navbar principal */}
      <div className="navbar bg-base-100 sticky top-0 z-10 mx-auto px-4 w-full">
        <div className="flex-1">
          {/* Menú hamburguesa (LG en adelante lo oculta) */}
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={toggleDropdown}
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                   className="h-5 w-5"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke="currentColor"
              >
                <path strokeLinecap="round"
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
                {location.pathname === '/' ? <FiltrosButton /> : (
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
                {/* <NavLink to="/crearevento">Crear Evento</NavLink> */}
                <ProtectedLink to="/crearevento">Crear Evento</ProtectedLink>
              </ul>
            )}
          </div>

          {/* Logo / título */}
          <Link className="btn btn-ghost normal-case text-xl" to="/">
            RaveApp
          </Link>

          {/* Links horizontales (solo en md/lg en adelante) */}
          <div className="hidden lg:flex gap-2">
            <ul className="mt-2 p-2 flex items-center">
              {location.pathname === '/' ? <FiltrosButton /> : (
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
              {/* <NavLink to="/crearevento">Crear Evento</NavLink> */}
              <ProtectedLink to="/crearevento">Crear Evento</ProtectedLink>
            </ul>
          </div>
        </div>

        {/* Avatar / Login */}
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
                  <button onClick={logout}>Cerrar sesión</button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Login />
              <Link to="/register" className="btn btn-primary ml-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Filtros (solo cuando estás en “/”) */}
      {location.pathname === '/' && <Filtros onFilter={onFilter} />}

    </div>
  );
}



// // NavBar.js
// import { Link, useLocation } from 'react-router-dom';
// import { useState, useContext } from 'react';
// import Filtros from './Filtros';
// import Login from './Login';
// import { AuthContext } from '../context/AuthContext';

// function NavLink({ to, children }) {
//   return (
//     <li>
//       <Link
//         className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
//         to={to}
//       >
//         {children}
//       </Link>
//     </li>
//   );
// }

// function FiltrosButton() {
//   return (
//     <li>
//       <label
//         htmlFor="my-modal-filtros"
//         className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
//       >
//         Filtros
//       </label>
//     </li>
//   );
// }

// export default function NavBar({ onFilter }) {
//   const location = useLocation();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { user, logout } = useContext(AuthContext);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const renderUserMenu = () => {
//     if (!user) return null;
//     if (user.rol === 'admin') {
//       return (
//         <>
//           <li className="menu-title">
//             <span>Administrador</span>
//           </li>
//           <li>
//             <Link to="/eventosavalidar">Validar eventos</Link>
//           </li>
//           <li>
//             <Link to="/crear-artista">Crear artista</Link>
//           </li>
//           <li>
//             <Link to="/modificar-eliminar-artistas">Editar artistas</Link>
//           </li>
//           <li>
//             <Link to="/crear-noticia">Crear noticia</Link>
//           </li>
//           <li>
//             <Link to="/modificar-eliminar-noticias">Editar noticias</Link>
//           </li>
//         </>
//       );
//     } else if (user.rol === 'duenioevento') {
//       return (
//         <>
//           <li className="menu-title">
//             <span>{user.name}</span>
//           </li>
//           <li>
//             <Link to="/mis-entradas">Mis entradas</Link>
//           </li>
//           <li>
//             <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
//           </li>
//           <li>
//             <Link to="/datospersonales">Mis datos personales</Link>
//           </li>
//           <li className="menu-title">
//             <span>Opciones de organizadores de eventos</span>
//           </li>
//           <li>
//             <Link to="/eventos-creados">Mis eventos creados</Link>
//           </li>
//           <li>
//             <Link to="/fiestas-recurrentes">Mis fiestas recurrentes</Link>
//           </li>
//           <li>
//             <Link to="/entradas-vendidas">Entradas vendidas</Link>
//           </li>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <li className="menu-title">
//             <span>{user.name}</span>
//           </li>
//           <li>
//             <Link to="/mis-entradas">Mis entradas</Link>
//           </li>
//           <li>
//             <Link to="/eventos-favoritos">Mis eventos favoritos</Link>
//           </li>
//           <li>
//             <Link to="/datospersonales">Mis datos personales</Link>
//           </li>
//         </>
//       );
//     }
//   };

//   return (
//     <div>
//       <div className="navbar bg-base-100 object-top top-0 sticky z-10 mx-auto px-4 w-full">
//         <div className="flex-1">
//           <div className="dropdown">
//             <label
//               tabIndex={0}
//               className="btn btn-ghost lg:hidden"
//               onClick={toggleDropdown}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h8m-8 6h16"
//                 />
//               </svg>
//             </label>
//             {isDropdownOpen && (
//               <ul
//                 tabIndex={0}
//                 className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               >
//                 {location.pathname === '/' ? (
//                   <FiltrosButton />
//                 ) : (
//                   <li>
//                     <Link
//                       to="/"
//                       className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
//                     >
//                       Eventos
//                     </Link>
//                   </li>
//                 )}
//                 <NavLink to="/artistas">Artistas</NavLink>
//                 <NavLink to="/noticias">Noticias</NavLink>
//                 <NavLink to="/crearevento">Crear Evento</NavLink>
//               </ul>
//             )}
//           </div>
//           <Link className="btn btn-ghost normal-case text-xl" to="/">
//             RaveApp
//           </Link>
//           <div className="gap-2 navbar hidden lg:flex">
//             <ul className="mt-2 p-2">
//               {location.pathname === '/' ? (
//                 <FiltrosButton />
//               ) : (
//                 <li>
//                   <Link
//                     to="/"
//                     className="btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3"
//                   >
//                     Eventos
//                   </Link>
//                 </li>
//               )}
//               <NavLink to="/artistas">Artistas</NavLink>
//               <NavLink to="/noticias">Noticias</NavLink>
//               <NavLink to="/crearevento">Crear Evento</NavLink>
//             </ul>
//           </div>
//         </div>
//         <div className="hidden md:flex items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="input input-bordered w-full max-w-md mt-1 lg:mt-0"
//           />
//           <button className="mr-2 btn btn-ghost btn-circle mt-1">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
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
//               <ul
//                 tabIndex={0}
//                 className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
//               >
//                 {renderUserMenu()}
//                 <li>
//                   <button onClick={logout}>Cerrar sesión</button>
//                 </li>
//               </ul>
//             </div>
//           ) : (
//             <>
//               <Login />
//               <Link to="/register" className="btn btn-primary">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//         {location.pathname === '/' && <Filtros onFilter={onFilter} />}
//       </div>

//       <div className="block md:hidden">
//         <div className="flex justify-end items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="input input-bordered max-w-xs h-8"
//           />
//           <button className="mr-2 btn btn-ghost btn-circle">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }