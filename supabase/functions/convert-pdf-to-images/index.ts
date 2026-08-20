// Supabase Edge Function: convierte cada página de un PDF en una imagen PNG.
// Runtime: Deno
//
// Usamos "mupdf" (compilado a WebAssembly) porque pdf-lib no puede renderizar
// páginas visualmente, solo manipular la estructura del PDF. mupdf sí puede
// "dibujar" cada página como si fuera una foto, y al ser WASM puro corre bien
// en el entorno de Supabase Edge Functions (sin necesidad de librerías nativas
// de sistema operativo, que ahí no están disponibles).

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import * as mupdf from "npm:mupdf@1.28.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "conversions";
const MAX_PAGES = 30; // límite de seguridad para no tronar la función con PDFs enormes

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fileUrls } = (await req.json()) as { fileUrls: string[] };

    if (!fileUrls || fileUrls.length !== 1) {
      return jsonResponse(
        { success: false, error: "Se necesita exactamente 1 PDF." },
        400
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const res = await fetch(fileUrls[0]);
    if (!res.ok) {
      return jsonResponse({ success: false, error: "No se pudo descargar el PDF." }, 400);
    }
    const bytes = new Uint8Array(await res.arrayBuffer());

    const doc = mupdf.Document.openDocument(bytes, "application/pdf");
    const pageCount = doc.countPages();

    if (pageCount > MAX_PAGES) {
      return jsonResponse(
        {
          success: false,
          error: `El PDF tiene ${pageCount} páginas. Por ahora el límite es ${MAX_PAGES}.`,
        },
        400
      );
    }

    const outputUrls: string[] = [];
    const batchId = crypto.randomUUID();

    for (let i = 0; i < pageCount; i++) {
      const page = doc.loadPage(i);
      // Escala 2x para buena calidad sin generar imágenes gigantes
      const pixmap = page.toPixmap(mupdf.Matrix.scale(2, 2), mupdf.ColorSpace.DeviceRGB);
      const pngBytes = pixmap.asPNG();

      const outputPath = `pdf-to-images/${batchId}/page-${i + 1}.png`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(outputPath, pngBytes, { contentType: "image/png" });

      if (uploadError) {
        return jsonResponse({ success: false, error: uploadError.message }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(outputPath);

      outputUrls.push(publicUrlData.publicUrl);

      pixmap.destroy();
      page.destroy();
    }

    doc.destroy();

    return jsonResponse({ success: true, outputUrls });
  } catch (err) {
    return jsonResponse(
      { success: false, error: err instanceof Error ? err.message : "Error desconocido" },
      500
    );
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}