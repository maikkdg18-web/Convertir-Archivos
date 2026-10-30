"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import type { FaqBankItem } from "../lib/faq-bank";
import { buildIndex, highlightRanges, search, shuffledOrder } from "../lib/faq-search";

interface FaqExplorerProps {
  items: FaqBankItem[];
  /** Cuántas preguntas se muestran cuando no hay búsqueda. Sin valor, se muestran todas. */
  limit?: number;
  /** Si es true, el grupo de preguntas cambia en cada visita y con «Mostrar otras preguntas». */
  rotate?: boolean;
  /** Muestra un enlace a la página con todas las preguntas. */
  showAllLink?: boolean;
}

// Palabras de ejemplo para buscar con un toque
const SUGGESTIONS = ["comprimir", "unir", "gratis", "borrar archivos", "celular", "límite", "Word"];

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {highlightRanges(text, terms).map((piece, i) =>
        piece.match ? <mark key={i}>{piece.text}</mark> : <span key={i}>{piece.text}</span>,
      )}
    </>
  );
}

export function FaqExplorer({ items, limit, rotate = false, showAllLink = false }: FaqExplorerProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  // El primer render (servidor y cliente) usa el orden original: así no hay diferencias al
  // hidratar. Después de montar, si se pide rotación, se baraja el orden.
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [offset, setOffset] = useState(0);

  const index = useMemo(() => buildIndex(items), [items]);

  useEffect(() => {
    if (rotate) setOrder(shuffledOrder(items.length));
  }, [rotate, items.length]);

  const pageSize = Math.min(limit ?? items.length, items.length);
  const outcome = useMemo(() => search(index, query), [index, query]);
  const isSearching = outcome.terms.length > 0;

  const visible = isSearching
    ? outcome.results.map((result) => items[result.index])
    : Array.from({ length: pageSize }, (_, k) => items[order[(offset + k) % order.length]]);

  const canRotate = !isSearching && pageSize < items.length;

  function showOthers() {
    const next = offset + pageSize;
    if (next >= order.length) {
      setOrder(shuffledOrder(items.length));
      setOffset(0);
    } else {
      setOffset(next);
    }
  }

  let status: string;
  if (!isSearching) {
    status =
      pageSize < items.length
        ? `Mostrando ${pageSize} de ${items.length} preguntas. Busca por palabra clave para ver el resto.`
        : `${items.length} preguntas.`;
  } else if (outcome.results.length === 0) {
    status = "No encontramos nada con esas palabras.";
  } else if (outcome.approximate) {
    status = `Sin coincidencias exactas. Estas ${outcome.results.length} preguntas se parecen a tu búsqueda.`;
  } else {
    status = `${outcome.results.length} ${outcome.results.length === 1 ? "pregunta encontrada" : "preguntas encontradas"}.`;
  }

  return (
    <div className="faq-explorer">
      <div className="faq-search">
        <label htmlFor={inputId} className="faq-search-label">
          Buscar en las preguntas frecuentes
        </label>
        <div className="faq-search-field">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca: comprimir, gratis, borrar…"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button type="button" className="faq-search-clear" onClick={() => setQuery("")}>
              Borrar
            </button>
          )}
        </div>

        <div className="faq-suggestions" aria-label="Búsquedas sugeridas">
          {SUGGESTIONS.map((term) => (
            <button key={term} type="button" className="faq-chip" onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}
        </div>
      </div>

      <p className="faq-status" role="status" aria-live="polite">
        {status}
      </p>

      {visible.length > 0 && (
        <div className="faq">
          {visible.map((item) => (
            <details key={item.id} open={isSearching && !outcome.approximate && visible.length <= 3}>
              <summary>
                <span>
                  <Highlighted text={item.q} terms={outcome.terms} />
                </span>
              </summary>
              <p>
                <Highlighted text={item.a} terms={outcome.terms} />
              </p>
              {item.link && (
                <p className="faq-link">
                  <Link href={item.link.route}>
                    {item.link.label} <span aria-hidden="true">→</span>
                  </Link>
                </p>
              )}
            </details>
          ))}
        </div>
      )}

      {isSearching && outcome.results.length === 0 && (
        <p className="faq-empty">
          Prueba con otra palabra o con una de las búsquedas sugeridas. Si no encuentras lo que buscas,
          escríbenos desde <Link href="/contacto">Contacto</Link>.
        </p>
      )}

      {(canRotate || showAllLink) && (
        <div className="actions actions-tight">
          {canRotate && rotate && (
            <button type="button" className="btn btn-secondary" onClick={showOthers}>
              Mostrar otras preguntas
            </button>
          )}
          {showAllLink && (
            <Link href="/preguntas" className="btn btn-secondary">
              Ver todas las preguntas
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
