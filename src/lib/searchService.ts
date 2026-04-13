import { buscarDeputados } from "@/lib/camaraApi";
import { politicosConhecidos } from "@/data/politicosConhecidos";
import { listarSenadoresAtuais } from "@/lib/senadoApi";

export interface ResultadoBusca {
  id: string;
  nome: string;
  partido: string;
  estado: string;
  urlFoto?: string;
  cargo?: string;
  fonte: "camara" | "senado" | "local" | "web";
}

const WORKER_URL = "https://politicometro-api.fernando-650.workers.dev";

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
  if (nNome.includes(nQuery)) return true;
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
    const nQuery = normalize(query);
    if (nQuery.length < 3) return [];

    const senadores = await listarSenadoresAtuais();

    return senadores
      .filter((senador) => {
        const nomeBusca = senador.nomeCompleto || senador.nome;
        return matchNome(nomeBusca, query) || matchNome(senador.nome, query);
      })
      .map((senador) => ({
        id: `senado-${senador.id}`,
        nome: senador.nome,
        partido: senador.partido,
        estado: senador.estado,
        urlFoto: senador.urlFoto,
        cargo: "Senador(a)",
        fonte: "senado" as const,
      }))
      .slice(0, 10);
  } catch (err) {
    console.error("[Busca] Erro ao buscar senadores:", err);
    return [];
  }
}

async function buscarDeputadosComRetry(query: string): Promise<ResultadoBusca[]> {
  try {
    const mapDeputado = (d: Awaited<ReturnType<typeof buscarDeputados>>[number]) => ({
      id: String(d.id),
      nome: d.nome,
      partido: d.siglaPartido,
      estado: d.siglaUf,
      urlFoto: d.urlFoto,
      cargo: "Deputado(a) Federal",
      fonte: "camara" as const,
    });

    let results = (await buscarDeputados(query)).filter((d) => matchNome(d.nome, query));

    if (results.length === 0) {
      const firstWord = query.trim().split(/\s+/)[0];
      if (firstWord && firstWord !== query.trim()) {
        results = (await buscarDeputados(firstWord)).filter((d) => matchNome(d.nome, query));
      }
    }

    return results.map(mapDeputado);
  } catch (err) {
    console.error("[Busca] Erro ao buscar deputados:", err);
    return [];
  }
}

async function buscarViaWorker(query: string): Promise<ResultadoBusca[]> {
  try {
    const res = await fetch(`${WORKER_URL}/buscar-politico`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: query.trim() }),
    });
    if (!res.ok) return [];
    const data = await res.json();

    // Worker returns { encontrado, nome, cargo, partido, estado, descricao }
    if (data?.encontrado && data.nome) {
      return [{
        id: `web-${normalize(data.nome).replace(/\s+/g, "-")}`,
        nome: data.nome,
        partido: data.partido || "—",
        estado: data.estado || "—",
        cargo: data.cargo || "Político(a)",
        fonte: "web" as const,
      }];
    }
    return [];
  } catch (err) {
    console.error("[Busca] Erro ao buscar via worker:", err);
    return [];
  }
}

function deduplicar(resultados: ResultadoBusca[]): ResultadoBusca[] {
  const seen = new Map<string, ResultadoBusca>();
  for (const r of resultados) {
    const key = normalize(r.nome);
    let foundKey: string | null = null;
    for (const [existingKey] of seen) {
      if (existingKey.includes(key) || key.includes(existingKey)) {
        foundKey = existingKey;
        break;
      }
    }
    if (foundKey) {
      const existing = seen.get(foundKey)!;
      if (!existing.urlFoto && r.urlFoto) {
        seen.set(foundKey, { ...existing, urlFoto: r.urlFoto });
      }
      if (existing.fonte === "local" && r.fonte !== "local") {
        seen.set(foundKey, {
          ...r,
          urlFoto: r.urlFoto || existing.urlFoto,
          cargo: existing.cargo || r.cargo,
        });
      }
    } else {
      seen.set(key, r);
    }
  }
  return Array.from(seen.values());
}

export async function buscarUnificado(query: string): Promise<ResultadoBusca[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const locais = buscarLocais(q);

  const [deputados, senadores] = await Promise.all([
    buscarDeputadosComRetry(q),
    buscarSenadores(q),
  ]);

  const merged = [...locais, ...deputados, ...senadores];
  const deduped = deduplicar(merged);

  // If no official results found, try worker web search
  if (deduped.length === 0) {
    const webResults = await buscarViaWorker(q);
    return webResults;
  }

  return deduped;
}
