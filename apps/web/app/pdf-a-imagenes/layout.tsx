import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF a imágenes (JPG/PNG) gratis online",
  description: "Convierte cada página de tu PDF en una imagen PNG lista para descargar. Gratis y sin instalar nada.",
  alternates: { canonical: "/pdf-a-imagenes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
