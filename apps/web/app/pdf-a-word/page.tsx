import type { Metadata } from "next";
import { SingleFileConverter } from "../../components/SingleFileConverter";

export const metadata: Metadata = {
  title: "PDF a Word gratis — convierte PDF a DOCX editable",
  description:
    "Convierte tu PDF a un documento Word (DOCX) editable en segundos, gratis y sin instalar nada.",
  alternates: { canonical: "/pdf-a-word" },
};

export default function PdfAWordPage() {
  return (
    <SingleFileConverter
      title="PDF a Word"
      description="Convierte un PDF a un documento DOCX editable para continuar trabajando con su contenido."
      sheet="06"
      accept="application/pdf"
      acceptedTypes={["application/pdf"]}
      functionName="convert-pdf-to-word"
      outputName="documento-editable.docx"
      buttonLabel="convertir a word →"
      processingLabel="convirtiendo a word…"
      usageNote="Plan gratuito: hasta 10 conversiones diarias. Los archivos deben pesar menos de 1 GB."
    />
  );
}
