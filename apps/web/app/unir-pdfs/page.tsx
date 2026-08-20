"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FileDropzone } from "../../components/FileDropzone";

type Status = "idle" | "uploading" | "processing" | "done" | "error";

export default function UnirPdfsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  function handleFilesSelected(newFiles: File[]) {
    const onlyPdfs = newFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...onlyPdfs]);
    setStatus("idle");
    setResultUrl(null);
    setErrorMsg(null);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleMerge() {
    if (files.length < 2) {
      setErrorMsg("Necesitas al menos 2 PDFs para unir.");
      return;
    }

    setStatus("uploading");
    setErrorMsg(null);

    try {
      // 1. Subir cada archivo al bucket "conversions"
      const fileUrls: string[] = [];

      for (const file of files) {
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
      }

      // 2. Llamar a la Edge Function convert-merge
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
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  async function handleDownload() {
    if (!resultUrl) return;
    setIsDownloading(true);
    try {
      // Descargamos el PDF como blob y forzamos la descarga en el navegador,
      // en vez de dejar que abra en una pestaña nueva (que es lo que pasa
      // con un <a href> normal apuntando a un archivo cross-origin).
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
    } catch (err) {
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
      <h1>Unir PDFs</h1>
      <p>Sube 2 o más PDFs y los unimos en uno solo, en el orden en que los agregues.</p>

      <FileDropzone accept="application/pdf" onFilesSelected={handleFilesSelected} />

      {files.length > 0 && (
        <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
          {files.map((file, i) => (
            <li key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{file.name}</span>
              <button onClick={() => removeFile(i)} style={{ marginLeft: 8, cursor: "pointer" }}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleMerge}
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
        {status === "uploading" && "Subiendo archivos..."}
        {status === "processing" && "Uniendo PDFs..."}
        {(status === "idle" || status === "done" || status === "error") && "Unir PDFs"}
      </button>

      {errorMsg && <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>}

      {status === "done" && resultUrl && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: 8 }}>
          <p style={{ margin: 0, marginBottom: 8 }}>✅ ¡Listo! Tu PDF está unido.</p>
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

// Supabase Storage no acepta tildes ni ciertos caracteres especiales en el nombre.
// Quitamos acentos, reemplazamos espacios y dejamos solo caracteres seguros.
function sanitizeFileName(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes/acentos
  return normalized
    .replace(/[^a-zA-Z0-9._-]/g, "-") // reemplaza cualquier otro caracter raro por "-"
    .replace(/-+/g, "-"); // colapsa guiones repetidos
}