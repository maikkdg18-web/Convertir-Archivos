// Supabase Edge Function: convierte una o varias imágenes en un solo PDF.
// Runtime: Deno

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@1.17.1?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "conversions";

serve(async (req) => {
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
      const bytes = new Uint8Array(await res.arrayBuffer());
      const isPng = fileUrl.toLowerCase().endsWith(".png");

      const image = isPng
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);

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
    headers: { "Content-Type": "application/json" },
  });
}
