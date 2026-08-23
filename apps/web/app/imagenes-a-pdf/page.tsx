"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";
import { CornerAdjuster } from "../../components/CornerAdjuster";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function ImagenesAPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Cuando se toma una foto en el momento (cámara), primero se muestra aquí
  // para ajustar las 4 esquinas antes de agregarla a la lista.
  const [cameraPreviewUrl, setCameraPreviewUrl] = useState<string | null>(null);

  function handleFilesSelected(newFiles: File[]) {
    const onlyImages = newFiles.filter(
      (f) => f.type === "image/png" || f.type === "image/jpeg"
    );
    setImages((prev) => [...prev, ...onlyImages]);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(null);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCameraCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCameraPreviewUrl(URL.createObjectURL(file));
    // Reseteamos el input para poder tomar otra foto después con el mismo botón
    e.target.value = "";
  }

  function handleCornersConfirmed(blob: Blob) {
    const scannedFile = new File([blob], `documento-escaneado-${Date.now()}.png`, {
      type: "image/png",
    });
    setImages((prev) => [...prev, scannedFile]);
    setCameraPreviewUrl(null);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(null);
  }

  async function handleConvert() {
    if (images.length < 1) {
      setErrorMsg("Selecciona al menos 1 imagen (JPG o PNG).");
      return;
    }

    setStatus("uploading");
    setErrorMsg(null);

    try {
      const fileUrls: string[] = [];

      for (const image of images) {
        const safeName = sanitizeFileName(image.name);
        const path = `uploads/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("conversions")
          .upload(path, image, { contentType: image.type });

        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("conversions")
          .getPublicUrl(path);

        fileUrls.push(publicUrlData.publicUrl);
      }

      setStatus("processing");

      const { data, error: fnError } = await supabase.functions.invoke(
        "convert-images-to-pdf",
        { body: { fileUrls } }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error ?? "Error al crear el PDF");

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
      a.download = "imagenes-convertidas.pdf";
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
          <h1 className="sheet-title">Imágenes a PDF</h1>
          <p className="sheet-desc">
            Sube imágenes (JPG/PNG) o toma una foto en el momento — si tomas la foto,
            podrás ajustar las esquinas del documento antes de agregarla.
          </p>
        </div>
        <span className="sheet-number">HOJA 04</span>
      </div>

      {cameraPreviewUrl ? (
        <CornerAdjuster
          imageUrl={cameraPreviewUrl}
          onConfirm={handleCornersConfirmed}
          onCancel={() => setCameraPreviewUrl(null)}
        />
      ) : (
        <>
          <FileDropzone accept="image/png, image/jpeg" onFilesSelected={handleFilesSelected} />

          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => document.getElementById("camera-input")?.click()}
              className="btn btn-success"
              type="button"
            >
              📷 tomar foto ahora
            </button>
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              style={{ display: "none" }}
            />
          </div>
        </>
      )}

      {!cameraPreviewUrl && images.length > 0 && (
        <ul className="file-list">
          {images.map((img, i) => (
            <li key={i} className="file-row">
              <span className="file-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="file-name">{img.name}</span>
              <button onClick={() => removeImage(i)} className="file-remove">
                quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {!cameraPreviewUrl && (
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleConvert}
            disabled={status === "uploading" || status === "processing"}
            className="btn btn-primary"
          >
            {status === "uploading" && "subiendo imágenes…"}
            {status === "processing" && "creando pdf…"}
            {(status === "idle" || status === "done" || status === "error") && "convertir a pdf →"}
          </button>
        </div>
      )}

      {errorMsg && <p className="error-text">⚠ {errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div className="result-panel">
          <span className="stamp">✓ listo</span>
          <p className="result-meta">Tu PDF quedó creado y listo para descargar.</p>
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
