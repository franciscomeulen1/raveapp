import '../index.css';

export default function CardNoticia(props) {

    return (
        <div className="p-4">
            <button className="bg-white shadow-lg rounded-lg overflow-hidden" onClick={props.onClick}>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
                    alt="noticia"
                    className="w-full h-auto"
                />
                <div className="p-4">
                <h2 className="card-title text-black">{props.titulo}</h2>
                <p className="text-black text-left">{props.encabezado}</p>
                </div>
            </button>
        </div>
    )
}