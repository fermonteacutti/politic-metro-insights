import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

type Question = {
  text: string;
  dimension: number; // 0-6
  options: { label: string; value: number }[]; // value: -2,-1,0,1,2
};

const dimensionNames = [
  "Econômica",
  "Social / Costumes",
  "Segurança Pública",
  "Ambiental",
  "Educação / Cultura",
  "Democracia / Institucional",
  "Saúde / Bem-Estar",
];

const dimensionWeights = [25, 20, 15, 10, 10, 15, 5];

const options = [
  { label: "Discordo totalmente", value: -2 },
  { label: "Discordo", value: -1 },
  { label: "Neutro", value: 0 },
  { label: "Concordo", value: 1 },
  { label: "Concordo totalmente", value: 2 },
];

const questions: Question[] = [
  // Econômica (dim 0) — 5 perguntas
  { text: "O Estado deveria ter participação mínima na economia, deixando o mercado se autorregular.", dimension: 0, options },
  { text: "Programas de transferência de renda são essenciais para reduzir a desigualdade.", dimension: 0, options },
  { text: "Privatizar empresas estatais melhora a qualidade dos serviços.", dimension: 0, options },
  { text: "O salário mínimo deveria ser significativamente maior, mesmo com impacto em empresas.", dimension: 0, options },
  { text: "Impostos sobre grandes fortunas são justos e necessários.", dimension: 0, options },

  // Social (dim 1) — 5 perguntas
  { text: "O casamento entre pessoas do mesmo sexo deve ser plenamente garantido.", dimension: 1, options },
  { text: "A descriminalização do uso recreativo de drogas reduziria a violência.", dimension: 1, options },
  { text: "Cotas raciais nas universidades são necessárias para reparar desigualdades históricas.", dimension: 1, options },
  { text: "A família tradicional deve ser especialmente protegida pelo Estado.", dimension: 1, options },
  { text: "O aborto deveria ser uma decisão da mulher, sem interferência do Estado.", dimension: 1, options },

  // Segurança (dim 2) — 4 perguntas
  { text: "A população deveria ter amplo acesso ao porte de armas de fogo.", dimension: 2, options },
  { text: "A redução da maioridade penal tornaria o país mais seguro.", dimension: 2, options },
  { text: "Investir em educação é mais eficaz contra o crime do que aumentar penas.", dimension: 2, options },
  { text: "A polícia deveria ter mais autonomia para agir em operações.", dimension: 2, options },

  // Ambiental (dim 3) — 4 perguntas
  { text: "O desenvolvimento econômico é mais importante que a preservação ambiental.", dimension: 3, options },
  { text: "O Brasil deveria liderar a transição energética global.", dimension: 3, options },
  { text: "Terras indígenas devem ser protegidas da exploração econômica.", dimension: 3, options },
  { text: "O agronegócio é o motor da economia e deve ter licenciamento mais flexível.", dimension: 3, options },

  // Educação (dim 4) — 4 perguntas
  { text: "A educação pública gratuita deve ser prioridade absoluta do governo.", dimension: 4, options },
  { text: "Vouchers educacionais dariam mais liberdade de escolha às famílias.", dimension: 4, options },
  { text: "O ensino religioso deveria fazer parte do currículo escolar.", dimension: 4, options },
  { text: "Universidades públicas deveriam cobrar mensalidade de quem pode pagar.", dimension: 4, options },

  // Democracia (dim 5) — 4 perguntas
  { text: "O STF tem poder excessivo e deveria ser reformado.", dimension: 5, options },
  { text: "A liberdade de imprensa é inegociável, mesmo quando incomoda.", dimension: 5, options },
  { text: "O voto deveria ser facultativo.", dimension: 5, options },
  { text: "É aceitável que o Executivo governe por decreto em situações de urgência.", dimension: 5, options },

  // Saúde (dim 6) — 4 perguntas
  { text: "O SUS deveria receber mais investimento, mesmo com aumento de impostos.", dimension: 6, options },
  { text: "Planos de saúde deveriam ser mais acessíveis via desregulamentação.", dimension: 6, options },
  { text: "Saúde mental deveria ser tratada como prioridade nas políticas públicas.", dimension: 6, options },
  { text: "A vacinação obrigatória é justificada em nome da saúde coletiva.", dimension: 6, options },
];

// Some questions are "inverted" — agreeing = left, not right
// For simplicity, questions where agreeing pushes LEFT get their score negated
const leftLeaning = new Set([1, 3, 4, 5, 6, 7, 9, 12, 15, 16, 18, 22, 23, 26, 28, 29]);

