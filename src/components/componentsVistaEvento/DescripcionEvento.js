// components/evento/DescripcionEvento.js
export default function DescripcionEvento({ descripcion }) {
  return (
    <div className='mb-6'>
      <p className="whitespace-pre-line">{descripcion}</p>
    </div>
  );
}
