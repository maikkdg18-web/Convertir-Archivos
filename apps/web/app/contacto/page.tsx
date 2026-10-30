import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "../../lib/site";
import { BackLink } from "../../components/BackLink";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cómo ponerte en contacto con Conversor de Archivos para dudas, errores, sugerencias o para pedir que se borre un archivo.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Contacto</h1>
          <p className="sheet-desc">
            ¿Preguntas, sugerencias o algo que no funcionó como esperabas?
          </p>
        </div>
      </div>

      <div className="static-card">
        <section>
          <h2>Escríbenos</h2>
          <p>
            Puedes escribirnos directamente por correo a:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p>Intentamos responder lo antes posible.</p>
        </section>

        <section>
          <h2>Si algo no funcionó</h2>
          <p>Ayuda muchísimo que en el mensaje cuentes:</p>
          <ul>
            <li>Qué herramienta usaste (por ejemplo, «Unir PDFs»).</li>
            <li>Qué esperabas que pasara y qué pasó exactamente, incluido el texto de cualquier aviso de error.</li>
            <li>Desde qué dispositivo y navegador lo hiciste (por ejemplo, «iPhone, Safari»).</li>
          </ul>
          <p>
            Antes de escribir, puede que la respuesta ya esté en las preguntas frecuentes que
            aparecen debajo de cada herramienta o en las <Link href="/guias">guías</Link>.
          </p>
        </section>

        <section>
          <h2>Sugerencias</h2>
          <p>
            Si echas de menos alguna herramienta o una mejora en las que ya existen, cuéntanoslo.
            Las ideas que más se repiten son las primeras que se estudian.
          </p>
        </section>

        <section>
          <h2>Pedir que se borre un archivo</h2>
          <p>
            Los archivos se eliminan automáticamente al poco tiempo de subirse. Si quieres que se
            borre uno antes, escríbenos indicando el nombre del archivo y la hora aproximada en la
            que lo subiste. Más información en la{" "}
            <Link href="/politica-de-privacidad">Política de Privacidad</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
