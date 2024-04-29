function Login() {
    return (
        <div>
            <label htmlFor="my-modal-login" className="btn modal-button btn-primary hover:bg-indigo-400 hover:text-cyan-200 mx-2 btn-sm md:btn-md">Ingresar</label>

            <input type="checkbox" id="my-modal-login" className="modal-toggle" />
            <label htmlFor="my-modal-login" className="modal modal-middle">

                <form className="modal-box">

                    <div className="flex justify-center mb-2">
                        <button className="btn">Iniciar sesion con Google</button>
                    </div>

                    <h2 className="font-bold text-3xl mt-3 mb-2">Iniciar Sesión</h2>

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

                        <div className="modal-action justify-between">
                            <button type="submit" htmlFor="my-modal-1" className="btn">Ingresar</button>
                            <button htmlFor="my-modal-6" className="text-indigo-900 font-medium">Olvidaste la constraseña?</button>
                        </div>

                </form>
            </label>

        </div>
    );
}

export default Login;
