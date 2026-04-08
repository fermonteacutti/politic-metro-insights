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
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomePolitico, votacoes, proposicoes }),
  });

  if (!response.ok) throw new Error("Erro ao calcular termômetro");
  return response.json();
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
