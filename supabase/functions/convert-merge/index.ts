// Supabase Edge Function: une varios PDFs en uno solo.
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

    if (!fileUrls || fileUrls.length < 2) {
      return jsonResponse(
        { success: false, error: "Se necesitan al menos 2 archivos para unir." },
        400
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const mergedPdf = await PDFDocument.create();

    for (const fileUrl of fileUrls) {
      const res = await fetch(fileUrl);
      const bytes = await res.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const outputPath = `merged/${crypto.randomUUID()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(outputPath, mergedBytes, { contentType: "application/pdf" });

    if (uploadError) {
      return jsonResponse({ success: false, error: uploadError.message }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(outputPath);

    return jsonResponse({
      success: true,
      outputUrl: publicUrlData.publicUrl,
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
    headers: { "Content-Type": "application/json" },
  });
}
