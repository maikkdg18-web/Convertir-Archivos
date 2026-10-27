# Rediseño: Glassmorphism → Neumorphism + Soft UI Evolution

> Instrucciones para Claude Code. Proyecto: monorepo `Convertir-Archivos` (`apps/web` Next.js, `apps/mobile` Expo/React Native, `packages/shared`).
> Objetivo: reemplazar el estilo glass oscuro actual por un sistema Soft UI claro, accesible (WCAG 2.1 AA) y consistente entre web y móvil, sin romper la lógica de conversión.

## Reglas generales

- **No tocar** la lógica de Supabase (uploads, `functions.invoke`, descargas) salvo donde se indique.
- Trabajar en una rama nueva: `feat/soft-ui-redesign`.
- Commits pequeños por fase (ver orden al final).
- Al terminar cada fase, correr `npm run build` en `apps/web` y verificar que compila sin errores.
- Respetar el responsive actual (breakpoints 560px, 800px, 1200px, 1600px).

## Principios del estilo (aplican a todo)

1. **Superficies opacas del mismo color que el fondo.** La profundidad se logra con dos sombras: clara arriba-izquierda y oscura abajo-derecha.
2. **Tres estados de profundidad con significado:**
   - `raised` = elemento clickeable (cards, botones).
   - `inset` = zona de entrada o elemento presionado (dropzone en reposo, barra de progreso, `:active`).
   - `flat` = deshabilitado (sin sombra).
3. **Un solo color con peso:** el CTA primario va en violeta sólido. Todo lo demás es neutro.
4. **Contraste primero (Soft UI Evolution):** texto oscuro, borde sutil de 1px en superficies y anillo de foco visible. La sombra NUNCA es el único indicador de estado o foco.
5. **Prohibido:** `backdrop-filter`, colores `rgba` translúcidos como superficie, bordes `dashed`, fondos animados y degradados en cards.

---

## Fase 1 — Tokens y base (`apps/web/app/globals.css`)

### 1.1 Reemplazar el bloque `:root`
Eliminar todas las variables `--glass-*`, `--accent-strong`, `--teal`, `--line`, `--line-soft` y `--grid-size`. Usar:

```css
:root {
  --bg: #E8ECF2;
  --surface: #E8ECF2;
  --ink: #1F2937;        /* 12.4:1 sobre --bg */
  --ink-soft: #4B5563;   /* 6.4:1 */
  --ink-faint: #6B7280;  /* 4.1:1 — SOLO íconos/decoración, nunca texto */
  --accent: #6D28D9;     /* texto blanco encima: 7.1:1 */
  --accent-soft: #EDE7FB;
  --success: #0F766E;
  --success-soft: #DDF3EF;
  --danger: #B91C1C;
  --danger-soft: #FBE4E4;
  --edge: rgba(255, 255, 255, 0.6);
  --divider: #D5DBE5;

  --light: #FFFFFF;
  --dark: #C5CCD8;
  --raised: 6px 6px 14px var(--dark), -6px -6px 14px var(--light);
  --raised-sm: 3px 3px 8px var(--dark), -3px -3px 8px var(--light);
  --inset: inset 4px 4px 10px var(--dark), inset -4px -4px 10px var(--light);
  --inset-sm: inset 2px 2px 5px var(--dark), inset -2px -2px 5px var(--light);
  --focus-ring: 0 0 0 3px var(--bg), 0 0 0 5px var(--accent);

  --r-sm: 12px;
  --r-md: 20px;
  --r-lg: 28px;
  --r-pill: 999px;
}
```

