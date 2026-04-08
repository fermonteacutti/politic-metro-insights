import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Calendar, FileText, Vote, User, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { obterDeputado, obterEventos, obterProposicoes, type DeputadoDetalhe, type Evento, type Proposicao } from "@/lib/camaraApi";

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

const placeholderDimensoes = [
  { nome: "Econômica", score: 0, peso: 25 },
  { nome: "Social/Costumes", score: 0, peso: 20 },
  { nome: "Segurança", score: 0, peso: 15 },
  { nome: "Ambiental", score: 0, peso: 10 },
  { nome: "Educação/Cultura", score: 0, peso: 10 },
  { nome: "Democracia/Institucional", score: 0, peso: 15 },
  { nome: "Saúde/Bem-Estar", score: 0, peso: 5 },
];

export default function PerfilPolitico() {
  const { id } = useParams<{ id: string }>();
  const [deputado, setDeputado] = useState<DeputadoDetalhe | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      obterDeputado(id),
      obterEventos(id).catch(() => [] as Evento[]),
      obterProposicoes(id).catch(() => [] as Proposicao[]),
    ])
      .then(([dep, evt, prop]) => {
        setDeputado(dep);
        setEventos(evt);
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
  const score = 0;

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
                  Deputado(a) Federal · {status.condicaoEleitoral}
                </p>
              </div>

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
              <Tabs defaultValue="votacoes">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="votacoes" className="gap-1.5 text-xs sm:text-sm">
                    <Vote size={14} className="hidden sm:block" /> Votações
                  </TabsTrigger>
                  <TabsTrigger value="projetos" className="gap-1.5 text-xs sm:text-sm">
                    <FileText size={14} className="hidden sm:block" /> Projetos
                  </TabsTrigger>
                  <TabsTrigger value="dados" className="gap-1.5 text-xs sm:text-sm">
                    <User size={14} className="hidden sm:block" /> Dados Pessoais
                  </TabsTrigger>
                </TabsList>

                {/* Votações (eventos/sessões) */}
                <TabsContent value="votacoes">
                  {eventos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhuma votação/evento encontrado.</p>
                  ) : (
                    <div className="space-y-3">
                      {eventos.map((e) => (
                        <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{e.descricao || e.descricaoTipo}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(e.dataHoraInicio).toLocaleDateString("pt-BR")} · {e.situacao}
                            </p>
                          </div>
                          {e.orgaos?.[0] && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary font-medium shrink-0 ml-2">
                              {e.orgaos[0].sigla}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

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

                {/* Dados Pessoais */}
                <TabsContent value="dados">
                  <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                    <InfoRow label="Nome Civil" value={deputado.nomeCivil} />
                    <InfoRow label="Nome Eleitoral" value={status.nomeEleitoral} />
                    <InfoRow label="Partido" value={status.siglaPartido} />
                    <InfoRow label="Estado" value={status.siglaUf} />
                    <InfoRow label="Situação" value={status.situacao} />
                    <InfoRow label="Condição Eleitoral" value={status.condicaoEleitoral} />
                    <InfoRow label="Escolaridade" value={deputado.escolaridade} />
                    <InfoRow label="Data de Nascimento" value={deputado.dataNascimento ? new Date(deputado.dataNascimento).toLocaleDateString("pt-BR") : "—"} />
                    <InfoRow label="Município de Nascimento" value={`${deputado.municipioNascimento || "—"} / ${deputado.ufNascimento || "—"}`} />
                    {status.gabinete && (
                      <>
                        <InfoRow label="Telefone" value={status.gabinete.telefone} />
                        <InfoRow label="E-mail" value={status.gabinete.email} />
                        <InfoRow label="Gabinete" value={`Sala ${status.gabinete.sala}, Andar ${status.gabinete.andar}`} />
                      </>
                    )}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-1 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
