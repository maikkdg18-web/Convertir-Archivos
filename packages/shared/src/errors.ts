/**
 * Traduce mensajes técnicos de Supabase / CloudConvert a texto entendible
 * para quien usa la app. Si no reconoce el error, lo devuelve tal cual.
 */
export function toFriendlyError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("failed to send a request")) {
    return "La función de conversión aún no está desplegada en Supabase.";
  }

  if (
    normalized.includes("credit") ||
    normalized.includes("quota") ||
    normalized.includes("limit") ||
    normalized.includes("daily")
  ) {
    return "Se alcanzó el límite diario de conversiones. Intenta de nuevo mañana.";
  }

  if (normalized.includes("unauthorized") || normalized.includes("api key")) {
    return "La clave de CloudConvert no es válida o fue revocada.";
  }

  return message;
}
