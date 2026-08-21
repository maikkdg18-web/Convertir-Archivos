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
      <body>
        <header className="letterhead">
          <div className="letterhead-inner">
            <Link href="/" className="brand-lockup" aria-label="Ir a la página principal">
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
