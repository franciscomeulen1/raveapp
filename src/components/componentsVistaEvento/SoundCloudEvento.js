// components/evento/SoundCloudEvento.js
export default function SoundCloudEvento({ url }) {
  if (!url) return null;

  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

  return (
    <iframe
      title="musicaSoundCloud"
      width="100%"
      height="450"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={embedUrl}
      className='mb-6'
    ></iframe>
  );
}
