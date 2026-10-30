import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "../../components/BackLink";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Qué es Conversor de Archivos, cómo funciona, qué hace con tus archivos y por qué es gratis.",
  alternates: { canonical: "/acerca-de" },
};

const TOOLS = [
  { route: "/unir-pdfs", name: "Unir PDFs", text: "combina varios PDFs en uno solo, en el orden que elijas." },
  { route: "/comprimir-pdf", name: "Comprimir PDF", text: "reduce el peso de un PDF con tres niveles de compresión." },
  { route: "/pdf-a-imagenes", name: "PDF a imágenes", text: "convierte cada página de un PDF en una imagen PNG." },
  {
    route: "/imagenes-a-pdf",
    name: "Imágenes a PDF",
    text: "junta fotos JPG o PNG en un PDF, con corrección de perspectiva para documentos fotografiados.",
  },
  { route: "/word-a-pdf", name: "Word a PDF", text: "convierte documentos DOC y DOCX a PDF." },
  { route: "/pdf-a-word", name: "PDF a Word", text: "convierte un PDF en un documento DOCX editable." },
];

export default function AcercaDePage() {
  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Acerca de</h1>
          <p className="sheet-desc">Qué es este sitio, cómo funciona y por qué es gratis.</p>
        </div>
      </div>

      <div className="static-card">
        <section>
          <h2>Qué es Conversor de Archivos</h2>
          <p>
            <strong>Conversor de Archivos</strong> es una herramienta web gratuita para unir,
            comprimir y convertir PDFs e imágenes sin tener que instalar ningún programa. Nació de
            una necesidad simple: resolver tareas cotidianas con documentos (unir dos PDFs, achicar
            uno demasiado pesado, pasar una foto tomada con el celular a PDF) sin depender de
            programas de escritorio ni de servicios que cobran por cada archivo.
          </p>
          <p>
            La idea es que cada herramienta haga una sola cosa y la haga con pocos pasos: eliges la
            herramienta, subes el archivo y descargas el resultado, sin registrarte.
          </p>
        </section>

        <section>
          <h2>Las herramientas</h2>
          <ul>
            {TOOLS.map((tool) => (
              <li key={tool.route}>
                <Link href={tool.route}>{tool.name}</Link>: {tool.text}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Cómo funciona por dentro</h2>
          <p>
            Cuando subes un archivo, se guarda de forma temporal en el almacenamiento del sitio y
            se procesa para generar el resultado. Unir PDFs, Imágenes a PDF y PDF a imágenes se
            procesan en el propio servidor del sitio. Word a PDF, PDF a Word y Comprimir PDF usan
            un servicio externo especializado (CloudConvert), que recibe el archivo únicamente para
            devolver el resultado convertido.
          </p>
        </section>

        <section>
          <h2>Qué hacemos con tus archivos</h2>
          <p>
            Los archivos que subes y los resultados que se generan se usan solo para darte el
            servicio. No los revisamos ni los compartimos con otros fines. Se eliminan
            automáticamente: una tarea se ejecuta cada hora y borra todo lo que lleva más de una
            hora almacenado. El detalle completo está en la{" "}
            <Link href="/politica-de-privacidad">Política de Privacidad</Link>.
          </p>
        </section>

        <section>
          <h2>Por qué es gratis</h2>
          <p>
            El proyecto se sostiene con publicidad (Google AdSense) para poder mantenerlo gratuito.
            Los anuncios se muestran en la portada y en las guías, no en las pantallas donde subes
            y conviertes tus archivos.
          </p>
        </section>

        <section>
          <h2>Límites que conviene conocer</h2>
          <ul>
            <li>PDF a imágenes procesa hasta 30 páginas por archivo.</li>
            <li>
              Las herramientas que usan el servicio externo (Word a PDF, PDF a Word y Comprimir PDF)
              tienen un límite diario de conversiones. Si se alcanza, la página te avisa y puedes
              volver a intentarlo al día siguiente.
            </li>
            <li>
              Imágenes a PDF admite imágenes JPG y PNG. La corrección de perspectiva se aplica a
              las fotos tomadas desde la propia herramienta.
            </li>
          </ul>
        </section>

        <section>
          <h2>Guías y ayuda</h2>
          <p>
            Si quieres aprender a sacar más partido a tus documentos, en la sección de{" "}
            <Link href="/guias">Guías</Link> encontrarás explicaciones paso a paso. Y si tienes
            dudas, sugerencias o encontraste un error, puedes escribirnos desde la página de{" "}
            <Link href="/contacto">Contacto</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
