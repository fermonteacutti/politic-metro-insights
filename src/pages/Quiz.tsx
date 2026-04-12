import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Brain, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Progress } from "@/components/ui/progress";
import { perguntas, dimensionLabels } from "@/data/quizPerguntas";
import { calcularScoreQuiz, classificarScore } from "@/services/quizService";

const opcoes = [
  { label: "Discordo totalmente", value: 1 },
  { label: "Discordo", value: 2 },
  { label: "Neutro", value: 3 },
  { label: "Concordo", value: 4 },
  { label: "Concordo totalmente", value: 5 },
];

const allDimensoes = ["economica", "social", "seguranca", "ambiental", "educacao", "democracia", "saude"];

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});

  const totalPerguntas = perguntas.length;
  const answeredCount = Object.keys(respostas).length;
  const progress = (answeredCount / totalPerguntas) * 100;
  const perguntaAtual = perguntas[current];

  const resultado = useMemo(() => {
    if (step !== "result") return null;
    return calcularScoreQuiz(respostas);
  }, [respostas, step]);

  const handleAnswer = (value: number) => {
    setRespostas((prev) => ({ ...prev, [perguntaAtual.id]: value }));

    if (current < totalPerguntas - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      // Last question — go to result
      setTimeout(() => setStep("result"), 400);
    }
  };

  const handleShare = () => {
    if (!resultado) return;
    const label = classificarScore(resultado.score);
    const text = `Fiz o Quiz do Politicômetro e meu resultado foi: ${label} (score ${resultado.score > 0 ? "+" : ""}${resultado.score}). Descubra o seu em politicometro.com.br`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("✓ Copiado para a área de transferência!", { duration: 3000 });
    }).catch(() => {
      // Fallback for environments where clipboard API is blocked
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("✓ Copiado para a área de transferência!", { duration: 3000 });
    });
  };

  const reset = () => {
    setCurrent(0);
    setRespostas({});
    setStep("intro");
  };

  const handleVerPoliticos = () => {
    navigate("/");
    setTimeout(() => {
      const searchInput = document.querySelector<HTMLInputElement>('input[type="text"], input[type="search"]');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => searchInput.focus(), 500);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* INTRO */}
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
                  Responda 31 perguntas baseadas nas mesmas 7 dimensões que usamos
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

        {/* QUIZ */}
        {step === "quiz" && (
          <section className="py-8 md:py-12">
            <div className="container">
              <div className="max-w-2xl mx-auto">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Pergunta {current + 1} de {totalPerguntas}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Dimensão: {dimensionLabels[perguntaAtual.dimensao]}
                  </p>
                </div>

                {/* Question */}
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-6">
                  <p className="text-lg md:text-xl font-medium leading-relaxed">
                    {perguntaAtual.texto}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-8">
                  {opcoes.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all text-sm font-medium ${
                        respostas[perguntaAtual.id] === opt.value
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

                  {current < totalPerguntas - 1 && respostas[perguntaAtual.id] !== undefined && (
                    <button
                      onClick={() => setCurrent(current + 1)}
                      className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                    >
                      Próxima <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RESULT */}
        {step === "result" && resultado && (
          <section className="py-12 md:py-16">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                  Seu Termômetro Político
                </h2>
                <p className="text-muted-foreground mb-8">
                  Baseado nas suas respostas, aqui está seu posicionamento no espectro político.
                </p>

                {/* Gauge */}
                <div className="flex flex-col items-center gap-4 mb-10">
                  <ThermometerGauge score={resultado.score} size="lg" />
                  <div>
                    <p className="text-2xl font-heading font-bold">
                      {classificarScore(resultado.score)}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Score: {resultado.score > 0 ? "+" : ""}{resultado.score}
                    </p>
                  </div>
                </div>

                {/* Dimensões */}
                <div className="bg-card rounded-2xl border border-border p-6 text-left mb-8">
                  <h3 className="font-heading font-bold mb-4">Detalhamento por Dimensão</h3>
                  <div className="space-y-3">
                    {allDimensoes.map((dim) => {
                      const s = resultado.dimensoes[dim] ?? 0;
                      const pct = ((s + 100) / 200) * 100;
                      return (
                        <div key={dim} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{dimensionLabels[dim]}</span>
                            <span className="text-muted-foreground">
                              {s > 0 ? "+" : ""}{s}
                            </span>
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
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Share2 size={16} /> Compartilhar
                  </button>
                  <button
                    onClick={handleVerPoliticos}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <Search size={16} /> Ver políticos similares
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
