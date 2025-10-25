export default function ImagenEvento({ imagen }) {
  const imagenFallback =
    "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp";

  return (
    <div className="mb-6 flex justify-center">
      <div
        className="
          w-full
          max-w-md        /* ← igual que tu versión original */
          aspect-[1.4]    /* relación un poco más cuadrada que 1.4, para flyers medianos */
          bg-gray-100
          rounded-xl
          overflow-hidden
          flex items-center justify-center
        "
      >
        <img
          src={imagen || imagenFallback}
          alt="Imagen del evento"
          width={448}   // pista de layout (coincide con max-w-md ≈ 28rem)
          height={320}  // 448 / 1.3 ≈ 345
          className="
            block
            w-full h-full
            object-cover object-center
            rounded-xl
          "
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = imagenFallback;
          }}
        />
      </div>
    </div>
  );
}



// // components/evento/ImagenEvento.js
// export default function ImagenEvento({ imagen }) {
//   return (
//     <div className='mb-6 flex justify-center'>
//       {imagen ? (
//         <img
//           src={imagen}
//           alt="imagen del evento"
//           className="rounded-xl w-full max-w-md" />
//       ) : (
//         <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600 rounded-xl">
//           Sin imagen disponible
//         </div>
//       )}
//     </div>
//   );
// }