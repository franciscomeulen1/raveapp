import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function CrearEvento() {
  window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
  return (
    <div>
      <div className="px-10 mb-11">
        <NavBar />

        <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Crear evento</h1>

        <form className='px-10'>

          <div className='grid sm:grid-cols-2 gap-10 mb-6'>
            <div className='columns-1'>
              <h2>Datos personales:</h2>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text">Tu nombre:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu nombre"
                  className="input input-bordered w-full max-w-xs"
                  autoFocus
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text">Tu apellido:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu apellido"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text">Tu telefono:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu telefono"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text">Email:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu email"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <p className='mt-4'>* Te crearemos una cuenta con tu nombre y correo para que puedas administrar tus eventos.<br /> Te enviaremos una constraseña al correo ingresado.</p>
            </div>
            <div className='columns-1'>
              <img src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg" width="550" height="auto" alt="imagen de evento" />
            </div>
          </div>

          <h2>Datos del evento</h2>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-6'>

            <div className='form-control w-full max-w-xs'>
              <label className="label">
                <span className="label-text">Nombre del evento:</span>
              </label>
              <input type='text'
                placeholder="Nombre del evento"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Género musical:</span>
              </label>
              <select defaultValue="Seleccione un género" className="select select-bordered">
                <option disabled>Seleccione un género</option>
                <option>Techno</option>
                <option>Tech-House</option>
                <option>House</option>
                <option>Progressive</option>
                <option>Trance</option>
                <option>Psy-Trance</option>
              </select>
            </div>


          </div>

          <h3>Ubicación del evento:</h3>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-6'>

            <div className='columns-1'>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Provincia:</span>
                </label>
                <select defaultValue="Seleccione una provincia" className="select select-bordered">
                  <option disabled>Seleccione una provincia</option>
                  <option>Buenos Aires</option>
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

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Partido:</span>
                </label>
                <select defaultValue="Seleccione un partido" className="select select-bordered">
                  <option disabled>Seleccione un partido</option>
                  <option>Partido 1</option>
                  <option>Partido 2</option>
                </select>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Localidad:</span>
                </label>
                <select defaultValue="Seleccione una localidad" className="select select-bordered">
                  <option disabled>Seleccione una localidad</option>
                  <option>Localidad 1</option>
                  <option>Localidad 2</option>
                </select>
              </div>

              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text">Dirección:</span>
                </label>
                <input type='text'
                  placeholder="Dirección del evento"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <span className="label-text mr-2">Es After?</span>
                  <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <span className="label-text mr-2">Es un evento LGBT?</span>
                  <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Descripción del evento:</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Descripcion..."></textarea>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Fecha y hora de inicio del evento:</span>
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
                  <select defaultValue="Hora" className="select select-bordered">
                    <option disabled >Hora</option>
                    <option>00</option>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                    <option>07</option>
                    <option>08</option>
                    <option>09</option>
                    <option>10</option>
                    <option>11</option>
                  </select>
                  <select defaultValue="Minutos" className="select select-bordered">
                    <option disabled >Minutos</option>
                    <option>00</option>
                    <option>05</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                    <option>30</option>
                    <option>35</option>
                    <option>40</option>
                    <option>45</option>
                    <option>50</option>
                    <option>55</option>
                  </select>
                  <select className="select select-bordered">
                    <option>PM</option>
                    <option>AM</option>
                  </select>
                </div>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Fecha y hora fin del evento:</span>
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
                  <select defaultValue="Hora" className="select select-bordered">
                    <option disabled >Hora</option>
                    <option>00</option>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                    <option>07</option>
                    <option>08</option>
                    <option>09</option>
                    <option>10</option>
                    <option>11</option>
                  </select>
                  <select defaultValue="Minutos" className="select select-bordered">
                    <option disabled>Minutos</option>
                    <option>00</option>
                    <option>05</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                    <option>30</option>
                    <option>35</option>
                    <option>40</option>
                    <option>45</option>
                    <option>50</option>
                    <option>55</option>
                  </select>
                  <select className="select select-bordered">
                    <option>PM</option>
                    <option>AM</option>
                  </select>
                </div>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Agregar video:</span>
                </label>
                <input type="text" placeholder="Pegá el link de YouTube aquí" className="input input-bordered w-full max-w-xs" />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Agregar música:</span>
                </label>
                <input type="text" placeholder="Pegá el link de Spotify o SoundCloud aquí" className="input input-bordered w-full max-w-xs" />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Foto del evento:</span>
                </label>
                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
              </div>
            </div>

          </div>

          <div className="form-control">
            <label className="cursor-pointer label justify-start">
              <input type="checkbox" className="checkbox checkbox-accent mr-2" />
              <span className="label-text">Acepto terminos y condiciones</span>
            </label>
          </div>

          <button type="submit" className="btn btn-secondary rounded-xl">Crear Evento</button>

        </form>


      </div>

      <Footer />
    </div>
  )
}

export default CrearEvento