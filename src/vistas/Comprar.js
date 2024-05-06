import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CardResumenCompra from '../components/CardResumenCompra';
export default function Comprar() {
    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
    return (
        <div>
            <div className="sm:px-10 mb-11">
                <NavBar />
                <h1 className='mx-10 sm:px-10 mt-2 mb-3 text-2xl font-bold'>Estas comprando:</h1>
                <CardResumenCompra />
                <h2 className='mx-10 sm:px-10 mt-4 mb-3 text-2xl font-bold'>Tus datos:</h2>
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
                            <option selected>DNI</option>
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
                            autoFocus
                        />
                    </div>
                    <div className='form-control'>
                        <label className="label">
                            <span className="label-text">Email:</span>
                        </label>
                        <input type='email'
                            placeholder="tumail@mail.com"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>
                    <div className='form-control'>
                        <label className="label">
                            <span className="label-text">Confirmación de Email:</span>
                        </label>
                        <input type='email'
                            placeholder="tumail@mail.com"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>
                    <div className='form-control'>
                        <label className="label">
                            <span className="label-text">Teléfono:</span>
                        </label>
                        <input type='text'
                            placeholder="1155556666"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>
                    <div></div>
                    <div className='py-5'>
                        <p className='text-lg font-semibold mb-3'>Subtotal: $5000</p>
                        <p className='font-semibold text-green-700 mb-3'>Cargo por servicio: $1000</p>
                        <p className='text-xl font-bold'>Total: $6000</p>
                    </div>
                    <div className='py-5'>
                        <p className='text-sm'>** Al hacer click en comprar, te redireccionaremos a MercadoPago para que puedas realizar el pago y finalizar la compra.</p>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}