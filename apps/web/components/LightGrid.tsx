"use client";

import { useEffect, useRef } from "react";

interface LightGridProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Grid de cards cuya sombra reacciona al cursor: la "luz" está donde está el
 * puntero, así que la sombra oscura de cada card apunta en sentido contrario.
 * Escribe --lx / --ly (vector unitario) en cada hijo; el CSS hace el resto.
 * Solo corre con puntero fino (no táctil), con la grilla visible y sin
 * prefers-reduced-motion.
 */
export function LightGrid({ className, children }: LightGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const cards = Array.from(grid.children) as HTMLElement[];
    let pointer: { x: number; y: number } | null = null;
    let isVisible = false;
    let frame = 0;

    function update() {
      frame = 0;
      if (!pointer || !isVisible) return;

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - pointer.x;
        const dy = rect.top + rect.height / 2 - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        card.style.setProperty("--lx", (dx / distance).toFixed(3));
        card.style.setProperty("--ly", (dy / distance).toFixed(3));
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function reset() {
      pointer = null;
      for (const card of cards) {
        card.style.removeProperty("--lx");
        card.style.removeProperty("--ly");
      }
    }

    function onPointerMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) schedule();
    });
    observer.observe(grid);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", reset);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, []);

  return (
    <div ref={gridRef} className={className}>
      {children}
    </div>
  );
}
