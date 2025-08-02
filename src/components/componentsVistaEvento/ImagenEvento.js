// components/evento/ImagenEvento.js
export default function ImagenEvento({ imagen }) {
  return (
    <div className='mb-6 flex justify-center'>
      {imagen ? (
        <img
          src={imagen}
          alt="imagen del evento"
          className="rounded-xl w-full max-w-md" />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600 rounded-xl">
          Sin imagen disponible
        </div>
      )}
    </div>
  );
}


// components/evento/ImagenEvento.js
// export default function ImagenEvento({ imagen }) {
//   return (
//     <div className='mb-6 flex justify-center'>
//       <img
//         src={imagen || "https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"}
//         width="450"
//         height="auto"
//         alt="imagen de evento"
//         className='rounded-xl'
//       />
//     </div>
//   );
// }