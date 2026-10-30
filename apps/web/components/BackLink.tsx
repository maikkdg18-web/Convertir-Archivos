"use client";

import { useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Ruta actual y anterior dentro de esta sesión de navegación del cliente. Se pierden
// al recargar o al entrar directo a una herramienta, y entonces BackLink usa su enlace.
let currentPath: string | null = null;
let previousPath: string | null = null;

/** Se monta una vez en el layout para saber de qué página viene la persona. */
export function NavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === currentPath) return;
    previousPath = currentPath;
    currentPath = pathname;
  }, [pathname]);

  return null;
}

/**
 * "Todas las herramientas": si vienes de la portada vuelve atrás en el historial, con lo
 * que el navegador restaura el scroll exacto donde estabas. Si no (entrada directa,
 * recarga, otra página), lleva a la lista de herramientas.
 */
export function BackLink() {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const opensElsewhere =
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (opensElsewhere || previousPath !== "/") return;

    event.preventDefault();
    router.back();
  }

  return (
    <Link href="/#herramientas" className="back-link" onClick={handleClick}>
      ← Todas las herramientas
    </Link>
  );
}
