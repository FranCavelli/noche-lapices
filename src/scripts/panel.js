// Panel del archivo: se abre con Ctrl+Shift+A y muestra las visitas guardadas
// con su ficha y su tira de fotos. Es para vos, no para el visitante, por eso
// no hay ningun boton a la vista que lo abra.
import { listarVisitas, borrarVisita, vaciarArchivo, exportarArchivoHTML, bajarArchivo } from "./archivo.js";

const $ = (id) => document.getElementById(id);
const fechaLinda = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
};
let orden = "puntos";

async function pintar() {
  const visitas = await listarVisitas();
  visitas.sort((a, b) => orden === "puntos" ? b.puntos - a.puntos : new Date(b.fecha) - new Date(a.fecha));
  $("panel-total").textContent = `${visitas.length} ${visitas.length === 1 ? "visita" : "visitas"}`;
  const cont = $("panel-lista");
  cont.innerHTML = "";
  if (!visitas.length) {
    cont.innerHTML = '<p class="panel-vacio">Todavía no hay visitas guardadas.</p>';
    return;
  }
  visitas.forEach((v, i) => {
    const ficha = document.createElement("article");
    ficha.className = "panel-ficha";
    const datos = document.createElement("div");
    datos.className = "panel-datos";
    const h = document.createElement("h3");
    h.textContent = `${orden === "puntos" ? `${i + 1}. ` : ""}${v.nombre} — ${v.puntos} pts`;
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
      bajar.addEventListener("click", () => {
        fetch(v.tarjeta).then((r) => r.blob()).then((b) => bajarArchivo(`recuerdo-${v.id}.jpg`, b));
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
      img.src = v.tarjeta;
      img.alt = `Recuerdo de ${v.nombre}`;
      img.className = "panel-foto";
      ficha.append(img);
    }
    cont.append(ficha);
  });
}
function abrir() {
  $("archivo").classList.remove("oculta");
  pintar();
}
function cerrar() {
  $("archivo").classList.add("oculta");
}
$("panel-cerrar").addEventListener("click", cerrar);
$("panel-orden").addEventListener("click", () => {
  orden = orden === "puntos" ? "fecha" : "puntos";
  $("panel-orden").textContent = orden === "puntos" ? "ordenar por fecha" : "ordenar por puntaje";
  pintar();
});
$("panel-exportar").addEventListener("click", exportarArchivoHTML);
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
  pintar();
});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
    e.preventDefault();
    $("archivo").classList.contains("oculta") ? abrir() : cerrar();
  }
  if (e.key === "Escape" && !$("archivo").classList.contains("oculta")) cerrar();
});
