import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "../../lib/site";
import { BackLink } from "../../components/BackLink";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Qué datos recolecta ${SITE_NAME}, cómo se tratan tus archivos, qué proveedores intervienen y cómo se usan las cookies publicitarias.`,
  alternates: { canonical: "/politica-de-privacidad" },
};

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="page">
      <BackLink />

      <div className="sheet-header">
        <div>
          <h1 className="sheet-title">Política de Privacidad</h1>
          <p className="sheet-desc">Última actualización: octubre de 2026.</p>
        </div>
      </div>

      <div className="static-card">
        <section>
          <h2>1. Qué archivos procesamos</h2>
          <p>
            Cuando usas alguna herramienta de {SITE_NAME}, el archivo que subes se almacena
            temporalmente para poder generar el resultado de la conversión (unir, comprimir,
            convertir, etc.). No usamos el contenido de tus archivos con ningún otro fin, no lo
            revisamos manualmente ni lo compartimos con terceros, salvo cuando la propia conversión
            lo requiere: las conversiones de Word ↔ PDF y la compresión de PDF se procesan a través
            de <strong>CloudConvert</strong>, un servicio externo que recibe el archivo únicamente
            para devolver el resultado.
          </p>
          <p>
            No necesitas crear una cuenta ni iniciar sesión para usar el sitio, y no guardamos tu
            identidad junto a los archivos que procesas.
          </p>
          <p className="static-note">
            Los archivos (los que subes y los resultados generados) se borran automáticamente del
            servidor: una tarea se ejecuta cada hora y elimina todo lo que lleva más de una hora
            almacenado.
          </p>
        </section>

        <section>
          <h2>2. Proveedores que intervienen</h2>
          <p>Para ofrecer el servicio usamos los siguientes proveedores:</p>
          <ul>
            <li>
              <strong>Netlify</strong>, que aloja la página web.
            </li>
            <li>
              <strong>Supabase</strong>, que almacena temporalmente los archivos y ejecuta las
              conversiones que se realizan en el propio servidor del sitio.
            </li>
            <li>
              <strong>CloudConvert</strong>, que realiza las conversiones entre Word y PDF y la
              compresión de PDF.
            </li>
            <li>
              <strong>Google AdSense</strong>, que muestra la publicidad.
            </li>
          </ul>
          <p>
            Como es habitual en cualquier alojamiento web, estos proveedores pueden registrar datos
            técnicos de la conexión (como la dirección IP o el tipo de navegador) en sus propios
            registros de funcionamiento y seguridad.
          </p>
        </section>

        <section>
          <h2>3. Cookies y publicidad</h2>
          <p>
            Este sitio muestra anuncios a través de <strong>Google AdSense</strong>, en la portada
            y en las guías. Google y sus socios publicitarios pueden usar cookies para mostrar
            anuncios según tus visitas a este y otros sitios. Puedes revisar u optar por no recibir
            publicidad personalizada desde los{" "}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
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
          <p>
            Aparte de eso, el sitio no usa cookies propias de seguimiento ni de analítica.
          </p>
        </section>

        <section>
          <h2>4. Qué NO recolectamos</h2>
          <p>
            No pedimos ni guardamos nombre, correo ni ningún dato personal para usar las
            herramientas de conversión. No usamos analítica propia de seguimiento de usuarios en el
            sitio.
          </p>
        </section>

        <section>
          <h2>5. Tus derechos y cómo ejercerlos</h2>
          <p>
            Si quieres que se elimine un archivo que subiste antes de que se borre
            automáticamente, o tienes cualquier pregunta sobre cómo tratamos tus datos, escríbenos
            a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, indicando el nombre del
            archivo y la hora aproximada en que lo subiste.
          </p>
        </section>

        <section>
          <h2>6. Cambios en esta política</h2>
          <p>
            Si el funcionamiento del sitio cambia de forma que afecte a tus datos, actualizaremos
            esta página y la fecha de «última actualización». Puedes consultar cómo funciona el
            sitio en <Link href="/acerca-de">Acerca de</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
