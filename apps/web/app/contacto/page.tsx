import type { Metadata } from "next";
import { CONTACT_EMAIL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo ponerte en contacto con Conversor de Archivos.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main className="page">
      <a href="/" className="back-link">← volver al set</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Contacto</h1>
          <p className="sheet-desc">
            ¿Preguntas, sugerencias o algo que no funcionó como esperabas?
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, maxWidth: 640 }}>
        <p>
          Puedes escribirnos directamente por correo a:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="mono">
            {CONTACT_EMAIL}
          </a>
        </p>

        <p>
          Intentamos responder lo antes posible. Si el mensaje es sobre un problema técnico
          con alguna herramienta, ayuda muchísimo que cuentes qué herramienta usaste
          (por ejemplo, &quot;Unir PDFs&quot;) y qué pasó exactamente.
        </p>
      </div>
    </main>
  );
}
