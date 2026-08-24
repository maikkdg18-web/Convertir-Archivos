import type { Metadata } from "next";
import { SingleFileConverter } from "../../components/SingleFileConverter";

export const metadata: Metadata = {
  title: "Word a PDF gratis — convierte DOC y DOCX a PDF",
  description:
    "Convierte tus documentos Word (DOC/DOCX) a PDF conservando el formato, gratis y sin instalar nada.",
  alternates: { canonical: "/word-a-pdf" },
};

export default function WordAPdfPage() {
  return (
    <SingleFileConverter
      title="Word a PDF"
      description="Convierte documentos DOC y DOCX a PDF conservando su formato para compartirlos fácilmente."
      sheet="05"
      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      acceptedTypes={["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
      functionName="convert-word-to-pdf"
      outputName="documento-convertido.pdf"
      buttonLabel="convertir a pdf →"
      processingLabel="convirtiendo a pdf…"
      usageNote="Plan gratuito: hasta 10 conversiones diarias. Los archivos deben pesar menos de 1 GB."
    />
  );
}
