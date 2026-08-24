import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_NAME } from "../../lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Qué datos recolecta ${SITE_NAME}, cómo se usan y cómo se usan las cookies publicitarias.`,
  alternates: { canonical: "/politica-de-privacidad" },
};

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="page">
      <a href="/" className="back-link">← volver al set</a>

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Política de Privacidad</h1>
          <p className="sheet-desc">Última actualización: agosto de 2026.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 22, maxWidth: 640 }}>
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>1. Qué archivos procesamos</h2>
          <p>
            Cuando usas alguna herramienta de {SITE_NAME}, el archivo que subes se almacena
            temporalmente para poder generar el resultado de la conversión (unir, comprimir,
            convertir, etc.). No usamos el contenido de tus archivos con ningún otro fin, no
            lo revisamos manualmente ni lo compartimos con terceros, salvo cuando la propia
            conversión lo requiere: las conversiones de Word ↔ PDF se procesan a través de{" "}
            <strong>CloudConvert</strong>, un servicio externo que recibe el archivo únicamente
            para devolver el resultado convertido.
          </p>
          <p>
            No pidas permiso de cuenta ni inicio de sesión para usar el sitio: no guardamos tu
            identidad junto a los archivos que procesas.
          </p>
          <p style={{ color: "var(--ink-faint)", fontSize: 13 }}>
            Los archivos (los que subes y los resultados generados) se borran automáticamente
            del servidor pasada una hora.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>2. Cookies y publicidad</h2>
          <p>
            Este sitio muestra anuncios a través de <strong>Google AdSense</strong>. Google y
            sus socios publicitarios pueden usar cookies para mostrar anuncios según tus
            visitas a este y otros sitios. Puedes revisar u optar por no recibir publicidad
            personalizada desde los{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ajustes de anuncios de Google
            </a>
            , y conocer más en su{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de tecnologías publicitarias
            </a>
            .
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>3. Qué NO recolectamos</h2>
          <p>
            No pedimos ni guardamos nombre, correo, ni ningún dato personal para usar las
            herramientas de conversión. No usamos analítica propia de seguimiento de usuarios
            en el sitio.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>4. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política o quieres solicitar la eliminación de un
            archivo que subiste, escríbenos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="mono">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
