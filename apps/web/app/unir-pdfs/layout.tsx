import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unir PDFs gratis online",
  description: "Une dos o más PDFs en un solo archivo, en el orden que elijas. Gratis y sin marcas de agua.",
  alternates: { canonical: "/unir-pdfs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
