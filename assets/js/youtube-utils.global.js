
// youtube-utils.global.js
(function(){
  function getYouTubeID(input) {
    if (!input) return null;
    const str = String(input).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
    try {
      const u = new URL(str);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      const v = u.searchParams.get('v');
      if (v) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('embed');
      if (idx !== -1 && parts[idx+1]) return parts[idx+1];
    } catch(e) {}
    return null;
  }

  function createPlayer(targetElement, videoId, onReady){
    const options = {
      height: '360',
      width: '640',
      videoId,
      playerVars: { playsinline:1, rel:0, modestbranding:1, autoplay:0 },
      events: { 'onReady': (ev) => onReady && onReady(ev) }
    };
    return new YT.Player(targetElement, options);
  }

  window.YTUtils = { getYouTubeID, createPlayer };
})();