### 1.2 Fondo y tipografía
- `body`: quitar `background` degradado, `background-size`, `animation`, `background-attachment` y el `@keyframes gradientBG`. Dejar `background: var(--bg); color: var(--ink);`.
- Reemplazar el `@import` de Google Fonts: **Manrope** (400, 500, 600, 700, 800) + **IBM Plex Mono** (400, 500). Quitar Space Grotesk e IBM Plex Sans.
- `body` y `h1–h3`: `font-family: "Manrope", ui-sans-serif, system-ui, sans-serif`.
- `.mono` y mono en general: usar SOLO para tamaños de archivo, formatos (`PDF → PNG`) y números de índice. Quitar mono de: `.btn`, `.dropzone-hint`, `.back-link`, `.file-row` (excepto `.file-index` y tamaño), `.site-footer-links a`, `.error-text`, `.result-meta`, `.conversion-note`, `.trust-strip`.

### 1.3 Accesibilidad global
Reemplazar el bloque `prefers-reduced-motion` por:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}

:is(a, button, [role="button"], .dropzone, .landing-tool, .tool-card):focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

---

## Fase 2 — Componentes (`globals.css`)

| Selector | Cambio |
|---|---|
| `.letterhead` | Fondo `var(--bg)`, sin blur, sin border-bottom. Sombra inferior suave: `0 6px 14px -8px var(--dark)`. |
| `.brand-icon` | Sombra `var(--raised-sm)`. |
| `.wordmark span` | Color `var(--accent)`. |
| `.status-dot::before` | Color `var(--success)` sin glow. Texto en `--ink-soft`. |
| `.back-link` | Sans, sin uppercase, `--ink-soft`; hover `--accent`. Debe ser una pastilla `raised-sm` con `min-height: 44px` y `padding: 0 16px`. |
| `.sheet-header` | Quitar `border-bottom`. |
| `.sheet-number` | **Eliminar** del CSS (y del JSX, ver Fase 3). |
| `.tool-card`, `.landing-tool` | `background: var(--surface)`, `border: 1px solid var(--edge)`, `border-radius: var(--r-md)`, `box-shadow: var(--raised)`, `color: var(--ink)`. Hover: `translateY(-2px)`. `:active`: `box-shadow: var(--inset)`, sin translate. |
| `.tool-tone-1` … `.tool-tone-6` | **Eliminar.** Las cards son neutras. |
| `.tool-symbol` | Convertir en "ícono en pozo": círculo de 44px, `box-shadow: var(--inset-sm)`, color `var(--accent)`. Ver Fase 3 para el contenido. |
| `.landing-tool-action` | `border-top: 1px solid var(--divider)`, color `--ink-soft`. |
| `[data-disabled="true"]` | `box-shadow: none`, `color: var(--ink-faint)`, sin hover. |
| `.dropzone` | Sin dashed ni blur: `border: 2px solid transparent`, `border-radius: var(--r-lg)`, `box-shadow: var(--inset)`. `[data-active="true"]` y `:hover`: `box-shadow: var(--raised)`, `border-color: var(--accent)`. Agregar un ícono central (círculo raised de 64px con flecha ↑ en `--accent`) arriba del texto. |
| `.crosshair` | **Eliminar** del CSS y del JSX. |
| `.file-list` | Sin border ni blur. `box-shadow: var(--inset-sm)`, `border-radius: var(--r-md)`, `padding: 8px`. |
| `.file-row` | Cada fila es un chip `raised-sm` con `border-radius: var(--r-sm)` y `margin: 6px 0`. Sin `border-bottom`. Sans; tamaño de archivo en mono `--ink-soft`. |
| `.file-remove` | Botón cuadrado de **44×44px mínimo**, `raised-sm`, hover color `--danger`, `:active` inset. Agregar `aria-label="Quitar {nombre}"`. |
| `.btn` | `min-height: 44px`, `border-radius: var(--r-sm)`, `border: 1px solid var(--edge)`, `background: var(--surface)`, `color: var(--ink)`, `box-shadow: var(--raised-sm)`, sans 600. Quitar `backdrop-filter`. `:active` → `var(--inset-sm)`. |
| `.btn-primary` | `background: var(--accent)`, `color: #fff`, `border-color: transparent`, `box-shadow: 4px 4px 12px rgba(109,40,217,.35), -4px -4px 12px var(--light)`. Hover: `filter: brightness(1.08)`. |
| `.btn-success` | `background: var(--success)`, `color: #fff`, sombra como primary pero con `rgba(15,118,110,.35)`. |
| **Nuevo** `.btn-secondary` | Botón neutro (estilo base `.btn`). |
| `.btn:disabled` | `box-shadow: none`, `background: var(--bg)`, `color: var(--ink-faint)`, `opacity: 1`. |
| `.result-panel` | Sin dashed ni blur. `background: var(--surface)`, `box-shadow: var(--raised)`, `border-radius: var(--r-lg)`, `border-left: 4px solid var(--success)`. |
| `.stamp` | Quitar `rotate`. Pastilla `--success-soft` con texto `--success`, sans 600, sin uppercase: "✓ Listo". |
| `.error-text` | `background: var(--danger-soft)`, `color: var(--danger)`, `border-left: 4px solid var(--danger)`, sin blur, sans 500. Agregar `role="alert"` en el JSX. |
| `.image-card` | `raised-sm`, sin blur. El botón interno con `min-height: 44px`, `border-top: 1px solid var(--divider)`. |
| `.landing-hero` | `background: var(--surface)`, `box-shadow: var(--raised)`, `border: 1px solid var(--edge)`, sin blur. |
| `.hero-copy h1` | `color: var(--ink)`, quitar `text-shadow`. |
| `.landing-button` | Mismo estilo que `.btn-primary`, `min-height: 48px`. |
| `.hero-ring` | Sin dashed. `border: none`, `box-shadow: var(--inset)`. `.hero-ring-front` con `box-shadow: var(--raised)`. Quitar fondos rgba. |
| `.file-preview` | `background: var(--surface)`, `box-shadow: var(--raised)`, `border: 1px solid var(--edge)`, sin blur. `.file-line` en `--divider`; `.file-line-short` en `--accent`. `.file-corner` en `--divider`. |
| `.floating-chip` | `background: var(--surface)`, `color: var(--ink)`, `box-shadow: var(--raised-sm)`, `border-radius: var(--r-pill)`. `.chip-bottom` con color `--success`. |
| `.trust-strip` | `box-shadow: var(--inset-sm)`, `color: var(--ink-soft)`, sin blur. |
| `.trust-dots` | **Eliminar** del CSS y del JSX. |
| `.section-heading h2`, `.benefits-intro h2` | `color: var(--ink)`. |
| `.benefits-band` | `background: var(--surface)`, `box-shadow: var(--raised)`, `color: var(--ink)`, sin blur. `.eyebrow` en `--ink-soft`. |
| `.benefit-item > span` | Círculo de 40px `inset-sm`, color `--accent`. |
| `.site-footer` | `border-top: 1px solid var(--divider)`. Links con `min-height: 44px` (display inline-flex, align-items center). |
| `.eyebrow` | Color `--accent`, sans 700, conserva uppercase y letter-spacing. |
| **Nuevo** `.actions` | `margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;` |
| **Nuevo** `.progress` | Track: `height: 12px`, `border-radius: var(--r-pill)`, `box-shadow: var(--inset-sm)`. Fill: `background: var(--accent)`, mismo radio, `transition: width .3s`. |

