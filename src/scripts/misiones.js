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
    datoVideo: "/media/video/testimoniopablo.mp4",
    datoDesde: 1,
    datoHasta: 38,
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
    // cada hito cae con su foto cuando la voz lo nombra
    fotosEventos: [
      { hito: "1983", img: "/fichas/marcha.jpg" },
      { hito: "1985", img: "/media/juicio/01.jpg" },
      { hito: "1986", img: "/fichas/cine.jpg" },
      { hito: "2015", img: "/fichas/colectivo.jpg" }
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
    tipo: "tachado",
    titulo: "La agrupación",
    img: "/fichas/colectivo.jpg",
    texto: "Muchos de los estudiantes militaban en la [[0]], la agrupación que había impulsado el reclamo del [[1]].",
    blancos: ["UES", "boleto"],
    senuelos: ["Franja Morada", "comedor"],
    dato: "UES: Unión de Estudiantes Secundarios.",
    voz: "Muchos de los estudiantes secuestrados militaban en la UES, la Unión de Estudiantes Secundarios, la agrupación que había impulsado el reclamo del boleto. Organizarse para pedir un derecho los convirtió en blanco de la dictadura."
  },
  {
    tipo: "tachado",
    titulo: "Las escuelas",
    img: "/fichas/pupitres.jpg",
    texto: "Claudia, María Clara y Francisco estudiaban en el Bachillerato de [[0]]; Horacio y Daniel, en la Escuela [[1]] N.º 3 de La Plata.",
    blancos: ["Bellas Artes", "Normal"],
    senuelos: ["Medicina", "Técnica"],
    dato: "Eran pibes de escuelas públicas de La Plata.",
    voz: "Claudia Falcone, María Clara Ciocchini y Francisco López Muntaner estudiaban en el Bachillerato de Bellas Artes. Horacio Ungaro y Daniel Racero, en la Escuela Normal número tres. Claudio de Acha, en el Colegio Nacional. Eran pibes de escuelas públicas de La Plata."
  },
  {
    tipo: "tachado",
    titulo: "El informe",
    img: "/fichas/juicio.jpg",
    texto: "En 1984, la comisión [[0]] reunió los testimonios en un informe llamado [[1]].",
    blancos: ["CONADEP", "Nunca Más"],
    senuelos: ["UNESCO", "Nunca Olvidar"],
    dato: "El Nunca Más documentó los centros clandestinos y fue la base del Juicio a las Juntas.",
    voz: "En 1984, ya en democracia, la comisión CONADEP recorrió el país reuniendo testimonios de sobrevivientes y familiares. Su informe se llamó Nunca Más, y fue la base del Juicio a las Juntas del año siguiente."
  },

  {
    tipo: "tachado",
    titulo: "El fiscal",
    img: "/fichas/juicio.jpg",
    texto: "En el cierre del Juicio a las Juntas, el fiscal [[0]] terminó su alegato con las palabras: «[[1]]».",
    blancos: ["Strassera", "Nunca más"],
    senuelos: ["Sabato", "Hasta siempre"],
    dato: "«Señores jueces: nunca más», dijo Julio César Strassera en 1985.",
    datoVideo: "/media/video/DiscursoStrasseraNuncaMas.mp4",
    datoDesde: 0,
    datoHasta: 22,
    voz: "En 1985, el fiscal Julio César Strassera cerró su alegato en el Juicio a las Juntas con dos palabras que ya eran de todos: nunca más. La sala entera se puso de pie."
  },
  {
    tipo: "tachado",
    titulo: "Los sobrevivientes",
    img: "/fichas/mano.jpg",
    texto: "De los diez estudiantes, sobrevivieron [[0]]: Pablo, Emilce, Gustavo y [[1]].",
    blancos: ["cuatro", "Patricia"],
    senuelos: ["dos", "Marta"],
    dato: "Pablo Díaz, Emilce Moler, Gustavo Calotti y Patricia Miranda sobrevivieron y pudieron contarlo.",
    voz: "De los diez estudiantes secuestrados sobrevivieron cuatro: Pablo Díaz, Emilce Moler, Gustavo Calotti y Patricia Miranda. Pasaron por centros clandestinos y por la cárcel, y años después su palabra fue prueba en los juicios."
  },
  {
    tipo: "veredicto",
    titulo: "La más chica",
    img: "/fichas/lapices.jpg",
    afirmacion: "María Claudia Falcone tenía 16 años cuando la secuestraron.",
    esCierto: true,
    dato: "Era de las más chicas del grupo; estudiaba dibujo en Bellas Artes.",
    voz: "Es cierto. María Claudia Falcone tenía dieciséis años y estudiaba dibujo en el Bachillerato de Bellas Artes. Su ficha escolar todavía existe, con su foto de alumna."
  },
  {
    tipo: "veredicto",
    titulo: "El lugar",
    img: "/fichas/puerta.jpg",
    afirmacion: "Los estudiantes fueron secuestrados en la ciudad de Buenos Aires.",
    esCierto: false,
    dato: "Fue en La Plata, donde vivían y estudiaban.",
    voz: "Falso. Los secuestros ocurrieron en La Plata, donde los estudiantes vivían y estudiaban. Grupos armados entraron de madrugada a sus casas, delante de sus familias."
  },
  {
    tipo: "veredicto",
    titulo: "Las madres",
    img: "/fichas/marcha.jpg",
    afirmacion: "Las Madres de Plaza de Mayo empezaron a marchar durante la propia dictadura.",
    esCierto: true,
    dato: "Desde 1977 dieron vueltas a la Plaza pidiendo por sus hijos.",
    voz: "Es cierto. En plena dictadura, en 1977, las madres de los desaparecidos empezaron a dar vueltas a la Plaza de Mayo con pañuelos blancos, preguntando por sus hijos. Lo hicieron cuando casi nadie se animaba a hablar."
  },
  {
    tipo: "tachado",
    titulo: "El pañuelo",
    img: "/media/madres-plaza-mayo/madres-panuelos.jpg",
    texto: "Las Madres se reconocían entre ellas con un [[0]] blanco en la cabeza. Al principio no era una tela cualquiera: era un [[1]] de sus propios hijos.",
    blancos: ["pañuelo", "pañal"],
    senuelos: ["sombrero", "mantel"],
    dato: "Se pusieron en la cabeza los pañales de tela de cuando sus hijos eran bebés.",
    voz: "Las Madres se reconocían entre ellas con un pañuelo blanco en la cabeza. Al principio no era una tela cualquiera: era un pañal de tela de sus propios hijos, de cuando eran bebés. Llevaban puesto lo más íntimo que tenían de ellos, para que nadie pudiera decir que no habían existido."
  },
  {
    tipo: "veredicto",
    titulo: "La ronda",
    img: "/media/madres-plaza-mayo/madres-policia.jpg",
    afirmacion: "Las Madres empezaron a caminar en ronda porque estaba prohibido quedarse reunidas.",
    esCierto: true,
    dato: "La policía les gritaba «circulen». Ellas circularon: en ronda, alrededor de la Pirámide.",
    voz: "Es cierto. Con el estado de sitio estaba prohibido que se juntaran tres personas o más. Cuando las Madres se paraban en la Plaza, la policía les gritaba: circulen. Y ellas circularon. Empezaron a caminar en ronda alrededor de la Pirámide de Mayo, y esa vuelta se convirtió en su forma de resistir."
  },
  {
    tipo: "tachado",
    titulo: "Que aparezcan",
    img: "/media/madres-plaza-mayo/madres-aparezcan-con-vida.jpg",
    consigna: "Mirá el cartel de la foto y tocá la palabra que restaura cada tachadura.",
    texto: "El cartel más conocido de las Madres pedía: «Que aparezcan con [[0]] los detenidos [[1]]». La primera ronda fue en 1977, en plena dictadura.",
    blancos: ["vida", "desaparecidos"],
    senuelos: ["justicia", "encarcelados"],
    dato: "No pedían tumbas ni listas: pedían que sus hijos volvieran vivos.",
    voz: "Que aparezcan con vida los detenidos desaparecidos. Eso decía el cartel. No pedían tumbas ni listas: pedían que sus hijos volvieran vivos. La primera ronda fue el treinta de abril de mil novecientos setenta y siete, cuando catorce mujeres se animaron a preguntar en voz alta lo que nadie preguntaba."
  },
  {
    tipo: "veredicto",
    titulo: "El secreto",
    img: "/fichas/puerta.jpg",
    afirmacion: "La dictadura reconocía públicamente dónde estaban los detenidos.",
    esCierto: false,
    dato: "Los centros eran clandestinos: el Estado negaba tener a los secuestrados.",
    voz: "Falso. Los centros de detención eran clandestinos: el Estado negaba saber dónde estaban los secuestrados. Por eso a las víctimas se las llama desaparecidos: no había registro, ni juicio, ni respuesta para las familias."
  },
  {
    tipo: "veredicto",
    titulo: "La ficha",
    img: "/fichas/pupitres.jpg",
    afirmacion: "La ficha escolar de Claudia Falcone se conserva hasta hoy.",
    esCierto: true,
    dato: "En observaciones dice «Deserción»: el registro escolar no podía nombrar lo que había pasado.",
    voz: "Es cierto. En el archivo del Bachillerato de Bellas Artes se conserva su ficha, con su foto de alumna. En observaciones dice deserción: el registro escolar no podía nombrar lo que en verdad había pasado."
  },
  {
    tipo: "veredicto",
    titulo: "La libertad",
    img: "/fichas/mano.jpg",
    afirmacion: "Los sobrevivientes fueron liberados a los pocos días.",
    esCierto: false,
    dato: "Pasaron años detenidos; Pablo Díaz recuperó la libertad recién en 1980.",
    voz: "Falso. Los sobrevivientes pasaron por centros clandestinos y después años presos a disposición del gobierno militar. Pablo Díaz recién recuperó la libertad en 1980."
  },
  {
    tipo: "veredicto",
    titulo: "La escuela de Claudio",
    img: "/fichas/pupitres.jpg",
    afirmacion: "Claudio de Acha estudiaba en el Colegio Nacional de La Plata.",
    esCierto: true,
    dato: "Su colegio hoy lo recuerda con actos cada 16 de septiembre.",
    voz: "Es cierto. Claudio de Acha estudiaba en el Colegio Nacional de La Plata. Hoy su colegio, como tantas escuelas, lo recuerda cada dieciséis de septiembre."
  },
  {
    tipo: "veredicto",
    titulo: "La censura",
    img: "/fichas/cine.jpg",
    afirmacion: "Durante la dictadura se podía hablar libremente de los desaparecidos.",
    esCierto: false,
    dato: "Había censura: diarios, libros y canciones estaban vigilados.",
    voz: "Falso. Había censura: los diarios no podían informar, había libros prohibidos y hasta canciones que no se podían pasar por radio. Hablar de un desaparecido era un riesgo. Por eso la historia recién se conoció entera en democracia."
  },
  {
    tipo: "orden",
    titulo: "La vida de Claudia",
    img: "/fichas/lapices.jpg",
    eventos: [
      { txt: "Nace María Claudia Falcone en La Plata", anio: "1960" },
      { txt: "Entra al Bachillerato de Bellas Artes", anio: "1973" },
      { txt: "Marcha con sus compañeros y consiguen el boleto", anio: "1975" },
      { txt: "La secuestran: tenía 16 años", anio: "sep 1976" }
    ],
    // cada momento de su vida cae con su imagen cuando la voz lo nombra
    fotosEventos: [
      { hito: "1960", img: "/media/caras/claudia-falcone.jpg" },
      { hito: "1973", img: "/media/documentos/02.jpg" },
      { hito: "1975", img: "/fichas/colectivo.jpg" },
      { hito: "1976", img: "/fichas/lapices.jpg" }
    ],
    dato: "Los datos salen de su propia ficha escolar, que se conserva hasta hoy.",
    voz: "María Claudia Falcone nació en La Plata en 1960. En 1973 entró al Bachillerato de Bellas Artes. En 1975 marchó con sus compañeros por el boleto, y lo consiguieron. En septiembre de 1976 fue secuestrada. Tenía dieciséis años."
  },
  {
    tipo: "orden",
    titulo: "La verdad y la justicia",
    img: "/fichas/juicio.jpg",
    eventos: [
      { txt: "Golpe de Estado cívico-militar", anio: "1976" },
      { txt: "La CONADEP reúne la verdad en el Nunca Más", anio: "1984" },
      { txt: "Juicio a las Juntas: los responsables son condenados", anio: "1985" },
      { txt: "El libro y la película cuentan la historia al país", anio: "1986" }
    ],
    dato: "Primero la verdad, después la justicia, después la memoria.",
    voz: "Después del golpe de 1976 vinieron años de silencio. Con la democracia, en 1984, la CONADEP reunió la verdad en el informe Nunca Más. En 1985 llegó la justicia con el Juicio a las Juntas. Y en 1986, el libro y la película hicieron que todo el país conociera esta historia."
  },
  {
    tipo: "orden",
    titulo: "El boleto, ida y vuelta",
    img: "/fichas/colectivo.jpg",
    eventos: [
      { txt: "Los estudiantes lo consiguen en la calle", anio: "1975" },
      { txt: "La dictadura lo suspende", anio: "1976" },
      { txt: "Vuelve la democracia", anio: "1983" },
      { txt: "El boleto gratuito se convierte en ley", anio: "2015" }
    ],
    dato: "El derecho por el que marcharon hoy es ley.",
    voz: "El boleto estudiantil se consiguió en 1975 con los pibes en la calle. La dictadura lo suspendió en 1976. Con la democracia volvió a discutirse, y en 2015 se convirtió en ley gratuita en la provincia de Buenos Aires. Un derecho puede tardar cuarenta años en volver."
  },
  {
    tipo: "unir",
    titulo: "Tres escuelas",
    img: "/fichas/pupitres.jpg",
    pares: [
      ["Claudia Falcone", "Bachillerato de Bellas Artes"],
      ["Horacio Ungaro", "Escuela Normal N.º 3"],
      ["Claudio de Acha", "Colegio Nacional de La Plata"]
    ],
    dato: "Tres escuelas públicas de La Plata que hoy los recuerdan.",
    voz: "Claudia Falcone estudiaba en el Bachillerato de Bellas Artes. Horacio Ungaro, en la Escuela Normal número tres. Claudio de Acha, en el Colegio Nacional de La Plata. Tres escuelas públicas que hoy los recuerdan con placas, murales y actos."
  },
  {
    tipo: "unir",
    titulo: "Las cuatro voces",
    img: "/fichas/mano.jpg",
    pares: [
      ["Pablo Díaz", "Declaró en el Juicio a las Juntas"],
      ["Emilce Moler", "Hoy cuenta la historia en las escuelas"],
      ["Patricia Miranda", "Sobrevivió; su palabra llegó a los juicios"]
    ],
    dato: "Cuatro sobrevivieron: Pablo, Emilce, Gustavo y Patricia.",
    voz: "Pablo Díaz declaró en el Juicio a las Juntas. Emilce Moler recorre las escuelas contando la historia. Gustavo Calotti y Patricia Miranda también sobrevivieron, y su palabra fue prueba en los juicios. Cuatro voces que mantienen viva la memoria."
  },
  {
    tipo: "unir",
    titulo: "La justicia",
    img: "/fichas/juicio.jpg",
    pares: [
      ["CONADEP", "Reunió la verdad en el informe Nunca Más"],
      ["Julio César Strassera", "Fiscal del Juicio a las Juntas"],
      ["Ernesto Sabato", "Escritor que presidió la CONADEP"]
    ],
    dato: "La verdad y la justicia también se construyeron con nombres propios.",
    voz: "La CONADEP reunió la verdad en el informe Nunca Más, presidida por el escritor Ernesto Sabato. Y en el Juicio a las Juntas, el fiscal Julio César Strassera cerró su alegato con dos palabras: nunca más."
  },
  {
    tipo: "unir",
    titulo: "Los lugares",
    img: "/fichas/puerta.jpg",
    pares: [
      ["Arana", "Centro clandestino de la zona de La Plata"],
      ["Pozo de Quilmes", "Otro centro por el que pasaron los estudiantes"],
      ["Pozo de Banfield", "Hoy es un sitio de memoria que se puede visitar"]
    ],
    dato: "Los tres existieron; hoy se pueden conocer como sitios de memoria.",
    voz: "Arana, el Pozo de Quilmes y el Pozo de Banfield: por esos centros clandestinos pasaron los estudiantes. Hoy varios funcionan como sitios de memoria: se pueden recorrer, conocer y no olvidar."
  },
  {
    tipo: "unir",
    titulo: "Las canciones",
    img: "/fichas/marcha.jpg",
    pares: [
      ["Los dinosaurios", "De Charly García: sobre el miedo a que los amigos desaparezcan"],
      ["La memoria", "De León Gieco: sobre lo que no se puede olvidar"],
      ["Marcha de la bronca", "De Pedro y Pablo: protesta que la censura prohibió"]
    ],
    dato: "Cuando no se podía hablar, la música guardó la memoria.",
    voz: "Cuando no se podía hablar, la música guardó la memoria. Charly García cantó el miedo a que los amigos desaparecieran en Los dinosaurios. León Gieco le puso voz al recuerdo en La memoria. Y la Marcha de la bronca, de Pedro y Pablo, estuvo prohibida por la censura."
  },
  {
    tipo: "escena",
    titulo: "La escena",
    img: "/fichas/cine.jpg",
    tiempo: 150,
    desde: 0,
    hasta: 13,
    datoDesde: 20,
    datoHasta: 66,
    // el audio va por separado del video para que siga sonando cuando la
    // ficha se va y aparece el informe final
    datoAudio: "/media/musica/cancion-final.mp3",
    datoVer: 16,
    pregunta: "En esta escena de la película, ¿qué canción cantan los chicos en las celdas?",
    opciones: ["«Rasguña las piedras», de Sui Generis", "«La balsa», de Los Gatos", "«Muchacha ojos de papel», de Almendra", "«Cambalache», de Enrique Santos Discépolo"],
    correcta: 0,
    dato: "Cantan «Rasguña las piedras», de Sui Generis: cantar juntos era resistir.",
    voz: "En una de las escenas más fuertes de la película, los chicos, cada uno en su celda, se dan fuerza cantando juntos Rasguña las piedras, de Sui Generis. En la oscuridad, cantar era seguir estando vivos, y seguir estando juntos."
  },
  {
    tipo: "unir",
    titulo: "Los sonidos",
    img: "/fichas/marcha.jpg",
    tiempo: 75,
    consigna: "Tocá cada sonido para escucharlo y unilo con el momento de la historia que suena así.",
    sonidos: ["/media/musica/boleto.mp3", "/media/musica/dictadura.mp3", "/media/musica/democracia.mp3"],
    pares: [
      ["Sonido 1", "La alegría del boleto ganado (1975)"],
      ["Sonido 2", "Los años oscuros de la dictadura"],
      ["Sonido 3", "La vuelta de la democracia (1983)"]
    ],
    dato: "Escuchá cada sonido y decidí qué momento de la historia suena así.",
    voz: "La música también cuenta la historia. Un mismo país sonó distinto: la alegría de los pibes que ganaron su boleto, el miedo de los años oscuros, y la esperanza del regreso de la democracia."
  },
  {
    tipo: "veredicto",
    titulo: "La música prohibida",
    img: "/fichas/cine.jpg",
    afirmacion: "Durante la dictadura, las radios tenían listas de canciones que no podían pasar.",
    esCierto: true,
    dato: "Hubo listas negras de temas y de artistas; muchos músicos se fueron al exilio.",
    voz: "Es cierto. Existían listas de canciones prohibidas que las radios no podían pasar, y listas negras de artistas. Muchos músicos tuvieron que irse del país. Cantar también era una forma de resistir y de recordar."
  }
];
const slugMision = (titulo) => titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export {
  MISIONES,
  slugMision
};
