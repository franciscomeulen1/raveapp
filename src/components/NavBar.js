import { Link } from 'react-router-dom';
import '../index.css';
import Login from './Login';

export default function NavBar() {
    return (
        <div className="navbar bg-base-100 object-top top-0 sticky z-10" >

            <div className="flex-1">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3'>Filtros
                        </button></li>
                        <li><Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/crearevento'>
                            Crear Evento
                        </Link></li>
                    </ul>
                </div>
                <Link className="btn btn-ghost normal-case text-xl" to='/'>
                    RaveApp
                </Link>
                <div className='gap-2 navbar hidden lg:flex'>
                    <ul className='mt-2 p-2'>
                        <li><Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/login'>Filtros
                        </Link></li>
                        <li>
                            <Link className='btn btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3' to='/crearevento'>
                                Crear Evento
                            </Link>
                        </li>
                    </ul>

                </div>

            </div>
            <input type="text" placeholder="Search" className="input input-bordered w-full max-w-xs mt-1" />
            <button className="mx-2 btn btn-ghost btn-circle mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            {/* <div className="flex-none mt-2">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://placeimg.com/80/80/people" />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
                        <li>
                            <a className="justify-between  hover:bg-indigo-400 hover:text-cyan-200">
                                Profile
                            </a>
                        </li>
                        <li><a className="justify-between  hover:bg-indigo-400 hover:text-cyan-200">Settings</a></li>
                        <li><a className="justify-between  hover:bg-indigo-400 hover:text-cyan-200">Logout</a></li>
                    </ul>
                </div>
            </div> */}
            <div>
                {/* <button className="btn btn-primary hover:bg-indigo-400 hover:text-cyan-200 mx-2">Ingresar</button> */}
                <Login />
                <button className="btn btn-info hover:bg-indigo-400 hover:text-cyan-200 navbar-end">Registrarse</button>
            </div>
        </div>
    )
}