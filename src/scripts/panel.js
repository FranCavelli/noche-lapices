// Panel del archivo: se abre con Ctrl+Alt+A o con cinco toques sobre la línea
// de los años en la portada. Es para el organizador, no para el visitante, por
// eso no hay ningún botón a la vista que lo abra.
// Pagina de a pocas fichas porque con cientos de visitas dibujarlas todas de
// golpe cuelga la pestaña.
import {
  listarVisitas, borrarVisita, vaciarArchivo, exportarArchivoHTML, bajarArchivo,
  espacioUsado, pedirPersistencia, urlDe
} from "./archivo.js";
import { armarZip } from "./zip.js";

const $ = (id) => document.getElementById(id);
const POR_PAGINA = 12;
const fechaLinda = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
};
const pesoLindo = (b) => b > 1024 ** 3 ? `${(b / 1024 ** 3).toFixed(1)} GB` : `${Math.round(b / 1024 ** 2)} MB`;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const limpio = (s) => (s || "visita").normalize("NFD").replace(/[^\w]+/g, "-").toLowerCase().slice(0, 30);
const comoBlob = async (valor) => typeof valor === "string" ? (await fetch(valor)).blob() : valor;

let orden = "puntos";
let pagina = 0;
let urlsVivas = [];

function soltarUrls() {
  urlsVivas.forEach((u) => URL.revokeObjectURL(u));
  urlsVivas = [];
}
function verImagen(valor) {
  const u = urlDe(valor);
  if (u.startsWith("blob:")) urlsVivas.push(u);
  return u;
}
function avisar(texto) {
  $("panel-aviso").textContent = texto;
}
async function pintar() {
  soltarUrls();
  const visitas = await listarVisitas();
  visitas.sort((a, b) => orden === "puntos" ? b.puntos - a.puntos : new Date(b.fecha) - new Date(a.fecha));
  const paginas = Math.max(1, Math.ceil(visitas.length / POR_PAGINA));
  pagina = Math.min(Math.max(0, pagina), paginas - 1);
  const { usado } = await espacioUsado();
  $("panel-total").textContent = `${visitas.length} ${visitas.length === 1 ? "visita" : "visitas"} · ${pesoLindo(usado)}`;
  const cont = $("panel-lista");
  cont.innerHTML = "";
  $("panel-antes").classList.toggle("oculta", paginas < 2);
  $("panel-despues").classList.toggle("oculta", paginas < 2);
  $("panel-paginas").textContent = paginas > 1 ? `${pagina + 1} / ${paginas}` : "";
  if (!visitas.length) {
    cont.innerHTML = '<p class="panel-vacio">Todavía no hay visitas guardadas.</p>';
    return;
  }
  visitas.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA).forEach((v, n) => {
    const puesto = pagina * POR_PAGINA + n + 1;
    const ficha = document.createElement("article");
    ficha.className = "panel-ficha";
    const datos = document.createElement("div");
    datos.className = "panel-datos";
    const h = document.createElement("h3");
    h.textContent = `${orden === "puntos" ? `${puesto}. ` : ""}${v.nombre} — ${v.puntos} pts`;
    const meta = document.createElement("p");
    meta.textContent = `${v.correctas} impecables · ${fechaLinda(v.fecha)}`;
    const contacto = document.createElement("p");
    contacto.textContent = `Tel: ${v.telefono || "—"} · Mail: ${v.email || "—"}`;
    const acciones = document.createElement("p");
    acciones.className = "panel-acciones";
    if (v.tarjeta) {
      const bajar = document.createElement("button");
      bajar.type = "button";
      bajar.className = "boton-fantasma";
      bajar.textContent = "descargar foto";
      bajar.addEventListener("click", async () => {
        bajarArchivo(`recuerdo-${limpio(v.nombre)}.jpg`, await comoBlob(v.tarjeta));
      });
      acciones.append(bajar);
    }
    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "boton-fantasma";
    borrar.textContent = "borrar";
    borrar.addEventListener("click", async () => {
      if (borrar.dataset.seguro !== "1") {
        borrar.dataset.seguro = "1";
        borrar.textContent = "¿seguro? tocá de nuevo";
        return;
      }
      await borrarVisita(v.id);
      pintar();
    });
    acciones.append(borrar);
    datos.append(h, meta, contacto, acciones);
    ficha.append(datos);
    if (v.tarjeta) {
      const img = new Image();
      img.loading = "lazy";
      img.src = verImagen(v.tarjeta);
      img.alt = `Recuerdo de ${v.nombre}`;
      img.className = "panel-foto";
      ficha.append(img);
    }
    cont.append(ficha);
  });
  cont.scrollTop = 0;
}
const indice = (fichas, total) => `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<title>Archivo de visitas — La Noche de los Lápices</title>
<style>
body{background:#241c14;color:#ede3cb;font-family:"Courier New",monospace;margin:0;padding:2rem}
h1{font-size:1.6rem;letter-spacing:.08em;text-transform:uppercase}
.v{background:#ede3cb;color:#3d3830;padding:1.2rem;margin:0 0 1.4rem;border-radius:4px;max-width:900px}
.v h2{margin:0 0 .3rem;font-size:1.15rem}
.v p{margin:.15rem 0;font-size:.9rem}
.v img{width:100%;margin-top:.8rem;border:1px solid #d9cbaa}
</style></head><body>
<h1>Archivo de visitas · ${total} registros</h1>
<p>Las fotos están en la carpeta <b>fotos/</b> y los datos en <b>visitas.csv</b>.</p>
${fichas || "<p>El archivo está vacío.</p>"}
</body></html>`;
// Un solo ZIP con las fotos como archivos sueltos, una planilla y un índice
// navegable. Si el ZIP no se puede armar, cae al export en partes HTML.
async function exportarTodo() {
  const boton = $("panel-exportar");
  boton.disabled = true;
  try {
    const visitas = (await listarVisitas()).sort((a, b) => b.puntos - a.puntos);
    if (!visitas.length) {
      avisar("No hay nada para exportar.");
      return;
    }
    avisar("Preparando el archivo…");
    const archivos = [];
    const filas = [["puesto", "nombre", "telefono", "mail", "puntos", "impecables", "fecha", "foto"]];
    const fichas = [];
    for (let i = 0; i < visitas.length; i++) {
      const v = visitas[i];
      const nombreFoto = v.tarjeta ? `fotos/${String(i + 1).padStart(4, "0")}-${limpio(v.nombre)}.jpg` : "";
      if (v.tarjeta) archivos.push({ nombre: nombreFoto, blob: await comoBlob(v.tarjeta) });
      filas.push([i + 1, v.nombre, v.telefono, v.email, v.puntos, v.correctas, v.fecha, nombreFoto]);
      fichas.push(`<article class="v"><h2>${i + 1}. ${esc(v.nombre)} — ${v.puntos} pts</h2>
<p>${v.correctas} misiones impecables · ${fechaLinda(v.fecha)}</p>
<p>Tel: ${esc(v.telefono) || "—"} · Mail: ${esc(v.email) || "—"}</p>
${nombreFoto ? `<img src="${nombreFoto}" alt="Recuerdo de ${esc(v.nombre)}" loading="lazy" />` : "<p><i>sin fotos</i></p>"}</article>`);
    }
    const csv = filas.map((f) => f.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    archivos.push({ nombre: "visitas.csv", blob: new Blob(["﻿" + csv], { type: "text/csv" }) });
    archivos.push({ nombre: "index.html", blob: new Blob([indice(fichas.join(""), visitas.length)], { type: "text/html" }) });
    const zip = await armarZip(archivos, (hechos, total) => {
      if (hechos % 10 === 0 || hechos === total) avisar(`Empaquetando ${hechos} de ${total}…`);
    });
    bajarArchivo("archivo-noche-de-los-lapices.zip", zip);
    avisar(`Listo: ${visitas.length} visitas en un ZIP de ${pesoLindo(zip.size)}.`);
  } catch (e) {
    console.error("[archivo] falló el zip:", e);
    avisar("El ZIP no se pudo armar. Bajando en partes HTML…");
    const partes = await exportarArchivoHTML();
    avisar(`Exportado en ${partes} ${partes === 1 ? "archivo" : "archivos"} HTML.`);
  } finally {
    boton.disabled = false;
  }
}
function abrir() {
  $("archivo").classList.remove("oculta");
  pagina = 0;
  avisar("");
  pintar();
}
function cerrar() {
  $("archivo").classList.add("oculta");
  soltarUrls();
}
$("panel-cerrar").addEventListener("click", cerrar);
$("panel-orden").addEventListener("click", () => {
  orden = orden === "puntos" ? "fecha" : "puntos";
  $("panel-orden").textContent = orden === "puntos" ? "ordenar por fecha" : "ordenar por puntaje";
  pagina = 0;
  pintar();
});
$("panel-antes").addEventListener("click", () => {
  pagina--;
  pintar();
});
$("panel-despues").addEventListener("click", () => {
  pagina++;
  pintar();
});
$("panel-exportar").addEventListener("click", exportarTodo);
$("panel-vaciar").addEventListener("click", async (e) => {
  const b = e.currentTarget;
  if (b.dataset.seguro !== "1") {
    b.dataset.seguro = "1";
    b.textContent = "borra TODO el archivo, tocá de nuevo";
    return;
  }
  await vaciarArchivo();
  b.dataset.seguro = "";
  b.textContent = "vaciar archivo";
  pagina = 0;
  pintar();
});
const alternar = () => $("archivo").classList.contains("oculta") ? abrir() : cerrar();
// Ctrl+Alt+A: Ctrl+Shift+A no sirve, se lo queda Chrome para buscar pestañas.
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    alternar();
  }
  if (e.key === "Escape" && !$("archivo").classList.contains("oculta")) cerrar();
});
// Gesto oculto para el kiosco táctil, donde puede no haber teclado:
// cinco toques seguidos sobre la línea "1976 — 2026" de la portada.
let toques = 0;
let relojToques = null;
document.querySelector(".tarjeta-anios")?.addEventListener("click", () => {
  clearTimeout(relojToques);
  if (++toques >= 5) {
    toques = 0;
    alternar();
    return;
  }
  relojToques = setTimeout(() => (toques = 0), 2000);
});
pedirPersistencia();