Escala de radios: reemplazar todos los valores sueltos (8, 9, 12, 16, 18, 20, 24, 25, 28px) por `--r-sm`, `--r-md`, `--r-lg` o `--r-pill`.

---

## Fase 3 — JSX y copy

### `apps/web/app/page.tsx`
- Quitar `tool-tone-${index + 1}` del className.
- Cambiar `tool-symbol` (↗) por un ícono por herramienta (lucide-react: `Combine`, `Minimize2`, `Image`, `FileImage`, `FileText`, `FileType`). Instalar `lucide-react` en `apps/web`. Agregar el campo `icon` al array `TOOLS`.
- Quedarse con una sola flecha por card: conservar "Abrir herramienta →" y quitar el ↗.
- Eliminar `<span className="trust-dots">`.
- Benefits: reemplazar ✦ ↗ ✓ por íconos lucide (`Download`, `Zap`, `ShieldCheck`).

### `apps/web/app/layout.tsx`
- `style={{ fontSize: 12 }}` en el footer → clase CSS.
- Wordmark: "Conversor**.**de archivos" o mantener mayúsculas, pero el punto en `--accent`.

### `apps/web/components/FileDropzone.tsx`
- Eliminar los 4 `<span className="crosshair …">`.
- Agregar `aria-label="Subir archivos"` al div `role="button"`.
- Prevenir el scroll con Espacio: `e.preventDefault()` en `onKeyDown`.
- `id="file-input"` es global y puede duplicarse: usar `useRef` en lugar de `document.getElementById`.
- Texto: "Arrastra tus archivos aquí o **haz clic para elegirlos**" (mayúscula inicial, "clic" con c).
- Agregar el ícono de subida (ver Fase 2).

