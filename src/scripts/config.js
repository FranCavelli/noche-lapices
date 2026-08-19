// Configuración del envío por mail.
// Los valores salen de variables de entorno (.env local / secrets de GitHub),
// no del código. Solo las PUBLIC_ llegan al navegador.
// NUNCA pongas acá la private key de EmailJS: este sitio se publica en GitHub
// Pages y quedaría a la vista. El SDK del navegador no la necesita.
export const EMAILJS = {
  servicio: import.meta.env.PUBLIC_EMAILJS_SERVICE || "",
  plantilla: import.meta.env.PUBLIC_EMAILJS_TEMPLATE || "",
  clave: import.meta.env.PUBLIC_EMAILJS_KEY || ""
};
// El plan gratuito de EmailJS no permite adjuntos y corta los pedidos de más
// de 50 KB, así que la foto no puede viajar dentro del mail. En su lugar se
// sube a Cloudinary y el mail lleva el link: el pedido queda en unos pocos KB.
// El cloud name y el preset son públicos por diseño (el preset va sin firma).
export const CLOUDINARY = {
  nube: import.meta.env.PUBLIC_CLOUDINARY_CLOUD || "",
  preset: import.meta.env.PUBLIC_CLOUDINARY_PRESET || ""
};
export const emailjsListo = () => Boolean(EMAILJS.servicio && EMAILJS.plantilla && EMAILJS.clave);
export const cloudinaryListo = () => Boolean(CLOUDINARY.nube && CLOUDINARY.preset);
