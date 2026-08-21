import { SingleFileConverter } from "../../components/SingleFileConverter";

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
