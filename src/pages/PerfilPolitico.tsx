import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Calendar, ExternalLink, FileText, Vote, Newspaper, Gavel, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo data — will be replaced with API calls
const demoPolitico = {
  nome: "Exemplo de Político",
  partido: "PARTIDO",
  uf: "SP",
  cargo: "Deputado(a) Federal",
  foto: null,
  mandatoInicio: "2023",
  score: 23,
  dimensoes: [
    { nome: "Econômica", score: 35, peso: 25 },
    { nome: "Social/Costumes", score: -12, peso: 20 },
    { nome: "Segurança", score: 45, peso: 15 },
    { nome: "Ambiental", score: -30, peso: 10 },
    { nome: "Educação/Cultura", score: 10, peso: 10 },
    { nome: "Democracia/Institucional", score: 20, peso: 15 },
    { nome: "Saúde/Bem-Estar", score: -5, peso: 5 },
  ],
  projetos: [
    { titulo: "PL 1234/2024 — Reforma Tributária", status: "Em tramitação", data: "15/03/2024" },
    { titulo: "PL 5678/2023 — Programa Social", status: "Aprovado", data: "22/11/2023" },
    { titulo: "PL 9012/2023 — Segurança Pública", status: "Em análise", data: "05/08/2023" },
  ],
  votacoes: [
    { tema: "PEC da Reforma Administrativa", voto: "Sim", data: "10/04/2024" },
    { tema: "PL das Fake News", voto: "Não", data: "28/03/2024" },
    { tema: "LOA 2024", voto: "Sim", data: "15/12/2023" },
    { tema: "Marco Legal das Garantias", voto: "Abstenção", data: "01/11/2023" },
  ],
  noticias: [
    { titulo: "Político defende nova proposta de reforma", fonte: "Folha", data: "02/04/2024" },
    { titulo: "Bancada articula votação para semana que vem", fonte: "G1", data: "28/03/2024" },
  ],
};

function DimensionBar({ nome, score, peso }: { nome: string; score: number; peso: number }) {
  const pct = ((score + 100) / 200) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{nome}</span>
        <span className="text-muted-foreground">
          {score > 0 ? "+" : ""}{score} · peso {peso}%
        </span>
      </div>
      <div className="relative h-2.5 rounded-full bg-secondary overflow-hidden">
        <div className="absolute inset-0 thermometer-gradient opacity-30" />
        <div
          className="absolute top-0 h-full w-1 bg-foreground rounded-full transition-all duration-700"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function getScoreLabel(score: number) {
  if (score <= -60) return "Extrema Esquerda";
  if (score <= -20) return "Centro-Esquerda";
  if (score <= 19) return "Centro";
  if (score <= 59) return "Centro-Direita";
  return "Extrema Direita";
}

export default function PerfilPolitico() {
  const { id } = useParams();
  const pol = demoPolitico;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Top bar */}
        <div className="bg-hero py-8">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6">
              <ArrowLeft size={16} /> Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <span className="text-4xl font-bold text-primary-foreground/60">
                  {pol.nome.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  {pol.nome}
                </h1>
                <div className="flex flex-wrap gap-3 text-primary-foreground/70 text-sm">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {pol.partido}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {pol.uf}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Mandato desde {pol.mandatoInicio}</span>
                </div>
                <p className="mt-2 text-primary-foreground/50 text-xs">
                  {pol.cargo} · ID: {id || "demo"}
                </p>
              </div>

              {/* Thermometer */}
              <div className="shrink-0">
                <ThermometerGauge score={pol.score} size="md" />
                <p className="text-center text-primary-foreground/70 text-sm font-medium mt-1">
                  {getScoreLabel(pol.score)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Análise por Dimensão</h2>
              <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
                {pol.dimensoes.map((d) => (
                  <DimensionBar key={d.nome} nome={d.nome} score={d.score} peso={d.peso} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⚖️ Termômetro baseado em dados públicos — não representa opinião editorial.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="pb-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="projetos">
                <TabsList className="w-full grid grid-cols-4 mb-6">
                  <TabsTrigger value="projetos" className="gap-1.5 text-xs sm:text-sm">
                    <FileText size={14} className="hidden sm:block" /> Projetos
                  </TabsTrigger>
                  <TabsTrigger value="votacoes" className="gap-1.5 text-xs sm:text-sm">
                    <Vote size={14} className="hidden sm:block" /> Votações
                  </TabsTrigger>
                  <TabsTrigger value="noticias" className="gap-1.5 text-xs sm:text-sm">
                    <Newspaper size={14} className="hidden sm:block" /> Notícias
                  </TabsTrigger>
                  <TabsTrigger value="financeiro" className="gap-1.5 text-xs sm:text-sm">
                    <DollarSign size={14} className="hidden sm:block" /> Financeiro
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="projetos">
                  <div className="space-y-3">
                    {pol.projetos.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-sm">{p.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.data}</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-secondary font-medium">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="votacoes">
                  <div className="space-y-3">
                    {pol.votacoes.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-sm">{v.tema}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{v.data}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          v.voto === "Sim" ? "bg-thermo-center-right/20 text-thermo-right" :
                          v.voto === "Não" ? "bg-destructive/10 text-destructive" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {v.voto}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="noticias">
                  <div className="space-y-3">
                    {pol.noticias.map((n, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                        <div>
                          <p className="font-medium text-sm">{n.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.fonte} · {n.data}</p>
                        </div>
                        <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground">Fontes externas são de responsabilidade de seus veículos.</p>
                  </div>
                </TabsContent>

                <TabsContent value="financeiro">
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Dados financeiros serão disponibilizados em breve.</p>
                    <p className="text-xs mt-1">Fonte: Portal da Transparência e TSE</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
