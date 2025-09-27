
/**
 * Extrae el ID de un video de YouTube desde varias formas de URL o un ID crudo.
 */
export function getYouTubeID(input) {
  if (!input) return null;
  const str = String(input).trim();

  // Si ya parece un ID de 11 chars
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

  try {
    const u = new URL(str);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    const v = u.searchParams.get('v');
    if (v) return v;
    const parts = u.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('embed');
    if (idx !== -1 && parts[idx+1]) return parts[idx+1];
  } catch(e) {
    // not URL
  }
  return null;
}

/**
 * Crea un reproductor YT en el contenedor targetElement con opciones base.
 * Devuelve la instancia de YT.Player.
 */
export function createPlayer(targetElement, videoId, onReady) {
  const options = {
    height: '360',
    width: '640',
    videoId,
    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      autoplay: 0
    },
    events: {
      'onReady': (ev) => onReady && onReady(ev)
    }
  };
  return new YT.Player(targetElement, options);
}
