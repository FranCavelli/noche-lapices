import gsap from "gsap";
import { MISIONES, slugMision } from "./misiones.js";
import { abrirRecuerdo } from "./recuerdo.js";
import { arrancarMusica, pararMusica, acompanar, taparMusica, destaparMusica } from "./musica.js";
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
const ruta = (p) => BASE + p;
// cada visita sortea 7 misiones del pool, con mezcla de tipos garantizada
const MISIONES_POR_PARTIDA = 7;
const CUPOS = { tachado: 2, veredicto: 2, orden: 1, unir: 1, escena: 1 };
const TIEMPOS = { tachado: 30, veredicto: 15, orden: 40, unir: 35 };
const CARAS = [
  ["claudia-falcone.jpg", "Claudia Falcone"],
  ["maria-clara-ciocchini.jpg", "María Clara Ciocchini"],
  ["horacio-ungaro.jpg", "Horacio Ungaro"],
  ["daniel-racero.jpg", "Daniel Racero"],
  ["francisco-lopez-muntaner.jpg", "Francisco López Muntaner"],
  ["claudio-de-acha.jpg", "Claudio de Acha"]
];
const BASE_MISION = 120;
const BONUS_MISION = 60;
const FRAMES_APERTURA = [1, 2, 3, 4, 5, 7, 8];
const RANKING_KEY = "nlp_ranking_v1";
const CONSIGNAS = {
  tachado: "Tocá la palabra que restaura cada tachadura.",
  veredicto: "Sellá el documento: ¿verdadero o falso?",
  escena: "Mirá la escena y respondé.",
  orden: "Tocá los hechos en orden, del primero al último.",
  unir: "Uní cada nombre con su dato: tocá uno de cada columna."
};
const estado = {
  nombre: "",
  telefono: "",
  email: "",
  ficha: null,
  puntos: 0,
  perfectas: 0,
  misiones: [],
  idx: 0,
  sub: { total: 0, hechos: 0, puntos: 0, errores: 0 },
  resuelta: false,
  timer: null,
  t0: 0,
  timeoutId: null,
  revelar: null,
  audioDato: null,
  medios: null,
  galeriaTimer: null,
  galeriaGen: 0,
  carasTimeouts: [],
  audioClip: null,
  saltear: null,
  cancionId: null
};
fetch(ruta("/media/manifest.json")).then((r) => r.ok ? r.json() : null).then((j) => estado.medios = j).catch(() => {
});
function pararClip() {
  if (!estado.audioClip) return;
  estado.audioClip.pause();
  estado.audioClip.botonRef?.classList.remove("sonando");
  estado.audioClip = null;
}
function reproducirClip(src, boton) {
  pararClip();
  const a = new Audio(ruta(src));
  a.botonRef = boton;
  boton.classList.add("sonando");
  a.addEventListener("ended", () => boton.classList.remove("sonando"));
  a.play().catch(() => {});
  estado.audioClip = acompanar(a);
}
function reproducirVoz(slug) {
  const a = new Audio(ruta(`/audio/datos/${slug}.mp3`));
  // marcamos si llegó a sonar: las misiones nuevas todavía no tienen audio
  // grabado y ahí hay que darle tiempo a la gente a leer el dato en pantalla
  a.sono = false;
  a.addEventListener("playing", () => (a.sono = true), { once: true });
  a.play().catch(() => {
  });
  return acompanar(a);
}
const $ = (id) => document.getElementById(id);
const pantallas = { portada: $("portada"), apertura: $("apertura"), juego: $("juego"), final: $("final"), recuerdo: $("recuerdo") };
function mostrar(nombre) {
  Object.values(pantallas).forEach((p) => p.classList.remove("activa"));
  pantallas[nombre].classList.add("activa");
}
function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function elegirMisiones() {
  const porTipo = {};
  MISIONES.forEach((m) => (porTipo[m.tipo] ||= []).push(m));
  const elegidas = [];
  for (const [tipo, n] of Object.entries(CUPOS)) elegidas.push(...barajar(porTipo[tipo] || []).slice(0, n));
  const resto = MISIONES.filter((m) => !elegidas.includes(m));
  elegidas.push(...barajar(resto).slice(0, MISIONES_POR_PARTIDA - elegidas.length));
  return barajar(elegidas);
}
function barajarDesalineado(items, posOriginalDe) {
  const n = items.length;
  let mezcla;
  let intentos = 0;
  do {
    mezcla = barajar(items);
    const fijos = mezcla.filter((it, pos) => posOriginalDe(it) === pos).length;
    const invertida = mezcla.every((it, pos) => posOriginalDe(it) === n - 1 - pos);
    if (fijos <= 1 && !invertida) return mezcla;
  } while (++intentos < 50);
  return mezcla;
}
function sacudir(el) {
  el.classList.add("mal-intento");
  setTimeout(() => el.classList.remove("mal-intento"), 380);
}
const leerRanking = () => {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY)) || [];
  } catch {
    return [];
  }
};
const guardarRanking = (lista) => localStorage.setItem(RANKING_KEY, JSON.stringify(lista));
$("nro-visita").textContent = String(leerRanking().length + 1).padStart(3, "0");
function pintarPodio() {
  const top = [...leerRanking()].sort((a, b) => b.puntos - a.puntos).slice(0, 5);
  $("podio").classList.toggle("oculta", top.length === 0);
  const ol = $("podio-lista");
  ol.innerHTML = "";
  const medallas = ["oro", "plata", "bronce"];
  top.forEach((r, i) => {
    const li = document.createElement("li");
    if (medallas[i]) li.classList.add(medallas[i]);
    li.innerHTML = `<span class="pos">${i + 1}.</span><span class="nom">${escapeHtml(r.nombre)}</span><span class="pts">${r.puntos} pts</span>`;
    ol.appendChild(li);
  });
}
pintarPodio();
let vozInvitacion = null;
function invitar() {
  if (!pantallas.portada.classList.contains("activa")) return;
  if (vozInvitacion && !vozInvitacion.paused) return;
  vozInvitacion = new Audio(ruta("/audio/datos/invitacion.mp3"));
  vozInvitacion.play().catch(() => {});
}
setTimeout(invitar, 1500);
setInterval(invitar, 120000);
const rutaFrame = (n) => ruta(`/expediente/frame-${String(n).padStart(2, "0")}.jpg`);
const frames = FRAMES_APERTURA.map((n) => {
  const img = new Image();
  img.src = rutaFrame(n);
  return img;
});
$("ficha-ingreso").addEventListener("submit", (e) => {
  e.preventDefault();
  if (pantallas.apertura.classList.contains("activa")) return;
  const nombre = $("nombre").value.trim();
  if (!nombre) return;
  vozInvitacion?.pause();
  estado.nombre = nombre;
  estado.telefono = $("telefono").value.trim();
  estado.email = $("email").value.trim();
  estado.puntos = 0;
  estado.perfectas = 0;
  estado.misiones = elegirMisiones();
  arrancarMusica();
  $("hud-nombre").textContent = nombre;
  $("hud-puntos").textContent = "0 pts";
  animarApertura();
});
async function animarApertura() {
  const img = $("apertura-img");
  mostrar("apertura");
  for (let i = 0; i < FRAMES_APERTURA.length; i++) {
    img.src = rutaFrame(FRAMES_APERTURA[i]);
    try {
      await Promise.race([img.decode(), new Promise((r) => setTimeout(r, 450))]);
    } catch {
    }
    await new Promise((r) => setTimeout(r, i === 0 ? 250 : 400));
  }
  gsap.to(img, { scale: 1.18, duration: 1, ease: "power2.inOut" });
  setTimeout(empezarJuego, 1100);
}
function empezarJuego() {
  mostrar("juego");
  gsap.set($("apertura-img"), { clearProps: "all" });
  $("mis-total").textContent = estado.misiones.length;
  estado.misiones.forEach((m) => {
    const a = new Audio(ruta(`/audio/datos/${slugMision(m.titulo)}.mp3`));
    a.preload = "auto";
  });
  cargarMision(0);
}
const subTotalDe = (m) => ({ tachado: () => m.blancos.length, orden: () => m.eventos.length, unir: () => m.pares.length, veredicto: () => 1, escena: () => 1 })[m.tipo]();
function ajustarHoja() {
  const hoja = $("hoja");
  const vista = $("vista-mision");
  vista.style.zoom = "";
  const cs = getComputedStyle(hoja);
  const disponible = hoja.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const necesario = vista.scrollHeight;
  if (necesario > disponible + 1) vista.style.zoom = Math.max(0.55, disponible / necesario);
  hoja.scrollTop = 0;
}
function reservarAlto(el, texto) {
  el.style.minHeight = "";
  el.textContent = texto;
  const alto = el.getBoundingClientRect().height;
  el.textContent = "";
  el.style.minHeight = `${alto}px`;
}
function cargarMision(i) {
  estado.idx = i;
  estado.resuelta = false;
  clearTimeout(estado.cancionId);
  ocultarSaltear();
  estado.revelar = null;
  estado.audioDato?.pause();
  estado.audioDato = null;
  pararClip();
  clearInterval(estado.galeriaTimer);
  estado.galeriaTimer = null;
  estado.galeriaGen++;
  estado.carasTimeouts.forEach(clearTimeout);
  estado.carasTimeouts = [];
  $("galeria").innerHTML = "";
  const m = estado.misiones[i];
  estado.sub = { total: subTotalDe(m), hechos: 0, puntos: 0, errores: 0 };
  $("mis-num").textContent = i + 1;
  $("mis-titulo").textContent = m.titulo;
  $("mis-consigna").textContent = m.consigna || CONSIGNAS[m.tipo];
  const cuerpo = $("mis-cuerpo");
  // pausar antes de vaciar: si un video se va del DOM sonando, no dispara
  // "pause" y la música quedaría agachada para siempre
  cuerpo.querySelectorAll("video").forEach((v) => v.pause());
  cuerpo.innerHTML = "";
  CONSTRUCTORES[m.tipo](m, cuerpo);
  const numerar = (botones) => botones.slice(0, 9).forEach((b, n) => {
    b.dataset.tecla = n + 1;
    const t = document.createElement("span");
    t.className = "tecla";
    t.textContent = n + 1;
    b.append(t);
  });
  if (m.tipo === "unir") {
    numerar([...cuerpo.querySelectorAll(".unir-nombre")]);
    numerar([...cuerpo.querySelectorAll(".unir-dato")]);
  } else {
    numerar([...cuerpo.querySelectorAll(".chip, .sello-vf, .orden-item")]);
  }
  const sello = $("sello-feedback");
  sello.className = "sello-feedback";
  sello.textContent = "";
  gsap.set(sello, { opacity: 0 });
  reservarAlto($("mis-dato"), m.dato);
  gsap.set($("mis-dato"), { opacity: 0 });
  reservarAlto($("anota-puntos"), "quedó asentado en el expediente");
  gsap.set($("anota-puntos"), { opacity: 0 });
  gsap.set($("timer-barra"), { scaleX: 1 });
  gsap.fromTo(
    $("hoja"),
    { y: 60, opacity: 0, rotate: i % 2 ? -2.4 : 2.8 },
    { y: 0, opacity: 1, rotate: i % 2 ? -0.4 : 0.4, duration: 0.55, ease: "power3.out" }
  );
  ajustarHoja();
  cuerpo.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", ajustarHoja, { once: true });
  });
  arrancarTimer(m.tiempo || TIEMPOS[m.tipo]);
}
addEventListener("resize", () => {
  if (pantallas.juego.classList.contains("activa")) ajustarHoja();
});
document.addEventListener("keydown", (e) => {
  if (!pantallas.juego.classList.contains("activa") || estado.resuelta) return;
  if (!/^[1-9]$/.test(e.key)) return;
  const cuerpo = $("mis-cuerpo");
  const candidatos = [...cuerpo.querySelectorAll(`[data-tecla="${e.key}"]`)];
  if (!candidatos.length) return;
  let b = candidatos[0];
  if (candidatos.length > 1) {
    const haySeleccion = cuerpo.querySelector(".unir-nombre.sel");
    b = candidatos.find((x) => x.classList.contains(haySeleccion ? "unir-dato" : "unir-nombre")) || b;
  }
  if (b && !b.disabled) b.click();
});
function arrancarTimer(segundos) {
  estado.t0 = Date.now();
  estado.timer = gsap.to($("timer-barra"), { scaleX: 0, duration: segundos, ease: "none" });
  estado.timeoutId = setTimeout(() => resolverMision(true), segundos * 1e3);
}
function anotarSub(valor) {
  estado.sub.hechos++;
  estado.sub.puntos += valor;
  if (estado.sub.hechos === estado.sub.total) resolverMision(false);
}
function construirTachado(m, cuerpo) {
  const valor = Math.round(BASE_MISION / m.blancos.length);
  let actual = 0;
  let errorActual = false;
  if (m.img) {
    const fig = document.createElement("figure");
    fig.className = "ficha-figura chica";
    const img = document.createElement("img");
    img.src = ruta(m.img);
    img.alt = m.titulo;
    fig.append(img);
    cuerpo.append(fig);
  }
  const doc = document.createElement("p");
  doc.className = "doc-texto";
  const tachones = [];
  m.texto.split(/\[\[(\d+)\]\]/).forEach((parte, i) => {
    if (i % 2 === 0) {
      doc.append(parte);
      return;
    }
    const idx = Number(parte);
    const s = document.createElement("span");
    s.className = "tachon";
    s.textContent = m.blancos[idx];
    tachones[idx] = s;
    doc.append(s);
  });
  cuerpo.append(doc);
  tachones[0].classList.add("actual");
  const chips = document.createElement("div");
  chips.className = "chips";
  barajar([...m.blancos, ...m.senuelos]).forEach((palabra) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = palabra;
    b.addEventListener("click", () => {
      if (estado.resuelta || b.disabled) return;
      if (palabra === m.blancos[actual]) {
        const t = tachones[actual];
        t.classList.remove("actual");
        t.classList.add("revelado");
        b.disabled = true;
        b.classList.add("usado");
        anotarSub(errorActual ? Math.round(valor / 2) : valor);
        errorActual = false;
        actual++;
        if (actual < m.blancos.length && !estado.resuelta) tachones[actual].classList.add("actual");
      } else {
        errorActual = true;
        estado.sub.errores++;
        sacudir(b);
      }
    });
    chips.append(b);
  });
  cuerpo.append(chips);
  estado.revelar = () => {
    for (let i = actual; i < m.blancos.length; i++) {
      tachones[i].classList.remove("actual");
      tachones[i].classList.add("revelado", "fallado");
    }
  };
}
function construirVeredicto(m, cuerpo) {
  const p = document.createElement("p");
  p.className = "afirmacion";
  p.textContent = `«${m.afirmacion}»`;
  cuerpo.append(p);
  const fila = document.createElement("div");
  fila.className = "sellos-vf";
  const botones = [];
  [
    ["VERDADERO", true],
    ["FALSO", false]
  ].forEach(([txt, val]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `boton-sello sello-vf ${val ? "vf-cierto" : "vf-falso"}`;
    b.textContent = txt;
    b.addEventListener("click", () => {
      if (estado.resuelta) return;
      botones.forEach((o) => o.disabled = true);
      if (val === m.esCierto) {
        b.classList.add("acertado");
        anotarSub(BASE_MISION);
      } else {
        b.classList.add("errado");
        botones[m.esCierto ? 0 : 1].classList.add("acertado");
        estado.sub.errores++;
        resolverMision(false);
      }
    });
    botones.push(b);
    fila.append(b);
  });
  cuerpo.append(fila);
  estado.revelar = () => botones[m.esCierto ? 0 : 1].classList.add("acertado");
}
function construirOrden(m, cuerpo) {
  const valor = Math.round(BASE_MISION / m.eventos.length);
  let siguiente = 0;
  let errorSlot = false;
  const linea = document.createElement("div");
  linea.className = "lt-linea";
  const slots = m.eventos.map((ev, pos) => {
    const slot = document.createElement("div");
    slot.className = "lt-slot";
    const nodo = document.createElement("span");
    nodo.className = "lt-nodo";
    nodo.textContent = pos + 1;
    const anio = document.createElement("span");
    anio.className = "lt-anio lapiz";
    const txt = document.createElement("span");
    txt.className = "lt-txt";
    txt.textContent = "· · · · ·";
    slot.append(nodo, anio, txt);
    linea.append(slot);
    return { slot, anio, txt };
  });
  cuerpo.append(linea);
  const llenarSlot = (pos, ev, fallado) => {
    const { slot, anio, txt } = slots[pos];
    slot.classList.add("lleno");
    if (fallado) slot.classList.add("fallado");
    anio.textContent = ev.anio;
    txt.textContent = ev.txt;
    gsap.fromTo(slot, { y: 10, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
  };
  const pendientes = document.createElement("div");
  pendientes.className = "lt-pendientes";
  const items = [];
  barajarDesalineado(m.eventos.map((ev, pos) => ({ ...ev, pos })), (it) => it.pos).forEach((ev) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "orden-item";
    const txt = document.createElement("span");
    txt.className = "orden-txt";
    txt.textContent = ev.txt;
    b.append(txt);
    b.addEventListener("click", () => {
      if (estado.resuelta || b.classList.contains("hecho")) return;
      if (ev.pos === siguiente) {
        b.classList.add("hecho");
        b.disabled = true;
        gsap.to(b, { opacity: 0.3, scale: 0.97, duration: 0.3 });
        llenarSlot(ev.pos, ev, false);
        anotarSub(errorSlot ? Math.round(valor / 2) : valor);
        errorSlot = false;
        siguiente++;
      } else {
        errorSlot = true;
        estado.sub.errores++;
        sacudir(b);
      }
    });
    items.push({ b, ev });
    pendientes.append(b);
  });
  cuerpo.append(pendientes);
  estado.revelar = () => {
    items.forEach(({ b, ev }) => {
      if (b.classList.contains("hecho")) return;
      b.classList.add("hecho", "fallado");
      llenarSlot(ev.pos, ev, true);
    });
  };
}
function construirUnir(m, cuerpo) {
  const valor = Math.round(BASE_MISION / m.pares.length);
  let seleccion = null;
  const conError = new Set();
  let vinculados = 0;
  const grilla = document.createElement("div");
  grilla.className = "unir-grilla";
  const colIzq = document.createElement("div");
  const colDer = document.createElement("div");
  colIzq.className = "unir-col";
  colDer.className = "unir-col";
  grilla.append(colIzq, colDer);
  const lienzo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lienzo.setAttribute("class", "unir-lineas");
  grilla.append(lienzo);
  const dibujarLinea = (izq, der, fallada) => {
    const g = grilla.getBoundingClientRect();
    const a = izq.getBoundingClientRect();
    const d = der.getBoundingClientRect();
    const x1 = a.right - g.left;
    const y1 = a.top + a.height / 2 - g.top;
    const x2 = d.left - g.left;
    const y2 = d.top + d.height / 2 - g.top;
    const trazo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trazo.setAttribute("d", `M ${x1} ${y1} C ${x1 + 22} ${y1}, ${x2 - 22} ${y2}, ${x2} ${y2}`);
    trazo.setAttribute("class", fallada ? "linea-union fallada" : "linea-union");
    lienzo.append(trazo);
    const largo = trazo.getTotalLength();
    trazo.style.strokeDasharray = largo;
    gsap.fromTo(trazo, { strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" });
  };
  const izquierdos = [];
  const derechos = [];
  m.pares.forEach(([nombre], idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "unir-item unir-nombre";
    b.textContent = m.sonidos ? `♪ ${nombre}` : nombre;
    if (m.sonidos) b.classList.add("unir-sonido");
    b.dataset.idx = idx;
    b.addEventListener("click", () => {
      if (estado.resuelta || b.classList.contains("hecho")) return;
      izquierdos.forEach((o) => o.classList.remove("sel"));
      b.classList.add("sel");
      seleccion = b;
      if (m.sonidos) reproducirClip(m.sonidos[idx], b);
    });
    izquierdos.push(b);
    colIzq.append(b);
  });
  barajarDesalineado(m.pares.map(([, datoTxt], idx) => ({ datoTxt, idx })), (it) => it.idx).forEach(({ datoTxt, idx }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "unir-item unir-dato";
    b.textContent = datoTxt;
    b.dataset.idx = idx;
    b.addEventListener("click", () => {
      if (estado.resuelta || b.classList.contains("hecho")) return;
      if (!seleccion) {
        sacudir(b);
        return;
      }
      const idxSel = Number(seleccion.dataset.idx);
      if (idxSel === idx) {
        vinculados++;
        dibujarLinea(seleccion, b, false);
        [seleccion, b].forEach((el) => {
          el.classList.remove("sel");
          el.classList.add("hecho");
          el.dataset.vinculo = vinculados;
        });
        anotarSub(conError.has(idx) ? Math.round(valor / 2) : valor);
        seleccion = null;
      } else {
        conError.add(idxSel);
        estado.sub.errores++;
        sacudir(b);
      }
    });
    derechos.push(b);
    colDer.append(b);
  });
  cuerpo.append(grilla);
  estado.revelar = () => {
    m.pares.forEach((_, idx) => {
      const izq = izquierdos.find((b) => Number(b.dataset.idx) === idx);
      const der = derechos.find((b) => Number(b.dataset.idx) === idx);
      if (izq.classList.contains("hecho")) return;
      vinculados++;
      dibujarLinea(izq, der, true);
      [izq, der].forEach((el) => {
        el.classList.remove("sel");
        el.classList.add("hecho", "fallado");
        el.dataset.vinculo = vinculados;
      });
    });
  };
}
function construirEscena(m, cuerpo) {
  const marco = document.createElement("div");
  marco.className = "escena-video";
  const video = document.createElement("video");
  video.src = ruta("/media/video/suigenerisnochelapices.mp4");
  video.autoplay = true;
  video.controls = false;
  video.playsInline = true;
  video.preload = "auto";
  video.disablePictureInPicture = true;
  video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
  video.setAttribute("aria-label", m.titulo);
  const desde = m.desde || 0;
  const hasta = m.hasta || Infinity;
  const arrancar = () => {
    if (desde > 0 && Math.abs(video.currentTime - desde) > 0.3) video.currentTime = desde;
    video.play().then(() => marco.classList.remove("trabado")).catch(() => marco.classList.add("trabado"));
  };
  marco.addEventListener("click", () => {
    if (!video.paused || video.currentTime >= Number(video.dataset.hasta)) return;
    video.play().then(() => marco.classList.remove("trabado")).catch(() => marco.classList.add("trabado"));
  });
  video.addEventListener("play", taparMusica);
  video.addEventListener("pause", destaparMusica);
  if (video.readyState >= 1) arrancar();
  else video.addEventListener("loadedmetadata", arrancar, { once: true });
  // el tope vive en el dataset porque cambia al revelar, cuando suena la canción
  video.dataset.hasta = String(hasta);
  video.addEventListener("timeupdate", () => {
    const tope = Number(video.dataset.hasta);
    if (tope && video.currentTime >= tope) video.pause();
  });
  marco.append(video);
  cuerpo.append(marco);
  const p = document.createElement("p");
  p.className = "afirmacion escena-pregunta";
  p.textContent = m.pregunta;
  cuerpo.append(p);
  const lista = document.createElement("div");
  lista.className = "lt-pendientes";
  const botones = [];
  barajar(m.opciones.map((txt, idx) => ({ txt, idx }))).forEach(({ txt, idx }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "orden-item";
    if (idx === m.correcta) b.dataset.correcta = "1";
    const s = document.createElement("span");
    s.className = "orden-txt";
    s.textContent = txt;
    b.append(s);
    b.addEventListener("click", () => {
      if (estado.resuelta) return;
      botones.forEach((o) => (o.disabled = true));
      if (idx === m.correcta) {
        b.classList.add("hecho");
        anotarSub(BASE_MISION);
      } else {
        b.classList.add("hecho", "fallado");
        botones.find((o) => o.dataset.correcta === "1")?.classList.add("hecho");
        estado.sub.errores++;
        resolverMision(false);
      }
    });
    botones.push(b);
    lista.append(b);
  });
  cuerpo.append(lista);
  estado.revelar = () => botones.find((o) => o.dataset.correcta === "1")?.classList.add("hecho");
}
const CONSTRUCTORES = { tachado: construirTachado, veredicto: construirVeredicto, orden: construirOrden, unir: construirUnir, escena: construirEscena };
function mostrarGaleria(slug) {
  const lista = estado.medios?.[slug];
  if (!lista?.length) return;
  const galeria = $("galeria");
  const maxFotos = matchMedia("(max-width: 640px)").matches ? 2 : 4;
  const seleccion = barajar(lista).slice(0, maxFotos);
  const n = seleccion.length;
  let i = 0;
  const poner = () => {
    if (i >= n) {
      clearInterval(estado.galeriaTimer);
      estado.galeriaTimer = null;
      return;
    }
    const src = seleccion[i];
    const paso = i - (n - 1) / 2;
    const marco = document.createElement("figure");
    marco.className = "foto-caida";
    marco.style.zIndex = String(20 - i);
    const vista = document.createElement("div");
    vista.className = "foto-vista";
    const esVideo = /\.(mp4|webm)$/i.test(src);
    const el = esVideo ? document.createElement("video") : document.createElement("img");
    el.src = ruta(src);
    if (esVideo) {
      el.muted = true;
      el.autoplay = true;
      el.loop = true;
      el.playsInline = true;
    }
    vista.append(el);
    marco.append(vista);
    if (/\/media\/photos\//.test(src) && !/teresa-laborde/.test(src)) {
      const credito = document.createElement("figcaption");
      credito.className = "foto-credito";
      credito.textContent = "PH: Gabriela Villalba";
      marco.append(credito);
    }
    galeria.append(marco);
    const panear = () => {
      const sobra = el.getBoundingClientRect().width - vista.getBoundingClientRect().width;
      if (sobra > 12) gsap.fromTo(el, { x: 0 }, { x: -sobra, duration: 5.5, ease: "none" });
    };
    if (esVideo) el.addEventListener("loadeddata", panear, { once: true });
    else if (el.complete) panear();
    else el.addEventListener("load", panear, { once: true });
    gsap.fromTo(
      marco,
      { xPercent: -50, yPercent: -50, x: 0, y: 30, opacity: 0, scale: 0.9, rotate: 0 },
      {
        xPercent: -50,
        yPercent: -50,
        x: `${paso * 110}%`,
        y: Math.abs(paso) * 14,
        opacity: 1,
        scale: 1,
        rotate: paso * 5,
        duration: 0.7,
        ease: "power2.out"
      }
    );
    i++;
  };
  setTimeout(() => {
    if (!estado.resuelta) return;
    poner();
    estado.galeriaTimer = setInterval(poner, 3400);
  }, 1e3);
}
function tiemposDeNombres(texto) {
  if (!texto) return null;
  const cortos = ["Claudia", "María Clara", "Horacio", "Daniel", "Francisco", "Claudio"];
  let desde = 0;
  const fracciones = [];
  for (const n of cortos) {
    const i = texto.indexOf(n, desde);
    if (i < 0) return null;
    fracciones.push(i / texto.length);
    desde = i + n.length;
  }
  return fracciones;
}
function mostrarCaras(fracciones) {
  const galeria = $("galeria");
  const gen = estado.galeriaGen;
  const cargas = CARAS.map(([archivo, nombre]) => new Promise((res) => {
    const img = new Image();
    img.src = ruta(`/media/caras/${archivo}`);
    img.onload = () => res({ img, nombre });
    img.onerror = () => res(null);
  }));
  Promise.all(cargas).then((resultados) => {
    if (!estado.resuelta || gen !== estado.galeriaGen) return;
    const caras = resultados.filter(Boolean);
    if (!caras.length) return;
    const porFila = matchMedia("(max-width: 640px)").matches ? 2 : 3;
    const filas = Math.ceil(caras.length / porFila);
    const ponerCara = ({ img, nombre }, i) => {
      if (gen !== estado.galeriaGen) return;
      const fila = Math.floor(i / porFila);
      const paso = i % porFila - (porFila - 1) / 2;
      const marco = document.createElement("figure");
      marco.className = "foto-caida cara";
      marco.style.zIndex = String(20 - i);
      const vista = document.createElement("div");
      vista.className = "foto-vista";
      vista.append(img);
      const cartel = document.createElement("figcaption");
      cartel.className = "cara-nombre";
      cartel.textContent = nombre;
      marco.append(vista, cartel);
      galeria.append(marco);
      const alto = marco.offsetHeight + 16;
      const yFinal = fila * alto - (filas - 1) * alto / 2;
      gsap.fromTo(
        marco,
        { xPercent: -50, yPercent: -50, x: 0, y: yFinal + 30, opacity: 0, scale: 0.9, rotate: 0 },
        { xPercent: -50, yPercent: -50, x: `${paso * 112}%`, y: yFinal, opacity: 1, scale: 1, rotate: paso * 3, duration: 0.6, ease: "power2.out" }
      );
    };
    const voz = estado.audioDato;
    const cadencia = () => caras.forEach((cara, i) => estado.carasTimeouts.push(setTimeout(() => ponerCara(cara, i), 400 + i * 1e3)));
    const conVoz = () => {
      if (!(isFinite(voz.duration) && voz.duration > 0)) return cadencia();
      caras.forEach((cara, i) => {
        const t = Math.max(0.2, (fracciones[i] ?? i / caras.length) * voz.duration - voz.currentTime) * 1e3;
        estado.carasTimeouts.push(setTimeout(() => ponerCara(cara, i), t));
      });
    };
    if (!fracciones || !voz) return cadencia();
    if (isFinite(voz.duration) && voz.duration > 0) return conVoz();
    let fue = false;
    const unaVez = () => {
      if (!fue) {
        fue = true;
        conVoz();
      }
    };
    voz.addEventListener("loadedmetadata", unaVez, { once: true });
    estado.carasTimeouts.push(setTimeout(unaVez, 1500));
  });
}
function resolverMision(porTiempo) {
  if (estado.resuelta) return;
  estado.resuelta = true;
  const m = estado.misiones[estado.idx];
  const total = m.tiempo || TIEMPOS[m.tipo];
  const restante = Math.max(0, total - (Date.now() - estado.t0) / 1e3);
  pararClip();
  $("mis-cuerpo").querySelectorAll("iframe").forEach((el) => el.remove());
  $("mis-cuerpo").querySelectorAll("video").forEach((v) => v.pause());
  $("mis-cuerpo").querySelectorAll(".escena-video").forEach((el) => {
    el.classList.remove("trabado");
    el.classList.add("congelado");
  });
  $("hoja").scrollTop = 0;
  estado.timer?.kill();
  estado.timer = null;
  clearTimeout(estado.timeoutId);
  if (porTiempo) estado.revelar?.();
  $("mis-cuerpo").querySelectorAll("button").forEach((b) => b.disabled = true);
  const completo = estado.sub.hechos === estado.sub.total;
  const impecable = completo && estado.sub.errores === 0 && !porTiempo;
  const bonus = impecable ? Math.round(restante / total * BONUS_MISION) : 0;
  const ganados = estado.sub.puntos + bonus;
  estado.puntos += ganados;
  if (impecable) estado.perfectas++;
  $("hud-puntos").textContent = `${estado.puntos} pts`;
  const sello = $("sello-feedback");
  if (porTiempo) {
    sello.textContent = "Sin tiempo";
    sello.classList.add("mal");
  } else if (impecable) {
    sello.textContent = "Correcto";
    sello.classList.add("ok");
  } else if (ganados > 0) {
    sello.textContent = "Parcial";
    sello.classList.add("parcial");
  } else {
    sello.textContent = "Incorrecto";
    sello.classList.add("mal");
  }
  $("anota-puntos").textContent = ganados > 0 ? `+${ganados} pts ✎` : "quedó asentado en el expediente";
  $("mis-dato").textContent = m.dato;
  // si la misión revela con un tramo de video, ese tramo reemplaza a la voz del relator
  const videoFicha = $("mis-cuerpo").querySelector("video");
  const hayTramo = Boolean(m.datoHasta && (videoFicha || m.datoVideo));
  estado.audioDato = hayTramo ? null : reproducirVoz(slugMision(m.titulo));
  if (m.caras) mostrarCaras(tiemposDeNombres(m.voz));
  else if (ganados > 0 && !hayTramo) mostrarGaleria(slugMision(m.titulo));
  gsap.fromTo(sello, { opacity: 0, scale: 2.2 }, { opacity: 0.9, scale: 1, duration: 0.28, ease: "power4.in" });
  gsap.to($("anota-puntos"), { opacity: 1, duration: 0.4, delay: 0.35 });
  gsap.to($("mis-dato"), { opacity: 1, duration: 0.5, delay: 0.6 });
  const seguir = () => {
    ocultarSaltear();
    gsap.to($("hoja"), { y: -70, opacity: 0, rotate: 4, duration: 0.4, ease: "power2.in" });
    setTimeout(() => {
      if (estado.idx + 1 < estado.misiones.length) cargarMision(estado.idx + 1);
      else terminarJuego();
    }, 430);
  };
  if (hayTramo) {
    setTimeout(() => reproducirTramo(videoFicha, m, seguir), 2600);
    return;
  }
  setTimeout(() => {
    const voz = estado.audioDato;
    if (voz && !voz.paused && !voz.ended) {
      let fue = false;
      const unaVez = () => {
        if (!fue) {
          fue = true;
          seguir();
        }
      };
      voz.addEventListener("ended", unaVez, { once: true });
      voz.addEventListener("error", unaVez, { once: true });
      const restante = isFinite(voz.duration) && voz.duration > 0 ? voz.duration - voz.currentTime : 0;
      setTimeout(unaVez, restante > 0 ? restante * 1e3 + 2e3 : 3e4);
    } else {
      setTimeout(seguir, voz && !voz.sono ? 4500 : 0);
    }
  }, 4200);
}
// Arma el cuadro de video para las misiones que revelan con un testimonio.
function marcoDeVideo(src) {
  const marco = document.createElement("div");
  marco.className = "escena-video";
  const video = document.createElement("video");
  video.src = ruta(src);
  video.controls = false;
  video.playsInline = true;
  video.preload = "auto";
  video.disablePictureInPicture = true;
  video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
  marco.append(video);
  marco.addEventListener("click", () => {
    if (!video.paused || video.currentTime >= Number(video.dataset.hasta)) return;
    video.play().then(() => marco.classList.remove("trabado")).catch(() => marco.classList.add("trabado"));
  });
  video.addEventListener("play", taparMusica);
  video.addEventListener("pause", destaparMusica);
  return { marco, video };
}
// Reproduce el tramo de video que reemplaza a la voz, con opción de saltear.
// El sello ya se vio, así que se desvanece para no tapar la imagen.
function reproducirTramo(video, m, alTerminar) {
  const desde = m.datoDesde || 0;
  const hasta = m.datoHasta;
  gsap.to($("sello-feedback"), { opacity: 0, duration: 0.5 });
  if (!video) {
    const nuevo = marcoDeVideo(m.datoVideo);
    video = nuevo.video;
    $("mis-cuerpo").append(nuevo.marco);
    ajustarHoja();
    gsap.fromTo(nuevo.marco, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }
  video.closest(".escena-video")?.classList.remove("congelado");
  video.dataset.hasta = String(hasta);
  // el video recién creado puede no tener metadatos todavía: el salto espera
  const posicionar = () => {
    if (Math.abs(video.currentTime - desde) > 0.3) video.currentTime = desde;
  };
  if (video.readyState >= 1) posicionar();
  else video.addEventListener("loadedmetadata", posicionar, { once: true });
  let listo = false;
  const terminar = () => {
    if (listo) return;
    listo = true;
    clearTimeout(estado.cancionId);
    video.pause();
    alTerminar();
  };
  estado.saltear = terminar;
  mostrarSaltear();
  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= hasta) terminar();
  });
  video.addEventListener("ended", terminar, { once: true });
  video.play().catch(() => video.closest(".escena-video")?.classList.add("trabado"));
  // red de seguridad por si el video se traba y nunca llega al final
  estado.cancionId = setTimeout(terminar, (hasta - desde) * 1e3 + 5e3);
}
function mostrarSaltear() {
  const b = $("btn-saltear");
  b.classList.remove("oculta");
  gsap.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.6 });
}
function ocultarSaltear() {
  $("btn-saltear").classList.add("oculta");
  estado.saltear = null;
}
$("btn-saltear").addEventListener("click", () => estado.saltear?.());
document.addEventListener("keydown", (e) => {
  if (!estado.saltear) return;
  if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
    e.preventDefault();
    estado.saltear();
  }
});
function terminarJuego() {
  clearInterval(estado.galeriaTimer);
  estado.galeriaTimer = null;
  estado.galeriaGen++;
  estado.carasTimeouts.forEach(clearTimeout);
  estado.carasTimeouts = [];
  $("galeria").innerHTML = "";
  const lista = leerRanking();
  const registro = {
    nombre: estado.nombre,
    telefono: estado.telefono,
    email: estado.email,
    puntos: estado.puntos,
    correctas: estado.perfectas,
    fecha: (new Date()).toISOString()
  };
  estado.ficha = registro;
  lista.push(registro);
  guardarRanking(lista);
  const contCaras = $("final-caras");
  contCaras.innerHTML = "";
  $("final-frase").classList.remove("oculta");
  const marcosFinal = CARAS.map(([archivo, nombre]) => {
    const marco = document.createElement("figure");
    marco.className = "cara-final";
    marco.style.display = "none";
    const vista = document.createElement("div");
    vista.className = "cara-final-vista";
    const img = new Image();
    img.src = ruta(`/media/caras/${archivo}`);
    img.onerror = () => marco.remove();
    vista.append(img);
    const cartel = document.createElement("figcaption");
    cartel.textContent = nombre;
    marco.append(vista, cartel);
    contCaras.append(marco);
    return marco;
  });
  $("final-nombre").textContent = estado.nombre;
  $("final-puntos").textContent = `${estado.puntos} pts`;
  $("final-detalle").textContent = `${estado.perfectas} de ${estado.misiones.length} misiones impecables`;
  const orden = [...lista].sort((a, b) => b.puntos - a.puntos).slice(0, 10);
  const ol = $("ranking");
  ol.innerHTML = "";
  const miRegistro = lista[lista.length - 1];
  orden.forEach((r, i) => {
    const li = document.createElement("li");
    if (r === miRegistro) li.classList.add("actual");
    li.innerHTML = `<span class="pos">${i + 1}.</span><span class="nom">${escapeHtml(r.nombre)}</span><span class="pts">${r.puntos} pts</span>`;
    ol.appendChild(li);
  });
  mostrar("final");
  estado.audioDato?.pause();
  estado.audioDato = reproducirVoz("final");
  const vozFinal = estado.audioDato;
  const FR_FINAL = [0.01, 0.088, 0.206, 0.289, 0.366, 0.5];
  const revelarCara = (marco) => {
    if (!marco.isConnected) return;
    marco.style.display = "";
    $("final-frase").classList.add("oculta");
    gsap.fromTo(marco, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };
  const programarCarasFinal = () => {
    const dur = vozFinal && isFinite(vozFinal.duration) && vozFinal.duration > 0 ? vozFinal.duration : 0;
    marcosFinal.forEach((marco, i) => setTimeout(() => revelarCara(marco), dur ? Math.max(200, FR_FINAL[i] * dur * 1e3) : 300 + i * 800));
  };
  if (vozFinal && !(isFinite(vozFinal.duration) && vozFinal.duration > 0)) {
    let fue = false;
    const unaVez = () => {
      if (!fue) {
        fue = true;
        programarCarasFinal();
      }
    };
    vozFinal.addEventListener("loadedmetadata", unaVez, { once: true });
    setTimeout(unaVez, 1500);
  } else {
    programarCarasFinal();
  }
  gsap.fromTo(".hoja-final", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
async function animarCierre() {
  const img = $("apertura-img");
  gsap.set(img, { clearProps: "all" });
  mostrar("apertura");
  const alReves = [...FRAMES_APERTURA].reverse();
  for (let i = 0; i < alReves.length; i++) {
    img.src = rutaFrame(alReves[i]);
    try {
      await Promise.race([img.decode(), new Promise((r) => setTimeout(r, 450))]);
    } catch {
    }
    await new Promise((r) => setTimeout(r, 320));
  }
  mostrar("portada");
  $("nombre").focus();
  setTimeout(invitar, 9000);
}
function volverAPortada() {
  estado.audioDato?.pause();
  estado.audioDato = null;
  // entre visitante y visitante el kiosco queda en silencio
  pararMusica();
  $("nombre").value = "";
  $("telefono").value = "";
  $("email").value = "";
  $("nro-visita").textContent = String(leerRanking().length + 1).padStart(3, "0");
  pintarPodio();
  animarCierre();
}
// "Cerrar expediente" pasa antes por el fotomatón; de ahí se vuelve a la portada.
$("btn-reiniciar").addEventListener("click", () => {
  if (pantallas.apertura.classList.contains("activa")) return;
  estado.audioDato?.pause();
  estado.audioDato = null;
  mostrar("recuerdo");
  abrirRecuerdo(estado.ficha, volverAPortada);
});
function exportarRegistros() {
  const blob = new Blob([JSON.stringify(leerRanking(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "registro-noche-de-los-lapices.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
$("btn-exportar").addEventListener("click", exportarRegistros);
$("btn-exportar-portada").addEventListener("click", exportarRegistros);
