// Solucionario oculto (Ctrl+Alt+R): la lista entera de misiones con sus
// opciones y la respuesta correcta marcada, para tener a mano durante el acto.
// Es solo lectura: lo único que toca del juego es el reloj, que se congela
// mientras está abierto y se reanuda al cerrar, sin costarle puntos a nadie.
import { MISIONES } from "./misiones.js";
import { pausarMision, reanudarMision } from "./game.js";

const $ = (id) => document.getElementById(id);
const CONSIGNAS = {
  tachado: "Tocá la palabra que restaura cada tachadura.",
  veredicto: "Sellá el documento: ¿verdadero o falso?",
  escena: "Mirá la escena y respondé.",
  orden: "Tocá los hechos en orden, del primero al último.",
  unir: "Uní cada nombre con su dato: tocá uno de cada columna."
};

const el = (tag, clase, texto) => {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
};

// ── Un bloque por tipo de misión ──────────────────────────────────

function cuerpoTachado(m) {
  const caja = el("div");
  // el texto completo, con cada blanco ya restaurado y resaltado
  const p = el("p", "sol-texto");
  m.texto.split(/\[\[(\d+)\]\]/).forEach((parte, i) => {
    if (i % 2 === 0) p.append(parte);
    else p.append(el("b", "sol-ok", m.blancos[Number(parte)]));
  });
  caja.append(p);
  // los chips salen barajados en el juego: acá van etiquetados
  const chips = el("div", "sol-chips");
  m.blancos.forEach((palabra, i) => {
    const c = el("span", "sol-chip sol-chip-ok", palabra);
    c.prepend(el("i", "sol-marca", `${i + 1}·`));
    chips.append(c);
  });
  m.senuelos.forEach((palabra) => chips.append(el("span", "sol-chip sol-chip-mal", palabra)));
  caja.append(chips);
  return caja;
}

function cuerpoVeredicto(m) {
  const caja = el("div");
  caja.append(el("p", "sol-texto", `«${m.afirmacion}»`));
  caja.append(el("p", `sol-sello ${m.esCierto ? "sol-sello-si" : "sol-sello-no"}`, m.esCierto ? "VERDADERO" : "FALSO"));
  return caja;
}

function cuerpoOrden(m) {
  const ol = el("ol", "sol-linea");
  m.eventos.forEach((ev) => {
    const li = el("li");
    li.append(el("span", "sol-anio", ev.anio), el("span", null, ev.txt));
    ol.append(li);
  });
  return ol;
}

function cuerpoUnir(m) {
  const caja = el("div");
  if (m.sonidos) caja.append(el("p", "sol-nota", "Los tres se escuchan tocándolos; el orden de la columna derecha se baraja."));
  const ul = el("ul", "sol-pares");
  m.pares.forEach(([nombre, dato]) => {
    const li = el("li");
    li.append(el("span", "sol-par-izq", nombre), el("span", "sol-flecha", "→"), el("span", null, dato));
    ul.append(li);
  });
  caja.append(ul);
  return caja;
}

function cuerpoEscena(m) {
  const caja = el("div");
  caja.append(el("p", "sol-texto", m.pregunta));
  const ul = el("ul", "sol-opciones");
  m.opciones.forEach((txt, i) => {
    const li = el("li", i === m.correcta ? "sol-ok" : null);
    li.append(el("span", "sol-marca", i === m.correcta ? "✓" : "·"), el("span", null, txt));
    ul.append(li);
  });
  caja.append(ul);
  return caja;
}

const CUERPOS = {
  tachado: cuerpoTachado,
  veredicto: cuerpoVeredicto,
  orden: cuerpoOrden,
  unir: cuerpoUnir,
  escena: cuerpoEscena
};

// ── Armado ────────────────────────────────────────────────────────

function armar() {
  const lista = $("solucionario-lista");
  if (lista.dataset.armado) return;
  lista.dataset.armado = "1";
  MISIONES.forEach((m, i) => {
    const ficha = el("article", "sol-ficha");
    ficha.dataset.titulo = m.titulo.toLowerCase();
    const cab = el("header", "sol-cab");
    cab.append(
      el("span", "sol-num", String(i + 1).padStart(2, "0")),
      el("h3", null, m.titulo),
      el("span", "sol-tipo", m.tipo)
    );
    ficha.append(cab);
    ficha.append(el("p", "sol-consigna", m.consigna || CONSIGNAS[m.tipo]));
    ficha.append(CUERPOS[m.tipo](m));
    if (m.dato) ficha.append(el("p", "sol-dato", m.dato));
    lista.append(ficha);
  });
  $("solucionario-total").textContent = `${MISIONES.length} misiones`;
}

// Si hay una misión en pantalla, la marca y salta hasta ella al abrir.
function marcarActual() {
  const titulo = $("mis-titulo")?.textContent?.trim().toLowerCase();
  const fichas = [...$("solucionario-lista").children];
  fichas.forEach((f) => f.classList.remove("sol-actual"));
  if (!titulo || !$("juego")?.classList.contains("activa")) return;
  const actual = fichas.find((f) => f.dataset.titulo === titulo);
  if (!actual) return;
  actual.classList.add("sol-actual");
  actual.scrollIntoView({ block: "center" });
}

function filtrar(texto) {
  const q = texto.trim().toLowerCase();
  [...$("solucionario-lista").children].forEach((f) => {
    f.classList.toggle("oculta", Boolean(q) && !f.textContent.toLowerCase().includes(q));
  });
}

const cerrado = () => $("solucionario").classList.contains("oculta");

function abrir() {
  armar();
  pausarMision();
  $("solucionario").classList.remove("oculta");
  marcarActual();
  $("solucionario-buscar").focus();
}

function cerrar() {
  $("solucionario").classList.add("oculta");
  reanudarMision();
  $("solucionario-buscar").value = "";
  filtrar("");
}

$("solucionario-cerrar").addEventListener("click", cerrar);
$("solucionario-buscar").addEventListener("input", (e) => filtrar(e.target.value));

// Ctrl+Alt+R: se compara e.code para no depender del layout del teclado.
// Ctrl+Alt+M ya es el selector de misiones y Ctrl+Alt+A el archivo.
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.ctrlKey && e.altKey && (e.code === "KeyR" || e.key.toLowerCase() === "r")) {
    e.preventDefault();
    cerrado() ? abrir() : cerrar();
    return;
  }
  if (e.key === "Escape" && !cerrado()) cerrar();
});

// Gesto oculto para el kiosco táctil: cinco toques sobre el número de misión.
let toques = 0;
let relojToques = null;
$("mis-num")?.addEventListener("click", () => {
  clearTimeout(relojToques);
  if (++toques >= 5) {
    toques = 0;
    abrir();
    return;
  }
  relojToques = setTimeout(() => (toques = 0), 2000);
});
