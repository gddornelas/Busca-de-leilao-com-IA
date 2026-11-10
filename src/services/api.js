export async function obterStatus() {
  try {
    const r = await fetch("/api/status");
    if (!r.ok) return { status: "offline", temChaveConfigurada: false };
    return await r.json();
  } catch {
    return { status: "offline", temChaveConfigurada: false };
  }
}

export async function obterDestaques() {
  const r = await fetch("/api/destaques");
  const data = await r.json();
  if (!r.ok) throw new Error(data.erro || "Falha ao carregar destaques.");
  return data;
}

export async function buscarLeiloes(filtros, apiKey = "", model = "gemini-2.0-flash") {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["x-gemini-key"] = apiKey;
  if (model) headers["x-gemini-model"] = model;

  const r = await fetch("/api/buscar", {
    method: "POST",
    headers,
    body: JSON.stringify(filtros),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.erro || "Erro ao buscar leilões.");
  return data;
}

export async function analisarLoteComIA(lote, apiKey = "", model = "gemini-2.0-flash") {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["x-gemini-key"] = apiKey;
  if (model) headers["x-gemini-model"] = model;

  const r = await fetch("/api/analise-ia", {
    method: "POST",
    headers,
    body: JSON.stringify({ lote }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.erro || "Erro ao analisar lote com IA.");
  return data.analise;
}
