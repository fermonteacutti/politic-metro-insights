const SENADO_ATUAIS_URL = "https://legis.senado.leg.br/dadosabertos/senador/lista/atual?campos=IdentificacaoParlamentar";

export interface SenadorResumo {
  id: string;
  nome: string;
  nomeCompleto: string;
  partido: string;
  estado: string;
  urlFoto?: string;
  urlPagina?: string;
  email?: string;
}

let senadoresCachePromise: Promise<SenadorResumo[]> | null = null;

function getText(parent: ParentNode, tagName: string): string {
  return parent.querySelector(tagName)?.textContent?.trim() ?? "";
}

function normalizeUrl(url: string): string {
  return url.replace(/^http:\/\//i, "https://");
}

async function fetchSenadoresAtuais(): Promise<SenadorResumo[]> {
  const res = await fetch(SENADO_ATUAIS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ao chamar Senado`);

  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Falha ao processar resposta do Senado");
  }

  return Array.from(doc.getElementsByTagName("Parlamentar"))
    .map((parlamentar) => {
      const identificacao = parlamentar.querySelector("IdentificacaoParlamentar");
      if (!identificacao) return null;

      const id = getText(identificacao, "CodigoParlamentar");
      const nome = getText(identificacao, "NomeParlamentar");
      const nomeCompleto = getText(identificacao, "NomeCompletoParlamentar");

      return {
        id,
        nome: nome || nomeCompleto,
        nomeCompleto,
        partido: getText(identificacao, "SiglaPartidoParlamentar"),
        estado: getText(identificacao, "UfParlamentar"),
        urlFoto: normalizeUrl(getText(identificacao, "UrlFotoParlamentar")) || undefined,
        urlPagina: normalizeUrl(getText(identificacao, "UrlPaginaParlamentar")) || undefined,
        email: getText(identificacao, "EmailParlamentar") || undefined,
      } satisfies SenadorResumo;
    })
    .filter((senador): senador is SenadorResumo => Boolean(senador?.id && senador.nome));
}

export async function listarSenadoresAtuais(forceRefresh = false): Promise<SenadorResumo[]> {
  if (!senadoresCachePromise || forceRefresh) {
    senadoresCachePromise = fetchSenadoresAtuais();
  }
  return senadoresCachePromise;
}

export async function obterSenadorAtual(id: string): Promise<SenadorResumo | null> {
  const senadores = await listarSenadoresAtuais();
  return senadores.find((senador) => senador.id === id) ?? null;
}