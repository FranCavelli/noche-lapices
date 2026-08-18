const MISIONES = [
  {
    tipo: "tachado",
    titulo: "La noche",
    img: "/fichas/lapices.jpg",
    texto: "En la madrugada del [[0]] de 1976, en plena dictadura cívico-militar, grupos armados secuestraron de sus casas a estudiantes secundarios de [[1]].",
    blancos: ["16 de septiembre", "La Plata"],
    senuelos: ["24 de marzo", "Rosario"],
    dato: "Al golpe de Estado del 24 de marzo de 1976 le siguieron años de terror. La Noche de los Lápices fue uno de sus episodios más tristes.",
    voz: "La madrugada del 16 de septiembre de 1976, en plena dictadura, grupos armados entraron a las casas de estudiantes secundarios de La Plata y se los llevaron por la fuerza. A ese episodio lo conocemos como la Noche de los Lápices, uno de los más tristes de nuestra historia."
  },
  {
    tipo: "tachado",
    titulo: "El boleto",
    img: "/fichas/colectivo.jpg",
    texto: "En 1975, los estudiantes secundarios de La Plata marcharon para conseguir el [[0]]: un pasaje de colectivo más barato para poder ir a estudiar. Lo [[1]].",
    blancos: ["boleto estudiantil", "lograron"],
    senuelos: ["comedor escolar", "perdieron"],
    dato: "Un año después, la dictadura persiguió a muchos de los pibes que habían marchado por ese derecho.",
    voz: "En 1975, miles de estudiantes secundarios de La Plata marcharon para conseguir el boleto estudiantil, un pasaje más barato para poder ir a estudiar. Y lo lograron. Un año después, la dictadura persiguió a muchos de esos mismos pibes por haberse organizado para reclamar sus derechos."
  },
  {
    tipo: "tachado",
    titulo: "Los estudiantes",
    img: "/fichas/pupitres.jpg",
    texto: "Esa noche y en los días cercanos secuestraron a [[0]] estudiantes de entre 16 y 18 años. [[1]] de ellos siguen desaparecidos.",
    blancos: ["diez", "Seis"],
    senuelos: ["veinte", "Dos"],
    caras: true,
    dato: "Claudia, María Clara, Horacio, Daniel, Francisco y Claudio siguen desaparecidos.",
    voz: "Esa noche y en los días cercanos secuestraron a diez estudiantes de entre dieciséis y dieciocho años. Cuatro sobrevivieron. Claudia, María Clara, Horacio, Daniel, Francisco y Claudio siguen desaparecidos. Tenían la edad de cualquier estudiante de secundaria de hoy."
  },
  {
    tipo: "tachado",
    titulo: "Los centros clandestinos",
    img: "/fichas/puerta.jpg",
    texto: "A los estudiantes los llevaron a centros clandestinos de detención de la zona, como Arana, el Pozo de [[0]] y el Pozo de [[1]].",
    blancos: ["Banfield", "Quilmes"],
    senuelos: ["Palermo", "Retiro"],
    dato: "Hoy varios de esos lugares son sitios de memoria que se pueden visitar.",
    voz: "A los estudiantes los llevaron a centros clandestinos de detención, como Arana, el Pozo de Banfield y el Pozo de Quilmes. Hoy varios de esos lugares son sitios de memoria: se pueden visitar para conocer lo que pasó, y para que no vuelva a pasar nunca más."
  },
  {
    tipo: "tachado",
    titulo: "La memoria",
    img: "/fichas/marcha.jpg",
    texto: "Cada [[0]] se conmemora en la Argentina el Día de los Derechos del Estudiante [[1]].",
    blancos: ["16 de septiembre", "secundario"],
    senuelos: ["21 de septiembre", "universitario"],
    dato: "No es el Día del Estudiante (21/9): es un día para recordar que los derechos estudiantiles costaron mucho.",
    voz: "Cada 16 de septiembre se conmemora en la Argentina el Día de los Derechos del Estudiante Secundario. No hay que confundirlo con el Día del Estudiante, que es el 21. Es una fecha para recordar que los derechos estudiantiles costaron mucho, y que defenderlos es tarea de todos."
  },
  {
    tipo: "tachado",
    titulo: "La frase",
    img: "/fichas/mano.jpg",
    texto: "La frase símbolo de esta historia dice: «Los lápices siguen [[0]]».",
    blancos: ["escribiendo"],
    senuelos: ["esperando", "marchando"],
    dato: "La dijo Pablo Díaz al recordar a sus compañeros. Hoy la repiten miles de estudiantes cada 16 de septiembre.",
    voz: "«Los lápices siguen escribiendo» la dijo Pablo Díaz, uno de los sobrevivientes, al recordar a sus compañeros. Con los años se volvió el símbolo de esta historia, y hoy la repiten miles de estudiantes en todo el país, cada 16 de septiembre."
  },
  {
    tipo: "veredicto",
    titulo: "La edad",
    img: "/fichas/pupitres.jpg",
    afirmacion: "Los estudiantes secuestrados tenían entre 16 y 18 años.",
    esCierto: true,
    dato: "Eran pibes de la escuela secundaria, como los de hoy.",
    voz: "Es cierto. Los estudiantes secuestrados tenían entre dieciséis y dieciocho años. Eran pibes de la escuela secundaria, con carpetas, amigos y sueños, como los de hoy."
  },
  {
    tipo: "veredicto",
    titulo: "El gobierno",
    img: "/fichas/puerta.jpg",
    afirmacion: "La Noche de los Lápices ocurrió durante un gobierno elegido por el voto.",
    esCierto: false,
    dato: "Fue durante la dictadura cívico-militar que había tomado el poder el 24 de marzo de 1976.",
    voz: "Falso. La Noche de los Lápices ocurrió durante la dictadura cívico-militar que había tomado el poder por la fuerza el 24 de marzo de 1976, apenas seis meses antes. No había ni democracia ni elecciones, y se perseguía a quienes pensaban distinto."
  },
  {
    tipo: "veredicto",
    titulo: "El regreso",
    img: "/fichas/lapices.jpg",
    afirmacion: "Todos los estudiantes secuestrados aparecieron con vida.",
    esCierto: false,
    caras: true,
    dato: "Sobrevivieron cuatro; seis siguen desaparecidos.",
    voz: "Falso. De los estudiantes secuestrados sobrevivieron cuatro, que años después pudieron contar lo que pasó. Los otros seis siguen desaparecidos hasta el día de hoy."
  },
  {
    tipo: "veredicto",
    titulo: "El testigo",
    img: "/fichas/juicio.jpg",
    afirmacion: "La historia se conoció en todo el país gracias al testimonio de un sobreviviente.",
    esCierto: true,
    dato: "Pablo Díaz la contó en el Juicio a las Juntas, en 1985.",
    voz: "Es cierto. En 1985, ya en democracia, el sobreviviente Pablo Díaz declaró en el Juicio a las Juntas. Su testimonio hizo que todo el país conociera la historia de la Noche de los Lápices."
  },
  {
    tipo: "veredicto",
    titulo: "La película",
    img: "/fichas/cine.jpg",
    afirmacion: "La película «La noche de los lápices» se estrenó en plena dictadura.",
    esCierto: false,
    dato: "Se estrenó en 1986, ya en democracia, dirigida por Héctor Olivera.",
    voz: "Falso. La película «La noche de los lápices» se estrenó en 1986, ya en democracia. La dirigió Héctor Olivera, y ayudó a que generaciones enteras conocieran esta historia."
  },
  {
    tipo: "veredicto",
    titulo: "El boleto hoy",
    img: "/fichas/colectivo.jpg",
    afirmacion: "Hoy el boleto estudiantil gratuito es ley en la provincia de Buenos Aires.",
    esCierto: true,
    dato: "La lucha de aquellos estudiantes siguió escribiéndose: la ley se sancionó en 2015.",
    voz: "Es cierto. Desde el año 2015, el boleto estudiantil gratuito es ley en la provincia de Buenos Aires. La lucha de aquellos estudiantes siguió escribiéndose, y hoy es un derecho."
  },
  {
    tipo: "veredicto",
    titulo: "La testigo",
    img: "/fichas/juicio.jpg",
    afirmacion: "Una mujer que dio a luz en el Pozo de Banfield sobrevivió, y su testimonio fue clave en el Juicio a las Juntas.",
    esCierto: true,
    dato: "Fue Adriana Calvo. En centros clandestinos como el Pozo de Banfield funcionaron maternidades clandestinas.",
    voz: "Es cierto. En el Pozo de Banfield funcionó una maternidad clandestina: allí hubo mujeres que dieron a luz en cautiverio. Adriana Calvo sobrevivió, y su testimonio en el Juicio a las Juntas, en 1985, fue una de las pruebas más importantes."
  },
  {
    tipo: "orden",
    titulo: "Los hechos",
    img: "/fichas/marcha.jpg",
    eventos: [
      { txt: "Los estudiantes consiguen el boleto estudiantil", anio: "1975" },
      { txt: "Golpe de Estado cívico-militar", anio: "mar 1976" },
      { txt: "La dictadura suspende el boleto que habían ganado", anio: "ago 1976" },
      { txt: "La Noche de los Lápices", anio: "sep 1976" },
      { txt: "Vuelve la democracia", anio: "1983" }
    ],
    dato: "La dictadura les quitó el boleto que habían ganado en la calle; muchos de los secuestrados eran los pibes que volvieron a reclamarlo.",
    voz: "Primero, en 1975, los estudiantes marcharon y consiguieron el boleto estudiantil. En marzo de 1976 llegó el golpe de Estado, y la dictadura suspendió ese derecho que los pibes habían ganado en la calle. Por eso volvieron a reclamarlo. En septiembre llegó la Noche de los Lápices: se llevaron a muchos de los que habían marchado. Recién en 1983 volvió la democracia."
  },
  {
    tipo: "orden",
    titulo: "La memoria se construye",
    img: "/fichas/juicio.jpg",
    eventos: [
      { txt: "Vuelve la democracia", anio: "1983" },
      { txt: "Pablo Díaz declara en el Juicio a las Juntas", anio: "1985" },
      { txt: "Se estrena la película «La noche de los lápices»", anio: "1986" },
      { txt: "El boleto estudiantil gratuito se vuelve ley", anio: "2015" }
    ],
    dato: "La memoria no fue automática: la construyeron testigos, libros, películas y nuevas leyes.",
    voz: "La memoria no fue automática: hubo que construirla. En 1983 volvió la democracia. En 1985, Pablo Díaz declaró en el Juicio a las Juntas. En 1986 llegaron el libro y la película. Y en 2015, el boleto gratuito se hizo ley. Testigos, libros, películas y leyes: así se construye la memoria."
  },
  {
    tipo: "unir",
    titulo: "Los nombres I",
    img: "/fichas/mano.jpg",
    pares: [
      ["Pablo Díaz", "Sobreviviente: declaró en el Juicio a las Juntas"],
      ["Claudia Falcone", "Tenía 16 años; sigue desaparecida"],
      ["Héctor Olivera", "Dirigió la película de 1986"]
    ],
    dato: "Esta historia se armó con nombres propios: víctimas, sobrevivientes y quienes la contaron.",
    voz: "Pablo Díaz sobrevivió y declaró en el Juicio a las Juntas. Claudia Falcone tenía dieciséis años y sigue desaparecida. Héctor Olivera dirigió la película que contó esta historia al país. Víctimas, sobrevivientes y quienes la contaron: la memoria se arma con nombres propios."
  },
  {
    tipo: "unir",
    titulo: "Los nombres II",
    img: "/fichas/mano.jpg",
    pares: [
      ["Emilce Moler", "Sobreviviente: hoy cuenta la historia en las escuelas"],
      ["María Seoane", "Coescribió el libro que reveló el caso"],
      ["Pozo de Banfield", "Centro clandestino donde estuvieron detenidos"]
    ],
    dato: "El libro lo escribieron María Seoane y Héctor Ruiz Núñez en 1986.",
    voz: "Emilce Moler sobrevivió, y hoy recorre las escuelas contando la historia. María Seoane escribió, junto a Héctor Ruiz Núñez, el libro que reveló el caso en 1986. Y el Pozo de Banfield fue uno de los centros clandestinos donde estuvieron detenidos los estudiantes."
  },
  {
    tipo: "unir",
    titulo: "Los nombres III",
    img: "/fichas/mano.jpg",
    pares: [
      ["Adriana Calvo", "Parió en cautiverio; su testimonio fue clave en el Juicio a las Juntas"],
      ["Teresa Laborde", "Nació en cautiverio y permaneció con su madre: un caso único"],
      ["Pozo de Banfield", "Allí funcionó una maternidad clandestina"]
    ],
    dato: "Teresa Laborde es hoy docente en Lomas de Zamora.",
    voz: "Adriana Calvo dio a luz en cautiverio y sobrevivió para contarlo: su testimonio fue clave en el Juicio a las Juntas. Su hija, Teresa Laborde, nació allí y permaneció con su madre todo el tiempo: un caso único. Hoy Teresa es docente en Lomas de Zamora."
  }
];
const slugMision = (titulo) => titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export {
  MISIONES,
  slugMision
};
