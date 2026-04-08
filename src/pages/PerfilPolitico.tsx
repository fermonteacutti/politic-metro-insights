import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Calendar, ExternalLink, FileText, Vote, Newspaper, Gavel, DollarSign, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { obterDeputado, obterVotacoes, obterProposicoes, type DeputadoDetalhe, type Votacao, type Proposicao } from "@/lib/camaraApi";

// --- Sub-components ---

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

// Placeholder dimensions (will be replaced by real algorithm later)
const placeholderDimensoes = [
  { nome: "Econômica", score: 0, peso: 25 },
  { nome: "Social/Costumes", score: 0, peso: 20 },
  { nome: "Segurança", score: 0, peso: 15 },
  { nome: "Ambiental", score: 0, peso: 10 },
  { nome: "Educação/Cultura", score: 0, peso: 10 },
  { nome: "Democracia/Institucional", score: 0, peso: 15 },
  { nome: "Saúde/Bem-Estar", score: 0, peso: 5 },
];

// --- Main page ---

export default function PerfilPolitico() {
  const { id } = useParams<{ id: string }>();
  const [deputado, setDeputado] = useState<DeputadoDetalhe | null>(null);
  const [votacoes, setVotacoes] = useState<Votacao[]>([]);
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      obterDeputado(id),
      obterVotacoes(id).catch(() => [] as Votacao[]),
      obterProposicoes(id).catch(() => [] as Proposicao[]),
    ])
      .then(([dep, vot, prop]) => {
        setDeputado(dep);
        setVotacoes(vot);
        setProposicoes(prop);
      })
      .catch(() => setError("Não foi possível carregar os dados deste deputado."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-muted-foreground gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Carregando perfil...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !deputado) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-destructive font-medium mb-2">{error || "Deputado não encontrado."}</p>
          <Link to="/" className="text-sm text-primary hover:underline">← Voltar à busca</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const status = deputado.ultimoStatus;
  const score = 0; // placeholder until algorithm is implemented

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
              <img
                src={status.urlFoto}
                alt={status.nome}
                className="w-24 h-24 rounded-2xl object-cover bg-secondary shrink-0"
              />

              <div className="flex-1">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  {status.nomeEleitoral || status.nome}
                </h1>
                <div className="flex flex-wrap gap-3 text-primary-foreground/70 text-sm">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {status.siglaPartido}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {status.siglaUf}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {status.situacao}</span>
                </div>
                <p className="mt-2 text-primary-foreground/50 text-xs">
                  Deputado(a) Federal · ID: {id}
                </p>
              </div>

              {/* Thermometer */}
              <div className="shrink-0">
                <ThermometerGauge score={score} size="md" />
                <p className="text-center text-primary-foreground/70 text-sm font-medium mt-1">
                  {getScoreLabel(score)}
                </p>
                <p className="text-center text-primary-foreground/40 text-[10px] mt-0.5">
                  Score em desenvolvimento
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
                {placeholderDimensoes.map((d) => (
                  <DimensionBar key={d.nome} nome={d.nome} score={d.score} peso={d.peso} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⚖️ Algoritmo de pontuação em desenvolvimento — dados preliminares.
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

                {/* Projetos (proposições) */}
                <TabsContent value="projetos">
                  {proposicoes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma proposição encontrada.</p>
                  ) : (
                    <div className="space-y-3">
                      {proposicoes.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl border border-border bg-card">
                          <p className="font-medium text-sm">{p.siglaTipo} {p.numero}/{p.ano}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.ementa}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Votações */}
                <TabsContent value="votacoes">
                  {votacoes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma votação encontrada.</p>
                  ) : (
                    <div className="space-y-3">
                      {votacoes.map((v) => (
                        <div key={v.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{v.descricao || v.siglaOrgao}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(v.dataHoraRegistro || v.data).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-secondary font-medium shrink-0 ml-2">
                            {v.siglaOrgao}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Notícias */}
                <TabsContent value="noticias">
                  <div className="text-center py-12 text-muted-foreground">
                    <Newspaper size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Notícias serão integradas em breve.</p>
                  </div>
                </TabsContent>

                {/* Financeiro */}
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
