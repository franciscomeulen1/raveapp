import '../index.css';

export default function CardResumenCompra() {
    return (
        <div>
            <div className="bg-base-100 shadow-xl mx-5 md:mx-16">
                <div className="grid grid-cols-3 justify-between gap-x-6">
                    <div className='justify-self-center my-2'>
                        <figure className="w-40 ml-5"><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Movie" /></figure>
                    </div>
                    <div className='text-lg font-semibold justify-self-center self-center'>
                        <p>Entrada general para [Nombre del evento]</p>
                        <p>Valor: $5000,00</p>
                    </div>
                    <div className='text-lg font-semibold justify-self-center self-center'>
                        <p>Cantidad: 1</p>
                        <p>Subtotal: $5000,00</p>
                    </div>
                </div>
            </div>

        </div>
    )

}