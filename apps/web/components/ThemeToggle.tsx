"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Alterna entre modo claro y oscuro. El tema inicial lo resuelve un script en
 * <head> (preferencia guardada o del sistema) para evitar el parpadeo; aquí solo
 * se sincroniza el estado, se guarda la elección y se sigue al sistema mientras
 * la persona no haya elegido nada.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

    const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readStoredTheme()) return;
      const next: Theme = systemQuery.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };

    systemQuery.addEventListener("change", onSystemChange);
    return () => systemQuery.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 400);
    }

    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sin almacenamiento (modo privado): el cambio vale solo para esta visita
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Modo oscuro"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Cambiar entre modo claro y oscuro"
    >
      <Moon className="icon-moon" size={20} aria-hidden="true" />
      <Sun className="icon-sun" size={20} aria-hidden="true" />
    </button>
  );
}
