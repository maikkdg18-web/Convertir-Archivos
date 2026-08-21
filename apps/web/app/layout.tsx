import "./globals.css";

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
            <div className="brand-lockup">
              <img className="brand-icon" src="/icon.png" alt="" />
              <span className="wordmark">
                CONVERSOR<span>.</span>DE ARCHIVOS
              </span>
            </div>
            <span className="status-dot">listo para usar</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
