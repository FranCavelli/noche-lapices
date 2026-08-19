// Archivo local de visitas: guarda en IndexedDB la ficha de cada persona
// junto con su tira de fotos, para poder verlas después desde la portada.
const BD = "nlp_archivo";
const TIENDA = "visitas";
let bdPromesa = null;
function abrirBD() {
  bdPromesa ||= new Promise((res, rej) => {
    const pedido = indexedDB.open(BD, 1);
    pedido.onupgradeneeded = () => {
      const db = pedido.result;
      if (!db.objectStoreNames.contains(TIENDA)) {
        db.createObjectStore(TIENDA, { keyPath: "id", autoIncrement: true }).createIndex("puntos", "puntos");
      }
    };
    pedido.onsuccess = () => res(pedido.result);
    pedido.onerror = () => rej(pedido.error);
  });
  return bdPromesa;
}
function correr(modo, fn) {
  return abrirBD().then((db) => new Promise((res, rej) => {
    const tx = db.transaction(TIENDA, modo);
    const pedido = fn(tx.objectStore(TIENDA));
    tx.oncomplete = () => res(pedido?.result);
    tx.onerror = () => rej(tx.error);
  }));
}
export const guardarVisita = (visita) => correr("readwrite", (t) => t.add(visita)).catch(() => null);
export const listarVisitas = () => correr("readonly", (t) => t.getAll()).catch(() => []);
export const borrarVisita = (id) => correr("readwrite", (t) => t.delete(id)).catch(() => null);
export const vaciarArchivo = () => correr("readwrite", (t) => t.clear()).catch(() => null);
export function bajarArchivo(nombre, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1e3);
}
const escapar = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fechaLinda = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
};
// Exporta todo el archivo como una página HTML autocontenida: se abre en
// cualquier navegador sin servidor y trae las fotos adentro.
export async function exportarArchivoHTML() {
  const visitas = (await listarVisitas()).sort((a, b) => b.puntos - a.puntos);
  const filas = visitas.map((v, i) => `
    <article class="v">
      <h2>${i + 1}. ${escapar(v.nombre)} — ${v.puntos} pts</h2>
      <p>${v.correctas} misiones impecables · ${fechaLinda(v.fecha)}</p>
      <p>Tel: ${escapar(v.telefono) || "—"} · Mail: ${escapar(v.email) || "—"}</p>
      ${v.tarjeta ? `<img src="${v.tarjeta}" alt="Recuerdo de ${escapar(v.nombre)}" />` : "<p><i>sin fotos</i></p>"}
    </article>`).join("");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<title>Archivo de visitas — La Noche de los Lápices</title>
<style>
body{background:#241c14;color:#ede3cb;font-family:"Courier New",monospace;margin:0;padding:2rem}
h1{font-size:1.6rem;letter-spacing:.08em;text-transform:uppercase}
.v{background:#ede3cb;color:#3d3830;padding:1.2rem;margin:0 0 1.4rem;border-radius:4px;max-width:900px}
.v h2{margin:0 0 .3rem;font-size:1.15rem}
.v p{margin:.15rem 0;font-size:.9rem}
.v img{width:100%;margin-top:.8rem;border:1px solid #d9cbaa}
</style></head><body>
<h1>Archivo de visitas · ${visitas.length} registros</h1>
<p>Exportado el ${fechaLinda(new Date().toISOString())}</p>
${filas || "<p>El archivo está vacío.</p>"}
</body></html>`;
  bajarArchivo("archivo-noche-de-los-lapices.html", new Blob([html], { type: "text/html" }));
}
