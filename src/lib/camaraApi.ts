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

export interface Votacao {
  id: string;
  uri: string;
  data: string;
  dataHoraRegistro: string;
  siglaOrgao: string;
  descricao: string;
  aprovacao: number;
}

export interface Proposicao {
  id: number;
  uri: string;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.dados as T;
}

export async function buscarDeputados(nome: string): Promise<DeputadoResumo[]> {
  return fetchJson<DeputadoResumo[]>(
    `${BASE}/deputados?nome=${encodeURIComponent(nome)}&ordem=ASC&ordenarPor=nome&itens=20`
  );
}

export async function obterDeputado(id: string): Promise<DeputadoDetalhe> {
  return fetchJson<DeputadoDetalhe>(`${BASE}/deputados/${id}`);
}

export async function obterVotacoes(id: string): Promise<Votacao[]> {
  return fetchJson<Votacao[]>(
    `${BASE}/deputados/${id}/votacoes?ordem=DESC&ordenarPor=dataHoraRegistro&itens=15`
  );
}

export async function obterProposicoes(id: string): Promise<Proposicao[]> {
  return fetchJson<Proposicao[]>(
    `${BASE}/deputados/${id}/proposicoes?ordem=DESC&ordenarPor=ano&itens=15`
  );
}
