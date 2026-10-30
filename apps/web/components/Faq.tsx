import type { FaqItem } from "../lib/tool-guides";

/** Preguntas frecuentes desplegables; el texto está en el HTML aunque estén cerradas. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
