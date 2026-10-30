import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "../../components/BackLink";
import { GUIDES, formatGuideDate } from "../../lib/guides";

export const metadata: Metadata = {
  title: "Guías sobre PDF, Word e imágenes",
  description:
    "Guías prácticas para reducir el peso de un PDF, unir documentos, pasar de PDF a Word y de Word a PDF, escanear con el celular y proteger tu privacidad.",
  alternates: { canonical: "/guias" },
};

export default function GuiasPage() {
  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Guías</h1>
          <p className="sheet-desc">
            Explicaciones claras para resolver las tareas más habituales con PDFs, documentos de
            Word e imágenes.
          </p>
        </div>
      </div>

      <ul className="guide-list">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guias/${guide.slug}`} className="guide-card">
              <span className="guide-card-meta">
                {formatGuideDate(guide.published)} · {guide.readingMinutes} min de lectura
              </span>
              <span className="guide-card-title">{guide.title}</span>
              <span className="guide-card-desc">{guide.description}</span>
              <span className="guide-card-action">
                Leer guía <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
