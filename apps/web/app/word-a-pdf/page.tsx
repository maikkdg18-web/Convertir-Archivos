import { SingleFileConverter } from "../../components/SingleFileConverter";

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
    />
  );
}