function getScoreLabel(score: number) {
  if (score <= -60) return "Extrema Esquerda";
  if (score <= -20) return "Centro-Esquerda";
  if (score <= 19) return "Centro";
  if (score <= 59) return "Centro-Direita";
  return "Extrema Direita";
}

export default function Quiz() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const progress = useMemo(() => {
    const answered = answers.filter((a) => a !== null).length;
    return (answered / questions.length) * 100;
  }, [answers]);

  const result = useMemo(() => {
    // Calculate per-dimension scores
    const dimScores = dimensionNames.map((_, dimIdx) => {
      const dimQs = questions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => q.dimension === dimIdx);
      if (dimQs.length === 0) return 0;

      const sum = dimQs.reduce((acc, { i }) => {
        const raw = answers[i] ?? 0;
        const adjusted = leftLeaning.has(i) ? -raw : raw;
        return acc + adjusted;
      }, 0);

      // Normalize to -100..+100
      const maxPossible = dimQs.length * 2;
      return Math.round((sum / maxPossible) * 100);
    });

    // Weighted average
    const finalScore = Math.round(
      dimScores.reduce((acc, s, i) => acc + s * dimensionWeights[i], 0) / 100
    );

    return { dimScores, finalScore };
  }, [answers]);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);

    // Auto-advance
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    }
  };

  const allAnswered = answers.every((a) => a !== null);

  const reset = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers(Array(questions.length).fill(null));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {step === "intro" && (
          <section className="py-20 md:py-28">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Brain size={16} />
                  Quiz do Cidadão
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                  Descubra seu Termômetro Político
                </h1>
                <p className="text-muted-foreground text-lg mb-3">
                  Responda {questions.length} perguntas baseadas nas mesmas 7 dimensões que usamos
                  para avaliar políticos e veja onde você se posiciona no espectro.
                </p>
                <p className="text-muted-foreground text-sm mb-8">
                  ⏱ Tempo estimado: 5 minutos · Seus dados não são armazenados.
                </p>
                <button
                  onClick={() => setStep("quiz")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Começar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        )}

        {step === "quiz" && (
          <section className="py-8 md:py-12">
            <div className="container">
              <div className="max-w-2xl mx-auto">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Pergunta {current + 1} de {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Dimensão: {dimensionNames[questions[current].dimension]}
                  </p>
                </div>

                {/* Question */}
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6">
                  <p className="text-lg md:text-xl font-medium leading-relaxed">
                    {questions[current].text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-8">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all text-sm font-medium ${
                        answers[current] === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/30 text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrent(Math.max(0, current - 1))}
                    disabled={current === 0}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} /> Anterior
                  </button>

                  {current < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrent(current + 1)}
                      disabled={answers[current] === null}
                      className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                    >
                      Próxima <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => allAnswered && setStep("result")}
                      disabled={!allAnswered}
                      className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Ver Resultado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {step === "result" && (
          <section className="py-12 md:py-16">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                  Seu Resultado
                </h2>
                <p className="text-muted-foreground mb-8">
                  Baseado nas suas respostas, aqui está seu posicionamento no espectro político.
                </p>

                <div className="flex flex-col items-center gap-4 mb-10">
                  <ThermometerGauge score={result.finalScore} size="lg" />
                  <div>
                    <p className="text-2xl font-heading font-bold">{getScoreLabel(result.finalScore)}</p>
                    <p className="text-muted-foreground text-sm">Score: {result.finalScore}</p>
                  </div>
                </div>

                {/* Per-dimension breakdown */}
                <div className="bg-card rounded-2xl border border-border p-6 text-left mb-8">
                  <h3 className="font-heading font-bold mb-4">Detalhamento por Dimensão</h3>
                  <div className="space-y-3">
                    {dimensionNames.map((name, i) => {
                      const s = result.dimScores[i];
                      const pct = ((s + 100) / 200) * 100;
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{name}</span>
                            <span className="text-muted-foreground">{s > 0 ? "+" : ""}{s}</span>
                          </div>
                          <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                            <div className="absolute inset-0 thermometer-gradient opacity-25" />
                            <div
                              className="absolute top-0 h-full w-1 bg-foreground rounded-full"
                              style={{ left: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <RotateCcw size={16} /> Refazer Quiz
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    <Share2 size={16} /> Compartilhar
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mt-8">
                  Este quiz é baseado nas mesmas dimensões usadas para avaliar políticos. 
                  Seus dados não são armazenados — o cálculo é feito localmente no navegador.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
