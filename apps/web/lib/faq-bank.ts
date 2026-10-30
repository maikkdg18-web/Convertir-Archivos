// Banco de preguntas frecuentes del sitio. La portada muestra un grupo distinto en cada visita
// y el buscador recorre todo el banco. Las respuestas describen lo que la web hace de verdad:
// si cambia el comportamiento de una herramienta, revisa también la pregunta que la menciona.

export interface FaqBankItem {
  id: string;
  q: string;
  a: string;
  /** Palabras que la gente podría escribir y que no aparecen en el texto (sinónimos, jerga). */
  keywords: string[];
  /** Herramienta o página relacionada, para ofrecer un enlace directo. */
  link?: { route: string; label: string };
}

export const FAQ_BANK: FaqBankItem[] = [
  // --- General ---
  {
    id: "gratis",
    q: "¿Es gratis? ¿Los archivos salen con marca de agua?",
    a: "Es gratis y los archivos que descargas salen sin marcas de agua. El sitio se mantiene con publicidad, que se muestra en la portada y en las guías, no en las pantallas donde subes tus archivos.",
    keywords: ["precio", "costo", "pagar", "cobran", "gratuito", "watermark"],
  },
  {
    id: "cuenta",
    q: "¿Necesito crear una cuenta o instalar algo?",
    a: "No. Todo se hace desde el navegador, sin registro, sin iniciar sesión y sin instalar programas.",
    keywords: ["registro", "registrarme", "sesion", "programa", "app", "descargar"],
  },
  {
    id: "celular",
    q: "¿Funciona desde el celular?",
    a: "Sí. Las herramientas funcionan en el navegador del móvil o la tablet. Con Imágenes a PDF incluso puedes fotografiar un documento con la cámara y corregir su perspectiva en el momento.",
    keywords: ["movil", "telefono", "iphone", "android", "tablet", "smartphone"],
    link: { route: "/imagenes-a-pdf", label: "Abrir Imágenes a PDF" },
  },
  {
    id: "navegador",
    q: "¿Qué navegadores son compatibles?",
    a: "Cualquier navegador actual: Chrome, Firefox, Safari o Edge. Si algo no funciona, actualiza el navegador a su última versión y vuelve a intentarlo.",
    keywords: ["chrome", "firefox", "safari", "edge", "explorer", "compatible", "actualizar"],
  },
  {
    id: "herramientas",
    q: "¿Qué herramientas ofrece la web?",
    a: "Seis: unir PDFs, comprimir PDF, PDF a imágenes, imágenes a PDF, Word a PDF y PDF a Word. Todas siguen el mismo flujo: subes el archivo, pulsas el botón y descargas el resultado.",
    keywords: ["funciones", "opciones", "servicios", "lista", "que hace", "convertir"],
  },
  {
    id: "uso-profesional",
    q: "¿Puedo usar los archivos resultantes para trabajo o para entregar documentos?",
    a: "Sí. El resultado es tu propio archivo y el sitio no le añade marcas ni condiciones. Eso sí, revísalo antes de enviarlo: ninguna conversión automática es perfecta en todos los documentos.",
    keywords: ["comercial", "profesional", "empresa", "trabajo", "tramite", "entregar", "licencia"],
  },
  {
    id: "anuncios",
    q: "¿Por qué hay anuncios en la web?",
    a: "Los anuncios (Google AdSense) permiten mantener el servicio gratuito. Se muestran en la portada y en las guías; las pantallas de las herramientas no llevan publicidad.",
    keywords: ["publicidad", "adsense", "ads", "cookies", "banner"],
  },

  // --- Privacidad ---
  {
    id: "que-pasa-archivos",
    q: "¿Qué pasa con mis archivos después de usar una herramienta?",
    a: "Se borran automáticamente del servidor: una tarea se ejecuta cada hora y elimina todo lo que lleva más de una hora almacenado. Los usamos solo para generar tu resultado.",
    keywords: ["borrar", "eliminar", "borran", "guardan", "almacenan", "conservan", "privacidad", "datos"],
    link: { route: "/politica-de-privacidad", label: "Leer la política de privacidad" },
  },
  {
    id: "revisan",
    q: "¿Alguien revisa o comparte mis documentos?",
    a: "No. No revisamos el contenido de tus archivos ni los compartimos con terceros, salvo que la propia conversión lo requiera: Word a PDF, PDF a Word y Comprimir PDF usan un servicio externo (CloudConvert) que recibe el archivo solo para devolver el resultado.",
    keywords: ["privacidad", "ver", "leer", "terceros", "confidencial", "espiar"],
  },
  {
    id: "cloudconvert",
    q: "¿Qué es CloudConvert y por qué interviene en algunas conversiones?",
    a: "Es un servicio externo especializado en convertir documentos. Lo usamos para Word a PDF, PDF a Word y Comprimir PDF, porque da mejores resultados que hacerlo por nuestra cuenta. Recibe el archivo únicamente para devolver el resultado convertido.",
    keywords: ["externo", "tercero", "servicio", "proveedor", "api"],
  },
  {
    id: "borrar-antes",
    q: "¿Puedo pedir que se borre un archivo antes de que pase la hora?",
    a: "Sí. Escríbenos desde la página de Contacto indicando el nombre del archivo y la hora aproximada en que lo subiste.",
    keywords: ["eliminar", "quitar", "retirar", "borrado", "solicitar", "derechos"],
    link: { route: "/contacto", label: "Ir a Contacto" },
  },
  {
    id: "datos-personales",
    q: "¿Guardan mi correo, mi nombre u otros datos personales?",
    a: "No pedimos ni guardamos nombre, correo ni ningún dato personal para usar las herramientas, y no usamos analítica propia de seguimiento. Como en cualquier web, los proveedores de alojamiento pueden registrar datos técnicos de la conexión, como la dirección IP.",
    keywords: ["privacidad", "email", "ip", "cookies", "seguimiento", "rastrear"],
    link: { route: "/politica-de-privacidad", label: "Leer la política de privacidad" },
  },
  {
    id: "seguro-sensibles",
    q: "¿Es seguro subir documentos con datos personales, como un DNI o un contrato?",
    a: "Los archivos viajan por conexión segura (https) y se borran en poco tiempo, pero ninguna web online es adecuada para todo. Si el documento es muy confidencial, valora usar un programa instalado en tu equipo. En la guía de privacidad explicamos qué conviene revisar.",
    keywords: ["seguridad", "privacidad", "confidencial", "dni", "contrato", "medico", "proteger", "riesgo"],
    link: { route: "/guias/como-proteger-tu-privacidad-al-usar-convertidores-online", label: "Leer la guía de privacidad" },
  },

  // --- Comprimir ---
  {
    id: "nivel-compresion",
    q: "¿Qué nivel de compresión debo elegir?",
    a: "Empieza por Equilibrada, que sirve para casi todo. Usa Ligera si vas a imprimir el documento y quieres conservar la nitidez, y Máxima cuando solo importa que el archivo quepa en un límite estricto de tamaño.",
    keywords: ["comprimir", "ligera", "equilibrada", "maxima", "calidad", "reducir", "opciones"],
    link: { route: "/comprimir-pdf", label: "Abrir Comprimir PDF" },
  },
  {
    id: "no-reduce",
    q: "¿Por qué mi PDF casi no se reduce al comprimirlo?",
    a: "Lo que más pesa en un PDF son las imágenes. Si el archivo es sobre todo texto, o ya estaba optimizado, hay poco que reducir. Los escaneos y los documentos con fotos son los que más ahorran.",
    keywords: ["comprimir", "peso", "tamano", "no baja", "igual", "poco", "megas", "mb"],
  },
  {
    id: "calidad-compresion",
    q: "¿Se pierde calidad al comprimir un PDF?",
    a: "Depende del nivel. Con Ligera la diferencia suele ser imperceptible; con Máxima las imágenes pueden verse algo peor. El texto de un PDF normal no se degrada. Conserva siempre el original por si necesitas volver atrás.",
    keywords: ["comprimir", "borroso", "nitidez", "resolucion", "imagen", "perder"],
  },
  {
    id: "cuanto-reduce",
    q: "¿Cuánto puede reducirse el peso de un PDF?",
    a: "No hay una cifra única: depende del contenido. Como referencia orientativa, un escaneo o un documento con muchas fotos puede quedar en la mitad o menos, mientras que un PDF de solo texto apenas cambia. Al terminar, la página te muestra el ahorro real de tu archivo.",
    keywords: ["comprimir", "porcentaje", "ahorro", "megas", "kb", "mb", "reducir", "peso"],
  },
  {
    id: "nombre-comprimido",
    q: "¿Cambia el nombre del archivo al comprimirlo?",
    a: "No. El PDF comprimido se descarga con el mismo nombre con el que lo subiste.",
    keywords: ["comprimir", "renombrar", "llama", "nombre", "titulo"],
  },
  {
    id: "enviar-correo",
    q: "Mi PDF pesa demasiado para enviarlo por correo, ¿qué hago?",
    a: "Primero comprímelo con Comprimir PDF (nivel Equilibrada o Máxima). Si sigue siendo grande, divídelo en dos partes o compártelo con un enlace de almacenamiento en la nube en lugar de adjuntarlo. Muchos servicios de correo limitan los adjuntos a unos 20–25 MB.",
    keywords: ["adjunto", "email", "gmail", "outlook", "grande", "pesado", "limite", "enviar", "whatsapp"],
    link: { route: "/comprimir-pdf", label: "Abrir Comprimir PDF" },
  },

  // --- Unir ---
  {
    id: "orden-unir",
    q: "¿Cómo cambio el orden de los PDFs antes de unirlos?",
    a: "En la lista de archivos, cada PDF tiene flechas para subirlo o bajarlo y un botón para quitarlo. El PDF final respeta ese orden: primero todas las páginas del primer archivo, luego las del segundo, y así sucesivamente.",
    keywords: ["unir", "ordenar", "mover", "juntar", "combinar", "fusionar", "primero"],
    link: { route: "/unir-pdfs", label: "Abrir Unir PDFs" },
  },
  {
    id: "cuantos-unir",
    q: "¿Cuántos PDFs puedo unir a la vez?",
    a: "Necesitas al menos dos. Para documentos muy grandes o muchos archivos a la vez, el proceso tardará más; si falla, prueba a unirlos por grupos.",
    keywords: ["unir", "cantidad", "numero", "maximo", "varios", "muchos", "juntar"],
  },
  {
    id: "unir-contrasena",
    q: "¿Puedo unir un PDF protegido con contraseña?",
    a: "Un PDF protegido puede no poder leerse y hacer que la unión falle. Quítale la protección antes de subirlo.",
    keywords: ["unir", "clave", "password", "cifrado", "proteccion", "bloqueado", "permisos"],
  },
  {
    id: "calidad-unir",
    q: "¿Se pierde calidad al unir PDFs?",
    a: "No. Las páginas se copian tal cual al nuevo documento, sin recomprimirlas ni cambiar su tamaño. El peso del resultado es, aproximadamente, la suma de los archivos originales.",
    keywords: ["unir", "juntar", "combinar", "perder", "peso", "tamano"],
  },
  {
    id: "unir-word-imagen",
    q: "¿Puedo unir un documento de Word o una foto con un PDF?",
    a: "No directamente: Unir PDFs solo acepta PDFs. Convierte antes el documento con Word a PDF, o las fotos con Imágenes a PDF, y después únelos.",
    keywords: ["unir", "combinar", "mezclar", "docx", "jpg", "png", "formatos"],
  },

  // --- Word y PDF ---
  {
    id: "formato-word-pdf",
    q: "¿Se conserva el formato al convertir de Word a PDF?",
    a: "En general sí: márgenes, tablas, imágenes y estilos se mantienen. Con documentos muy complejos o fuentes poco habituales puede haber pequeñas diferencias, por eso conviene revisar el PDF antes de enviarlo.",
    keywords: ["word", "docx", "doc", "fuentes", "maquetacion", "diseno", "formato", "convertir"],
    link: { route: "/word-a-pdf", label: "Abrir Word a PDF" },
  },
  {
    id: "pdf-word-identico",
    q: "¿El Word que obtengo de un PDF queda idéntico al original?",
    a: "Suele ser muy parecido, pero no idéntico: el PDF guarda la posición del texto en la página, no párrafos ni estilos. Las maquetaciones con columnas, cuadros de texto o gráficos pueden necesitar retoques.",
    keywords: ["pdf a word", "docx", "editar", "editable", "convertir", "formato", "columnas", "tablas"],
    link: { route: "/pdf-a-word", label: "Abrir PDF a Word" },
  },
  {
    id: "editar-escaneado",
    q: "¿Puedo editar el texto de un PDF escaneado?",
    a: "Un escaneo contiene fotografías de las páginas, no texto. Por eso lo normal es que al convertirlo a Word las páginas se conserven como imágenes y no puedas editar el texto.",
    keywords: ["escaneo", "escaner", "escaneado", "ocr", "editar", "texto", "imagen", "foto"],
  },
  {
    id: "formatos-word",
    q: "¿Qué formatos de Word se aceptan?",
    a: "DOC y DOCX. Si trabajas con otro programa, como Google Docs o LibreOffice, descarga primero el documento como DOCX desde el menú Archivo y sube ese archivo.",
    keywords: ["word", "google docs", "libreoffice", "odt", "pages", "formatos", "extension", "compatible"],
  },
  {
    id: "word-gdocs",
    q: "¿Puedo convertir un documento de Google Docs a PDF?",
    a: "Sí, descargándolo antes como DOCX: en Google Docs, Archivo → Descargar → Microsoft Word. Después súbelo a Word a PDF. (Google Docs también permite descargar directamente como PDF desde ese mismo menú.)",
    keywords: ["google", "docs", "drive", "word", "docx", "descargar"],
  },

  // --- Imágenes ---
  {
    id: "formatos-imagen",
    q: "¿Qué formatos de imagen se aceptan para crear un PDF?",
    a: "JPG y PNG, que se pueden mezclar en el mismo PDF. Si tu celular guarda las fotos en HEIC, cambia el ajuste de la cámara a «más compatible» (en iPhone: Ajustes → Cámara → Formatos) o haz una captura de la foto.",
    keywords: ["imagenes", "foto", "jpeg", "heic", "iphone", "formatos", "extension", "webp"],
    link: { route: "/imagenes-a-pdf", label: "Abrir Imágenes a PDF" },
  },
  {
    id: "perspectiva",
    q: "¿Cómo corrijo la perspectiva de un documento fotografiado?",
    a: "Pulsa «Tomar foto ahora» en Imágenes a PDF, haz la foto y arrastra los cuatro puntos hasta las esquinas del documento. Al confirmar, la imagen se endereza. La corrección se aplica a las fotos tomadas con ese botón, no a las que subes desde la galería.",
    keywords: ["escanear", "escaner", "esquinas", "enderezar", "recortar", "camara", "celular", "torcido", "inclinado"],
    link: { route: "/imagenes-a-pdf", label: "Abrir Imágenes a PDF" },
  },
  {
    id: "orden-fotos",
    q: "¿En qué orden aparecen las fotos en el PDF?",
    a: "En el mismo orden en que aparecen en la lista, una imagen por página. Si te equivocaste, quita la imagen que sobre con el botón de su fila y añádela de nuevo.",
    keywords: ["imagenes", "paginas", "orden", "ordenar", "mover", "secuencia"],
  },
  {
    id: "pdf-fotos-pesa",
    q: "¿Por qué el PDF que hice con fotos pesa tanto?",
    a: "Cada imagen se convierte en una página con el tamaño de la propia imagen, sin reducirla, así que las fotos de cámara dan PDFs grandes. Pásalo después por Comprimir PDF: la mayoría de documentos siguen leyéndose perfectamente.",
    keywords: ["imagenes", "fotos", "peso", "megas", "grande", "pesado", "reducir", "comprimir"],
    link: { route: "/comprimir-pdf", label: "Abrir Comprimir PDF" },
  },
  {
    id: "limite-paginas",
    q: "¿Cuántas páginas puede tener un PDF para pasarlo a imágenes?",
    a: "Hasta 30. Si tu PDF tiene más, la herramienta te lo indicará y tendrás que dividirlo antes en partes.",
    keywords: ["limite", "maximo", "paginas", "pdf a imagenes", "muchas", "largo", "hojas"],
    link: { route: "/pdf-a-imagenes", label: "Abrir PDF a imágenes" },
  },
  {
    id: "formato-salida-imagenes",
    q: "¿En qué formato salen las imágenes de un PDF? ¿Puedo obtener JPG?",
    a: "Salen en PNG, que mantiene nítidos el texto y las líneas. Si necesitas JPG (más ligero), convierte después las imágenes con cualquier editor de imágenes.",
    keywords: ["png", "jpg", "jpeg", "pdf a imagenes", "formato", "calidad", "descargar"],
  },
  {
    id: "una-pagina",
    q: "¿Puedo sacar solo una página de un PDF?",
    a: "Con PDF a imágenes conviertes todas las páginas y puedes descargar solo la que necesites, ya sea como imagen suelta o descargándolas todas. La página resultante es una imagen PNG, no un PDF.",
    keywords: ["extraer", "separar", "dividir", "cortar", "una", "pagina", "partir"],
    link: { route: "/pdf-a-imagenes", label: "Abrir PDF a imágenes" },
  },

  // --- Límites y problemas ---
  {
    id: "limite-diario",
    q: "¿Qué significa el aviso de «límite diario alcanzado»?",
    a: "Word a PDF, PDF a Word y Comprimir PDF usan un servicio externo que permite un número limitado de conversiones al día. Si se alcanza, la página te lo indica y puedes volver a intentarlo al día siguiente. Las demás herramientas no dependen de ese servicio.",
    keywords: ["limite", "cuota", "diario", "maximo", "creditos", "error", "no funciona", "mañana"],
  },
  {
    id: "error-generico",
    q: "Me aparece un error al convertir, ¿qué hago?",
    a: "Prueba, por orden: comprobar que el archivo tiene el formato correcto y se abre bien en tu equipo, recargar la página y repetirlo, y probar con un archivo más pequeño. Si el aviso persiste, escríbenos desde Contacto contando la herramienta y el texto del error.",
    keywords: ["error", "falla", "fallo", "problema", "no funciona", "no se puede", "roto", "ayuda", "soporte"],
    link: { route: "/contacto", label: "Ir a Contacto" },
  },
  {
    id: "tarda",
    q: "La conversión se queda cargando mucho tiempo",
    a: "Los archivos grandes o con muchas imágenes tardan más, sobre todo en las conversiones que usan el servicio externo. Si pasan varios minutos sin avance, recarga la página y vuelve a intentarlo; si pasa siempre con el mismo archivo, cuéntanoslo desde Contacto.",
    keywords: ["lento", "tarda", "demora", "atascado", "cargando", "colgado", "espera", "bloqueado", "progreso"],
  },
  {
    id: "descarga-no-empieza",
    q: "El botón de descargar no hace nada, ¿qué puedo hacer?",
    a: "Comprueba que tu navegador no esté bloqueando las descargas (suele avisarlo junto a la barra de direcciones) y vuelve a pulsar el botón. Si no funciona, recarga la página y repite la conversión.",
    keywords: ["descargar", "descarga", "bajar", "guardar", "bloqueo", "no baja", "archivo", "resultado"],
  },
  {
    id: "contacto",
    q: "¿Cómo puedo contactar con vosotros?",
    a: "Desde la página de Contacto, por correo. Ayuda mucho que cuentes qué herramienta usaste, qué esperabas que pasara y qué ocurrió exactamente.",
    keywords: ["correo", "email", "escribir", "soporte", "sugerencia", "mensaje", "ayuda", "reportar"],
    link: { route: "/contacto", label: "Ir a Contacto" },
  },
  {
    id: "sugerir",
    q: "¿Puedo sugerir una herramienta nueva o una mejora?",
    a: "Sí, escríbenos desde Contacto. Las ideas que más se repiten son las primeras que se estudian.",
    keywords: ["sugerencia", "propuesta", "idea", "nueva", "mejora", "pedir", "falta", "añadir", "agregar"],
    link: { route: "/contacto", label: "Ir a Contacto" },
  },
];
