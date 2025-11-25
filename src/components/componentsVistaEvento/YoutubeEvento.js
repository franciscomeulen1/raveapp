// components/componentsVistaEvento/YoutubeEvento.js
export default function YoutubeEvento({ url }) {
  if (!url) return null;

  const getYoutubeEmbedUrl = (link) => {
    const match = link.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <iframe
      height="315"
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className='w-full mb-6'
    ></iframe>
  );
}


// // components/evento/YoutubeEvento.js
// export default function YoutubeEvento() {
//   return (
//     <iframe
//       height="315"
//       src="https://www.youtube.com/embed/zmqS5hEi_QI"
//       title="YouTube video player"
//       frameBorder="0"
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen
//       className='w-full mb-6'
//     ></iframe>
//   );
// }
