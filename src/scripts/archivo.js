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
// Sin esto Chrome puede descartar todo el archivo si la máquina se queda sin
// espacio. Con esto queda marcado como persistente y no se borra solo.
export async function pedirPersistencia() {
  try {
    if (!navigator.storage?.persist) return false;
    return await navigator.storage.persisted() || await navigator.storage.persist();
  } catch {
    return false;
  }
}
export async function espacioUsado() {
  try {
    const { usage, quota } = await navigator.storage.estimate();
    return { usado: usage || 0, tope: quota || 0 };
  } catch {
    return { usado: 0, tope: 0 };
  }
}
// Las fotos viajan como data URL mientras dura la sesión, pero se guardan como
// Blob: ocupa un tercio menos y el panel las muestra sin pasarlas por base64.
export const aBlob = (dataUrl) => fetch(dataUrl).then((r) => r.blob());
export const aDataUrl = (valor) => typeof valor === "string" ? Promise.resolve(valor) : new Promise((res) => {
  const fr = new FileReader();
  fr.onload = () => res(fr.result);
  fr.onerror = () => res("");
  fr.readAsDataURL(valor);
});
// Sirve para <img src>: si ya es data URL la devuelve, si es Blob crea una URL temporal.
export const urlDe = (valor) => typeof valor === "string" ? valor : URL.createObjectURL(valor);
export const actualizarVisita = (id, cambios) => correr("readwrite", (t) => {
  const p = t.get(id);
  p.onsuccess = () => p.result && t.put({ ...p.result, ...cambios });
  return p;
}).catch(() => null);
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
export async function exportarArchivoHTML(porArchivo = 50) {
  const todas = (await listarVisitas()).sort((a, b) => b.puntos - a.puntos);
  const tandas = Math.max(1, Math.ceil(todas.length / porArchivo));
  for (let t = 0; t < tandas; t++) {
    await exportarTanda(todas.slice(t * porArchivo, (t + 1) * porArchivo), t + 1, tandas, t * porArchivo);
  }
  return tandas;
}
async function exportarTanda(visitas, nro, total, desde) {
  const imagenes = await Promise.all(visitas.map((v) => v.tarjeta ? aDataUrl(v.tarjeta) : ""));
  const filas = visitas.map((v, i) => `
    <article class="v">
      <h2>${desde + i + 1}. ${escapar(v.nombre)} — ${v.puntos} pts</h2>
      <p>${v.correctas} misiones impecables · ${fechaLinda(v.fecha)}</p>
      <p>Tel: ${escapar(v.telefono) || "—"} · Mail: ${escapar(v.email) || "—"}</p>
      ${imagenes[i] ? `<img src="${imagenes[i]}" alt="Recuerdo de ${escapar(v.nombre)}" loading="lazy" />` : "<p><i>sin fotos</i></p>"}
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
<h1>Archivo de visitas · parte ${nro} de ${total}</h1>
<p>Puestos ${desde + 1} a ${desde + visitas.length} · exportado el ${fechaLinda(new Date().toISOString())}</p>
${filas || "<p>El archivo está vacío.</p>"}
</body></html>`;
  const sufijo = total > 1 ? `-parte-${String(nro).padStart(2, "0")}` : "";
  bajarArchivo(`archivo-noche-de-los-lapices${sufijo}.html`, new Blob([html], { type: "text/html" }));
  await new Promise((r) => setTimeout(r, 400));
}
