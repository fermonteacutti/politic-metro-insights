export interface PoliticoConhecido {
  id: string;
  nome: string;
  cargo: string;
  partido: string;
  estado: string;
  municipio?: string;
  urlFoto?: string;
  fonte: "local";
}

export const politicosConhecidos: PoliticoConhecido[] = [
  { id: "lula", nome: "Luiz Inácio Lula da Silva", cargo: "Presidente da República", partido: "PT", estado: "SP", municipio: "Garanhuns (PE)", fonte: "local" },
  { id: "bolsonaro", nome: "Jair Messias Bolsonaro", cargo: "Ex-Presidente / Deputado Federal", partido: "PL", estado: "RJ", municipio: "Glicério (SP)", fonte: "local" },
  { id: "tarcisio", nome: "Tarcísio de Freitas", cargo: "Governador de SP", partido: "Republicanos", estado: "SP", municipio: "Rio de Janeiro (RJ)", fonte: "local" },
  { id: "paes", nome: "Eduardo Paes", cargo: "Prefeito do Rio de Janeiro", partido: "PSD", estado: "RJ", municipio: "Rio de Janeiro (RJ)", fonte: "local" },
  { id: "nunes", nome: "Ricardo Nunes", cargo: "Prefeito de São Paulo", partido: "MDB", estado: "SP", municipio: "São Paulo (SP)", fonte: "local" },
  { id: "zema", nome: "Romeu Zema", cargo: "Governador de MG", partido: "Novo", estado: "MG", municipio: "Araxá (MG)", fonte: "local" },
  { id: "leite", nome: "Eduardo Leite", cargo: "Governador do RS", partido: "PSDB", estado: "RS", municipio: "Pelotas (RS)", fonte: "local" },
  { id: "boulos", nome: "Guilherme Boulos", cargo: "Deputado Federal", partido: "PSOL", estado: "SP", municipio: "São Paulo (SP)", fonte: "local" },
  { id: "tabata", nome: "Tabata Amaral", cargo: "Deputada Federal", partido: "PSB", estado: "SP", municipio: "São Paulo (SP)", fonte: "local" },
  { id: "marina", nome: "Marina Silva", cargo: "Ministra do Meio Ambiente", partido: "Rede", estado: "AC", municipio: "Rio Branco (AC)", fonte: "local" },
  { id: "moro", nome: "Sergio Moro", cargo: "Senador", partido: "União Brasil", estado: "PR", municipio: "Maringá (PR)", fonte: "local" },
  { id: "datena", nome: "José Luiz Datena", cargo: "Senador", partido: "PSDB", estado: "SP", municipio: "São Paulo (SP)", fonte: "local" },
  { id: "marcal", nome: "Pablo Marçal", cargo: "Candidato / Empresário", partido: "sem partido", estado: "SP", municipio: "Goiânia (GO)", fonte: "local" },
  { id: "gleisi", nome: "Gleisi Hoffmann", cargo: "Deputada Federal / Presidente PT", partido: "PT", estado: "PR", municipio: "Curitiba (PR)", fonte: "local" },
  { id: "alckmin", nome: "Geraldo Alckmin", cargo: "Vice-Presidente da República", partido: "PSB", estado: "SP", municipio: "Pindamonhangaba (SP)", fonte: "local" },
  { id: "haddad", nome: "Fernando Haddad", cargo: "Ministro da Fazenda", partido: "PT", estado: "SP", municipio: "São Paulo (SP)", fonte: "local" },
  { id: "ciro", nome: "Ciro Gomes", cargo: "Ex-Ministro / Ex-Candidato Presidencial", partido: "PDT", estado: "CE", municipio: "Pindamonhangaba (SP)", fonte: "local" },
  { id: "flavio", nome: "Flávio Bolsonaro", cargo: "Senador", partido: "PL", estado: "RJ", municipio: "Rio de Janeiro (RJ)", fonte: "local" },
  { id: "carlos", nome: "Carlos Bolsonaro", cargo: "Vereador / Político", partido: "PL", estado: "RJ", municipio: "Rio de Janeiro (RJ)", fonte: "local" },
  { id: "nikolas", nome: "Nikolas Ferreira", cargo: "Deputado Federal", partido: "PL", estado: "MG", municipio: "Belo Horizonte (MG)", fonte: "local" },
  { id: "waguinho", nome: "Waguinho", cargo: "Prefeito de Belford Roxo", partido: "União Brasil", estado: "RJ", municipio: "Belford Roxo (RJ)", fonte: "local" },
];
