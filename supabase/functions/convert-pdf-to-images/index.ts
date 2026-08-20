// Supabase Edge Function: convierte cada página de un PDF en una imagen (PNG/JPG).
// Runtime: Deno
// TODO: implementar con una librería de renderizado de PDF compatible con Deno
// (ej. pdfjs-dist en modo worker, o mover a backend Node con pdf-poppler si
// el rendering en Deno da problemas).

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
