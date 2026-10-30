import type { Metadata } from "next";
import { ToolGuide } from "../../components/ToolGuide";

export const metadata: Metadata = {
  title: "PDF a imágenes PNG gratis online",
  description: "Convierte cada página de tu PDF en una imagen PNG lista para descargar. Gratis y sin instalar nada.",
  alternates: { canonical: "/pdf-a-imagenes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolGuide slug="pdf-a-imagenes" />
    </>
  );
}
