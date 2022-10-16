function Filtros() {
    return (
        <div>
            {/* <label htmlFor="my-modal-3" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">Filtros</label>  */}

            <input type="checkbox" id="my-modal-filtros" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">

                <form className="modal-box">

                    <h2 className="font-bold text-3xl mt-3 mb-2">Filtrar búsqueda</h2>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Género</span>
                        </label>
                        <select className="select select-bordered">
                            <option selected>Todos</option>
                            <option>Techno</option>
                            <option>Tech-House</option>
                            <option>House</option>
                            <option>Progressive</option>
                            <option>Trance</option>
                            <option>Psy-Trance</option>
                        </select>
                    </div>

                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Ubicación:</span>
                        </label>
                        <select className="select select-bordered">
                            <option selected>Todas</option>
                            <option>Capital Federal</option>
                            <option>Gran Bs.As. Norte</option>
                            <option>Gran Bs.As. Oeste</option>
                            <option>Gran Bs.As. Sur</option>
                            <option>Bs.As. Interior</option>
                            <option>Catamarca</option>
                            <option>Chaco</option>
                            <option>Córdoba</option>
                            <option>Corrientes</option>
                            <option>Entre Ríos</option>
                            <option>Formosa</option>
                            <option>Jujuy</option>
                            <option>La Pampa</option>
                            <option>La Rioja</option>
                            <option>Mendoza</option>
                            <option>Misiones</option>
                            <option>Neuquén</option>
                            <option>Río Negro</option>
                            <option>Salta</option>
                            <option>San Juan</option>
                            <option>San Luis</option>
                            <option>Santa Cruz</option>
                            <option>Santa Fe</option>
                            <option>Santiago del Estero</option>
                            <option>Tierra del Fuego</option>
                            <option>Tucumán</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start">
                            <span className="label-text mr-2">LGBT: </span>
                            <input type="checkbox" className="checkbox checkbox-primary" />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start">
                            <span className="label-text mr-2">After: </span>
                            <input type="checkbox" className="checkbox checkbox-primary" />
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Alguna fecha en específico?</span>
                        </label>
                        <div className='inline-flex'>
                            <select className="select select-bordered">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>13</option>
                                <option>14</option>
                                <option>15</option>
                                <option>16</option>
                                <option>17</option>
                                <option>18</option>
                                <option>19</option>
                                <option>20</option>
                                <option>21</option>
                                <option>22</option>
                                <option>23</option>
                                <option>24</option>
                                <option>25</option>
                                <option>26</option>
                                <option>27</option>
                                <option>28</option>
                                <option>29</option>
                                <option>30</option>
                                <option>31</option>
                            </select>
                            <select className="select select-bordered">
                                <option>Enero</option>
                                <option>Febrero</option>
                                <option>Marzo</option>
                                <option>Abril</option>
                                <option>Mayo</option>
                                <option>Junio</option>
                                <option>Julio</option>
                                <option>Agosto</option>
                                <option>Septiembre</option>
                                <option>Octubre</option>
                                <option>Noviembre</option>
                                <option>Diciembre</option>
                            </select>
                            <select className="select select-bordered">
                                <option>2022</option>
                                <option>2023</option>
                                <option>2024</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-action justify-start">
                        <button type="submit" htmlFor="my-modal-2" className="btn">Buscar</button>
                    </div>

                </form>
            </div>

        </div>

    );
}

export default Filtros;

/* import React from "react";

function Filtros() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Open regular modal
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">

              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default Filtros; */