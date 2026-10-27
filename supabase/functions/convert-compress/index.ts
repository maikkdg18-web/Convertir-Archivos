// Supabase Edge Function: comprime un PDF usando CloudConvert (motor real de
// optimización: sí recomprime imágenes incrustadas, a diferencia de pdf-lib
// que solo puede limpiar metadata y reordenar objetos internos).
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const CLOUDCONVERT_API_URL = "https://api.cloudconvert.com/v2";
const CLOUDCONVERT_API_KEY = Deno.env.get("CLOUDCONVERT_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!CLOUDCONVERT_API_KEY) {
      return jsonResponse({ success: false, error: "Falta configurar CLOUDCONVERT_API_KEY en Supabase." }, 500);
    }

    const { fileUrls } = (await req.json()) as { fileUrls?: string[] };
    const fileUrl = fileUrls?.[0];
    if (!fileUrl) {
      return jsonResponse({ success: false, error: "Se necesita un PDF válido." }, 400);
    }

    const originalSize = await getRemoteSize(fileUrl);

    const job = await createJob(fileUrl);
    const finishedJob = await waitForJob(job.id);
    const exportFile = getExportFile(finishedJob);

    const compressedSize = exportFile.size ?? (await getRemoteSize(exportFile.url));
    const savedPercent =
      originalSize > 0 ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100)) : 0;

    return jsonResponse({
      success: true,
      outputUrl: exportFile.url,
      originalSize,
      compressedSize,
      savedPercent,
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido al comprimir el PDF.",
    }, 500);
  }
});

async function createJob(fileUrl: string) {
  const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: {
        "import-file": { operation: "import/url", url: fileUrl, filename: "documento.pdf" },
        "optimize-file": {
          operation: "optimize",
          input: "import-file",
          input_format: "pdf",
        },
        "export-file": { operation: "export/url", input: "optimize-file" },
      },
    }),
  });

  if (!response.ok) throw new Error(await readCloudConvertError(response));
  const payload = (await response.json()) as { data?: { id?: string } };
  if (!payload.data?.id) throw new Error("CloudConvert no devolvió un identificador de trabajo.");
  return { id: payload.data.id };
}

async function waitForJob(jobId: string) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${CLOUDCONVERT_API_KEY}` },
    });
    if (!response.ok) throw new Error(await readCloudConvertError(response));

    const job = (await response.json()) as {
      data: { status: string; tasks: Array<{ name: string; status: string; message?: string }> };
    };
    if (job.data.status === "finished") return job.data;
    if (job.data.status === "error") {
      const failedTask = job.data.tasks.find((task) => task.status === "error");
      throw new Error(failedTask?.message ?? "CloudConvert no pudo comprimir el archivo.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("La compresión tardó demasiado. Intenta de nuevo.");
}

function getExportFile(job: {
  tasks: Array<{ name: string; result?: { files?: Array<{ url: string; size?: number }> } }>;
}) {
  const exportTask = job.tasks.find((task) => task.name === "export-file");
  const file = exportTask?.result?.files?.[0];
  if (!file?.url) throw new Error("La compresión terminó sin generar un archivo.");
  return file;
}

async function getRemoteSize(url: string): Promise<number> {
  const res = await fetch(url, { method: "HEAD" });
  const length = res.headers.get("content-length");
  return length ? Number(length) : 0;
}

async function readCloudConvertError(response: Response) {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: { message?: string } };
    return parsed.message ?? parsed.error?.message ?? "Error del servicio de compresión.";
  } catch {
    return "Error del servicio de compresión.";
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
