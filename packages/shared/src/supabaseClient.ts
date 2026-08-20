import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Crea un cliente de Supabase reutilizable.
 * Tanto web (Next.js) como mobile (Expo) deben pasar sus propias
 * variables de entorno (SUPABASE_URL y SUPABASE_ANON_KEY).
 */
export function createSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient {
  return createClient(url, anonKey);
}
