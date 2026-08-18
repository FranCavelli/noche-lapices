# La Noche de los Lápices — Expediente interactivo

Juego conmemorativo por los 50 años de la Noche de los Lápices (1976–2026),
pensado para jugarse por turnos en una compu o pantalla táctil durante el acto,
y también desde el celular.

Cada visitante deja su nombre y un teléfono de contacto, "abre el expediente"
y resuelve 7 misiones sorteadas de un pool: documentos tachados para restaurar,
sellos de cierto/falso, líneas de tiempo para ordenar y nombres para unir con
su historia. Después de cada respuesta, una voz narra el dato y se despliegan
fotos de archivo sobre el escritorio.

## Cómo correrlo

```
npm install
npm run dev        # desarrollo
npm run build      # genera dist/
```

En el evento conviene abrir el navegador en pantalla completa (F11) y dejar la
ventana siempre visible.

## Puntajes

Quedan guardados en el navegador de la máquina (localStorage). El top 5 se
muestra en la portada con oro, plata y bronce, y el botón "exportar registros"
de la pantalla final descarga el JSON completo — de ahí sale el teléfono del
ganador al cierre del día.

## Fotos

Las fotos del interior del Pozo de Banfield son de Gabriela Villalba. El resto
del material de archivo proviene de Wikimedia Commons; cada carpeta de
`public/media` tiene un `_fuentes.json` con el origen de cada imagen.
