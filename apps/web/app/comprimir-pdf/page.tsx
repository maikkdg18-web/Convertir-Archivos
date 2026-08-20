"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

interface CompressResult {
  outputUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
}

export default function ComprimirPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function handleFilesSelected(newFiles: File[]) {
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
    setStatus("idle");
    setResult(null);
    setErrorMsg(null);
  }

  async function handleCompress() {
    if (!file) {
      setErrorMsg("Selecciona un PDF primero.");
      return;
    }

    setStatus("uploading");
    setErrorMsg(null);

    try {
      const safeName = sanitizeFileName(file.name);
      const path = `uploads/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("conversions")
        .upload(path, file, { contentType: "application/pdf" });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("conversions")
        .getPublicUrl(path);

      setStatus("processing");

      const { data, error: fnError } = await supabase.functions.invoke(
        "convert-compress",
        { body: { fileUrls: [publicUrlData.publicUrl] } }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error ?? "Error al comprimir el PDF");

      setResult({
        outputUrl: data.outputUrl,
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
        savedPercent: data.savedPercent,
      });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  async function handleDownload() {
    if (!result) return;
    setIsDownloading(true);
    try {
      const res = await fetch(result.outputUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "documento-comprimido.pdf";
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
          <h1 className="sheet-title">Comprimir PDF</h1>
          <p className="sheet-desc">
            Sube un PDF y reducimos su peso optimizando su estructura interna.
          </p>
        </div>
        <span className="sheet-number">HOJA 02</span>
      </div>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <p className="mono muted" style={{ marginTop: 14, fontSize: 13 }}>
          {file.name} · {formatBytes(file.size)}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleCompress}
          disabled={status === "uploading" || status === "processing"}
          className="btn btn-primary"
        >
          {status === "uploading" && "subiendo archivo…"}
          {status === "processing" && "comprimiendo…"}
          {(status === "idle" || status === "done" || status === "error") && "comprimir pdf →"}
        </button>
      </div>

      {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

      {status === "done" && result && (
        <div className="result-panel">
          <span className="stamp">✓ listo</span>
          <p className="result-meta">
            {formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}
            {result.savedPercent > 0 && ` · −${result.savedPercent}%`}
          </p>
          {result.savedPercent === 0 && (
            <p className="muted" style={{ fontSize: 13, marginTop: -6, marginBottom: 12 }}>
              Este PDF ya estaba bien optimizado, no hubo mucho que reducir.
            </p>
          )}
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
