import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, formatGuideDate, getGuide, type GuideBlock } from "../../../lib/guides";
import { SITE_NAME, SITE_URL } from "../../../lib/site";

interface GuidePageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: GuidePageProps): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guias/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}/guias/${guide.slug}`,
      publishedTime: guide.published,
    },
  };
}

function renderBlock(block: GuideBlock, index: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={index}>{block.text}</h2>;
    case "p":
      return <p key={index}>{block.text}</p>;
    case "ul":
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p key={index} className="article-note">
          {block.text}
        </p>
      );
  }
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const related = guide.related.flatMap((slug) => {
    const item = getGuide(slug);
    return item ? [item] : [];
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    inLanguage: "es",
    mainEntityOfPage: `${SITE_URL}/guias/${guide.slug}`,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <main className="page">
      <Link href="/guias" className="back-link">
        ← Todas las guías
      </Link>

      <article className="article">
        <header className="article-header">
          <p className="article-meta">
            {formatGuideDate(guide.published)} · {guide.readingMinutes} min de lectura
          </p>
          <h1 className="sheet-title">{guide.title}</h1>
          <p className="sheet-desc">{guide.description}</p>
        </header>

        {guide.body.map(renderBlock)}

        {guide.tool && (
          <div className="article-cta">
            <p>¿Listo para probarlo? Es gratis y no necesitas crear una cuenta.</p>
            <Link href={guide.tool.route} className="btn btn-primary">
              {guide.tool.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <aside className="article-related" aria-label="Sigue leyendo">
          <h2>Sigue leyendo</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/guias/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
