import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Conversor de Archivos",
  description: "Convierte y ajusta tus PDFs e imágenes",
  icons: {
    icon: "/icon.png",
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
      </body>
    </html>
  );
}