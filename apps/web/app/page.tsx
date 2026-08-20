import Link from "next/link";
import { CONVERSION_LABELS, ConversionType } from "@conversor/shared";

const ROUTES: Partial<Record<ConversionType, string>> = {
  "merge-pdf": "/unir-pdfs",
  // Las demás herramientas se activan conforme se implementen:
  // "compress-pdf": "/comprimir-pdf",
  // "pdf-to-images": "/pdf-a-imagenes",
  // "images-to-pdf": "/imagenes-a-pdf",
};

export default function HomePage() {
  const tools = Object.entries(CONVERSION_LABELS) as [ConversionType, string][];

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Conversor de Archivos</h1>
      <p>Elige una herramienta para empezar:</p>
      <ul>
        {tools.map(([key, label]) => {
          const route = ROUTES[key];
          return (
            <li key={key} style={{ marginBottom: 8 }}>
              {route ? (
                <Link href={route} style={{ color: "#2563eb" }}>
                  {label}
                </Link>
              ) : (
                <span style={{ color: "#999" }}>{label} (próximamente)</span>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}