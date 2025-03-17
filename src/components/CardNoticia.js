import '../index.css';

export default function CardNoticia(props) {
    return (
        <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 mx-auto">
            <button onClick={props.onClick} className="w-full">
                <img 
                    src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" 
                    alt="noticia" 
                    className="w-full object-cover aspect-[1.2]"
                />
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{props.titulo}</h2>
                </div>
            </button>
        </div>
    );
}


// import '../index.css';

// export default function CardNoticia(props) {

//     return (
//         <div className="p-4">
//             <button className="bg-white shadow-lg rounded-lg overflow-hidden" onClick={props.onClick}>
//                 <img
//                     src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
//                     alt="noticia"
//                     className="w-full h-auto"
//                 />
//                 <div className="p-4">
//                 <h2 className="card-title text-black">{props.titulo}</h2>
//                 <p className="text-black text-left">{props.encabezado}</p>
//                 </div>
//             </button>
//         </div>
//     )
// }