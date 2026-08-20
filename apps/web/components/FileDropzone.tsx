"use client";

import { useCallback, useState } from "react";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function FileDropzone({ accept, multiple = true, onFilesSelected }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? "#2563eb" : "#ccc"}`,
        borderRadius: 8,
        padding: "3rem 1.5rem",
        textAlign: "center",
        backgroundColor: isDragging ? "#eff6ff" : "#fafafa",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <p style={{ margin: 0, color: "#555" }}>
        Arrastra tus archivos aquí o haz click para seleccionarlos
      </p>
      <input
        id="file-input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
