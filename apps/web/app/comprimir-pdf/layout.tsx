import type { Metadata } from "next";
import { ToolGuide } from "../../components/ToolGuide";

export const metadata: Metadata = {
  title: "Comprimir PDF gratis online",
  description: "Reduce el peso de tu PDF eligiendo el nivel de compresión: ligera, equilibrada o máxima. Gratis y en segundos.",
  alternates: { canonical: "/comprimir-pdf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolGuide slug="comprimir-pdf" />
    </>
  );
}
