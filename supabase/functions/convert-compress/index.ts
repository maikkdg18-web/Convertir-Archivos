// Supabase Edge Function: comprime un PDF (reduce calidad de imágenes internas).
// Runtime: Deno
// TODO: implementar compresión real con pdf-lib (recomprimir imágenes embebidas)
// o evaluar mover esta función a un backend Node con Ghostscript si se requiere
// mayor compresión.

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

serve(async (req) => {
  const { fileUrls } = (await req.json()) as { fileUrls: string[] };
  return new Response(
    JSON.stringify({
      success: false,
      error: "Función aún no implementada. fileUrls recibidos: " + fileUrls?.length,
    }),
    { status: 501, headers: { "Content-Type": "application/json" } }
  );
});
