import '../index.css';
import { Link } from 'react-router-dom';

export default function CardNoticia(props) {

    return (
        <div>
            <Link className="card w-max bg-base-100 shadow-xl image-full glass" to='/noticia' titulo={props.titulo}>
                <figure><img src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                    <h2 className="card-title">{props.titulo}</h2>
                    <p>{props.encabezado}</p>
                </div>
            </Link>
        </div>
    )
}