const WORKER_URL = "https://politicometro-api.fernando-650.workers.dev";

export interface TermometroResult {
  score: number;
  resumo: string;
  dimensoes: Record<string, number>;
  pautas: string[];
}

export async function calcularTermometro(
  nomePolitico: string,
  votacoes: any[],
  proposicoes: any[]
): Promise<TermometroResult> {
  console.log(`[Termômetro] Chamando termômetro para: ${nomePolitico}`);
  console.log(`[Termômetro] Votações: ${votacoes.length}, Proposições: ${proposicoes.length}`);

  const response = await fetch(`${WORKER_URL}/termometro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomePolitico, votacoes, proposicoes }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Termômetro] Erro:", { status: response.status, text: errorText });
    throw new Error(`Erro ao calcular termômetro: ${response.status} - ${errorText}`);
  }

  const raw = await response.json();
  console.log("[Termômetro] Resultado bruto:", JSON.stringify(raw));

  // Defensive: score may be string or nested
  const score = typeof raw.score === "number" ? raw.score : Number(raw.score) || 0;
  const resumo = raw.resumo || "";
  const pautas = Array.isArray(raw.pautas) ? raw.pautas : [];

  // Normalize dimensoes — ensure all 7 keys are numbers
  const dimKeys = ["economica", "social", "seguranca", "ambiental", "educacao", "democracia", "saude"];
  const rawDim = raw.dimensoes || {};
  const dimensoes: Record<string, number> = {};
  for (const k of dimKeys) {
    const v = rawDim[k];
    dimensoes[k] = typeof v === "number" ? v : Number(v) || 0;
  }

  const resultado: TermometroResult = { score, resumo, dimensoes, pautas };
  console.log("[Termômetro] Resultado normalizado:", resultado);
  return resultado;
}

const CACHE_PREFIX = "termometro_";

export function getCachedResult(id: string): TermometroResult | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedResult(id: string, result: TermometroResult): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + id, JSON.stringify(result));
  } catch {}
}
