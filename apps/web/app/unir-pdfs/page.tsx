"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { toFriendlyError } from "@conversor/shared";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";
import { Progress } from "../../components/Progress";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

interface QueuedFile {
  id: string;
  file: File;
}

export default function UnirPdfsPage() {
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  function handleFilesSelected(newFiles: File[]) {
    const onlyPdfs = newFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [
      ...prev,
      ...onlyPdfs.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(onlyPdfs.length < newFiles.length ? "Solo se aceptan PDFs" : null);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleMerge() {
    if (files.length < 2) {
      setErrorMsg("Necesitas al menos 2 PDFs para unir.");
      return;
    }

    setStatus("uploading");
    setUploadedCount(0);
    setErrorMsg(null);

    try {
      const fileUrls: string[] = [];

      for (const { file } of files) {
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
        setUploadedCount(fileUrls.length);
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
      setErrorMsg(toFriendlyError(err instanceof Error ? err.message : "Error desconocido"));
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

  const isBusy = status === "uploading" || status === "processing";

  return (
    <main className="page">
      <a href="/" className="back-link">← Todas las herramientas</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Unir PDFs</h1>
          <p className="sheet-desc">
            Sube 2 o más PDFs y los unimos en uno solo. Puedes reordenarlos antes de unirlos.
          </p>
        </div>
      </div>

      <FileDropzone accept="application/pdf" onFilesSelected={handleFilesSelected} />

      {files.length > 0 && (
        <ul className="file-list">
          {files.map(({ id, file }, i) => (
            <li key={id} className="file-row">
              <span className="file-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="file-name">{file.name}</span>
              <button
                type="button"
                onClick={() => moveFile(i, -1)}
                disabled={i === 0 || isBusy}
                className="file-move"
                aria-label={`Mover ${file.name} arriba`}
              >
                <ArrowUp size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveFile(i, 1)}
                disabled={i === files.length - 1 || isBusy}
                className="file-move"
                aria-label={`Mover ${file.name} abajo`}
              >
                <ArrowDown size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => removeFile(id)}
                disabled={isBusy}
                className="file-remove"
                aria-label={`Quitar ${file.name}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="actions">
        <button onClick={handleMerge} disabled={isBusy} className="btn btn-primary">
          {status === "uploading" && "Subiendo archivos…"}
          {status === "processing" && "Uniendo PDFs…"}
          {(status === "idle" || status === "done" || status === "error") && "Unir PDFs →"}
        </button>
      </div>

      {status === "uploading" && (
        <Progress
          label={`Subiendo ${Math.min(uploadedCount + 1, files.length)} de ${files.length}…`}
          value={(uploadedCount / files.length) * 100}
        />
      )}
      {status === "processing" && <Progress label="Uniendo PDFs…" />}

      {errorMsg && <p className="error-text" role="alert">{errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div className="result-panel" role="status">
          <span className="stamp">✓ Listo</span>
          <p className="result-meta">Tu PDF quedó unido y listo para descargar.</p>
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
