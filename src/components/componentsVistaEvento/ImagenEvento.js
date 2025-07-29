// components/evento/ImagenEvento.js
export default function ImagenEvento({ imagen }) {
  return (
    <div className='mb-6 flex justify-center'>
      <img
        src={imagen || "https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg"}
        width="450"
        height="auto"
        alt="imagen de evento"
        className='rounded-xl'
      />
    </div>
  );
}
