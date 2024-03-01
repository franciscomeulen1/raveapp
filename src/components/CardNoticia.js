import '../index.css';
import { Link } from 'react-router-dom';

export default function CardNoticia() {
    return (
        <div>
            <Link className="card w-max bg-base-100 shadow-xl image-full glass" to='/noticia'>
                <figure><img src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                    <h2 className="card-title">Título de la noticia</h2>
                    <p>Encabezado lalalalalalalalalalalalalalalalalalalalalalalala</p>
                </div>
            </Link>
        </div>
    )
}