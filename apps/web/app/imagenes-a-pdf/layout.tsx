import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imágenes a PDF gratis online",
  description: "Convierte tus fotos o imágenes JPG/PNG a un PDF, con corrección de perspectiva incluida si tomas la foto en el momento.",
  alternates: { canonical: "/imagenes-a-pdf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
