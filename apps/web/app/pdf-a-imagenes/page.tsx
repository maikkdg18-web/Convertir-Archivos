"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toFriendlyError } from "@conversor/shared";
import { FileDropzone } from "../../components/FileDropzone";
import { Progress } from "../../components/Progress";
import { BackLink } from "../../components/BackLink";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function PdfAImagenesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  function handleFilesSelected(newFiles: File[]) {
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (pdf) setFile(pdf);
    setStatus("idle");
    setImages([]);
    setErrorMsg(null);
  }

  async function handleConvert() {
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
        "convert-pdf-to-images",
        { body: { fileUrls: [publicUrlData.publicUrl] } }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error ?? "Error al convertir el PDF");

      setImages(data.outputUrls);
      setStatus("done");
    } catch (err) {
      setErrorMsg(toFriendlyError(err instanceof Error ? err.message : "Error desconocido"));
      setStatus("error");
    }
  }

  async function handleDownload(url: string, index: number) {
    setDownloadingIndex(index);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `pagina-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setErrorMsg("No se pudo descargar esa imagen. Intenta de nuevo.");
    } finally {
      setDownloadingIndex(null);
    }
  }

  async function handleDownloadAll() {
    for (let i = 0; i < images.length; i++) {
      await handleDownload(images[i], i);
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">PDF a imágenes</h1>
          <p className="sheet-desc">
            Sube un PDF y convertimos cada página en una imagen PNG.
          </p>
        </div>
      </div>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <p className="muted file-selected">{file.name}</p>
      )}

      <div className="actions">
        <button
          onClick={handleConvert}
          disabled={status === "uploading" || status === "processing"}
          className="btn btn-primary"
        >
          {status === "uploading" && "Subiendo archivo…"}
          {status === "processing" && "Convirtiendo páginas…"}
          {(status === "idle" || status === "done" || status === "error") && "Convertir a imágenes →"}
        </button>
      </div>

      {status === "uploading" && <Progress label="Subiendo archivo…" />}
      {status === "processing" && <Progress label="Convirtiendo páginas…" />}

      {errorMsg && <p className="error-text" role="alert">{errorMsg}</p>}

      {status === "done" && images.length > 0 && (
        <div className="result-block" role="status">
          <div className="result-toolbar">
            <span className="stamp">✓ {images.length} páginas</span>
            <button onClick={handleDownloadAll} className="btn btn-success">
              Descargar todas
            </button>
          </div>

          <div className="image-grid">
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div key={i} className="image-card" style={{ "--i": i } as CSSProperties}>
                <img src={url} alt={`Página ${i + 1}`} />
                <button onClick={() => handleDownload(url, i)} disabled={downloadingIndex === i}>
                  {downloadingIndex === i ? "Descargando…" : `Página ${i + 1}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function sanitizeFileName(name: string): string {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}
