// Supabase Edge Function: borra archivos viejos del bucket "conversions"
// (tanto los subidos por el usuario como los resultados generados).
// Se ejecuta sola cada hora vía pg_cron (ver supabase/migrations).
// Runtime: Deno

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "conversions";

// Carpetas que usan las demás funciones para subir archivos/resultados.
const ROOT_PREFIXES = ["uploads", "merged", "compressed", "images-to-pdf", "pdf-to-images"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StorageEntry {
  path: string;
  createdAt: string | null;
}

// Lista un prefijo recursivamente (el SDK de storage no distingue carpetas de
// archivos directamente: una entrada con id=null es una carpeta).
async function listFilesRecursive(
  supabase: ReturnType<typeof createClient>,
  prefix: string
): Promise<StorageEntry[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error || !data) return [];

  const results: StorageEntry[] = [];
  for (const entry of data) {
    const fullPath = `${prefix}/${entry.name}`;
    if (entry.id === null) {
      results.push(...(await listFilesRecursive(supabase, fullPath)));
    } else {
      results.push({ path: fullPath, createdAt: entry.created_at });
    }
  }
  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const maxAgeMinutes = Number(Deno.env.get("CLEANUP_MAX_AGE_MINUTES") ?? "60");
    const cutoff = Date.now() - maxAgeMinutes * 60 * 1000;

    const allFiles = (
      await Promise.all(ROOT_PREFIXES.map((prefix) => listFilesRecursive(supabase, prefix)))
    ).flat();

    const staleFiles = allFiles.filter(
      (f) => f.createdAt && new Date(f.createdAt).getTime() < cutoff
    );

    if (staleFiles.length > 0) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove(staleFiles.map((f) => f.path));

      if (removeError) {
        return jsonResponse({ success: false, error: removeError.message }, 500);
      }
    }

    return jsonResponse({ success: true, deleted: staleFiles.length });
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
