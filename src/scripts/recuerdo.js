// Fotomaton del final: saca tres fotos, las deja como polaroids en pantalla,
// arma una tarjeta de recuerdo y ofrece mandarla por mail, bajarla o imprimirla.
// Todo queda guardado en el archivo local para poder verlo despues.
import gsap from "gsap";
import { EMAILJS, CLOUDINARY, emailjsListo, cloudinaryListo } from "./config.js";
import { guardarVisita, actualizarVisita, bajarArchivo, aBlob } from "./archivo.js";

const $ = (id) => document.getElementById(id);
const FOTOS = 3;
const LADO = 720;
// el pie de la primera polaroid lleva el 16 de septiembre del año en curso
const PIES = [`16.09.${new Date().getFullYear()}`, "", "50 años"];
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

let flujo = null;
let tomas = [];
let tarjeta = "";
// Ficha de la visita. Arranca vacia por si se llega al fotomaton sin partida.
let datos = { nombre: "", telefono: "", email: "", puntos: 0, correctas: 0, fecha: "" };
let alCerrar = null;
let guardada = false;
let fotoUrl = "";

function avisar(texto, malo = false) {
  const p = $("recuerdo-aviso");
  p.textContent = texto;
  p.classList.toggle("malo", malo);
}
function mostrarBotones(nombres) {
  ["btn-disparar", "btn-repetir", "btn-mail", "btn-descargar", "btn-imprimir"].forEach((id) => {
    $(id).classList.toggle("oculta", !nombres.includes(id));
  });
}
async function prenderCamara() {
  const video = $("recuerdo-video");
  try {
    flujo = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      audio: false
    });
  } catch {
    $("recuerdo-camara").classList.add("sin-camara");
    avisar("No pude usar la cámara. Podés cerrar el expediente igual.", true);
    mostrarBotones([]);
    return false;
  }
  video.srcObject = flujo;
  await video.play().catch(() => {});
  return true;
}
function apagarCamara() {
  flujo?.getTracks().forEach((t) => t.stop());
  flujo = null;
  const video = $("recuerdo-video");
  video.pause();
  video.srcObject = null;
}
// Recorta el cuadro del video a un cuadrado centrado, espejado como se ve en pantalla.
function capturar() {
  const video = $("recuerdo-video");
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = LADO;
  const ctx = lienzo.getContext("2d");
  const lado = Math.min(video.videoWidth, video.videoHeight);
  const sx = (video.videoWidth - lado) / 2;
  const sy = (video.videoHeight - lado) / 2;
  ctx.translate(LADO, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, lado, lado, 0, 0, LADO, LADO);
  return lienzo.toDataURL("image/jpeg", 0.85);
}
async function cuentaRegresiva(n) {
  const cartel = $("recuerdo-cuenta");
  for (let i = n; i > 0; i--) {
    cartel.textContent = String(i);
    gsap.fromTo(cartel, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.32, ease: "power3.out" });
    await esperar(900);
  }
  cartel.textContent = "";
}
const RUTA_BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
const sonidoPolaroid = new Audio(`${RUTA_BASE}/audio/polaroid.mp3`);
sonidoPolaroid.preload = "auto";
function destello() {
  sonidoPolaroid.currentTime = 0;
  sonidoPolaroid.play().catch(() => {});
  gsap.fromTo($("recuerdo-flash"), { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power3.out" });
}
function ponerPolaroid(dataUrl, i) {
  const marco = document.createElement("figure");
  marco.className = "polaroid";
  const vista = document.createElement("div");
  vista.className = "polaroid-vista";
  const img = new Image();
  img.src = dataUrl;
  img.alt = `Foto ${i + 1} de ${datos.nombre}`;
  vista.append(img);
  const pie = document.createElement("figcaption");
  pie.textContent = i === 1 ? datos.nombre : PIES[i];
  marco.append(vista, pie);
  $("recuerdo-tira").append(marco);
  gsap.fromTo(
    marco,
    { opacity: 0, y: -40, rotate: 0, scale: 0.85 },
    { opacity: 1, y: 0, rotate: [-5, 2, -2][i], scale: 1, duration: 0.55, ease: "back.out(1.4)" }
  );
}
async function sesionDeFotos() {
  tomas = [];
  tarjeta = "";
  guardada = false;
  fotoUrl = "";
  $("recuerdo-tira").innerHTML = "";
  mostrarBotones([]);
  for (let i = 0; i < FOTOS; i++) {
    avisar(`Foto ${i + 1} de ${FOTOS} — mirá a la cámara`);
    await cuentaRegresiva(3);
    destello();
    tomas.push(capturar());
    ponerPolaroid(tomas[i], i);
    await esperar(i < FOTOS - 1 ? 1100 : 400);
  }
  apagarCamara();
  $("recuerdo-camara").classList.add("apagada");
  avisar("Gracias por ayudar a reconstruir la historia.");
  tarjeta = await armarTarjeta();
  await guardarEnArchivo();
  const botones = ["btn-repetir", "btn-descargar", "btn-imprimir"];
  if (datos.email && emailjsListo()) botones.splice(1, 0, "btn-mail");
  mostrarBotones(botones);
}
// Dibuja la tarjeta de recuerdo: papel, titulo, las tres polaroids y el pie con la ficha.
async function armarTarjeta() {
  const A = 1200;
  const B = 900;
  const lienzo = document.createElement("canvas");
  lienzo.width = A;
  lienzo.height = B;
  const ctx = lienzo.getContext("2d");
  await document.fonts.ready.catch(() => {});
  ctx.fillStyle = "#ede3cb";
  ctx.fillRect(0, 0, A, B);
  ctx.strokeStyle = "#d9cbaa";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, A - 36, B - 36);
  ctx.textAlign = "center";
  ctx.fillStyle = "#a5231d";
  ctx.font = '26px "Special Elite", monospace';
  ctx.fillText("EXPEDIENTE 16.09.1976 — A CINCUENTA AÑOS", A / 2, 82);
  ctx.fillStyle = "#3d3830";
  ctx.font = '44px "Special Elite", monospace';
  ctx.fillText("Gracias por ayudar", A / 2, 152);
  ctx.fillText("a reconstruir la historia", A / 2, 204);
  const imgs = await Promise.all(tomas.map((src) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  })));
  const anchoFoto = 280;
  const marco = 22;
  const pie = 68;
  const giros = [-0.07, 0.035, -0.03];
  imgs.filter(Boolean).forEach((im, i) => {
    const ancho = anchoFoto + marco * 2;
    const alto = anchoFoto + marco + pie;
    ctx.save();
    ctx.translate(A / 2 + (i - 1) * 352, 480);
    ctx.rotate(giros[i] || 0);
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "#fbf7ee";
    ctx.fillRect(-ancho / 2, -alto / 2, ancho, alto);
    ctx.shadowColor = "transparent";
    ctx.drawImage(im, -anchoFoto / 2, -alto / 2 + marco, anchoFoto, anchoFoto);
    ctx.fillStyle = "#3d3830";
    ctx.font = "30px Caveat, cursive";
    ctx.fillText(i === 1 ? datos.nombre : PIES[i], 0, alto / 2 - 22);
    ctx.restore();
  });
  ctx.fillStyle = "#3d3830";
  ctx.font = '28px "Courier Prime", monospace';
  ctx.fillText(`${datos.nombre} · ${datos.puntos} pts · ${datos.correctas} misiones impecables`, A / 2, 742);
  ctx.font = '24px "Courier Prime", monospace';
  ctx.fillStyle = "#6f675a";
  ctx.fillText("Claudia · María Clara · Horacio · Daniel · Francisco · Claudio", A / 2, 796);
  ctx.fillStyle = "#a5231d";
  ctx.font = '26px "Special Elite", monospace';
  ctx.fillText("Los lápices siguen escribiendo · 1976 — 2026", A / 2, 850);
  return lienzo.toDataURL("image/jpeg", 0.9);
}
// Sube la tarjeta a Cloudinary y devuelve el link, para que el mail lleve
// solo la URL en vez de la imagen entera.
async function subirTarjeta() {
  if (fotoUrl) return fotoUrl;
  if (!cloudinaryListo()) return "";
  const blob = await (await fetch(tarjeta)).blob();
  const cuerpo = new FormData();
  cuerpo.append("file", blob);
  cuerpo.append("upload_preset", CLOUDINARY.preset);
  cuerpo.append("folder", "noche-lapices");
  cuerpo.append("tags", "noche-lapices");
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.nube}/image/upload`, { method: "POST", body: cuerpo });
  if (!r.ok) throw new Error("no se pudo subir");
  const json = await r.json();
  fotoUrl = json.secure_url || "";
  return fotoUrl;
}
async function cargarEmailJS() {
  if (window.emailjs) return window.emailjs;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = res;
    s.onerror = rej;
    document.head.append(s);
  });
  window.emailjs.init({ publicKey: EMAILJS.clave });
  return window.emailjs;
}
async function enviarPorMail() {
  const boton = $("btn-mail");
  boton.disabled = true;
  avisar("Enviando el recuerdo a tu mail…");
  try {
    const url = await subirTarjeta().catch(() => "");
    const emailjs = await cargarEmailJS();
    await emailjs.send(EMAILJS.servicio, EMAILJS.plantilla, {
      nombre: datos.nombre,
      // el mismo destinatario con los dos nombres habituales, para que ande
      // sea que el template use {{email}} o el {{to_email}} que trae por defecto
      email: datos.email,
      to_email: datos.email,
      to_name: datos.nombre,
      puntos: String(datos.puntos),
      correctas: String(datos.correctas),
      fecha: new Date(datos.fecha).toLocaleDateString("es-AR"),
      foto_url: url
    });
    if (url) await guardarEnArchivo(true);
    avisar(url
      ? `Listo, te lo mandamos a ${datos.email}.`
      : `Te mandamos el mail a ${datos.email}, pero sin la foto: bajala con "descargar".`, !url);
    boton.classList.add("oculta");
  } catch (e) {
    console.error("[recuerdo] falló el envío:", e?.status, e?.text || e?.message || e);
    boton.disabled = false;
    avisar("No se pudo enviar el mail. Probá con descargar la foto.", true);
  }
}
function descargar() {
  const limpio = (datos.nombre || "visita").normalize("NFD").replace(/[^\w]+/g, "-").toLowerCase();
  fetch(tarjeta).then((r) => r.blob()).then((b) => bajarArchivo(`recuerdo-${limpio}.jpg`, b));
  avisar("Foto descargada.");
}
function imprimir() {
  const cont = $("recuerdo-impresion");
  cont.innerHTML = "";
  const img = new Image();
  img.src = tarjeta;
  img.alt = "Recuerdo de la visita";
  cont.append(img);
  const lanzar = () => setTimeout(() => window.print(), 120);
  if (img.complete) lanzar();
  else img.addEventListener("load", lanzar, { once: true });
}
async function guardarEnArchivo(rehacer = false) {
  if (datos.prueba) return;
  if (guardada && !rehacer) return;
  if (guardada && rehacer) return void await actualizarVisita(guardada, { fotoUrl });
  // se guardan como Blob y no como data URL: ocupa un tercio menos y con
  // cientos de visitas esa diferencia es de decenas de megas
  const [tarjetaBlob, ...fotosBlob] = await Promise.all([tarjeta, ...tomas].map(aBlob));
  guardada = await guardarVisita({ ...datos, tarjeta: tarjetaBlob, fotos: fotosBlob, fotoUrl });
}
export async function abrirRecuerdo(ficha, cerrar) {
  if (ficha) datos = ficha;
  alCerrar = cerrar;
  tomas = [];
  tarjeta = "";
  guardada = false;
  fotoUrl = "";
  $("recuerdo-tira").innerHTML = "";
  $("recuerdo-camara").classList.remove("apagada", "sin-camara");
  $("recuerdo-nombre").textContent = datos.nombre;
  $("btn-mail").disabled = false;
  mostrarBotones(["btn-disparar"]);
  avisar(datos.email && emailjsListo()
    ? `Sacate tres fotos y te las mandamos a ${datos.email}.`
    : "Sacate tres fotos para dejar tu huella en el archivo.");
  await prenderCamara();
}
export function cerrarRecuerdo() {
  apagarCamara();
  $("recuerdo-impresion").innerHTML = "";
}
$("btn-disparar").addEventListener("click", sesionDeFotos);
$("btn-repetir").addEventListener("click", async () => {
  $("recuerdo-camara").classList.remove("apagada");
  mostrarBotones([]);
  if (await prenderCamara()) sesionDeFotos();
});
$("btn-mail").addEventListener("click", enviarPorMail);
$("btn-descargar").addEventListener("click", descargar);
$("btn-imprimir").addEventListener("click", imprimir);
$("btn-terminar").addEventListener("click", () => {
  cerrarRecuerdo();
  alCerrar?.();
});
