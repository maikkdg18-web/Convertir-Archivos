import type { CSSProperties } from "react";
import Link from "next/link";
import { FaqExplorer } from "../components/FaqExplorer";
import { GUIDES } from "../lib/guides";
import { FAQ_BANK } from "../lib/faq-bank";
import { LightGrid } from "../components/LightGrid";
import { Combine, Download, FileImage, FileText, FileType, Image as ImageIcon, Minimize2, ShieldCheck, Zap } from "lucide-react";

const TOOLS = [
  {
    icon: Combine,
    tag: "PDF + PDF → PDF",
    name: "Unir PDFs",
    route: "/unir-pdfs",
  },
  {
    icon: Minimize2,
    tag: "PDF → PDF",
    name: "Comprimir PDF",
    route: "/comprimir-pdf",
  },
  {
    icon: ImageIcon,
    tag: "PDF → PNG",
    name: "PDF a imágenes",
    route: "/pdf-a-imagenes",
  },
  {
    icon: FileImage,
    tag: "PNG/JPG → PDF",
    name: "Imágenes a PDF",
    route: "/imagenes-a-pdf",
  },
  {
    icon: FileText,
    tag: "DOC/DOCX → PDF",
    name: "Word a PDF",
    route: "/word-a-pdf",
  },
  {
    icon: FileType,
    tag: "PDF → DOCX",
    name: "PDF a Word",
    route: "/pdf-a-word",
  },
];

const STEPS = [
  {
    title: "Elige la herramienta",
    text: "Unir, comprimir o convertir: selecciona la acción que necesitas entre las seis disponibles.",
  },
  {
    title: "Sube tu archivo",
    text: "Arrástralo o pulsa para elegirlo. No hace falta crear una cuenta ni instalar nada.",
  },
  {
    title: "Descarga el resultado",
    text: "Cuando termina, descargas el archivo listo. Lo subido se borra automáticamente del servidor.",
  },
];

const FEATURED_GUIDES = GUIDES.slice(0, 4);

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Conversor de archivos · simple y rápido</span>
          <h1>Transforma tus archivos en un par de clics.</h1>
          <p>
            Une, comprime y convierte PDFs e imágenes desde un solo lugar.
            Sin instalaciones y con resultados listos para descargar.
          </p>
          <Link href="#herramientas" className="landing-button">
            Explorar herramientas <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="hero-art" aria-label="Vista previa de un archivo convertido">
          <div className="hero-ring hero-ring-back" />
          <div className="hero-ring hero-ring-front" />
          <div className="file-preview file-preview-back">
            <span className="file-corner" />
            <span className="file-line file-line-short" />
            <span className="file-line" />
          </div>
          <div className="file-preview file-preview-main">
            <span className="file-corner" />
            <img src="/icon.png" alt="" />
            <span className="preview-label">archivo listo</span>
            <span className="file-line file-line-short" />
            <span className="file-line" />
          </div>
          <span className="floating-chip chip-top">PDF → JPG</span>
          <span className="floating-chip chip-bottom">✓ 100% listo</span>
        </div>
      </section>

      <div className="trust-strip">
        <span>Todo lo que necesitas para tus documentos</span>
        <span>Rápido · claro · sin marcas de agua</span>
      </div>

      <section className="landing-section" id="herramientas">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Tu caja de herramientas</span>
            <h2>Elige una acción y empieza.</h2>
          </div>
          <p>Seis herramientas para resolver el trabajo cotidiano con tus archivos.</p>
        </div>

        <LightGrid className="landing-tool-grid">
          {TOOLS.map((tool, index) => (
            <Link
              key={tool.route}
              href={tool.route}
              className="landing-tool"
              style={{ "--i": index } as CSSProperties}
            >
              <span className="tool-number">0{index + 1}</span>
              <span className="tool-symbol" aria-hidden="true"><tool.icon size={22} /></span>
              <span className="tool-card-tag">{tool.tag}</span>
              <span className="tool-card-name">{tool.name}</span>
              <span className="landing-tool-action">Abrir herramienta <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </LightGrid>
      </section>

      <section className="benefits-band">
        <div className="benefits-intro">
          <span className="eyebrow">Hecho para avanzar</span>
          <h2>Menos pasos.<br />Más resultados.</h2>
        </div>
        <div className="benefit-list">
          <div className="benefit-item"><span aria-hidden="true"><Download size={18} /></span><div><strong>Sin instalaciones</strong><p>Trabaja directamente desde tu navegador.</p></div></div>
          <div className="benefit-item"><span aria-hidden="true"><Zap size={18} /></span><div><strong>Flujo sencillo</strong><p>Sube tus archivos y descarga el resultado.</p></div></div>
          <div className="benefit-item"><span aria-hidden="true"><ShieldCheck size={18} /></span><div><strong>Resultados limpios</strong><p>Tus documentos salen sin marcas de agua.</p></div></div>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="como-funciona">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Cómo funciona</span>
            <h2 id="como-funciona">Tres pasos, sin complicaciones.</h2>
          </div>
          <p>
            Cada herramienta sigue el mismo flujo, así que aprendes una vez y sirve para todas.
            Los archivos se usan solo para generar tu resultado y se eliminan después.
          </p>
        </div>

        <ol className="steps-grid">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step-card">
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-section" aria-labelledby="guias-destacadas">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Guías</span>
            <h2 id="guias-destacadas">Aprende a sacarles partido a tus documentos.</h2>
          </div>
          <Link href="/guias" className="section-link">
            Ver todas las guías <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="guide-list guide-list-wide">
          {FEATURED_GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guias/${guide.slug}`} className="guide-card">
                <span className="guide-card-title">{guide.title}</span>
                <span className="guide-card-desc">{guide.description}</span>
                <span className="guide-card-action">
                  Leer guía <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-section" aria-labelledby="preguntas-frecuentes">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 id="preguntas-frecuentes">Lo que suele preguntarse.</h2>
          </div>
          <p>
            Un grupo distinto de preguntas en cada visita. Si buscas algo concreto, escribe una
            palabra clave y las encontramos todas.
          </p>
        </div>

        <FaqExplorer items={FAQ_BANK} limit={6} rotate showAllLink />
      </section>
    </main>
  );
}
