// Supabase Edge Function: convierte una o varias imágenes en un solo PDF.
// Runtime: Deno

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

    if (!fileUrls || fileUrls.length < 1) {
      return jsonResponse(
        { success: false, error: "Se necesita al menos 1 imagen." },
        400
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const pdf = await PDFDocument.create();

    for (const fileUrl of fileUrls) {
      const res = await fetch(fileUrl);
      if (!res.ok) {
        return jsonResponse(
          { success: false, error: `No se pudo descargar una de las imágenes.` },
          400
        );
      }

      const contentType = res.headers.get("content-type") ?? "";
      const bytes = new Uint8Array(await res.arrayBuffer());

      const isPng = contentType.includes("png") || fileUrl.toLowerCase().endsWith(".png");

      let image;
      try {
        image = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      } catch {
        return jsonResponse(
          { success: false, error: "Una de las imágenes no es un PNG o JPG válido." },
          400
        );
      }

      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdf.save();
    const outputPath = `images-to-pdf/${crypto.randomUUID()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(outputPath, pdfBytes, { contentType: "application/pdf" });

    if (uploadError) {
      return jsonResponse({ success: false, error: uploadError.message }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(outputPath);

    return jsonResponse({ success: true, outputUrl: publicUrlData.publicUrl });
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