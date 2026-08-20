"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";

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
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
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
      <a href="/" className="back-link">← volver al set</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">PDF a imágenes</h1>
          <p className="sheet-desc">
            Sube un PDF y convertimos cada página en una imagen PNG.
          </p>
        </div>
        <span className="sheet-number">HOJA 03</span>
      </div>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <p className="mono muted" style={{ marginTop: 14, fontSize: 13 }}>
          {file.name}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleConvert}
          disabled={status === "uploading" || status === "processing"}
          className="btn btn-primary"
        >
          {status === "uploading" && "subiendo archivo…"}
          {status === "processing" && "convirtiendo páginas…"}
          {(status === "idle" || status === "done" || status === "error") && "convertir a imágenes →"}
        </button>
      </div>

      {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

      {status === "done" && images.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="stamp" style={{ margin: 0 }}>✓ {images.length} páginas</span>
            <button onClick={handleDownloadAll} className="btn btn-success" style={{ padding: "8px 14px", fontSize: 13 }}>
              descargar todas
            </button>
          </div>

          <div className="image-grid">
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div key={i} className="image-card">
                <img src={url} alt={`Página ${i + 1}`} />
                <button onClick={() => handleDownload(url, i)} disabled={downloadingIndex === i}>
                  {downloadingIndex === i ? "descargando…" : `página ${i + 1}`}
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
