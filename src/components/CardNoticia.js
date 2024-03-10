import '../index.css';

export default function CardNoticia(props) {

    return (
        <div>
            <button className="card w-max bg-base-100 shadow-xl image-full glass" onClick={props.onClick} titulo={props.titulo}>
                <figure><img src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                    <h2 className="card-title text-black">{props.titulo}</h2>
                    <p className="text-black">{props.encabezado}</p>
                </div>
            </button>
        </div>
    )
}