// Configuración del envío por mail (EmailJS).
// Los valores salen de variables de entorno (.env local / secrets de GitHub),
// no del código. Solo las PUBLIC_ llegan al navegador, que es lo que necesita
// el SDK web; la private key nunca se expone.
// Mientras falte el service o el template, el botón "enviarme por mail" no
// aparece y el resto del recuerdo (descargar / imprimir / archivo) anda igual.
export const EMAILJS = {
  servicio: import.meta.env.PUBLIC_EMAILJS_SERVICE || "",
  plantilla: import.meta.env.PUBLIC_EMAILJS_TEMPLATE || "",
  clave: import.meta.env.PUBLIC_EMAILJS_KEY || "",
  // Tope de peso de la imagen que viaja en el mail, en KB.
  // El plan gratuito de EmailJS corta los pedidos de más de 50 KB.
  // Si pasás a un plan pago, subilo a 500 y la foto va en alta.
  limiteKb: 45
};
export const emailjsListo = () => Boolean(EMAILJS.servicio && EMAILJS.plantilla && EMAILJS.clave);
