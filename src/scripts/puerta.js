// Puerta de entrada: el sitio pide una clave antes de mostrar la portada.
//
// OJO: esto se resuelve en el navegador, así que la clave viaja en el JS del
// sitio y cualquiera que abra el código fuente puede leerla. No es seguridad
// de verdad: alcanza para que nadie entre de casualidad o se adelante a jugar
// antes del acto, nada más. Si alguna vez hiciera falta algo serio, tendría
// que resolverse en un servidor, y este sitio es estático.
const CLAVE = "2576";
const LLAVE = "nlp_puerta_dia";

const $ = (id) => document.getElementById(id);
const puerta = $("puerta");
const campo = $("puerta-clave");
const error = $("puerta-error");

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

$("puerta-ficha").addEventListener("submit", (e) => {
  e.preventDefault();
  if (campo.value.trim() === CLAVE) {
    error.textContent = "";
    abrir();
    return;
  }
  error.textContent = "Clave incorrecta.";
  campo.value = "";
  campo.focus();
  campo.classList.add("mal-intento");
  setTimeout(() => campo.classList.remove("mal-intento"), 380);
});

campo.addEventListener("input", () => (error.textContent = ""));
