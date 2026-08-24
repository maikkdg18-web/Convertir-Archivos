import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprimir PDF gratis online",
  description: "Reduce el peso de tu PDF optimizando su estructura interna, sin perder calidad. Gratis y en segundos.",
  alternates: { canonical: "/comprimir-pdf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
