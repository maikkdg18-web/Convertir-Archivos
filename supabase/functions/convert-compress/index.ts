// Supabase Edge Function: comprime un PDF optimizando su estructura interna.
// Runtime: Deno
//
// Nota honesta: pdf-lib no puede recomprimir imágenes agresivamente (eso
// requiere algo como Ghostscript). Lo que hacemos aquí es: quitar metadata
// innecesaria y guardar con object streams (agrupa objetos internos, reduce
// tamaño de archivo). Para PDFs con puro texto/vectores el ahorro puede ser
// notable; para PDFs con fotos de alta resolución el ahorro será menor.

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "conversions";

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
        { success: false, error: "Se necesita exactamente 1 archivo para comprimir." },
        400
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const res = await fetch(fileUrls[0]);
    if (!res.ok) {
      return jsonResponse({ success: false, error: "No se pudo descargar el archivo original." }, 400);
    }
    const originalBytes = await res.arrayBuffer();
    const originalSize = originalBytes.byteLength;

    const pdf = await PDFDocument.load(originalBytes, {
      updateMetadata: false,
    });

    // Limpia metadata que no aporta y puede pesar
    pdf.setTitle("");
    pdf.setAuthor("");
    pdf.setSubject("");
    pdf.setKeywords([]);
    pdf.setProducer("");
    pdf.setCreator("");

    const compressedBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const compressedSize = compressedBytes.byteLength;
    const outputPath = `compressed/${crypto.randomUUID()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(outputPath, compressedBytes, { contentType: "application/pdf" });

    if (uploadError) {
      return jsonResponse({ success: false, error: uploadError.message }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(outputPath);

    const savedPercent =
      originalSize > 0
        ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
        : 0;

    return jsonResponse({
      success: true,
      outputUrl: publicUrlData.publicUrl,
      originalSize,
      compressedSize,
      savedPercent,
    });
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