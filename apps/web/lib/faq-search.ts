// Buscador de preguntas por palabras clave. Sin dependencias: ignora mayúsculas y tildes,
// reconoce variantes de una palabra (comprimir / comprime / compresión) y sinónimos
// (peso / tamaño / megas), y ordena por relevancia.

export interface SearchableFaq {
  id: string;
  q: string;
  a: string;
  keywords: string[];
}

export interface SearchResult {
  /** Posición del elemento en la lista original. */
  index: number;
  score: number;
}

export interface SearchOutcome {
  results: SearchResult[];
  /** true si no hubo coincidencias con todas las palabras y se muestran las más parecidas. */
  approximate: boolean;
  /** Palabras de la búsqueda ya normalizadas, para resaltarlas en el texto. */
  terms: string[];
}

/** Minúsculas y sin tildes, conservando la longitud del texto (útil para resaltar). */
export function fold(text: string): string {
  let out = "";
  for (const char of text) {
    // Los caracteres de dos unidades (emojis) se dejan tal cual para no cambiar la longitud
    out += char.length === 1 ? (char.normalize("NFD")[0] ?? char).toLowerCase()[0] : char;
  }
  return out;
}

const STOP_WORDS = new Set(
  (
    "a al algo como con cual cuales cuando de del el ella en es esta este esto fue ha han hay la las le lo los me mi mis " +
    "muy ni no nos o para pero por que se si sin sobre su sus te tu tus un una uno unas unos y ya yo puedo puede pueden " +
    "hago hacer hace donde cuanto cuantos cuantas quiero necesito"
  ).split(" "),
);

const SUFFIXES = [
  "amientos", "imientos", "aciones", "iciones", "amiento", "imiento", "ciones", "mente",
  "acion", "icion", "cion", "sion", "ando", "iendo", "ables", "ibles", "able", "ible",
  "ados", "adas", "idos", "idas", "ado", "ada", "ido", "ida", "ar", "er", "ir", "an", "en",
  "es", "as", "os", "s", "a", "e", "o",
];

/** Raíz aproximada de una palabra ya normalizada. */
export function stem(word: string): string {
  for (const suffix of SUFFIXES) {
    if (word.length - suffix.length >= 4 && word.endsWith(suffix)) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

/** Palabras con significado de un texto, normalizadas. */
export function tokenize(text: string): string[] {
  return fold(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 2 && !STOP_WORDS.has(word));
}

// Grupos de palabras que significan lo mismo para quien busca.
const SYNONYM_GROUPS: string[][] = [
  ["comprimir", "compresion", "reducir", "reduccion", "achicar", "aligerar", "optimizar", "peso", "pesa", "pesado", "tamano", "kb", "mb", "megas", "liviano", "ligero"],
  ["unir", "juntar", "combinar", "fusionar", "unificar", "agrupar", "mezclar"],
  ["word", "docx", "doc", "editar", "editable", "edicion"],
  ["imagen", "imagenes", "foto", "fotos", "fotografia", "jpg", "jpeg", "png", "captura"],
  ["celular", "movil", "telefono", "smartphone", "iphone", "android", "tablet"],
  ["escanear", "escaner", "escaneo", "escaneado", "perspectiva", "esquinas", "enderezar", "recortar", "camara"],
  ["privacidad", "seguro", "seguridad", "confidencial", "privado", "proteger", "datos", "personal"],
  ["borrar", "eliminar", "borrado", "elimina", "quitar", "retirar"],
  ["gratis", "gratuito", "precio", "costo", "pagar", "cobran", "cuesta", "marca", "watermark"],
  ["limite", "maximo", "diario", "cuota", "tope", "paginas", "hojas"],
  ["error", "falla", "fallo", "problema", "roto", "funciona"],
  ["lento", "tarda", "demora", "atascado", "cargando", "colgado", "espera"],
  ["cuenta", "registro", "registrar", "sesion", "instalar", "programa"],
  ["descargar", "descarga", "bajar"],
  ["contacto", "correo", "email", "escribir", "soporte", "ayuda", "mensaje"],
  ["contrasena", "clave", "password", "cifrado", "protegido", "bloqueado"],
  ["anuncios", "publicidad", "adsense", "banner"],
  ["nombre", "renombrar", "llama", "titulo"],
];

const SYNONYM_STEMS: string[][] = SYNONYM_GROUPS.map((group) => group.map(stem));

/** Dos raíces coinciden si son iguales o una empieza por la otra (para búsqueda "al escribir"). */
function stemsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.min(a.length, b.length) < 4) return false;
  return a.startsWith(b) || b.startsWith(a);
}

