"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

// La elección se guarda en localStorage y, como respaldo, en una cookie de un año
function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // localStorage bloqueado: se intenta con la cookie
  }
  const match = document.cookie.match(/(?:^|; )theme=(light|dark)/);
  return isTheme(match?.[1]) ? match[1] : null;
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Sin localStorage: queda la cookie
  }
  document.cookie = `${STORAGE_KEY}=${theme}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
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

    // Si se cambia el tema en otra pestaña, esta se actualiza
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !isTheme(e.newValue)) return;
      applyTheme(e.newValue);
      setTheme(e.newValue);
    };

    systemQuery.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      systemQuery.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
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
    storeTheme(next);
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
