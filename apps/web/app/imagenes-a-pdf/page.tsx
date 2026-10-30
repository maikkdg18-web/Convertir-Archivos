"use client";

import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Camera, X } from "lucide-react";
import { toFriendlyError } from "@conversor/shared";
import { FileDropzone } from "../../components/FileDropzone";
import { Progress } from "../../components/Progress";
import { CornerAdjuster } from "../../components/CornerAdjuster";
import { BackLink } from "../../components/BackLink";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function ImagenesAPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [listRef] = useAutoAnimate<HTMLUListElement>({ duration: 250 });
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    setUploadedCount(0);
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
        setUploadedCount(fileUrls.length);
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
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Imágenes a PDF</h1>
          <p className="sheet-desc">
            Sube imágenes (JPG/PNG) o toma una foto en el momento — si tomas la foto,
            podrás ajustar las esquinas del documento antes de agregarla.
          </p>
        </div>
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

          <div className="actions actions-tight">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn btn-secondary"
              type="button"
            >
              <Camera size={18} aria-hidden="true" /> Tomar foto ahora
            </button>
            <input
              ref={cameraInputRef}
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
        <ul ref={listRef} className="file-list">
          {images.map((img, i) => (
            <li key={i} className="file-row">
              <span className="file-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="file-name">{img.name}</span>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="file-remove"
                aria-label={`Quitar ${img.name}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!cameraPreviewUrl && (
        <div className="actions">
          <button
            onClick={handleConvert}
            disabled={status === "uploading" || status === "processing"}
            className="btn btn-primary"
          >
            {status === "uploading" && "Subiendo imágenes…"}
            {status === "processing" && "Creando PDF…"}
            {(status === "idle" || status === "done" || status === "error") && "Convertir a PDF →"}
          </button>
        </div>
      )}

      {status === "uploading" && (
        <Progress
          label={`Subiendo ${Math.min(uploadedCount + 1, images.length)} de ${images.length}…`}
          value={(uploadedCount / images.length) * 100}
        />
      )}
      {status === "processing" && <Progress label="Creando PDF…" />}

      {errorMsg && <p className="error-text" role="alert">{errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div className="result-panel" role="status">
          <span className="stamp">✓ Listo</span>
          <p className="result-meta">Tu PDF quedó creado y listo para descargar.</p>
          <button onClick={handleDownload} disabled={isDownloading} className="btn btn-success">
            {isDownloading ? "Descargando…" : "Descargar PDF"}
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
