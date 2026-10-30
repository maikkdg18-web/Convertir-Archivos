// Texto de ayuda que se muestra debajo de cada herramienta. Describe lo que la herramienta
// hace de verdad; si cambia su comportamiento, actualiza también este texto.

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolGuideContent {
  /** Ruta de la herramienta, sin barra inicial (p. ej. "comprimir-pdf"). */
  slug: string;
  name: string;
  intro: string[];
  steps: string[];
  tips: string[];
  faq: FaqItem[];
  /** Slugs de guías relacionadas. */
  guides: string[];
}

const PRIVACY_FAQ: FaqItem = {
  q: "¿Qué pasa con mis archivos después de usar la herramienta?",
  a: "Se borran automáticamente del servidor: una tarea se ejecuta cada hora y elimina lo que lleva más de una hora almacenado. No hace falta crear una cuenta ni dar datos personales. Puedes leer los detalles en la política de privacidad.",
};

export const TOOL_GUIDES: ToolGuideContent[] = [
  {
    slug: "unir-pdfs",
    name: "Unir PDFs",
    intro: [
      "Unir PDFs combina varios archivos PDF en uno solo. Es lo que necesitas cuando tienes un documento repartido en partes —una portada, un informe y sus anexos, o las facturas de un mes— y quieres entregarlo o archivarlo como un único archivo.",
      "Tú decides el orden: cada archivo de la lista se puede subir o bajar, y el PDF final contiene las páginas del primero, luego las del segundo, y así hasta el último, sin modificarlas.",
    ],
    steps: [
      "Sube dos o más PDFs arrastrándolos a la zona de carga o pulsando para elegirlos.",
      "Ordénalos con las flechas de cada fila y quita los que no quieras incluir.",
      "Pulsa «Unir PDFs» y espera a que termine el proceso.",
      "Descarga el PDF resultante y revisa que las páginas estén en el orden que querías.",
    ],
    tips: [
      "Ponle números a los nombres de los archivos (01, 02, 03…) para ordenarlos más rápido.",
      "Si un PDF está protegido con contraseña, quítale la protección antes de subirlo.",
      "Si el resultado pesa demasiado, pásalo después por Comprimir PDF.",
    ],
    faq: [
      {
        q: "¿Cuántos PDFs puedo unir?",
        a: "Necesitas al menos dos. Para documentos muy grandes o muchos archivos a la vez, el proceso tardará más; si falla, prueba a unirlos por grupos.",
      },
      {
        q: "¿Se pierde calidad al unir?",
        a: "No. Las páginas se copian tal cual al nuevo documento, sin recomprimirlas ni cambiar su tamaño.",
      },
      {
        q: "¿Puedo unir un Word o una imagen con un PDF?",
        a: "No directamente: esta herramienta solo acepta PDFs. Convierte antes el documento de Word con Word a PDF, o las fotos con Imágenes a PDF, y después únelos.",
      },
      PRIVACY_FAQ,
    ],
    guides: ["como-unir-pdfs-en-un-solo-archivo"],
  },
  {
    slug: "comprimir-pdf",
    name: "Comprimir PDF",
    intro: [
      "Comprimir PDF reduce el peso del archivo recomprimiendo sus imágenes y eliminando datos que no hacen falta. Es útil cuando un documento no cabe en un correo, un portal de trámites te pide un tamaño máximo o simplemente quieres ocupar menos espacio.",
      "Puedes elegir cuánto comprimir: la compresión ligera conserva al máximo la calidad, la equilibrada es el punto medio recomendado para casi todo, y la máxima busca el archivo más pequeño aunque las imágenes pierdan algo de calidad.",
    ],
    steps: [
      "Sube tu PDF arrastrándolo a la zona de carga o pulsando para elegirlo.",
      "Elige el nivel de compresión: Ligera, Equilibrada o Máxima.",
      "Pulsa «Comprimir PDF». Al terminar verás el peso original, el nuevo y el porcentaje ahorrado.",
      "Descarga el archivo: conserva el mismo nombre con el que lo subiste.",
    ],
    tips: [
      "Empieza por Equilibrada. Si el archivo sigue siendo demasiado grande, prueba con Máxima.",
      "Si vas a imprimir el documento, usa Ligera para no perder nitidez.",
      "Conserva siempre el original: la compresión puede reducir la calidad de las imágenes y no se puede deshacer.",
    ],
    faq: [
      {
        q: "¿Se pierde calidad al comprimir?",
        a: "Depende del nivel. Con Ligera, la diferencia suele ser imperceptible; con Máxima, las imágenes pueden verse algo peor. El texto de un PDF normal no se degrada.",
      },
      {
        q: "¿Por qué mi PDF casi no ha cambiado de tamaño?",
        a: "Lo que más pesa en un PDF son las imágenes. Si el archivo es sobre todo texto, o ya estaba optimizado, hay poco que reducir. Los escaneos y los documentos con fotos son los que más ahorran.",
      },
      {
        q: "¿Cambia el nombre del archivo?",
        a: "No. El PDF comprimido se descarga con el mismo nombre con el que lo subiste.",
      },
      {
        q: "¿Hay límite de uso?",
        a: "La compresión se realiza con un servicio externo que tiene un límite diario de conversiones. Si se alcanza, la página te avisa y puedes volver a intentarlo al día siguiente.",
      },
      PRIVACY_FAQ,
    ],
    guides: ["como-reducir-el-peso-de-un-pdf"],
  },
  {
    slug: "pdf-a-imagenes",
    name: "PDF a imágenes",
    intro: [
      "PDF a imágenes convierte cada página de un PDF en una imagen PNG. Sirve para insertar una página en una presentación, compartir solo una parte de un documento, publicar una página como imagen o subirla a un formulario que no acepta PDF.",
      "Las imágenes se generan al doble del tamaño base de la página, lo que da un buen equilibrio entre nitidez y peso. Puedes descargar una página suelta o todas a la vez.",
    ],
    steps: [
      "Sube el PDF que quieres convertir.",
      "Pulsa «Convertir a imágenes» y espera mientras se procesan las páginas.",
      "Revisa la vista previa y descarga la página que necesites, o pulsa «Descargar todas».",
    ],
    tips: [
      "El límite es de 30 páginas por PDF. Si el tuyo es más largo, divídelo antes en partes.",
      "Si lo que quieres es editar el texto del PDF, usa PDF a Word en lugar de convertirlo a imágenes.",
      "Las imágenes PNG pesan más que un JPG; si necesitas algo más ligero, conviértelas a JPG con un editor de imágenes.",
    ],
    faq: [
      {
        q: "¿En qué formato se descargan las imágenes?",
        a: "En PNG, que conserva los bordes del texto y de las líneas perfectamente nítidos.",
      },
      {
        q: "¿Cuántas páginas puede tener el PDF?",
        a: "Hasta 30. Si tiene más, la herramienta te lo indicará y tendrás que dividirlo antes.",
      },
      {
        q: "¿Se puede extraer el texto de las imágenes?",
        a: "No. El resultado son imágenes, no texto. Para obtener el texto editable, usa PDF a Word.",
      },
      PRIVACY_FAQ,
    ],
    guides: ["como-convertir-un-pdf-en-imagenes", "pdf-jpg-o-png-que-formato-usar"],
  },
  {
    slug: "imagenes-a-pdf",
    name: "Imágenes a PDF",
    intro: [
      "Imágenes a PDF junta una o varias imágenes JPG o PNG en un único documento PDF, con una imagen por página. Es la forma más rápida de convertir las fotos de un documento, unos apuntes o varios justificantes en un archivo fácil de enviar.",
      "Si usas «Tomar foto ahora», puedes corregir la perspectiva: arrastras cuatro puntos hasta las esquinas del documento y la imagen se endereza antes de añadirse al PDF, como si la hubieras escaneado.",
    ],
    steps: [
      "Sube imágenes JPG o PNG desde tu dispositivo, o pulsa «Tomar foto ahora» para fotografiar un documento.",
      "Si hiciste la foto en el momento, arrastra los puntos hasta las cuatro esquinas del documento y confirma.",
      "Revisa la lista: las páginas saldrán en ese orden. Quita las imágenes que sobren.",
      "Pulsa «Convertir a PDF» y descarga el documento.",
    ],
    tips: [
      "Haz las fotos con buena luz y con el documento plano, para que el texto salga legible.",
      "Solo se admiten JPG y PNG. Si tu celular guarda las fotos en HEIC, cambia el ajuste de la cámara a «más compatible».",
      "Cada página tiene el tamaño de su imagen; si el PDF pesa demasiado, pásalo por Comprimir PDF.",
    ],
    faq: [
      {
        q: "¿Puedo mezclar JPG y PNG en el mismo PDF?",
        a: "Sí. Puedes añadir imágenes de los dos formatos y se combinan en un único documento.",
      },
      {
        q: "¿La corrección de perspectiva funciona con cualquier imagen?",
        a: "Se aplica a las fotos tomadas con «Tomar foto ahora». Las imágenes que subes desde tu galería se añaden tal cual.",
      },
      {
        q: "¿En qué orden aparecen las páginas?",
        a: "En el mismo orden en que aparecen en la lista. Si te equivocaste, quita la imagen que sobre y añádela de nuevo.",
      },
      PRIVACY_FAQ,
    ],
    guides: [
      "como-escanear-documentos-con-el-celular-y-guardarlos-en-pdf",
      "pdf-jpg-o-png-que-formato-usar",
    ],
  },
  {
    slug: "word-a-pdf",
    name: "Word a PDF",
    intro: [
      "Word a PDF convierte documentos DOC y DOCX en archivos PDF. El PDF fija el diseño del documento, de modo que se ve igual en cualquier dispositivo y no depende de que quien lo reciba tenga Word o tus mismas fuentes.",
      "Es el formato habitual para currículums, contratos, facturas y trabajos que se envían o se imprimen. La conversión se realiza con un servicio externo especializado.",
    ],
    steps: [
      "Sube tu documento en formato DOC o DOCX.",
      "Pulsa «Convertir a PDF» y espera unos segundos.",
      "Descarga el PDF y ábrelo para comprobarlo antes de enviarlo.",
    ],
    tips: [
      "Antes de convertir, acepta o rechaza los cambios registrados y borra los comentarios que no deban verse.",
      "Actualiza los índices y las referencias para que los números de página sean correctos.",
      "Si usas fuentes poco comunes, comprueba el resultado: podrían sustituirse y mover el texto.",
    ],
    faq: [
      {
        q: "¿Se conserva el formato del documento?",
        a: "En general, sí: márgenes, tablas, imágenes y estilos se mantienen. Con documentos muy complejos o fuentes poco habituales puede haber pequeñas diferencias, por eso conviene revisar el PDF.",
      },
      {
        q: "¿Puedo convertir un documento de Google Docs o LibreOffice?",
        a: "Sí, descargándolo antes como DOCX desde el menú Archivo y subiendo ese archivo.",
      },
      {
        q: "¿Hay límite de uso?",
        a: "La conversión se realiza con un servicio externo que tiene un límite diario de conversiones y de tamaño de archivo. Si se alcanza, la página te lo indicará.",
      },
      PRIVACY_FAQ,
    ],
    guides: ["como-convertir-word-a-pdf-sin-perder-formato"],
  },
  {
    slug: "pdf-a-word",
    name: "PDF a Word",
    intro: [
      "PDF a Word convierte un PDF en un documento DOCX que puedes editar. Es la solución cuando solo conservas la versión en PDF de un documento y necesitas corregir un párrafo, actualizar una tabla o reutilizar su texto.",
      "La conversión reconstruye el documento a partir del contenido del PDF, así que el resultado suele ser muy parecido al original pero rara vez idéntico. Merece la pena revisarlo antes de editar.",
    ],
    steps: [
      "Sube el PDF que quieres convertir.",
      "Pulsa «Convertir a Word» y espera mientras se procesa; los documentos largos tardan algo más.",
      "Descarga el archivo DOCX y ábrelo en Word, LibreOffice o Google Docs.",
      "Revisa títulos, tablas y saltos de página antes de empezar a editar.",
    ],
    tips: [
      "Funciona mejor con PDFs creados desde un procesador de texto, donde el texto es texto real.",
      "Un PDF escaneado es una imagen: lo normal es que el resultado no tenga texto editable.",
      "Si tienes el documento original en Word, úsalo: siempre será mejor que convertir un PDF.",
    ],
    faq: [
      {
        q: "¿El resultado queda idéntico al PDF?",
        a: "Suele ser muy parecido, pero no idéntico. Las maquetaciones con varias columnas, cuadros de texto o gráficos pueden necesitar retoques.",
      },
      {
        q: "¿Puedo convertir un PDF escaneado?",
        a: "Un escaneo contiene imágenes de las páginas, no texto. En ese caso lo normal es que las páginas se conserven como imágenes y no puedas editar el texto.",
      },
      {
        q: "¿Hay límite de uso?",
        a: "La conversión se realiza con un servicio externo que tiene un límite diario de conversiones y de tamaño de archivo. Si se alcanza, la página te lo indicará.",
      },
      PRIVACY_FAQ,
    ],
    guides: ["como-pasar-un-pdf-a-word-y-editarlo"],
  },
];

export function getToolGuide(slug: string): ToolGuideContent | undefined {
  return TOOL_GUIDES.find((tool) => tool.slug === slug);
}
