import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../index.css';
import Filtros from './Filtros';
import Login from './Login';
import Register from './Register';

function NavLink({ to, children }) {
    return (
        <li>
            <Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to={to}>
                {children}
            </Link>
        </li>
    );
}

function FiltrosButton() {
    return (
        <li>
            <label htmlFor="my-modal-filtros" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">Filtros</label>
        </li>
    );
}

export default function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const commonLinks = (
        <>
            <FiltrosButton />
            <NavLink to='/artistas'>Artistas</NavLink>
            <NavLink to='/noticias'>Noticias</NavLink>
            <NavLink to='/crearevento'>Crear Evento</NavLink>
        </>
    );

    return (
        <div>
            <div className="navbar bg-base-100 object-top top-0 sticky z-10 mx-auto px-4 w-full">
                <div className="flex-1">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={toggleDropdown}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        {isDropdownOpen && (
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                {commonLinks}
                            </ul>
                        )}
                    </div>
                    <Link className="btn btn-ghost normal-case text-xl" to='/'>
                        RaveApp
                    </Link>
                    <div className='gap-2 navbar hidden lg:flex'>
                        <ul className='mt-2 p-2'>
                            {commonLinks}
                        </ul>
                    </div>
                </div>
                <div className="hidden md:flex items-center">
                    <input type="text" placeholder="Search" className="input input-bordered w-full max-w-md mt-1 lg:mt-0" /> {/* Ampliamos el ancho del input para pantallas pequeñas */}
                    <button className="mr-2 btn btn-ghost btn-circle mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
                <div>
                    <Login />
                    <Register /> {/* Puedes cambiar el estilo o tamaño de este botón en pantallas pequeñas según tu diseño */}
                </div>
                <Filtros />
            </div>

            <div className="block md:hidden">
                <div className='flex justify-end items-center'>
                    <input type="text" placeholder="Search" className="input input-bordered max-w-xs h-8" /> {/* Ampliamos el ancho del input para pantallas pequeñas */}      
                    <button className="mr-2 btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>

        </div>
    );
}


// import { Link } from 'react-router-dom';
// import '../index.css';
// import Filtros from './Filtros';
// import Login from './Login';
// import Register from './Register';

// export default function NavBar() {
//     return (
//         <div className="navbar bg-base-100 object-top top-0 sticky z-10 mx-auto px-4 w-full" >

//             <div className="flex-1">
//                 <div className="dropdown">
//                     <label tabIndex={0} className="btn btn-ghost lg:hidden">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
//                     </label>
//                     <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
//                         <li><label htmlFor="my-modal-filtros" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">Filtros</label></li>
//                         <li><Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/artistas'>
//                             Artistas
//                         </Link></li>
//                         <li><Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/noticias'>
//                             Noticias
//                         </Link></li>
//                         <li><Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/crearevento'>
//                             Crear Evento
//                         </Link></li>
//                     </ul>
//                 </div>
//                 <Link className="btn btn-ghost normal-case text-xl" to='/'>
//                     RaveApp
//                 </Link>
//                 <div className='gap-2 navbar hidden lg:flex'>
//                     <ul className='mt-2 p-2'>
//                         <li><label htmlFor="my-modal-filtros" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">Filtros</label></li>
//                         <li>
//                             <Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/artistas'>
//                                 Artistas
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/noticias'>
//                                 Noticias
//                             </Link>
//                         </li>
//                         <li>
//                             <Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/crearevento'>
//                                 Crear Evento
//                             </Link>
//                         </li>
//                     </ul>

//                 </div>

//             </div>
//             <input type="text" placeholder="Search" className="input input-bordered w-full max-w-xs mt-1" />
//             <button className="mx-2 btn btn-ghost btn-circle mt-1">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//             </button>
//             <div>
//                 <Login />
//                 <Register />
//             </div>
//             <Filtros />
//         </div>
//     )
// }