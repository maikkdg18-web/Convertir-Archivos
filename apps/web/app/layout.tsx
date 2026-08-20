export const metadata = {
  title: "Conversor de Archivos",
  description: "Convierte y manipula tus PDFs e imágenes gratis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
