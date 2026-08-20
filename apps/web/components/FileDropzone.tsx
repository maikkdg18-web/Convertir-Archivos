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
      className="dropzone"
      data-active={isDragging}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          document.getElementById("file-input")?.click();
        }
      }}
    >
      <span className="crosshair crosshair-tl" />
      <span className="crosshair crosshair-tr" />
      <span className="crosshair crosshair-bl" />
      <span className="crosshair crosshair-br" />
      <p className="dropzone-hint mono">
        arrastra tus archivos aquí — o haz click para elegirlos
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
