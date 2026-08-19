// Música de fondo del expediente.
// Suena bajita y en loop durante todo el juego, pero se agacha sola cada vez
// que hay algo que escuchar: la voz del relator, los sonidos de una misión o
// un tramo de video. Sin eso taparía justo lo que hay que oír.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
// La pista ya viene normalizada bien abajo (-20 LUFS), así que estos valores
// son el ajuste fino: subí VOLUMEN si en el kiosco se escucha muy tapada.
const VOLUMEN = 0.5;
const AGACHADA = 0.09;
const FUNDIDO = 700;

let pista = null;
let tapada = 0;
let fundido = null;

function llevarA(destino, ms = FUNDIDO) {
  if (!pista) return;
  clearInterval(fundido);
  const desde = pista.volume;
  const t0 = performance.now();
  fundido = setInterval(() => {
    const paso = Math.min(1, (performance.now() - t0) / ms);
    pista.volume = Math.max(0, Math.min(1, desde + (destino - desde) * paso));
    if (paso === 1) clearInterval(fundido);
  }, 40);
}
const objetivo = () => tapada > 0 ? AGACHADA : VOLUMEN;

export function arrancarMusica() {
  if (pista) {
    if (pista.paused) pista.play().catch(() => {});
    return;
  }
  pista = new Audio(`${BASE}/media/musica/fondo.mp3`);
  pista.loop = true;
  pista.preload = "auto";
  pista.volume = 0;
  pista.play().then(() => llevarA(objetivo(), 2500)).catch(() => {
    // si el navegador todavía no dio permiso, esperamos al primer toque
    const reintentar = () => pista?.play().then(() => llevarA(objetivo(), 2500)).catch(() => {});
    document.addEventListener("pointerdown", reintentar, { once: true });
    document.addEventListener("keydown", reintentar, { once: true });
  });
}
export function pararMusica() {
  if (!pista) return;
  llevarA(0, 500);
  setTimeout(() => pista?.pause(), 520);
}
// Cada cosa que suena pide silencio al entrar y lo devuelve al salir. Se lleva
// una cuenta porque puede haber dos a la vez (por ejemplo voz y galería).
export function taparMusica() {
  tapada++;
  llevarA(objetivo(), 350);
}
export function destaparMusica() {
  tapada = Math.max(0, tapada - 1);
  llevarA(objetivo());
}
// Envuelve un audio o video: agacha la música mientras dure y la devuelve al
// terminar, pase lo que pase (fin, error, o que nunca haya llegado a sonar).
export function acompanar(medio) {
  if (!medio) return medio;
  let soltado = false;
  const soltar = () => {
    if (soltado) return;
    soltado = true;
    destaparMusica();
  };
  taparMusica();
  medio.addEventListener("ended", soltar, { once: true });
  medio.addEventListener("error", soltar, { once: true });
  medio.addEventListener("pause", soltar, { once: true });
  // red de seguridad: si el audio nunca arranca, no dejamos la música agachada
  setTimeout(() => {
    if (medio.paused && !medio.currentTime) soltar();
  }, 3000);
  return medio;
}
