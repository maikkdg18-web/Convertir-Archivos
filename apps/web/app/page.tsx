import Link from "next/link";

const TOOLS = [
  {
    sheet: "01",
    tag: "PDF + PDF → PDF",
    name: "Unir PDFs",
    route: "/unir-pdfs",
  },
  {
    sheet: "02",
    tag: "PDF → PDF",
    name: "Comprimir PDF",
    route: "/comprimir-pdf",
  },
  {
    sheet: "03",
    tag: "PDF → PNG",
    name: "PDF a imágenes",
    route: "/pdf-a-imagenes",
  },
  {
    sheet: "04",
    tag: "PNG/JPG → PDF",
    name: "Imágenes a PDF",
    route: "/imagenes-a-pdf",
  },
  {
    sheet: "05",
    tag: "DOC/DOCX → PDF",
    name: "Word a PDF",
    route: "/word-a-pdf",
  },
  {
    sheet: "06",
    tag: "PDF → DOCX",
    name: "PDF a Word",
    route: "/pdf-a-word",
  },
];

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
        <span className="trust-dots" aria-hidden="true">✦ · ✦ · ✦</span>
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

        <div className="landing-tool-grid">
          {TOOLS.map((tool, index) => (
            <Link key={tool.route} href={tool.route} className={`landing-tool tool-tone-${index + 1}`}>
              <span className="tool-number">0{index + 1}</span>
              <span className="tool-symbol" aria-hidden="true">↗</span>
              <span className="tool-card-tag">{tool.tag}</span>
              <span className="tool-card-name">{tool.name}</span>
              <span className="landing-tool-action">Abrir herramienta <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits-band">
        <div className="benefits-intro">
          <span className="eyebrow">Hecho para avanzar</span>
          <h2>Menos pasos.<br />Más resultados.</h2>
        </div>
        <div className="benefit-list">
          <div className="benefit-item"><span>✦</span><div><strong>Sin instalaciones</strong><p>Trabaja directamente desde tu navegador.</p></div></div>
          <div className="benefit-item"><span>↗</span><div><strong>Flujo sencillo</strong><p>Sube tus archivos y descarga el resultado.</p></div></div>
          <div className="benefit-item"><span>✓</span><div><strong>Resultados limpios</strong><p>Tus documentos salen sin marcas de agua.</p></div></div>
        </div>
      </section>
    </main>
  );
}
