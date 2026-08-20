"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function UnirPdfsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function handleFilesSelected(newFiles: File[]) {
    const onlyPdfs = newFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...onlyPdfs]);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleMerge() {
    if (files.length < 2) {
      setErrorMsg("Necesitas al menos 2 PDFs para unir.");
      return;
    }

    setStatus("uploading");
    setErrorMsg(null);

    try {
      const fileUrls: string[] = [];

      for (const file of files) {
        const safeName = sanitizeFileName(file.name);
        const path = `uploads/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("conversions")
          .upload(path, file, { contentType: "application/pdf" });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("conversions")
          .getPublicUrl(path);

        fileUrls.push(publicUrlData.publicUrl);
      }

      setStatus("processing");

      const { data, error: fnError } = await supabase.functions.invoke(
        "convert-merge",
        { body: { fileUrls } }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error ?? "Error al unir los PDFs");

      setResultUrl(data.outputUrl);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  async function handleDownload() {
    if (!resultUrl) return;
    setIsDownloading(true);
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "documento-unido.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setErrorMsg("No se pudo descargar el archivo. Intenta de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main className="page">
      <a href="/" className="back-link">← volver al set</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Unir PDFs</h1>
          <p className="sheet-desc">
            Sube 2 o más PDFs y los unimos en uno solo, en el orden en que los agregues.
          </p>
        </div>
        <span className="sheet-number">HOJA 01</span>
      </div>

      <FileDropzone accept="application/pdf" onFilesSelected={handleFilesSelected} />

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, i) => (
            <li key={i} className="file-row">
              <span className="file-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="file-name">{file.name}</span>
              <button onClick={() => removeFile(i)} className="file-remove">
                quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleMerge}
          disabled={status === "uploading" || status === "processing"}
          className="btn btn-primary"
        >
          {status === "uploading" && "subiendo archivos…"}
          {status === "processing" && "uniendo pdfs…"}
          {(status === "idle" || status === "done" || status === "error") && "unir pdfs →"}
        </button>
      </div>

      {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div className="result-panel">
          <span className="stamp">✓ listo</span>
          <p className="result-meta">Tu PDF quedó unido y listo para descargar.</p>
          <button onClick={handleDownload} disabled={isDownloading} className="btn btn-success">
            {isDownloading ? "descargando…" : "descargar pdf"}
          </button>
        </div>
      )}
    </main>
  );
}

function sanitizeFileName(name: string): string {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}
