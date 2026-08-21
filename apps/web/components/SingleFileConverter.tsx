"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { FileDropzone } from "./FileDropzone";

interface SingleFileConverterProps {
  title: string;
  description: string;
  sheet: string;
  accept: string;
  acceptedTypes: string[];
  functionName: string;
  outputName: string;
  buttonLabel: string;
  processingLabel: string;
}

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export function SingleFileConverter({
  title,
  description,
  sheet,
  accept,
  acceptedTypes,
  functionName,
  outputName,
  buttonLabel,
  processingLabel,
}: SingleFileConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function handleFilesSelected(newFiles: File[]) {
    const selected = newFiles.find((candidate) => acceptedTypes.includes(candidate.type));
    if (!selected) {
      setErrorMsg("Selecciona un archivo con un formato compatible.");
      return;
    }

    setFile(selected);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(null);
  }

  async function handleConvert() {
    if (!file) {
      setErrorMsg("Selecciona un archivo primero.");
      return;
    }

    setStatus("uploading");
    setErrorMsg(null);

    try {
      const safeName = sanitizeFileName(file.name);
      const path = `uploads/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("conversions")
        .upload(path, file, { contentType: file.type || "application/octet-stream" });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("conversions")
        .getPublicUrl(path);

      setStatus("processing");
      const { data, error: fnError } = await supabase.functions.invoke(functionName, {
        body: { fileUrl: publicUrlData.publicUrl, fileName: file.name },
      });

      if (fnError) {
        let functionMessage = fnError.message;
        const responseContext = "context" in fnError ? fnError.context : null;

        if (responseContext instanceof Response) {
          const errorBody = await responseContext.json().catch(() => null) as { error?: string } | null;
          if (errorBody?.error) functionMessage = errorBody.error;
        }

        throw new Error(
          functionMessage.includes("Failed to send a request")
            ? "La función de conversión aún no está desplegada en Supabase."
            : functionMessage
        );
      }
      if (!data?.success) throw new Error(data?.error ?? "No se pudo convertir el archivo.");

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
      const response = await fetch(resultUrl);
      if (!response.ok) throw new Error("No se pudo descargar el archivo.");
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = outputName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setErrorMsg("No se pudo descargar el archivo. Intenta de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  }

  const isBusy = status === "uploading" || status === "processing";

  return (
    <main className="page">
      <a href="/" className="back-link">← volver al set</a>
      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">{title}</h1>
          <p className="sheet-desc">{description}</p>
        </div>
        <span className="sheet-number">HOJA {sheet}</span>
      </div>

      <FileDropzone accept={accept} multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <ul className="file-list">
          <li className="file-row">
            <span className="file-index">01</span>
            <span className="file-name">{file.name}</span>
            <span className="file-index">{formatBytes(file.size)}</span>
          </li>
        </ul>
      )}

      <div style={{ marginTop: 24 }}>
        <button onClick={handleConvert} disabled={isBusy} className="btn btn-primary">
          {status === "uploading" && "subiendo archivo…"}
          {status === "processing" && processingLabel}
          {(status === "idle" || status === "done" || status === "error") && buttonLabel}
        </button>
      </div>

      {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div className="result-panel">
          <span className="stamp">✓ listo</span>
          <p className="result-meta">Tu archivo quedó convertido y listo para descargar.</p>
          <button onClick={handleDownload} disabled={isDownloading} className="btn btn-success">
            {isDownloading ? "descargando…" : `descargar ${outputName.split(".").pop()}`}
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
