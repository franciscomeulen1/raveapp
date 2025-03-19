import React from 'react';

export default function TablaDeEntradas({ entradas, diaIndex }) {
  // Array de opciones de cantidad (0 a 10)
  const cantidadOptions = [...Array(11).keys()];

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((entrada, index) => (
            <tr key={index}>
              <td className='lg-min:text-sm'>{entrada.tipo}</td>
              <td>${entrada.precio}</td>
              <td>
                <select
                  name={`dia-${diaIndex}-entrada-${index}`}
                  className="select select-bordered w-full max-w-xs"
                >
                  {cantidadOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




// import React from 'react'
// import { Link } from 'react-router-dom';

// export default function TablaDeEntradas(props) {

//     const entradas = props.entradas;

//     // Array de opciones de cantidad
//     const cantidadOptions = [...Array(11).keys()]; // Genera un array de 0 a 10

//     return (
//         <div className="overflow-x-auto">
//             <form action="#">
//                 <table className="table w-full">
//                     {/* head */}
//                     <thead>
//                         <tr>
//                             <th>Ticket</th>
//                             <th>Precio</th>
//                             <th>Cantidad</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                     {entradas.map((entrada, index) => (
//                             <tr key={index}>
//                                 <td className='lg-min:text-sm'>{entrada.tipo}</td>
//                                 <td>${entrada.precio}</td>
//                                 <td>
//                                 <select name={`cant-entrada-${index}`} className="select select-bordered w-full max-w-xs">
//                                         {cantidadOptions.map((option, index) => (
//                                             <option key={index} value={option}>{option}</option>
//                                         ))}
//                                     </select>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <Link className="flex justify-end my-3" to='/comprar'>
//                     <button type="submit" className='btn btn-secondary'>Comprar</button>
//                 </Link>

//             </form>

//         </div>
//     )
// }