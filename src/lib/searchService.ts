import { buscarDeputados, type DeputadoResumo } from "@/lib/camaraApi";
import { politicosConhecidos, type PoliticoConhecido } from "@/data/politicosConhecidos";

const BASE = "https://politicometro-api.fernando-650.workers.dev/camara";

export interface ResultadoBusca {
  id: string;
  nome: string;
  partido: string;
  estado: string;
  urlFoto?: string;
  cargo?: string;
  fonte: "camara" | "senado" | "local";
}

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchNome(nome: string, query: string): boolean {
  const nNome = normalize(nome);
  const nQuery = normalize(query);
  // Match full query
  if (nNome.includes(nQuery)) return true;
  // Match each word of query
  const words = nQuery.split(/\s+/).filter(Boolean);
  return words.every((w) => nNome.includes(w));
}

function buscarLocais(query: string): ResultadoBusca[] {
  return politicosConhecidos
    .filter((p) => matchNome(p.nome, query))
    .map((p) => ({
      id: `local-${p.id}`,
      nome: p.nome,
      partido: p.partido,
      estado: p.estado,
      urlFoto: p.urlFoto,
      cargo: p.cargo,
      fonte: "local" as const,
    }));
}

async function buscarSenadores(query: string): Promise<ResultadoBusca[]> {
  try {
    const res = await fetch(
      `${BASE}/senadores/lista/atual?campos=IdentificacaoParlamentar`
    );
    if (!res.ok) return [];
    const json = await res.json();

    const lista =
      json?.dados?.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar ||
      json?.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar ||
      [];

    const arr = Array.isArray(lista) ? lista : [lista];

    return arr
      .filter((s: any) => {
        const nome =
          s?.IdentificacaoParlamentar?.NomeParlamentar ||
          s?.IdentificacaoParlamentar?.NomeCompletoParlamentar ||
          "";
        return matchNome(nome, query);
      })
      .map((s: any) => {
        const id = s?.IdentificacaoParlamentar?.CodigoParlamentar;
        const ip = s?.IdentificacaoParlamentar || {};
        return {
          id: `senado-${id}`,
          nome: ip.NomeParlamentar || ip.NomeCompletoParlamentar || "",
          partido: ip.SiglaPartidoParlamentar || "",
          estado: ip.UfParlamentar || "",
          urlFoto: ip.UrlFotoParlamentar || undefined,
          cargo: "Senador(a)",
          fonte: "senado" as const,
        };
      })
      .slice(0, 10);
  } catch (err) {
    console.error("[Busca] Erro ao buscar senadores:", err);
    return [];
  }
}

async function buscarDeputadosComRetry(query: string): Promise<ResultadoBusca[]> {
  try {
    let results = await buscarDeputados(query);

    // If no results, retry with first word only
    if (results.length === 0) {
      const firstWord = query.trim().split(/\s+/)[0];
      if (firstWord && firstWord !== query.trim()) {
        results = await buscarDeputados(firstWord);
      }
    }

    return results.map((d) => ({
      id: String(d.id),
      nome: d.nome,
      partido: d.siglaPartido,
      estado: d.siglaUf,
      urlFoto: d.urlFoto,
      cargo: "Deputado(a) Federal",
      fonte: "camara" as const,
    }));
  } catch (err) {
    console.error("[Busca] Erro ao buscar deputados:", err);
    return [];
  }
}

function deduplicar(resultados: ResultadoBusca[]): ResultadoBusca[] {
  const seen = new Map<string, ResultadoBusca>();
  for (const r of resultados) {
    const key = normalize(r.nome);
    if (!seen.has(key)) {
      seen.set(key, r);
    }
  }
  return Array.from(seen.values());
}

export async function buscarUnificado(query: string): Promise<ResultadoBusca[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  // Local results (instant)
  const locais = buscarLocais(q);

  // API results in parallel
  const [deputados, senadores] = await Promise.all([
    buscarDeputadosComRetry(q),
    buscarSenadores(q),
  ]);

  // Merge: local first, then API
  const merged = [...locais, ...deputados, ...senadores];
  return deduplicar(merged);
}
