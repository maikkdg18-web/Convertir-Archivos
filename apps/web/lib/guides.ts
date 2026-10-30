// Guías (artículos) del sitio. El texto describe lo que las herramientas hacen de verdad:
// si cambia el comportamiento de una herramienta, revisa también la guía que la menciona.

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Fecha de publicación (ISO). */
  published: string;
  readingMinutes: number;
  /** Ruta de la herramienta relacionada, si la hay. */
  tool?: { route: string; label: string };
  /** Slugs de otras guías para "Sigue leyendo". */
  related: string[];
  body: GuideBlock[];
}

export const GUIDES: Guide[] = [
  {
    slug: "como-reducir-el-peso-de-un-pdf",
    title: "Cómo reducir el peso de un PDF sin que se vea mal",
    description:
      "Por qué un PDF pesa tanto, qué nivel de compresión conviene en cada caso y qué hacer cuando el archivo casi no baja de tamaño.",
    published: "2026-10-29",
    readingMinutes: 5,
    tool: { route: "/comprimir-pdf", label: "Comprimir un PDF ahora" },
    related: ["pdf-jpg-o-png-que-formato-usar", "como-unir-pdfs-en-un-solo-archivo"],
    body: [
      {
        type: "p",
        text: "Casi todo el mundo se ha topado alguna vez con el mensaje «el archivo es demasiado grande»: al adjuntar un documento a un correo, al subirlo a un portal de trámites o al enviarlo por mensajería. Muchos servicios de correo limitan los adjuntos a unos 20–25 MB, y algunos portales piden archivos aún más pequeños. La buena noticia es que un PDF casi siempre se puede aligerar bastante sin que la lectura se resienta.",
      },
      { type: "h2", text: "Por qué un PDF pesa tanto" },
      {
        type: "p",
        text: "El texto ocupa muy poco: una página de puro texto suele pesar unas decenas de kilobytes. Lo que dispara el tamaño son las imágenes. Un PDF creado al escanear un documento, o uno que incluye fotografías, guarda cada página como una imagen de alta resolución, y ahí es donde se van los megas.",
      },
      {
        type: "p",
        text: "También influyen las fuentes incrustadas, las versiones duplicadas de una misma imagen y los datos que el programa que creó el PDF dejó dentro y que ya no hacen falta. Comprimir consiste, en esencia, en recomprimir las imágenes con un tamaño y una calidad más razonables y quitar lo que sobra.",
      },
      { type: "h2", text: "Qué nivel de compresión elegir" },
      {
        type: "p",
        text: "La herramienta Comprimir PDF ofrece tres niveles. Cuál elegir depende de para qué vayas a usar el archivo:",
      },
      {
        type: "ul",
        items: [
          "Ligera: limpia el archivo y respeta al máximo la calidad de las imágenes. Es la opción para documentos que se van a imprimir o en los que la nitidez importa. Reduce menos el peso.",
          "Equilibrada: reduce las imágenes a un tamaño cómodo para pantalla y fusiona fuentes. Es el punto medio y la que viene marcada por defecto; sirve para la mayoría de adjuntos.",
          "Máxima: busca el archivo más pequeño posible. Las imágenes pueden perder calidad, así que conviene revisar el resultado antes de enviarlo. Útil cuando solo importa que quepa en un límite estricto.",
        ],
      },
      { type: "h2", text: "Paso a paso" },
      {
        type: "ol",
        items: [
          "Entra en Comprimir PDF y sube tu archivo arrastrándolo a la zona de carga o pulsando para elegirlo.",
          "Elige el nivel de compresión. Si dudas, deja Equilibrada.",
          "Pulsa «Comprimir PDF» y espera unos segundos. La página muestra el peso original, el nuevo y el porcentaje que se ahorró.",
          "Descarga el resultado. El archivo conserva el mismo nombre con el que lo subiste, así que no tienes que renombrarlo.",
          "Ábrelo y echa un vistazo a las páginas con más imágenes. Si algo se ve peor de lo que esperabas, vuelve a comprimir el original con un nivel más suave.",
        ],
      },
      { type: "h2", text: "Cuánto se puede reducir" },
      {
        type: "p",
        text: "No hay una cifra única, porque depende de lo que contenga el PDF. Un escaneo a color o un documento lleno de fotos puede quedar en la mitad o menos. Un PDF que es sobre todo texto apenas cambia, porque ya era pequeño. Por eso la página muestra un ahorro aproximado por nivel y, al terminar, el ahorro real de tu archivo.",
      },
      { type: "h2", text: "Si el archivo casi no baja de peso" },
      {
        type: "ul",
        items: [
          "Si ya lo comprimiste antes, es normal: cada pasada aporta menos. El archivo ya estaba optimizado.",
          "Si es un PDF de solo texto, no hay imágenes que reducir. Si aun así es grande, puede ser que incluya fuentes completas o muchas páginas.",
          "Si es un escaneo, la forma más eficaz es volver a escanear con menos resolución (150 ppp suele bastar para leer en pantalla) o en blanco y negro cuando el documento no necesita color.",
          "Si el problema es un límite de adjuntos, divide el documento en dos partes o compártelo mediante un enlace de almacenamiento en la nube en lugar de adjuntarlo.",
        ],
      },
      {
        type: "note",
        text: "Guarda siempre el original. La compresión puede perder calidad de imagen, y esa pérdida no se puede deshacer en el archivo comprimido.",
      },
    ],
  },
  {
    slug: "como-unir-pdfs-en-un-solo-archivo",
    title: "Cómo unir varios PDF en un solo archivo y en el orden correcto",
    description:
      "Cómo combinar documentos PDF en uno solo, ordenar las partes antes de unirlas y evitar los errores más habituales.",
    published: "2026-10-29",
    readingMinutes: 4,
    tool: { route: "/unir-pdfs", label: "Unir PDFs ahora" },
    related: ["como-reducir-el-peso-de-un-pdf", "como-proteger-tu-privacidad-al-usar-convertidores-online"],
    body: [
      {
        type: "p",
        text: "Entregar un solo PDF en lugar de cinco archivos sueltos facilita la vida a quien lo recibe: se abre de una vez, se imprime de una vez y no se pierde ninguna parte por el camino. Es habitual al presentar una solicitud con varios documentos, al juntar facturas de un mes o al armar un informe con partes escritas por distintas personas.",
      },
      { type: "h2", text: "Antes de unir: prepara los archivos" },
      {
        type: "ul",
        items: [
          "Ponles nombres que te ayuden a ordenarlos, por ejemplo 01-portada.pdf, 02-informe.pdf, 03-anexos.pdf. Así sabrás de un vistazo cuál va primero.",
          "Comprueba que se abren bien. Un PDF dañado hará que la unión falle.",
          "Si alguno está protegido con contraseña, quítale la protección antes de subirlo; un archivo cifrado puede no poder leerse.",
        ],
      },
      { type: "h2", text: "Paso a paso con Unir PDFs" },
      {
        type: "ol",
        items: [
          "Entra en Unir PDFs y sube dos o más archivos. Puedes arrastrarlos todos a la vez o añadirlos de uno en uno.",
          "Revisa el orden de la lista. Cada archivo tiene flechas para subirlo o bajarlo, y un botón para quitarlo si te equivocaste.",
          "Pulsa «Unir PDFs». La página sube los archivos y los combina en uno solo.",
          "Descarga el resultado y ábrelo para comprobar que las páginas están en el orden que querías.",
        ],
      },
      { type: "h2", text: "Cómo se ordenan las páginas" },
      {
        type: "p",
        text: "El PDF final contiene todas las páginas del primer archivo de la lista, luego todas las del segundo, y así sucesivamente, sin alterarlas. Las páginas conservan su tamaño y orientación: si mezclas un documento en vertical con otro en horizontal, cada página mantendrá la suya.",
      },
      { type: "h2", text: "Errores habituales" },
      {
        type: "ul",
        items: [
          "«Solo se aceptan PDFs»: la herramienta únicamente trabaja con archivos PDF. Si tienes un documento de Word, conviértelo antes con Word a PDF; si son fotos, pásalas con Imágenes a PDF.",
          "«Necesitas al menos 2 PDFs»: para unir hacen falta dos archivos como mínimo.",
          "El resultado pesa mucho: la unión suma los pesos de los archivos. Si necesitas algo más ligero, pásalo después por Comprimir PDF.",
        ],
      },
      {
        type: "note",
        text: "Si quieres lo contrario, extraer páginas sueltas, puedes convertir el PDF en imágenes con PDF a imágenes y quedarte con las páginas que necesites.",
      },
    ],
  },
  {
    slug: "como-pasar-un-pdf-a-word-y-editarlo",
    title: "Cómo pasar un PDF a Word y editarlo sin rehacerlo desde cero",
    description:
      "Qué esperar al convertir un PDF a DOCX, por qué a veces el formato cambia y cómo dejar el documento listo para editar.",
    published: "2026-10-29",
    readingMinutes: 5,
    tool: { route: "/pdf-a-word", label: "Convertir PDF a Word" },
    related: ["como-convertir-word-a-pdf-sin-perder-formato", "pdf-jpg-o-png-que-formato-usar"],
    body: [
      {
        type: "p",
        text: "Un PDF está pensado para verse igual en cualquier pantalla, no para editarse. Por eso, cuando necesitas cambiar un párrafo, actualizar una tabla o reutilizar el texto de un documento que solo tienes en PDF, lo más práctico es convertirlo a Word (DOCX) y trabajar desde ahí.",
      },
      { type: "h2", text: "Qué hace la conversión" },
      {
        type: "p",
        text: "El convertidor lee el contenido del PDF —texto, imágenes, tablas— e intenta reconstruir un documento de Word con la misma apariencia. Es una reconstrucción: el PDF no guarda «párrafos» ni «estilos» como Word, sino la posición de cada trozo de texto en la página. Por eso el resultado suele ser muy parecido, pero rara vez idéntico.",
      },
      { type: "h2", text: "Cuándo funciona mejor" },
      {
        type: "ul",
        items: [
          "PDFs generados desde un procesador de texto o desde una aplicación, donde el texto es texto real.",
          "Documentos con una estructura sencilla: párrafos, títulos, listas y tablas básicas.",
          "Archivos con fuentes habituales, que existan también en tu ordenador.",
        ],
      },
      { type: "h2", text: "Cuándo da más problemas" },
      {
        type: "ul",
        items: [
          "PDFs escaneados: cada página es una fotografía, no hay texto que convertir. En ese caso lo normal es que el resultado conserve las páginas como imágenes y no puedas editar el texto.",
          "Maquetaciones complejas, con varias columnas, cuadros de texto superpuestos o gráficos integrados con el texto.",
          "Fuentes poco comunes: si Word no las tiene, las sustituye y puede moverse el texto.",
        ],
      },
      { type: "h2", text: "Paso a paso con PDF a Word" },
      {
        type: "ol",
        items: [
          "Entra en PDF a Word y sube tu archivo.",
          "Pulsa «Convertir a Word» y espera mientras se procesa; documentos largos tardan un poco más.",
          "Descarga el archivo DOCX y ábrelo en Word, LibreOffice o Google Docs.",
          "Repasa el documento antes de editar: títulos, tablas, saltos de página y listas son lo primero que suele necesitar un retoque.",
        ],
      },
      { type: "h2", text: "Consejos para obtener un buen resultado" },
      {
        type: "ul",
        items: [
          "Si tienes el documento original en Word, úsalo: siempre será mejor que convertir un PDF.",
          "Convierte el PDF completo y borra después lo que no necesites; es más sencillo que preparar un PDF recortado.",
          "Revisa los números y las fechas: tras cualquier conversión conviene comprobar que no se desplazó ninguna cifra.",
          "Si el documento es importante, compáralo con el PDF original página a página antes de enviarlo.",
        ],
      },
      {
        type: "note",
        text: "El servicio que realiza esta conversión tiene un límite diario de conversiones. Si lo alcanzas, la página te lo indicará y podrás intentarlo de nuevo al día siguiente.",
      },
    ],
  },
  {
    slug: "como-convertir-word-a-pdf-sin-perder-formato",
    title: "Cómo convertir un documento de Word a PDF sin perder el formato",
    description:
      "Por qué conviene enviar documentos en PDF, cómo convertir DOC y DOCX y qué revisar antes para que el resultado salga como esperas.",
    published: "2026-10-29",
    readingMinutes: 4,
    tool: { route: "/word-a-pdf", label: "Convertir Word a PDF" },
    related: ["como-pasar-un-pdf-a-word-y-editarlo", "como-reducir-el-peso-de-un-pdf"],
    body: [
      {
        type: "p",
        text: "Un documento de Word puede verse distinto según el equipo, la versión del programa o las fuentes instaladas. Un PDF, en cambio, fija el diseño: lo que ves es lo que verá quien lo reciba. Por eso es el formato habitual para currículums, contratos, facturas, trabajos académicos y cualquier documento que se envía a otra persona.",
      },
      { type: "h2", text: "Ventajas de enviar un PDF en lugar de un DOCX" },
      {
        type: "ul",
        items: [
          "El diseño no se mueve: márgenes, saltos de página, tablas e imágenes quedan donde los pusiste.",
          "Se abre en cualquier dispositivo sin necesidad de tener Word.",
          "Evita ediciones accidentales y que se vean cambios o comentarios que no querías compartir.",
          "Suele pesar menos y es más cómodo de imprimir.",
        ],
      },
      { type: "h2", text: "Revisa tu documento antes de convertir" },
      {
        type: "ul",
        items: [
          "Acepta o rechaza los cambios registrados y borra los comentarios que no deban verse.",
          "Actualiza los índices y las referencias cruzadas, para que los números de página sean correctos.",
          "Comprueba las fuentes: si usas una poco común, puede ser sustituida durante la conversión y alterar la maquetación.",
          "Mira la vista de impresión para detectar saltos de página raros o tablas partidas.",
        ],
      },
      { type: "h2", text: "Paso a paso con Word a PDF" },
      {
        type: "ol",
        items: [
          "Entra en Word a PDF y sube tu archivo en formato DOC o DOCX.",
          "Pulsa «Convertir a PDF» y espera unos segundos.",
          "Descarga el PDF y ábrelo para comprobarlo de principio a fin antes de enviarlo.",
        ],
      },
      { type: "h2", text: "Si usas Google Docs o LibreOffice" },
      {
        type: "p",
        text: "Descarga primero el documento como DOCX desde el menú Archivo (en Google Docs: Descargar → Microsoft Word) y súbelo después. La herramienta acepta los formatos DOC y DOCX.",
      },
      { type: "h2", text: "Después de convertir" },
      {
        type: "p",
        text: "Si el PDF resultante pesa más de lo conveniente por las imágenes que contiene, puedes reducirlo con Comprimir PDF. Y si necesitas juntarlo con otros documentos —por ejemplo, un currículum con sus certificados—, Unir PDFs los combina en un único archivo.",
      },
      {
        type: "note",
        text: "El servicio que realiza la conversión tiene un límite diario. Si aparece un aviso de límite alcanzado, vuelve a intentarlo al día siguiente.",
      },
    ],
  },
  {
    slug: "como-escanear-documentos-con-el-celular-y-guardarlos-en-pdf",
    title: "Cómo escanear documentos con el celular y guardarlos en un PDF",
    description:
      "Cómo fotografiar un documento, enderezar la perspectiva y juntar varias fotos en un único PDF sin usar un escáner.",
    published: "2026-10-29",
    readingMinutes: 5,
    tool: { route: "/imagenes-a-pdf", label: "Pasar imágenes a PDF" },
    related: ["pdf-jpg-o-png-que-formato-usar", "como-unir-pdfs-en-un-solo-archivo"],
    body: [
      {
        type: "p",
        text: "No hace falta un escáner para digitalizar un documento: la cámara del celular basta si sabes hacer bien la foto. El truco está en tres cosas: buena luz, el documento plano y la perspectiva corregida. Esta guía recorre el proceso completo, de la foto al PDF.",
      },
      { type: "h2", text: "Cómo hacer una buena foto del documento" },
      {
        type: "ul",
        items: [
          "Usa luz natural o una lámpara situada a un lado, para evitar que tu propia sombra caiga sobre el papel.",
          "Coloca el documento sobre una superficie lisa y de un color que contraste, como una mesa oscura si el papel es blanco.",
          "Alinea el celular en paralelo al papel, desde arriba y lo más centrado posible.",
          "Asegúrate de que se ven las cuatro esquinas y de que el texto está enfocado; si lo puedes leer en pantalla, saldrá legible.",
          "Evita el flash directo: suele crear un reflejo blanco en el centro de la página.",
        ],
      },
      { type: "h2", text: "Corregir la perspectiva" },
      {
        type: "p",
        text: "Aunque lo intentes, es difícil que la foto salga perfectamente recta, y el documento aparece como un trapecio. La herramienta Imágenes a PDF incluye una corrección de perspectiva: si usas el botón «Tomar foto ahora», la foto se muestra con cuatro puntos que arrastras hasta las esquinas del documento. Al confirmar, la imagen se endereza y queda como si estuviera escaneada.",
      },
      {
        type: "note",
        text: "La corrección de perspectiva se aplica a las fotos tomadas con el botón «Tomar foto ahora». Las imágenes que subes desde tu galería se añaden tal cual.",
      },
      { type: "h2", text: "Paso a paso" },
      {
        type: "ol",
        items: [
          "Entra en Imágenes a PDF. Desde un celular, pulsa «Tomar foto ahora» para abrir la cámara.",
          "Haz la foto y arrastra los cuatro puntos hasta las esquinas del documento; después, confirma.",
          "Repite con cada página. También puedes añadir imágenes JPG o PNG que ya tengas guardadas.",
          "Revisa la lista: las páginas del PDF saldrán en el mismo orden en que aparecen. Quita las que sobren con el botón de cada fila.",
          "Pulsa «Convertir a PDF» y descarga el resultado.",
        ],
      },
      { type: "h2", text: "Qué esperar del resultado" },
      {
        type: "p",
        text: "Cada imagen se convierte en una página del PDF con el tamaño de la propia imagen, sin recortes ni márgenes añadidos. Por eso un PDF con muchas fotos de cámara puede pesar bastante. Si el archivo es demasiado grande para enviarlo, pásalo por Comprimir PDF; la mayoría de los documentos se siguen leyendo perfectamente.",
      },
      { type: "h2", text: "Si tu celular guarda las fotos en HEIC" },
      {
        type: "p",
        text: "Algunos teléfonos guardan las fotos en formato HEIC, que esta herramienta no admite: solo acepta JPG y PNG. Cambia el ajuste de la cámara a «más compatible» (en iPhone: Ajustes → Cámara → Formatos), o haz una captura de la foto para obtener un PNG.",
      },
    ],
  },
  {
    slug: "como-convertir-un-pdf-en-imagenes",
    title: "Cómo convertir las páginas de un PDF en imágenes PNG",
    description:
      "Para qué sirve pasar un PDF a imágenes, qué calidad esperar y cómo descargar una página suelta o todas a la vez.",
    published: "2026-10-29",
    readingMinutes: 4,
    tool: { route: "/pdf-a-imagenes", label: "Convertir PDF a imágenes" },
    related: ["pdf-jpg-o-png-que-formato-usar", "como-unir-pdfs-en-un-solo-archivo"],
    body: [
      {
        type: "p",
        text: "A veces no necesitas el PDF entero, sino una página como imagen: para insertarla en una presentación, publicarla en una red social, enviarla por mensajería o usarla como ilustración. Convertir cada página en una imagen te da archivos que se abren en cualquier sitio, sin visor de PDF.",
      },
      { type: "h2", text: "Qué hace la herramienta" },
      {
        type: "p",
        text: "PDF a imágenes convierte cada página de tu PDF en una imagen PNG. Las páginas se generan al doble del tamaño base del PDF (equivale a unos 144 puntos por pulgada), un buen equilibrio entre nitidez y peso: el texto se lee con claridad sin que los archivos resulten enormes.",
      },
      { type: "h2", text: "Paso a paso" },
      {
        type: "ol",
        items: [
          "Entra en PDF a imágenes y sube tu archivo.",
          "Pulsa «Convertir a imágenes». La herramienta procesa cada página.",
          "Verás una vista previa de todas las páginas. Pulsa el botón de una página para descargarla sola, o «Descargar todas» para obtener el conjunto.",
        ],
      },
      { type: "h2", text: "Límite de páginas" },
      {
        type: "p",
        text: "Para mantener el servicio estable, la herramienta convierte PDFs de hasta 30 páginas. Si el tuyo tiene más, divídelo antes en partes o trabaja con las páginas que necesites.",
      },
      { type: "h2", text: "Por qué PNG" },
      {
        type: "p",
        text: "PNG conserva los bordes del texto y de las líneas perfectamente nítidos, porque no pierde información al guardarse. Es ideal para documentos, capturas y diagramas. A cambio, las imágenes pesan más que un JPG. Si necesitas algo más ligero, puedes convertir después la imagen a JPG con cualquier editor, o consultar la guía sobre qué formato usar en cada caso.",
      },
      { type: "h2", text: "Ideas de uso" },
      {
        type: "ul",
        items: [
          "Insertar una página de un informe en una presentación.",
          "Compartir una sola página sin mandar el documento completo.",
          "Conservar una imagen de una factura o un justificante para subirla a un formulario que no acepta PDF.",
          "Revisar con calma un diseño o una maquetación ampliando la imagen.",
        ],
      },
      {
        type: "note",
        text: "Esta conversión no extrae el texto: el resultado son imágenes. Si lo que quieres es editar el contenido, usa PDF a Word.",
      },
    ],
  },
  {
    slug: "pdf-jpg-o-png-que-formato-usar",
    title: "PDF, JPG o PNG: qué formato conviene usar en cada caso",
    description:
      "Diferencias prácticas entre PDF, JPG y PNG, cuándo elegir cada uno y cómo pasar de uno a otro sin perder lo importante.",
    published: "2026-10-29",
    readingMinutes: 5,
    related: [
      "como-convertir-un-pdf-en-imagenes",
      "como-escanear-documentos-con-el-celular-y-guardarlos-en-pdf",
    ],
    body: [
      {
        type: "p",
        text: "Los tres formatos sirven para cosas distintas, y elegir mal tiene consecuencias: un documento enviado como imagen no se puede buscar ni copiar, y una foto guardada como PNG puede pesar diez veces más de lo necesario. Esta guía resume las diferencias en lenguaje llano.",
      },
      { type: "h2", text: "PDF: para documentos" },
      {
        type: "p",
        text: "Un PDF puede contener texto, imágenes y varias páginas, y se ve igual en cualquier dispositivo. Es el formato adecuado para documentos que se leen, se imprimen o se archivan: contratos, facturas, informes, manuales. Además, el texto se puede buscar y copiar cuando el PDF no es un escaneo.",
      },
      { type: "h2", text: "JPG: para fotografías" },
      {
        type: "p",
        text: "JPG comprime las imágenes descartando detalles que el ojo apenas percibe. Esto lo hace perfecto para fotografías, con muchos colores y degradados, y genera archivos pequeños. Su punto débil: con texto o líneas finas aparecen pequeñas manchas alrededor de los bordes, y cada vez que se vuelve a guardar se pierde un poco más de calidad.",
      },
      { type: "h2", text: "PNG: para capturas, gráficos y texto" },
      {
        type: "p",
        text: "PNG guarda la imagen sin pérdida, así que los bordes del texto, los logotipos y los diagramas salen nítidos. Admite transparencia. Es la mejor opción para capturas de pantalla y gráficos; para fotografías, resulta innecesariamente pesado.",
      },
      { type: "h2", text: "Resumen rápido" },
      {
        type: "ul",
        items: [
          "¿Es un documento de varias páginas? PDF.",
          "¿Es una foto de personas, paisajes o productos? JPG.",
          "¿Es una captura, un logotipo, un gráfico o una página con texto? PNG.",
          "¿Necesitas que se pueda editar? Ni PDF ni imagen: convierte a Word con PDF a Word.",
        ],
      },
      { type: "h2", text: "Cómo pasar de un formato a otro" },
      {
        type: "ul",
        items: [
          "De imágenes (JPG o PNG) a PDF: con Imágenes a PDF puedes juntar varias imágenes en un único documento, una por página.",
          "De PDF a imágenes: PDF a imágenes convierte cada página en un PNG.",
          "De Word a PDF y de PDF a Word: con las herramientas del mismo nombre.",
        ],
      },
      { type: "h2", text: "Un detalle sobre los documentos escaneados" },
      {
        type: "p",
        text: "Un PDF creado a partir de un escaneo es, por dentro, una imagen dentro de un PDF. Se ve como un documento, pero no tiene texto que puedas seleccionar, y por eso suele pesar bastante más que un PDF «real». Si te interesa reducir su tamaño, Comprimir PDF recomprime esas imágenes y suele conseguir ahorros importantes.",
      },
    ],
  },
  {
    slug: "como-proteger-tu-privacidad-al-usar-convertidores-online",
    title: "Cómo proteger tu privacidad al usar convertidores de archivos online",
    description:
      "Qué conviene revisar antes de subir un documento a una web, qué riesgos reales existen y cómo reducirlos.",
    published: "2026-10-29",
    readingMinutes: 5,
    related: ["como-unir-pdfs-en-un-solo-archivo", "como-reducir-el-peso-de-un-pdf"],
    body: [
      {
        type: "p",
        text: "Subir un documento a un convertidor online es muy cómodo, pero implica enviar el archivo a un servidor que no controlas. En la mayoría de casos no pasa nada, y aun así merece la pena saber qué mirar, sobre todo si el documento contiene datos personales: DNI, contratos, informes médicos, nóminas.",
      },
      { type: "h2", text: "Preguntas que conviene hacerse antes de subir un archivo" },
      {
        type: "ul",
        items: [
          "¿La web explica qué hace con tus archivos y durante cuánto tiempo los conserva? Una política de privacidad clara y fácil de encontrar es buena señal.",
          "¿Se borran automáticamente? Cuanto menos tiempo permanezca el archivo en el servidor, menos exposición.",
          "¿Pide crear una cuenta o datos personales para algo tan simple como convertir un PDF? Si no hace falta, desconfía.",
          "¿La conexión es segura? La dirección debe empezar por https:// y mostrar el candado del navegador.",
          "¿Intervienen terceros? Algunas conversiones se hacen con servicios externos; una web seria lo cuenta.",
        ],
      },
      { type: "h2", text: "Cómo lo hace este sitio" },
      {
        type: "p",
        text: "En Conversor de Archivos no hace falta cuenta ni inicio de sesión. Los archivos que subes, y los resultados que se generan, se borran automáticamente del servidor: una tarea se ejecuta cada hora y elimina todo lo que lleva más de una hora almacenado. Las conversiones de Word a PDF y de PDF a Word, y la compresión de PDF, se realizan con un servicio externo (CloudConvert), que recibe el archivo solo para devolver el resultado. Todo esto está explicado en la política de privacidad.",
      },
      { type: "h2", text: "Buenas costumbres, uses la web que uses" },
      {
        type: "ul",
        items: [
          "Sube solo lo necesario. Si únicamente necesitas dos páginas de un documento largo, no subas el resto.",
          "Quita los datos que no hacen falta. Si la web de un trámite solo requiere tu nombre y número de documento, no compartas un PDF con tu historial completo.",
          "Conserva el original en tu equipo y trabaja con una copia.",
          "Evita redes wifi públicas para documentos sensibles.",
          "Para documentos muy confidenciales, valora usar un programa instalado en tu equipo en lugar de una herramienta online.",
        ],
      },
      { type: "h2", text: "Cómo comprobar que un archivo ya no está en el servidor" },
      {
        type: "p",
        text: "Si subiste algo por error y no quieres esperar al borrado automático, escribe al contacto de la web indicando qué archivo fue y a qué hora lo subiste. Cualquier sitio responsable debería atender una petición así.",
      },
      {
        type: "note",
        text: "Esta guía es orientativa y no sustituye el consejo de un profesional. Si manejas datos sujetos a confidencialidad legal, consulta antes las normas de tu organización.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function formatGuideDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
