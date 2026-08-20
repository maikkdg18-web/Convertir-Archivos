import { CONVERSION_LABELS } from "@conversor/shared";

export default function HomePage() {
  const tools = Object.entries(CONVERSION_LABELS);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Conversor de Archivos</h1>
      <p>Elige una herramienta para empezar:</p>
      <ul>
        {tools.map(([key, label]) => (
          <li key={key}>{label}</li>
        ))}
      </ul>
      {/* TODO: reemplazar por componentes de subida real conectados a Supabase */}
    </main>
  );
}
