"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function ImagenesAPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600 }}>
      <a href="/" style={{ color: "#2563eb" }}>
        ← Volver
      </a>
      <h1>Imágenes a PDF</h1>
      <p>Sube una o varias imágenes (JPG o PNG) y las juntamos en un solo PDF, en el orden en que las agregues.</p>

      <FileDropzone accept="image/png, image/jpeg" onFilesSelected={handleFilesSelected} />

      {images.length > 0 && (
        <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
          {images.map((img, i) => (
            <li key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{img.name}</span>
              <button onClick={() => removeImage(i)} style={{ marginLeft: 8, cursor: "pointer" }}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleConvert}
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
        {status === "uploading" && "Subiendo imágenes..."}
        {status === "processing" && "Creando PDF..."}
        {(status === "idle" || status === "done" || status === "error") && "Convertir a PDF"}
      </button>

      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: 8 }}>
          <p style={{ margin: 0, marginBottom: 8 }}>✅ ¡Listo! Tu PDF está creado.</p>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            style={{
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