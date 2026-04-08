const BASE = "https://dadosabertos.camara.leg.br/api/v2";

export interface DeputadoResumo {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
}

export interface DeputadoDetalhe {
  id: number;
  nomeCivil: string;
  ultimoStatus: {
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
    situacao: string;
    condicaoEleitoral: string;
    gabinete?: { sala: string; andar: string; telefone: string; email: string };
    nomeEleitoral: string;
  };
  dataNascimento: string;
  municipioNascimento: string;
  ufNascimento: string;
  escolaridade: string;
}

export interface Evento {
  id: number;
  dataHoraInicio: string;
  situacao: string;
  descricaoTipo: string;
  descricao: string;
  orgaos: { sigla: string; nome: string }[];
}

export interface Proposicao {
  id: number;
  uri: string;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
}

async function fetchJson<T>(url: string, retries = 2): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} ao chamar ${url}`);
      const json = await res.json();
      return json.dados as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw new Error(`Falha após ${retries + 1} tentativas em ${url}: ${lastError?.message}`);
}

export async function buscarDeputados(nome: string): Promise<DeputadoResumo[]> {
  return fetchJson<DeputadoResumo[]>(
    `${BASE}/deputados?nome=${encodeURIComponent(nome)}&ordem=ASC&ordenarPor=nome&itens=20`
  );
}

export async function obterDeputado(id: string): Promise<DeputadoDetalhe> {
  return fetchJson<DeputadoDetalhe>(`${BASE}/deputados/${id}`);
}

export async function obterEventos(id: string): Promise<Evento[]> {
  return fetchJson<Evento[]>(
    `${BASE}/deputados/${id}/eventos?itens=20&ordem=DESC&ordenarPor=dataHoraInicio`
  );
}

export async function obterProposicoes(id: string): Promise<Proposicao[]> {
  return fetchJson<Proposicao[]>(
    `${BASE}/proposicoes?idDeputadoAutor=${id}&ordem=DESC&ordenarPor=ano&itens=10`
  );
}
