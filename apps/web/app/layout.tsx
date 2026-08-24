import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Une, comprime y convierte PDFs e imágenes gratis`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Convierte y ajusta tus PDFs e imágenes en segundos: une PDFs, comprime, pasa de PDF a Word, de Word a PDF, de imágenes a PDF y más. Sin instalaciones, sin marcas de agua.",
  keywords: [
    "convertir pdf",
    "unir pdf",
    "comprimir pdf",
    "pdf a word",
    "word a pdf",
    "pdf a imagenes",
    "imagenes a pdf",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Une, comprime y convierte PDFs e imágenes gratis`,
    description:
      "Herramientas gratuitas para unir, comprimir y convertir PDFs e imágenes desde el navegador.",
    url: SITE_URL,
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Une, comprime y convierte PDFs e imágenes gratis`,
    description:
      "Herramientas gratuitas para unir, comprimir y convertir PDFs e imágenes desde el navegador.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4811758361067744"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <header className="letterhead">
          <div className="letterhead-inner">
            <Link
              href="/"
              className="brand-lockup"
              aria-label="Ir a la página principal"
            >
              <img className="brand-icon" src="/icon.png" alt="" />
              <span className="wordmark">
                CONVERSOR<span>.</span>DE ARCHIVOS
              </span>
            </Link>

            <span className="status-dot">listo para usar</span>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="site-footer-inner">
            <span className="muted mono" style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} {SITE_NAME}
            </span>
            <nav className="site-footer-links">
              <Link href="/acerca-de">Acerca de</Link>
              <Link href="/contacto">Contacto</Link>
              <Link href="/politica-de-privacidad">Privacidad</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}