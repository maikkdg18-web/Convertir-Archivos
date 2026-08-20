import "./globals.css";

export const metadata = {
  title: "Conversor de Archivos",
  description: "Convierte y ajusta tus PDFs e imágenes",
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
            <span className="wordmark">
              conversor<span>.</span>de-archivos
            </span>
            <span className="status-dot">listo para usar</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
