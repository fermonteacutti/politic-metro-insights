import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Calendar, FileText, Vote, User, Loader2, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { obterDeputado, obterEventos, obterProposicoes, type DeputadoDetalhe, type Evento, type Proposicao } from "@/lib/camaraApi";
import { calcularTermometro, getCachedResult, setCachedResult, type TermometroResult } from "@/services/termometroService";
import { politicosConhecidos } from "@/data/politicosConhecidos";

const DIMENSAO_META: Record<string, { nome: string; peso: number }> = {
  economica: { nome: "Econômica", peso: 25 },
  social: { nome: "Social/Costumes", peso: 20 },
  seguranca: { nome: "Segurança", peso: 15 },
  ambiental: { nome: "Ambiental", peso: 10 },
  educacao: { nome: "Educação/Cultura", peso: 10 },
  democracia: { nome: "Democracia/Institucional", peso: 15 },
  saude: { nome: "Saúde/Bem-Estar", peso: 5 },
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
  if (score <= -20) return "Esquerda";
  if (score <= -5) return "Centro-Esquerda";
  if (score <= 5) return "Centro";
  if (score <= 20) return "Centro-Direita";
  if (score <= 60) return "Direita";
  return "Extrema Direita";
}

function PerfilPhoto({ url, nome }: { url?: string; nome: string }) {
  const [errored, setErrored] = useState(false);
  if (url && !errored) {
    return <img src={url} alt={nome} className="w-20 h-20 rounded-xl object-cover bg-secondary shrink-0" onError={() => setErrored(true)} />;
  }
  return (
    <div className="w-20 h-20 rounded-xl bg-secondary shrink-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
      {nome.charAt(0)}
    </div>
  );
}

