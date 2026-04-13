export interface PoliticoConhecido {
  id: string;
  nome: string;
  cargo: string;
  partido: string;
  estado: string;
  urlFoto?: string;
  fonte: "local";
}

export const politicosConhecidos: PoliticoConhecido[] = [
  { id: "lula", nome: "Luiz Inácio Lula da Silva", cargo: "Presidente da República", partido: "PT", estado: "SP", fonte: "local" },
  { id: "bolsonaro", nome: "Jair Messias Bolsonaro", cargo: "Ex-Presidente / Deputado Federal", partido: "PL", estado: "RJ", fonte: "local" },
  { id: "tarcisio", nome: "Tarcísio de Freitas", cargo: "Governador de SP", partido: "Republicanos", estado: "SP", fonte: "local" },
  { id: "paes", nome: "Eduardo Paes", cargo: "Prefeito do Rio de Janeiro", partido: "PSD", estado: "RJ", fonte: "local" },
  { id: "nunes", nome: "Ricardo Nunes", cargo: "Prefeito de São Paulo", partido: "MDB", estado: "SP", fonte: "local" },
  { id: "zema", nome: "Romeu Zema", cargo: "Governador de MG", partido: "Novo", estado: "MG", fonte: "local" },
  { id: "leite", nome: "Eduardo Leite", cargo: "Governador do RS", partido: "PSDB", estado: "RS", fonte: "local" },
  { id: "boulos", nome: "Guilherme Boulos", cargo: "Deputado Federal", partido: "PSOL", estado: "SP", fonte: "local" },
  { id: "tabata", nome: "Tabata Amaral", cargo: "Deputada Federal", partido: "PSB", estado: "SP", fonte: "local" },
  { id: "marina", nome: "Marina Silva", cargo: "Ministra do Meio Ambiente", partido: "Rede", estado: "AC", fonte: "local" },
  { id: "moro", nome: "Sergio Moro", cargo: "Senador", partido: "União Brasil", estado: "PR", fonte: "local" },
  { id: "datena", nome: "José Luiz Datena", cargo: "Senador", partido: "PSDB", estado: "SP", fonte: "local" },
  { id: "marcal", nome: "Pablo Marçal", cargo: "Candidato / Empresário", partido: "sem partido", estado: "SP", fonte: "local" },
  { id: "gleisi", nome: "Gleisi Hoffmann", cargo: "Deputada Federal / Presidente PT", partido: "PT", estado: "PR", fonte: "local" },
  { id: "alckmin", nome: "Geraldo Alckmin", cargo: "Vice-Presidente da República", partido: "PSB", estado: "SP", fonte: "local" },
  { id: "haddad", nome: "Fernando Haddad", cargo: "Ministro da Fazenda", partido: "PT", estado: "SP", fonte: "local" },
  { id: "ciro", nome: "Ciro Gomes", cargo: "Ex-Ministro / Ex-Candidato Presidencial", partido: "PDT", estado: "CE", fonte: "local" },
  { id: "flavio", nome: "Flávio Bolsonaro", cargo: "Senador", partido: "PL", estado: "RJ", fonte: "local" },
  { id: "carlos", nome: "Carlos Bolsonaro", cargo: "Vereador / Político", partido: "PL", estado: "RJ", fonte: "local" },
  { id: "nikolas", nome: "Nikolas Ferreira", cargo: "Deputado Federal", partido: "PL", estado: "MG", fonte: "local" },
  { id: "waguinho", nome: "Waguinho", cargo: "Prefeito de Belford Roxo", partido: "União Brasil", estado: "RJ", fonte: "local" },
];
