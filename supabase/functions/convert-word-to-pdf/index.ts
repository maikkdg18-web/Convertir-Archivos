// Supabase Edge Function: convierte documentos Word a PDF usando CloudConvert.
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

    const { fileUrl, fileName } = await req.json() as { fileUrl?: string; fileName?: string };
    if (!fileUrl || !fileName) {
      return jsonResponse({ success: false, error: "Se necesita un documento Word válido." }, 400);
    }

    const extension = fileName.toLowerCase().endsWith(".doc") ? "doc" : "docx";
    const job = await createJob({
      url: fileUrl,
      filename: fileName,
      inputFormat: extension,
      outputFormat: "pdf",
    });
    const finishedJob = await waitForJob(job.id);
    const outputUrl = getOutputUrl(finishedJob);

    return jsonResponse({ success: true, outputUrl });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido al convertir el documento.",
    }, 500);
  }
});

async function createJob(options: {
  url: string;
  filename: string;
  inputFormat: string;
  outputFormat: string;
}) {
  const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tasks: {
        "import-file": { operation: "import/url", url: options.url, filename: options.filename },
        "convert-file": {
          operation: "convert",
          input: "import-file",
          input_format: options.inputFormat,
          output_format: options.outputFormat,
        },
        "export-file": { operation: "export/url", input: "convert-file" },
      },
    }),
  });

  if (!response.ok) throw new Error(await readCloudConvertError(response));
  const payload = await response.json() as { data?: { id?: string } };
  if (!payload.data?.id) throw new Error("CloudConvert no devolvió un identificador de trabajo.");
  return { id: payload.data.id };
}

async function waitForJob(jobId: string) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${CLOUDCONVERT_API_KEY}` },
    });
    if (!response.ok) throw new Error(await readCloudConvertError(response));

    const job = await response.json() as { data: { status: string; tasks: Array<{ name: string; status: string; result?: { files?: Array<{ url: string }> }; message?: string }> } };
    if (job.data.status === "finished") return job.data;
    if (job.data.status === "error") {
      const failedTask = job.data.tasks.find((task) => task.status === "error");
      throw new Error(failedTask?.message ?? "CloudConvert no pudo convertir el archivo.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error("La conversión tardó demasiado. Intenta de nuevo.");
}

function getOutputUrl(job: { tasks: Array<{ name: string; result?: { files?: Array<{ url: string }> } }> }) {
  const exportTask = job.tasks.find((task) => task.name === "export-file");
  const outputUrl = exportTask?.result?.files?.[0]?.url;
  if (!outputUrl) throw new Error("La conversión terminó sin generar un archivo.");
  return outputUrl;
}

async function readCloudConvertError(response: Response) {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: { message?: string } };
    return parsed.message ?? parsed.error?.message ?? "Error del servicio de conversión.";
  } catch {
    return "Error del servicio de conversión.";
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