### `apps/web/components/SingleFileConverter.tsx` y `apps/web/app/unir-pdfs/page.tsx` (y demás páginas de herramienta)
- `"← volver al set"` → `"← Todas las herramientas"`.
- Eliminar `<span className="sheet-number">HOJA XX</span>`.
- `<div style={{ marginTop: 24 }}>` → `<div className="actions">`.
- Mayúscula inicial en todos los labels: "Unir PDFs →", "Subiendo archivos…", "Uniendo PDFs…", "Descargando…", "Descargar PDF".
- `.error-text` con `role="alert"`; resultado con `role="status"`.
- Agregar `<div className="progress">` visible mientras `status` sea `uploading` o `processing`. En unir-pdfs mostrar "Subiendo 2 de 3…" (contador en el loop de uploads).
- Quitar mono del estilo del texto del botón.

### `apps/web/app/unir-pdfs/page.tsx` — funcionalidad
- **Reordenar archivos:** botones ↑ / ↓ por fila (44×44, `aria-label="Mover {nombre} arriba/abajo"`), deshabilitados en extremos. El texto promete "en el orden en que los agregues" y hoy no se puede corregir el orden.
- `key={i}` → key estable (`file.name + file.lastModified + i` o un id generado al agregar).
- Botón "quitar" → ícono `X` con `aria-label`.
- Si se suelta un archivo que no es PDF, mostrar error ("Solo se aceptan PDFs") en vez de ignorarlo en silencio.

### `apps/web/components/CornerAdjuster.tsx`
- Botón **Cancelar**: cambiar `btn-success` → `btn-secondary`.
- `style={{ borderStyle: "solid" }}` en `.result-panel` → ya no es necesario, quitarlo.
- Contenedor de botones inline → `className="actions"`.
- Los handles de las esquinas: tamaño táctil mínimo de 44px (puede ser un área invisible más grande que el punto visible).

### Errores consistentes (`packages/shared`)
- Crear `packages/shared/src/errors.ts` con `toFriendlyError(message: string): string`, moviendo ahí el mapeo que hoy vive en `SingleFileConverter` (failed to send a request, credit/quota/limit/daily, unauthorized/api key).
- Usarlo también en `unir-pdfs` y en cualquier otra página que muestre `fnError.message` crudo.

### Páginas estáticas
- `acerca-de`, `contacto`, `politica-de-privacidad`: revisar que no usen clases o colores glass; envolver el contenido en una card `raised` con `border-radius: var(--r-lg)` y `padding: 32px`.

---

## Fase 4 — Tokens compartidos para móvil

### `packages/shared/src/theme.ts`
Exportar los mismos valores como objeto:

