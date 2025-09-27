
// ==== YouTube utils (inline) ====
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

// ==== App ====
let playerA = null;
let playerB = null;
let apiReady = false;

window.onYouTubeIframeAPIReady = () => { apiReady = true; };

function ensureAPI() {
  return apiReady && window.YT && typeof YT.Player === 'function';
}

function loadVideo(which) {
  if (!ensureAPI()) {
    alert('La API de YouTube aún se está cargando. Espera 1-2 segundos e intenta nuevamente.');
    return;
  }
  const isA = which === 'A';
  const urlInput = document.getElementById(isA ? 'urlA' : 'urlB');
  const volInput = document.getElementById(isA ? 'volA' : 'volB');
  const holder = document.getElementById(isA ? 'playerA' : 'playerB');

  const vid = getYouTubeID(urlInput.value);
  if (!vid) { alert('Ingresa una URL o ID válido de YouTube'); return; }

  holder.innerHTML = '';
  const div = document.createElement('div');
  holder.appendChild(div);

  const p = createPlayer(div, vid, (ev) => {
    const v = parseInt(volInput.value, 10) || 0;
    ev.target.setVolume(Math.max(0, Math.min(100, v)));
    ev.target.pauseVideo();
  });

  if (isA) playerA = p; else playerB = p;
}

function bothReady() {
  return playerA && playerB && typeof playerA.playVideo === 'function' && typeof playerB.playVideo === 'function';
}

function playBoth() {
  if (!bothReady()) { alert('Carga ambos videos primero.'); return; }
  const tA = playerA.getCurrentTime ? playerA.getCurrentTime() : 0;
  const tB = playerB.getCurrentTime ? playerB.getCurrentTime() : 0;
  const t = Math.max(0, Math.min(tA, tB));
  try { playerA.seekTo(t, true); } catch(e){}
  try { playerB.seekTo(t, true); } catch(e){}
  playerA.playVideo();
  playerB.playVideo();
}

function pauseBoth() {
  if (playerA) playerA.pauseVideo();
  if (playerB) playerB.pauseVideo();
}

function stopBoth() {
  if (playerA) playerA.stopVideo();
  if (playerB) playerB.stopVideo();
}

function bindUI() {
  document.getElementById('btnLoadA').addEventListener('click', () => loadVideo('A'));
  document.getElementById('btnLoadB').addEventListener('click', () => loadVideo('B'));
  document.getElementById('btnPlayBoth').addEventListener('click', playBoth);
  document.getElementById('btnPauseBoth').addEventListener('click', pauseBoth);
  document.getElementById('btnStopBoth').addEventListener('click', stopBoth);
  document.getElementById('volA').addEventListener('input', (e) => {
    if (playerA && playerA.setVolume) playerA.setVolume(parseInt(e.target.value, 10));
  });
  document.getElementById('volB').addEventListener('input', (e) => {
    if (playerB && playerB.setVolume) playerB.setVolume(parseInt(e.target.value, 10));
  });
}

document.addEventListener('DOMContentLoaded', bindUI);
