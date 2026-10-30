import Link from "next/link";
import { getGuide } from "../lib/guides";
import { getToolGuide } from "../lib/tool-guides";
import { Faq } from "./Faq";

/** Texto de ayuda que acompaña a cada herramienta: para qué sirve, pasos, consejos y dudas. */
export function ToolGuide({ slug }: { slug: string }) {
  const tool = getToolGuide(slug);
  if (!tool) return null;

  const guides = tool.guides.flatMap((guideSlug) => {
    const guide = getGuide(guideSlug);
    return guide ? [guide] : [];
  });

  return (
    <section className="tool-guide" aria-label={`Sobre ${tool.name}`}>
      <div className="static-card">
        <section>
          <h2>Para qué sirve {tool.name}</h2>
          {tool.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section>
          <h2>Cómo usarlo, paso a paso</h2>
          <ol>
            {tool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Consejos</h2>
          <ul>
            {tool.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Preguntas frecuentes</h2>
          <Faq items={tool.faq} />
        </section>

        {guides.length > 0 && (
          <section>
            <h2>Guías relacionadas</h2>
            <ul>
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/guias/${guide.slug}`}>{guide.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
