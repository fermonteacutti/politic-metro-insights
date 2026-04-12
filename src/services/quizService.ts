import { perguntas, pesos } from "@/data/quizPerguntas";

export function calcularScoreQuiz(respostas: Record<number, number>) {
  const scoresPorDimensao: Record<string, number[]> = {};

  perguntas.forEach((p) => {
    const resposta = respostas[p.id];
    if (resposta === undefined) return;

    // resposta: 1=Discordo Totalmente, 2=Discordo, 3=Neutro, 4=Concordo, 5=Concordo Totalmente
    const valor = resposta - 3; // -2 a +2
    const scorePergunta = p.direcao === "direita" ? valor * 50 : valor * -50;

    if (!scoresPorDimensao[p.dimensao]) scoresPorDimensao[p.dimensao] = [];
    scoresPorDimensao[p.dimensao].push(scorePergunta);
  });

  let scoreFinal = 0;
  const dimensoesCalculadas: Record<string, number> = {};

  Object.entries(scoresPorDimensao).forEach(([dimensao, scores]) => {
    const media = scores.reduce((a, b) => a + b, 0) / scores.length;
    dimensoesCalculadas[dimensao] = Math.round(media);
    scoreFinal += media * (pesos[dimensao] || 0);
  });

  return {
    score: Math.round(scoreFinal),
    dimensoes: dimensoesCalculadas,
  };
}

export function classificarScore(score: number): string {
  if (score <= -60) return "Extrema Esquerda";
  if (score <= -20) return "Esquerda";
  if (score <= -5) return "Centro-Esquerda";
  if (score <= 5) return "Centro";
  if (score <= 20) return "Centro-Direita";
  if (score <= 60) return "Direita";
  return "Extrema Direita";
}
