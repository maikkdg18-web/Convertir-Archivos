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
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600 }}>
      <a href="/" style={{ color: "#2563eb" }}>
        ← Volver
      </a>
      <h1>Comprimir PDF</h1>
      <p>Sube un PDF y reducimos su peso optimizando su estructura interna.</p>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <p style={{ marginTop: "1rem" }}>
          Archivo seleccionado: <strong>{file.name}</strong> ({formatBytes(file.size)})
        </p>
      )}

      <button
        onClick={handleCompress}
        disabled={status === "uploading" || status === "processing"}
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          opacity: status === "uploading" || status === "processing" ? 0.6 : 1,
        }}
      >
        {status === "uploading" && "Subiendo archivo..."}
        {status === "processing" && "Comprimiendo..."}
        {(status === "idle" || status === "done" || status === "error") && "Comprimir PDF"}
      </button>

      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}

      {status === "done" && result && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: 8 }}>
          <p style={{ margin: 0, marginBottom: 4 }}>✅ ¡Listo!</p>
          <p style={{ margin: 0, marginBottom: 4, fontSize: 14, color: "#555" }}>
            {formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}
            {result.savedPercent > 0 && ` (−${result.savedPercent}%)`}
          </p>
          {result.savedPercent === 0 && (
            <p style={{ margin: 0, marginBottom: 8, fontSize: 13, color: "#888" }}>
              Este PDF ya estaba bien optimizado, no hubo mucho que reducir.
            </p>
          )}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
              marginTop: 8,
              padding: "0.5rem 1rem",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              opacity: isDownloading ? 0.6 : 1,
            }}
          >
            {isDownloading ? "Descargando..." : "Descargar PDF"}
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