```ts
export const theme = {
  colors: {
    bg: "#E8ECF2", surface: "#E8ECF2", ink: "#1F2937", inkSoft: "#4B5563",
    inkFaint: "#6B7280", accent: "#6D28D9", accentSoft: "#EDE7FB",
    success: "#0F766E", successSoft: "#DDF3EF", danger: "#B91C1C",
    dangerSoft: "#FBE4E4", divider: "#D5DBE5", light: "#FFFFFF", dark: "#C5CCD8",
  },
  radius: { sm: 12, md: 20, lg: 28, pill: 999 },
  touch: 44,
} as const;
```

Exportarlo desde el index de `packages/shared`.

### `apps/mobile`
- Crear `components/NeuView.tsx`: React Native solo soporta una sombra por vista, así que la sombra doble se arma con dos `View` anidados (exterior con sombra clara offset -6/-6, interior con sombra oscura offset 6/6, ambos `backgroundColor: theme.colors.surface`). Props: `variant: "raised" | "inset" | "flat"`, `radius`. Para `inset`, usar `react-native-inner-shadow` o simularlo con un borde interior más oscuro arriba-izquierda.
- Rehacer `App.tsx`: fondo `theme.colors.bg`, título con `theme.colors.ink`, y la lista de herramientas como cards `NeuView raised` en grid de 2 columnas (`minHeight` ≥ 120, ícono en pozo inset, nombre, tag del formato). Cada card con `accessibilityRole="button"` y `accessibilityLabel`.
- Dejar el TODO de navegación como está (no es parte de este rediseño).

---

## Criterios de aceptación

- [ ] `grep -rn "backdrop-filter\|glass-\|dashed\|gradientBG\|tool-tone\|crosshair\|sheet-number\|trust-dots" apps/web` no devuelve resultados.
- [ ] No hay texto con color `--ink-faint` (solo íconos o decoración).
- [ ] Todos los elementos interactivos miden ≥ 44×44px.
- [ ] Todos los interactivos muestran el anillo de foco al navegar con Tab (incluye dropzone, cards del home, links del footer, botones de reordenar).
- [ ] Con `prefers-reduced-motion: reduce` no hay ninguna animación.
- [ ] Solo hay 2 familias tipográficas cargadas (Manrope + IBM Plex Mono).
- [ ] Unir PDFs permite reordenar y muestra progreso "Subiendo X de N".
- [ ] El botón Cancelar de CornerAdjuster es neutro.
- [ ] Los errores de todas las herramientas pasan por `toFriendlyError`.
- [ ] `npm run build` en `apps/web` sin errores; la app móvil arranca con `npx expo start` sin errores.
- [ ] Revisión visual en 375px, 800px y 1440px: sin scroll horizontal y con las sombras visibles en todos los tamaños.

## Orden de commits sugerido

1. `style: tokens Soft UI y base sin glassmorphism`
2. `style: componentes neumórficos (cards, dropzone, botones, paneles)`
3. `feat: íconos, copy y accesibilidad en páginas de herramientas`
4. `feat(unir-pdfs): reordenar archivos y progreso de subida`
5. `refactor(shared): toFriendlyError y theme compartido`
6. `feat(mobile): pantalla principal con NeuView`

## Excepción: animaciones ambientales (solo el home)

La regla 5 prohíbe fondos animados. Se mantiene: el fondo (`--bg`) nunca se anima. Se permiten únicamente estos efectos sobre **objetos** del home, todos anulados con `prefers-reduced-motion`:

- **Flotación del hero:** `.hero-ring`, `.file-preview` y `.floating-chip` flotan ±8px (propiedad `translate`, ciclos de 5–9 s).
- **Entrada del hero:** el texto sube escalonado y las hojas "caen" a su lugar una sola vez al cargar.
- **Luz que sigue al cursor:** `LightGrid` orienta la sombra de las cards del home según el puntero. Solo con puntero fino y grilla visible.
