import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

const ROUTES = [
  "",
  "/unir-pdfs",
  "/comprimir-pdf",
  "/pdf-a-imagenes",
  "/imagenes-a-pdf",
  "/word-a-pdf",
  "/pdf-a-word",
  "/acerca-de",
  "/contacto",
  "/politica-de-privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
