export type ConversionType =
  | "merge-pdf"
  | "compress-pdf"
  | "pdf-to-images"
  | "images-to-pdf";

export interface ConversionRequest {
  type: ConversionType;
  fileUrls: string[]; // rutas en Supabase Storage
}

export interface ConversionResult {
  success: boolean;
  outputUrl?: string;
  outputUrls?: string[]; // cuando el resultado son varios archivos (ej. pdf-to-images)
  error?: string;
}

export const CONVERSION_LABELS: Record<ConversionType, string> = {
  "merge-pdf": "Unir PDFs",
  "compress-pdf": "Comprimir PDF",
  "pdf-to-images": "PDF a imágenes",
  "images-to-pdf": "Imágenes a PDF",
};

export const MAX_FILE_SIZE_MB = 20;
