export type Pergunta = {
  id: number;
  dimensao: string;
  texto: string;
  direcao: "esquerda" | "direita";
};

export const perguntas: Pergunta[] = [
  { id: 1, dimensao: "economica", texto: "O Estado deve controlar empresas estratégicas como Petrobras e energia elétrica.", direcao: "esquerda" },
  { id: 2, dimensao: "economica", texto: "Impostos sobre grandes fortunas e heranças devem ser aumentados para reduzir desigualdade.", direcao: "esquerda" },
  { id: 3, dimensao: "economica", texto: "A reforma trabalhista que flexibilizou direitos foi benéfica para a economia.", direcao: "direita" },
  { id: 4, dimensao: "economica", texto: "Privatizações de empresas públicas geram mais eficiência e benefícios para a população.", direcao: "direita" },
  { id: 5, dimensao: "economica", texto: "Programas de transferência de renda como Bolsa Família são fundamentais para reduzir a pobreza.", direcao: "esquerda" },
  { id: 6, dimensao: "economica", texto: "O teto de gastos públicos é necessário para controlar a dívida do país.", direcao: "direita" },
  { id: 7, dimensao: "economica", texto: "O livre mercado, sem muita regulação do Estado, é o melhor modelo para o Brasil.", direcao: "direita" },
  { id: 8, dimensao: "social", texto: "O casamento civil entre pessoas do mesmo sexo deve ser garantido por lei.", direcao: "esquerda" },
  { id: 9, dimensao: "social", texto: "Cotas raciais em universidades e concursos públicos são justas e necessárias.", direcao: "esquerda" },
  { id: 10, dimensao: "social", texto: "O aborto deve ser permitido legalmente ao menos nos casos de estupro e risco de vida.", direcao: "esquerda" },
  { id: 11, dimensao: "social", texto: "Valores tradicionais de família e religião devem orientar as políticas públicas.", direcao: "direita" },
  { id: 12, dimensao: "social", texto: "A descriminalização das drogas para uso pessoal beneficiaria a saúde pública.", direcao: "esquerda" },
  { id: 13, dimensao: "social", texto: "A identidade cultural nacional brasileira deve ser protegida de influências externas.", direcao: "direita" },
  { id: 14, dimensao: "seguranca", texto: "O porte de armas para cidadãos de bem deve ser liberalizado.", direcao: "direita" },
  { id: 15, dimensao: "seguranca", texto: "A redução da maioridade penal para 16 anos reduziria a criminalidade.", direcao: "direita" },
  { id: 16, dimensao: "seguranca", texto: "Políticas de prevenção social são mais eficazes que o endurecimento penal.", direcao: "esquerda" },
  { id: 17, dimensao: "seguranca", texto: "A pena de morte deveria ser adotada no Brasil para crimes hediondos.", direcao: "direita" },
  { id: 18, dimensao: "ambiental", texto: "A proteção da Amazônia deve ter prioridade mesmo que limite atividades econômicas.", direcao: "esquerda" },
  { id: 19, dimensao: "ambiental", texto: "O agronegócio deve ter prioridade sobre restrições ambientais para garantir desenvolvimento.", direcao: "direita" },
  { id: 20, dimensao: "ambiental", texto: "O Brasil deve investir mais em energia solar e eólica mesmo que custe mais no curto prazo.", direcao: "esquerda" },
  { id: 21, dimensao: "educacao", texto: "O Estado deve financiar escolas privadas com recursos públicos via vouchers.", direcao: "direita" },
  { id: 22, dimensao: "educacao", texto: "A educação pública gratuita e de qualidade deve ser prioridade máxima do governo.", direcao: "esquerda" },
  { id: 23, dimensao: "educacao", texto: "Ideologia e política não devem ser discutidas em sala de aula.", direcao: "direita" },
  { id: 24, dimensao: "democracia", texto: "As Forças Armadas devem ter papel de garantidoras da ordem constitucional.", direcao: "direita" },
  { id: 25, dimensao: "democracia", texto: "A liberdade de imprensa e a independência do judiciário são pilares inegociáveis.", direcao: "esquerda" },
  { id: 26, dimensao: "democracia", texto: "Governos fortes e centralizados são mais eficientes que sistemas com muitos contrapesos.", direcao: "direita" },
  { id: 27, dimensao: "democracia", texto: "A transparência total dos gastos públicos e combate à corrupção devem ser prioridade.", direcao: "esquerda" },
  { id: 28, dimensao: "saude", texto: "O SUS deve ser fortalecido e ser o principal sistema de saúde do Brasil.", direcao: "esquerda" },
  { id: 29, dimensao: "saude", texto: "Planos de saúde privados devem ter mais incentivos fiscais para reduzir pressão sobre o SUS.", direcao: "direita" },
  { id: 30, dimensao: "saude", texto: "O governo deve garantir acesso universal e gratuito a medicamentos essenciais.", direcao: "esquerda" },
];

export const pesos: Record<string, number> = {
  economica: 0.25,
  social: 0.20,
  seguranca: 0.15,
  ambiental: 0.10,
  educacao: 0.10,
  democracia: 0.15,
  saude: 0.05,
};

export const dimensionLabels: Record<string, string> = {
  economica: "Econômica",
  social: "Social / Costumes",
  seguranca: "Segurança Pública",
  ambiental: "Ambiental",
  educacao: "Educação / Cultura",
  democracia: "Democracia / Institucional",
  saude: "Saúde / Bem-Estar",
};
