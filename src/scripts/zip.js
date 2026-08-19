// Armador de ZIP mínimo, sin dependencias y sin compresión (método "store").
// Las fotos ya son JPEG, así que comprimirlas de nuevo no ganaría casi nada.
// Los datos se van acumulando como Blobs y no como bytes en memoria: Chrome
// los puede volcar a disco, que es lo que permite exportar cientos de fotos.

const TABLA = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = TABLA[(c ^ bytes[i]) & 0xff] ^ c >>> 8;
  return (c ^ 0xffffffff) >>> 0;
}
const texto = (s) => new TextEncoder().encode(s);
function escribir(campos) {
  const total = campos.reduce((n, [, largo]) => n + largo, 0);
  const buf = new Uint8Array(total);
  const vista = new DataView(buf.buffer);
  let pos = 0;
  for (const [valor, largo] of campos) {
    if (largo === 2) vista.setUint16(pos, valor, true);
    else if (largo === 4) vista.setUint32(pos, valor, true);
    else buf.set(valor, pos);
    pos += largo;
  }
  return buf;
}
// Fecha y hora en el formato MS-DOS que pide el formato ZIP.
function fechaDos(d) {
  const hora = d.getHours() << 11 | d.getMinutes() << 5 | Math.floor(d.getSeconds() / 2);
  const fecha = Math.max(0, d.getFullYear() - 1980) << 9 | d.getMonth() + 1 << 5 | d.getDate();
  return { hora, fecha };
}
/**
 * @param {Array<{nombre: string, blob: Blob}>} archivos
 * @param {(hechos: number, total: number) => void} [alAvanzar]
 * @returns {Promise<Blob>}
 */
export async function armarZip(archivos, alAvanzar) {
  const { hora, fecha } = fechaDos(new Date());
  const partes = [];
  const central = [];
  let offset = 0;
  for (let i = 0; i < archivos.length; i++) {
    const { nombre, blob } = archivos[i];
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const crc = crc32(bytes);
    const nom = texto(nombre);
    const largo = bytes.length;
    // el bit 11 avisa que los nombres van en UTF-8
    const local = escribir([
      [0x04034b50, 4], [20, 2], [0x0800, 2], [0, 2],
      [hora, 2], [fecha, 2], [crc, 4], [largo, 4], [largo, 4],
      [nom.length, 2], [0, 2], [nom, nom.length]
    ]);
    partes.push(local, blob);
    central.push(escribir([
      [0x02014b50, 4], [20, 2], [20, 2], [0x0800, 2], [0, 2],
      [hora, 2], [fecha, 2], [crc, 4], [largo, 4], [largo, 4],
      [nom.length, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 4], [offset, 4],
      [nom, nom.length]
    ]));
    offset += local.length + largo;
    alAvanzar?.(i + 1, archivos.length);
  }
  const largoCentral = central.reduce((n, c) => n + c.length, 0);
  const fin = escribir([
    [0x06054b50, 4], [0, 2], [0, 2],
    [archivos.length, 2], [archivos.length, 2],
    [largoCentral, 4], [offset, 4], [0, 2]
  ]);
  return new Blob([...partes, ...central, fin], { type: "application/zip" });
}