// Local politician profile component
function PerfilLocal({ localId }: { localId: string }) {
  const politico = politicosConhecidos.find((p) => p.id === localId);
  const [termometro, setTermometro] = useState<TermometroResult | null>(null);
  const [termometroLoading, setTermometroLoading] = useState(false);

  useEffect(() => {
    if (!politico) return;

    const cached = getCachedResult(`local-${localId}`);
    if (cached) {
      setTermometro(cached);
      return;
    }

    setTermometroLoading(true);
    calcularTermometro(politico.nome, [], [])
      .then((result) => {
        setTermometro(result);
        setCachedResult(`local-${localId}`, result);
      })
      .catch((err) => console.error("[PerfilLocal] Erro termômetro:", err))
      .finally(() => setTermometroLoading(false));
  }, [localId, politico]);

  if (!politico) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-destructive font-medium mb-2">Político não encontrado.</p>
          <Link to="/" className="text-sm text-primary hover:underline">← Voltar à busca</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const score = termometro?.score ?? 0;
  const dimensoes = termometro
    ? Object.entries(DIMENSAO_META).map(([key, meta]) => ({
        nome: meta.nome,
        score: termometro.dimensoes[key] ?? 0,
        peso: meta.peso,
      }))
    : Object.entries(DIMENSAO_META).map(([, meta]) => ({
        nome: meta.nome,
        score: 0,
        peso: meta.peso,
      }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-hero py-6">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6">
              <ArrowLeft size={16} /> Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
              <PerfilPhoto url={politico.urlFoto} nome={politico.nome} />

              <div className="flex-1 min-w-0 text-center md:text-left">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                  {politico.nome}
                </h1>
                <div className="flex flex-wrap gap-3 text-primary-foreground/70 text-sm justify-center md:justify-start">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {politico.partido}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {politico.estado}</span>
                </div>
                <p className="mt-1 text-primary-foreground/50 text-xs">{politico.cargo}</p>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                {termometroLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 size={18} className="animate-spin text-primary-foreground/60" />
                    <p className="text-primary-foreground/60 text-xs">Calculando...</p>
                  </div>
                ) : (
                  <>
                    <ThermometerGauge score={score} size="sm" />
                    <p className="text-primary-foreground/70 text-sm font-medium">
                      {getScoreLabel(score)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {!termometroLoading && termometro && (
              <div className="mt-4 pt-3 border-t border-primary-foreground/10">
                {termometro.resumo && (
                  <p className="text-primary-foreground/60 text-xs italic mb-2 max-w-2xl">
                    {termometro.resumo}
                  </p>
                )}
                {termometro.pautas && termometro.pautas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {termometro.pautas.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">
                        {p}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Warning */}
        <section className="py-4">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Dados baseados em histórico público e declarações — sem votações parlamentares registradas.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dimensions */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Análise por Dimensão</h2>
              <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
                {dimensoes.map((d) => (
                  <DimensionBar key={d.nome} nome={d.nome} score={d.score} peso={d.peso} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Main component: routes based on source type
export default function PerfilPolitico() {
  const { id, source } = useParams<{ id: string; source?: string }>();

  // Local politician
  if (source === "local") {
    return <PerfilLocal localId={id!} />;
  }

  // Senado politician — simplified view with termometer only
  if (source === "senado") {
    return <PerfilSenado senadoId={id!} />;
  }

  // Default: Câmara deputy
  return <PerfilDeputado id={id!} />;
}

function PerfilSenado({ senadoId }: { senadoId: string }) {
  const [termometro, setTermometro] = useState<TermometroResult | null>(null);
  const [termometroLoading, setTermometroLoading] = useState(true);
  const [senadorNome, setSenadorNome] = useState("");
  const [senadorData, setSenadorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = "https://politicometro-api.fernando-650.workers.dev/camara";
    fetch(`${BASE}/senadores/lista/atual?campos=IdentificacaoParlamentar`)
      .then((r) => r.json())
      .then((json) => {
        const lista =
          json?.dados?.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar ||
          json?.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar ||
          [];
        const arr = Array.isArray(lista) ? lista : [lista];
        const found = arr.find(
          (s: any) => String(s?.IdentificacaoParlamentar?.CodigoParlamentar) === senadoId
        );
        if (found) {
          const ip = found.IdentificacaoParlamentar;
          setSenadorNome(ip.NomeParlamentar || ip.NomeCompletoParlamentar);
          setSenadorData(ip);
        }
      })
      .catch((err) => console.error("[PerfilSenado] Erro:", err))
      .finally(() => setLoading(false));
  }, [senadoId]);

  useEffect(() => {
    if (!senadorNome) return;
    const cached = getCachedResult(`senado-${senadoId}`);
    if (cached) {
      setTermometro(cached);
      setTermometroLoading(false);
      return;
    }
    calcularTermometro(senadorNome, [], [])
      .then((result) => {
        setTermometro(result);
        setCachedResult(`senado-${senadoId}`, result);
      })
      .catch((err) => console.error("[PerfilSenado] Erro termômetro:", err))
      .finally(() => setTermometroLoading(false));
  }, [senadorNome, senadoId]);

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

  const score = termometro?.score ?? 0;
  const dimensoes = termometro
    ? Object.entries(DIMENSAO_META).map(([key, meta]) => ({
        nome: meta.nome,
        score: termometro.dimensoes[key] ?? 0,
        peso: meta.peso,
      }))
    : Object.entries(DIMENSAO_META).map(([, meta]) => ({
        nome: meta.nome,
        score: 0,
        peso: meta.peso,
      }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-hero py-6">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6">
              <ArrowLeft size={16} /> Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
              {senadorData?.UrlFotoParlamentar ? (
                <img src={senadorData.UrlFotoParlamentar} alt={senadorNome} className="w-20 h-20 rounded-xl object-cover bg-secondary shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-secondary shrink-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {senadorNome.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0 text-center md:text-left">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                  {senadorNome}
                </h1>
                <div className="flex flex-wrap gap-3 text-primary-foreground/70 text-sm justify-center md:justify-start">
                  {senadorData?.SiglaPartidoParlamentar && (
                    <span className="flex items-center gap-1"><Building2 size={14} /> {senadorData.SiglaPartidoParlamentar}</span>
                  )}
                  {senadorData?.UfParlamentar && (
                    <span className="flex items-center gap-1"><MapPin size={14} /> {senadorData.UfParlamentar}</span>
                  )}
                </div>
                <p className="mt-1 text-primary-foreground/50 text-xs">Senador(a)</p>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                {termometroLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 size={18} className="animate-spin text-primary-foreground/60" />
                    <p className="text-primary-foreground/60 text-xs">Calculando...</p>
                  </div>
                ) : (
                  <>
                    <ThermometerGauge score={score} size="sm" />
                    <p className="text-primary-foreground/70 text-sm font-medium">{getScoreLabel(score)}</p>
                  </>
                )}
              </div>
            </div>

            {!termometroLoading && termometro && (
              <div className="mt-4 pt-3 border-t border-primary-foreground/10">
                {termometro.resumo && (
                  <p className="text-primary-foreground/60 text-xs italic mb-2 max-w-2xl">{termometro.resumo}</p>
                )}
                {termometro.pautas && termometro.pautas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {termometro.pautas.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">{p}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="py-4">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Dados baseados em histórico público e declarações — sem votações parlamentares registradas no Senado.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Análise por Dimensão</h2>
              <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
                {dimensoes.map((d) => (
                  <DimensionBar key={d.nome} nome={d.nome} score={d.score} peso={d.peso} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PerfilDeputado({ id }: { id: string }) {
  const [deputado, setDeputado] = useState<DeputadoDetalhe | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [termometro, setTermometro] = useState<TermometroResult | null>(null);
  const [termometroLoading, setTermometroLoading] = useState(false);

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
      .catch((err) => {
        setError(`Erro ao carregar deputado (ID: ${id}): ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !deputado || loading) return;

    const cached = getCachedResult(id);
    if (cached) {
      setTermometro(cached);
      return;
    }

    setTermometroLoading(true);
    const nome = deputado.ultimoStatus.nomeEleitoral || deputado.ultimoStatus.nome;

    calcularTermometro(nome, eventos, proposicoes)
      .then((result) => {
        setTermometro(result);
        setCachedResult(id, result);
      })
      .catch((err) => {
        console.error("[PerfilPolitico] Erro termômetro:", err);
      })
      .finally(() => setTermometroLoading(false));
  }, [id, deputado, loading, eventos, proposicoes]);

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
  const score = termometro?.score ?? 0;

  const dimensoes = termometro
    ? Object.entries(DIMENSAO_META).map(([key, meta]) => ({
        nome: meta.nome,
        score: termometro.dimensoes[key] ?? 0,
        peso: meta.peso,
      }))
    : Object.entries(DIMENSAO_META).map(([, meta]) => ({
        nome: meta.nome,
        score: 0,
        peso: meta.peso,
      }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-hero py-6">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6">
              <ArrowLeft size={16} /> Voltar
            </Link>

            <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
              <img
                src={status.urlFoto}
                alt={status.nome}
                className="w-20 h-20 rounded-xl object-cover bg-secondary shrink-0"
              />

              <div className="flex-1 min-w-0 text-center md:text-left">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                  {status.nomeEleitoral || status.nome}
                </h1>
                <div className="flex flex-wrap gap-3 text-primary-foreground/70 text-sm justify-center md:justify-start">
                  <span className="flex items-center gap-1"><Building2 size={14} /> {status.siglaPartido}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {status.siglaUf}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {status.situacao}</span>
                </div>
                <p className="mt-1 text-primary-foreground/50 text-xs">
                  Deputado(a) Federal · {status.condicaoEleitoral}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                {termometroLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 size={18} className="animate-spin text-primary-foreground/60" />
                    <p className="text-primary-foreground/60 text-xs">Calculando...</p>
                  </div>
                ) : (
                  <>
                    <ThermometerGauge score={score} size="sm" />
                    <p className="text-primary-foreground/70 text-sm font-medium">
                      {getScoreLabel(score)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {!termometroLoading && termometro && (
              <div className="mt-4 pt-3 border-t border-primary-foreground/10">
                {termometro.resumo && (
                  <p className="text-primary-foreground/60 text-xs italic mb-2 max-w-2xl">
                    {termometro.resumo}
                  </p>
                )}
                {termometro.pautas && termometro.pautas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {termometro.pautas.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">
                        {p}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Análise por Dimensão</h2>
              <div className="space-y-4 bg-card rounded-2xl border border-border p-6">
                {dimensoes.map((d) => (
                  <DimensionBar key={d.nome} nome={d.nome} score={d.score} peso={d.peso} />
                ))}
              </div>
              {!termometro && (
                <p className="text-xs text-muted-foreground mt-3">
                  ⚖️ Algoritmo de pontuação em desenvolvimento — dados preliminares.
                </p>
              )}
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
