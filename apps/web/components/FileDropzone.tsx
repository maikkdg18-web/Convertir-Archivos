"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function FileDropzone({ accept, multiple = true, onFilesSelected }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Permite volver a elegir el mismo archivo después de quitarlo
      e.target.value = "";
    },
    [onFilesSelected]
  );

  return (
    <div
      className="dropzone"
      data-active={isDragging}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      aria-label="Subir archivos"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <span className="dropzone-icon" aria-hidden="true">
        <ArrowUp size={28} strokeWidth={2.25} />
      </span>
      <p className="dropzone-hint">
        Arrastra tus archivos aquí o <strong>haz clic para elegirlos</strong>
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
