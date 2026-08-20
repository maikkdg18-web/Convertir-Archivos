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
];

export default function HomePage() {
  return (
    <main className="page">
      <div style={{ paddingTop: 48 }}>
        <span className="eyebrow">Set de herramientas · 4 hojas</span>
        <h1 className="sheet-title" style={{ fontSize: 34, marginTop: 10 }}>
          Convierte y ajusta tus documentos
        </h1>
        <p className="muted" style={{ marginTop: 10, maxWidth: "48ch" }}>
          Cada herramienta corre en el navegador y en la nube — sin instalar nada,
          sin marcas de agua. Elige una hoja para empezar.
        </p>
      </div>

      <div className="tool-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.route} href={tool.route} className="tool-card">
            <span className="tool-card-tag">
              HOJA {tool.sheet} · {tool.tag}
            </span>
            <span className="tool-card-name">{tool.name}</span>
            <span className="tool-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
