import type { MetadataRoute } from "next";
import { GUIDES } from "../lib/guides";
import { SITE_URL } from "../lib/site";

const ROUTES = [
  "",
  "/unir-pdfs",
  "/comprimir-pdf",
  "/pdf-a-imagenes",
  "/imagenes-a-pdf",
  "/word-a-pdf",
  "/pdf-a-word",
  "/guias",
  "/preguntas",
  "/acerca-de",
  "/contacto",
  "/politica-de-privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));

  const guides = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: new Date(`${guide.published}T12:00:00`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...guides];
}
