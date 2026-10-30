"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4811758361067744";

// Los anuncios solo van en páginas con contenido propio (portada, guías y preguntas). Las pantallas
// de las herramientas son sobre todo una zona de subida de archivos y AdSense las
// considera "pantallas sin contenido del editor".
function showsAds(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/preguntas" ||
    pathname === "/guias" ||
    pathname.startsWith("/guias/")
  );
}

/**
 * Carga AdSense con next/script: como <script> estático en el head de la página rompe la
 * hidratación de React. Si la persona entra a una herramienta navegando desde una página
 * con anuncios, el script ya cargado puede seguir activo hasta que se recargue la página.
 */
export function AdSenseLoader() {
  const pathname = usePathname();
  if (!showsAds(pathname)) return null;

  return <Script async src={ADSENSE_SRC} crossOrigin="anonymous" strategy="afterInteractive" />;
}
