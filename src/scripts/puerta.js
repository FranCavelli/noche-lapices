// Puerta de entrada: el sitio pide una clave antes de mostrar la portada.
//
// La clave ya no está escrita acá: lo que viaja es su huella, o sea el
// resultado de pasarla 200.000 veces por PBKDF2 con la sal de abajo. De la
// huella no se vuelve a la clave, pero OJO: esto sigue sin ser seguridad de
// verdad. El juego y sus archivos están igual en el navegador de cualquiera,
// así que quien sepa un poco se saltea la puerta sin necesidad de la clave.
// Alcanza para que nadie entre de casualidad ni se adelante a jugar antes del
// acto, nada más. Lo único que cambia es que la clave no queda a la vista.
// El plano del puesto (public/puesto.html) sí va cifrado de verdad.
const SAL = "6124b13953c44790e79520598ff01067";
const HUELLA = "47d0a527b62998b2008713c6a7a1527c641a3baacfa9b28f81ca60d1efe0d464";
const VUELTAS = 200000;
const LLAVE = "nlp_puerta_dia";

const $ = (id) => document.getElementById(id);
const puerta = $("puerta");
const campo = $("puerta-clave");
const error = $("puerta-error");
const ficha = $("puerta-ficha");

const bytes = (hex) => Uint8Array.from(hex.match(/../g).map((p) => parseInt(p, 16)));
const aHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function huellaDe(clave) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: bytes(SAL), iterations: VUELTAS, hash: "SHA-256" },
    base,
    256
  );
  return aHex(bits);
}

// La clave se pide una vez por día: lo que queda guardado en la máquina es el
// día en que se abrió, así que a la mañana siguiente vuelve a preguntar.
const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const habilitada = () => {
  try {
    return localStorage.getItem(LLAVE) === hoy();
  } catch {
    return false;
  }
};

function abrir() {
  try {
    localStorage.setItem(LLAVE, hoy());
  } catch {
    // en modo incógnito no se puede guardar: se abre igual, pero va a volver
    // a preguntar en la próxima visita
  }
  puerta.classList.add("oculta");
  // la portada estaba muda esperando: que salude apenas se abre
  document.dispatchEvent(new CustomEvent("puerta-abierta"));
}

if (habilitada()) puerta.classList.add("oculta");
else campo.focus();

// crypto.subtle solo existe en https o en localhost: abierto como archivo
// suelto (file://) no hay forma de comparar la huella
if (!globalThis.crypto?.subtle) {
  error.textContent = "Abrí el sitio desde http://localhost, no como archivo suelto.";
  campo.disabled = true;
}

ficha.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (campo.disabled) return;
  const intento = campo.value.trim();
  campo.disabled = true;
  if (await huellaDe(intento) === HUELLA) {
    campo.disabled = false;
    error.textContent = "";
    abrir();
    return;
  }
  campo.disabled = false;
  error.textContent = "Clave incorrecta.";
  campo.value = "";
  campo.focus();
  campo.classList.add("mal-intento");
  setTimeout(() => campo.classList.remove("mal-intento"), 380);
});

campo.addEventListener("input", () => (error.textContent = ""));
