"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toFriendlyError } from "@conversor/shared";
import { FileDropzone } from "../../components/FileDropzone";
import { Progress } from "../../components/Progress";
import { BackLink } from "../../components/BackLink";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

type CompressionLevel = "light" | "balanced" | "max";

interface CompressResult {
  outputUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
}

// El ahorro es una estimación: depende de cuántas imágenes tenga el PDF (un PDF
// solo de texto casi no se reduce).
const LEVELS: {
  id: CompressionLevel;
  title: string;
  description: string;
  savings: string;
}[] = [
  {
    id: "light",
    title: "Ligera",
    description: "Casi sin pérdida de calidad. Reduce menos el peso.",
    savings: "10–25%",
  },
  {
    id: "balanced",
    title: "Equilibrada",
    description: "Buena calidad y buen ahorro. Recomendada.",
    savings: "30–60%",
  },
  {
    id: "max",
    title: "Máxima",
    description: "El archivo más pequeño. Las imágenes pueden perder calidad.",
    savings: "50–80%",
  },
];

export default function ComprimirPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("balanced");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isBusy = status === "uploading" || status === "processing";

  function handleFilesSelected(newFiles: File[]) {
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
    setStatus("idle");
    setResult(null);
    setErrorMsg(null);
  }

  function handleLevelChange(next: CompressionLevel) {
    setLevel(next);
    // El resultado anterior ya no corresponde al nivel elegido
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
        { body: { fileUrls: [publicUrlData.publicUrl], fileName: file.name, level } }
      );

      if (fnError) {
        let functionMessage = fnError.message;
        const responseContext = "context" in fnError ? fnError.context : null;

        if (responseContext instanceof Response) {
          const errorBody = (await responseContext.json().catch(() => null)) as { error?: string } | null;
          if (errorBody?.error) functionMessage = errorBody.error;
        }

        throw new Error(functionMessage);
      }
      if (!data?.success) throw new Error(data?.error ?? "Error al comprimir el PDF");

      setResult({
        outputUrl: data.outputUrl,
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
        savedPercent: data.savedPercent,
      });
      setStatus("done");
    } catch (err) {
      setErrorMsg(toFriendlyError(err instanceof Error ? err.message : "Error desconocido"));
      setStatus("error");
    }
  }

  async function handleDownload() {
    if (!result || !file) return;
    setIsDownloading(true);
    try {
      const res = await fetch(result.outputUrl);
      if (!res.ok) throw new Error("No se pudo descargar el archivo.");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      // Se conserva el nombre con el que se subió el archivo
      a.download = file.name;
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
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Comprimir PDF</h1>
          <p className="sheet-desc">Sube un PDF, elige cuánto quieres comprimirlo y reducimos su peso.</p>
        </div>
      </div>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <ul className="file-list">
          <li className="file-row">
            <span className="file-index">01</span>
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatBytes(file.size)}</span>
          </li>
        </ul>
      )}

      <fieldset className="level-picker" disabled={isBusy}>
        <legend>Nivel de compresión</legend>
        <div className="level-options">
          {LEVELS.map((option) => (
            <label key={option.id} className="level-option">
              <input
                type="radio"
                name="compression-level"
                value={option.id}
                checked={level === option.id}
                onChange={() => handleLevelChange(option.id)}
              />
              <span className="level-title">{option.title}</span>
              <span className="level-desc">{option.description}</span>
              <span className="level-savings">Ahorro aprox. {option.savings}</span>
            </label>
          ))}
        </div>
        <p className="level-hint">
          Los porcentajes son orientativos: dependen del contenido del PDF. Los que tienen muchas
          imágenes o son escaneos se reducen más; los de solo texto, poco.
        </p>
      </fieldset>

      <div className="actions">
        <button
          onClick={handleCompress}
          disabled={isBusy}
          className="btn btn-primary"
        >
          {status === "uploading" && "Subiendo archivo…"}
          {status === "processing" && "Comprimiendo…"}
          {(status === "idle" || status === "done" || status === "error") && "Comprimir PDF →"}
        </button>
      </div>

      {status === "uploading" && <Progress label="Subiendo archivo…" />}
      {status === "processing" && <Progress label="Comprimiendo…" />}

      {errorMsg && <p className="error-text" role="alert">{errorMsg}</p>}

      {status === "done" && result && (
        <div className="result-panel" role="status">
          <span className="stamp">✓ Listo</span>
          <p className="result-meta">
            {formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}
            {result.savedPercent > 0 && ` (−${result.savedPercent}%)`}
          </p>
          {result.savedPercent === 0 && (
            <p className="conversion-note result-note">
              {level === "max"
                ? "Este PDF ya estaba muy optimizado, no hubo mucho que reducir."
                : "No hubo mucho que reducir con este nivel. Prueba con una compresión más alta."}
            </p>
          )}
          <button onClick={handleDownload} disabled={isDownloading} className="btn btn-success">
            {isDownloading ? "Descargando…" : "Descargar PDF"}
          </button>
        </div>
      )}
    </main>
  );
}

function sanitizeFileName(name: string): string {
  const normalized = name.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
