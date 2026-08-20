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
      // pequeña pausa para que el navegador no bloquee descargas múltiples seguidas
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 700 }}>
      <a href="/" style={{ color: "#2563eb" }}>
        ← Volver
      </a>
      <h1>PDF a imágenes</h1>
      <p>Sube un PDF y convertimos cada página en una imagen PNG.</p>

      <FileDropzone accept="application/pdf" multiple={false} onFilesSelected={handleFilesSelected} />

      {file && (
        <p style={{ marginTop: "1rem" }}>
          Archivo seleccionado: <strong>{file.name}</strong>
        </p>
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
        {status === "uploading" && "Subiendo archivo..."}
        {status === "processing" && "Convirtiendo páginas..."}
        {(status === "idle" || status === "done" || status === "error") && "Convertir a imágenes"}
      </button>

      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}

      {status === "done" && images.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ margin: 0 }}>✅ {images.length} página(s) convertidas</p>
            <button
              onClick={handleDownloadAll}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Descargar todas
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Página ${i + 1}`} style={{ width: "100%", display: "block" }} />
                <button
                  onClick={() => handleDownload(url, i)}
                  disabled={downloadingIndex === i}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    fontSize: 13,
                    border: "none",
                    borderTop: "1px solid #eee",
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                  }}
                >
                  {downloadingIndex === i ? "Descargando..." : `Página ${i + 1}`}
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