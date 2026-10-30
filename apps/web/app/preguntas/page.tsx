import type { Metadata } from "next";
import { BackLink } from "../../components/BackLink";
import { FaqExplorer } from "../../components/FaqExplorer";
import { FAQ_BANK } from "../../lib/faq-bank";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las dudas más habituales sobre unir, comprimir y convertir PDFs, Word e imágenes, sobre privacidad y sobre los límites de uso. Con buscador por palabras clave.",
  alternates: { canonical: "/preguntas" },
};

export default function PreguntasPage() {
  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Preguntas frecuentes</h1>
          <p className="sheet-desc">
            Escribe una palabra clave para encontrar la respuesta, o recorre la lista completa.
          </p>
        </div>
      </div>

      <FaqExplorer items={FAQ_BANK} />
    </main>
  );
}