interface Variant {
  stem: string;
  weight: number;
}

/** La palabra escrita (peso 1) más sus sinónimos (peso menor). */
function variantsFor(token: string): Variant[] {
  const own = stem(token);
  const variants: Variant[] = [{ stem: own, weight: 1 }];

  for (const group of SYNONYM_STEMS) {
    if (group.some((candidate) => stemsMatch(candidate, own))) {
      for (const candidate of group) {
        if (!variants.some((v) => v.stem === candidate)) {
          variants.push({ stem: candidate, weight: 0.6 });
        }
      }
    }
  }
  return variants;
}

interface IndexedFaq {
  question: string[];
  keywords: string[];
  answer: string[];
}

export type FaqIndex = IndexedFaq[];

export function buildIndex(items: SearchableFaq[]): FaqIndex {
  return items.map((item) => ({
    question: tokenize(item.q).map(stem),
    keywords: item.keywords.flatMap(tokenize).map(stem),
    answer: tokenize(item.a).map(stem),
  }));
}

const FIELD_WEIGHTS = { question: 3, keywords: 2, answer: 1 } as const;

function tokenScore(entry: IndexedFaq, variants: Variant[]): number {
  let best = 0;
  for (const variant of variants) {
    for (const field of ["question", "keywords", "answer"] as const) {
      if (entry[field].some((word) => stemsMatch(word, variant.stem))) {
        best = Math.max(best, FIELD_WEIGHTS[field] * variant.weight);
      }
    }
  }
  return best;
}

export function search(index: FaqIndex, query: string): SearchOutcome {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return { results: [], approximate: false, terms };

  const variantsByTerm = terms.map(variantsFor);

  const scored = index.map((entry, position) => {
    const scores = variantsByTerm.map((variants) => tokenScore(entry, variants));
    return { index: position, scores, score: scores.reduce((sum, value) => sum + value, 0) };
  });

  const byRelevance = (a: SearchResult, b: SearchResult) => b.score - a.score || a.index - b.index;

  const exact = scored
    .filter((item) => item.scores.every((value) => value > 0))
    .map(({ index: position, score }) => ({ index: position, score }))
    .sort(byRelevance);
  if (exact.length > 0) return { results: exact, approximate: false, terms };

  const partial = scored
    .filter((item) => item.score > 0)
    .map(({ index: position, score }) => ({ index: position, score }))
    .sort(byRelevance);
  return { results: partial, approximate: partial.length > 0, terms };
}

/** Trozos de un texto marcando dónde aparecen las palabras buscadas. */
export function highlightRanges(text: string, terms: string[]): Array<{ text: string; match: boolean }> {
  if (terms.length === 0) return [{ text, match: false }];

  const folded = fold(text);
  const marked = new Array<boolean>(text.length).fill(false);

  for (const term of terms) {
    let from = 0;
    while (from <= folded.length - term.length) {
      const at = folded.indexOf(term, from);
      if (at === -1) break;
      // Solo al principio de una palabra, para no marcar «ar» dentro de «comparar»
      if (at === 0 || !/[a-z0-9]/.test(folded[at - 1])) {
        for (let i = at; i < at + term.length; i++) marked[i] = true;
      }
      from = at + term.length;
    }
  }

  const pieces: Array<{ text: string; match: boolean }> = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marked[i] !== marked[start]) {
      pieces.push({ text: text.slice(start, i), match: marked[start] });
      start = i;
    }
  }
  return pieces;
}

/** Orden aleatorio (Fisher–Yates) de las posiciones 0..length-1. */
export function shuffledOrder(length: number, random: () => number = Math.random): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
