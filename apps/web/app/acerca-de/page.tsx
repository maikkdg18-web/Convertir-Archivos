import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Qué es Conversor de Archivos, cómo funciona y por qué es gratis.",
  alternates: { canonical: "/acerca-de" },
};

export default function AcercaDePage() {
  return (
    <main className="page">
      <a href="/" className="back-link">← volver al set</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Acerca de</h1>
          <p className="sheet-desc">Qué es este sitio y cómo funciona por dentro.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
        <p>
          <strong>Conversor de Archivos</strong> es una herramienta web gratuita para unir,
          comprimir y convertir PDFs e imágenes sin tener que instalar ningún programa.
          Nació de una necesidad simple: resolver tareas cotidianas con documentos (unir dos
          PDFs, achicar uno demasiado pesado, pasar una foto tomada con el celular a PDF) sin
          depender de programas de escritorio ni de servicios que cobran por cada archivo.
        </p>

        <p>
          El sitio ofrece seis herramientas: unir PDFs, comprimir PDF, PDF a imágenes,
          imágenes a PDF (incluyendo corrección de perspectiva al fotografiar un documento en
          ángulo), Word a PDF y PDF a Word.
        </p>

        <p>
          Los archivos que subes se procesan para generar el resultado solicitado y no se
          usan con ningún otro fin. Puedes ver el detalle completo en la{" "}
          <a href="/politica-de-privacidad">Política de Privacidad</a>.
        </p>

        <p>
          El proyecto se sostiene con publicidad (Google AdSense) para poder mantenerlo
          gratuito. Si tienes dudas, sugerencias o encontraste un error, puedes escribirnos
          desde la página de <a href="/contacto">Contacto</a>.
        </p>
      </div>
    </main>
  );
}
