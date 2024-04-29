function Register() {
    return (
        <div>
            <label htmlFor="my-modal-register" className="btn modal-button btn-info hover:bg-indigo-400 hover:text-cyan-200 mx-2 btn-sm md:btn-md">Registrarme</label>


            <input type="checkbox" id="my-modal-register" className="modal-toggle" />
            <label htmlFor="my-modal-register" className="modal modal-middle">

                <form className="modal-box">

                    <div className="flex justify-center mb-2">
                        <button className="btn">Registrate con Google</button>
                    </div>

                    <h2 className="font-bold text-3xl mt-3 mb-2">Registrarse</h2>

                    <div className='form-control w-full max-w-xs'>
                        <label className="label">
                            <span className="label-text">Tu nombre:</span>
                        </label>
                        <input type='email'
                            placeholder="Tu email"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>

                    <div className='form-control w-full max-w-xs'>
                        <label className="label">
                            <span className="label-text">Tu apellido:</span>
                        </label>
                        <input type='email'
                            placeholder="Tu email"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>

                    <div className='form-control w-full max-w-xs'>
                        <label className="label">
                            <span className="label-text">Tu email:</span>
                        </label>
                        <input type='email'
                            placeholder="Tu email"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>

                    <div className='form-control w-full max-w-xs'>
                        <label className="label">
                            <span className="label-text">Tu constraseña:</span>
                        </label>
                        <input type='password'
                            placeholder="Tu constraseña"
                            className="input input-bordered w-full max-w-xs"
                            autoFocus
                        />
                    </div>

                    <div className="modal-action justify-start">
                        <button type="submit" htmlFor="my-modal-2" className="btn">Registrarme</button>
                    </div>

                </form>
            </label>

        </div>
    );
}

export default Register;