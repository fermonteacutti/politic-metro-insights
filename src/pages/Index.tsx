import { useState } from "react";
import { Search, ArrowRight, Users, Scale, Brain, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import LeiDoDiaCard from "@/components/LeiDoDiaCard";
import SearchResults from "@/components/SearchResults";
import { Link } from "react-router-dom";
import { buscarDeputados, type DeputadoResumo } from "@/lib/camaraApi";

const features = [
  {
    icon: Search,
    title: "Busca Inteligente",
    description: "Digite o nome de qualquer político e receba um perfil completo com dados públicos oficiais.",
  },
  {
    icon: Scale,
    title: "Termômetro Político",
    description: "Visualize o posicionamento ideológico baseado em votações, projetos e declarações.",
  },
  {
    icon: Brain,
    title: "Quiz do Cidadão",
    description: "Descubra seu próprio posicionamento no espectro político com nosso quiz interativo.",
  },
  {
    icon: Shield,
    title: "Metodologia Aberta",
    description: "Critérios transparentes e auditáveis. Sem viés editorial, sem patrocinadores políticos.",
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [searchResults, setSearchResults] = useState<DeputadoResumo[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchLoading(true);
    setSearchError(null);
    setSearched(true);
    try {
      const data = await buscarDeputados(q);
      setSearchResults(data);
    } catch {
      setSearchError("Erro ao buscar deputados. Tente novamente.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-hero py-20 md:py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-thermo-center rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-thermo-right rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4 animate-fade-up">
              Transparência Política{" "}
              <span className="block mt-1 opacity-80">para o Cidadão Brasileiro</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-up animation-delay-200">
              Busque qualquer político, entenda onde ele se posiciona e descubra seu próprio termômetro político.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto animate-fade-up animation-delay-400">
              <div className="flex items-center bg-card rounded-2xl shadow-2xl p-1.5">
                <div className="flex items-center flex-1 px-4 gap-3">
                  <Search size={20} className="text-muted-foreground shrink-0" />
                   <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Digite o nome de um político..."
                    className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="shrink-0 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Buscar
                </button>
              </div>
              <p className="text-primary-foreground/50 text-xs mt-3">
                Ex: Lula, Bolsonaro, Marina Silva, Simone Tebet...
              </p>
           </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searched && (
        <section className="py-10">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-xl font-bold mb-4">Resultados da Busca</h2>
              <SearchResults results={searchResults} loading={searchLoading} error={searchError} searched={searched} />
            </div>
          </div>
        </section>
      )}

      {/* Demo Thermometer */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Elemento Central</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">
                O Termômetro Político
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Gauge animado que posiciona o político no espectro ideológico, de Extrema Esquerda a Extrema Direita.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <ThermometerGauge score={demoScores[demoIndex].score} size="lg" />

              <div className="flex gap-2">
                {demoScores.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setDemoIndex(i)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      i === demoIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Scale legend */}
              <div className="w-full max-w-md">
                <div className="h-3 rounded-full thermometer-gradient" />
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                  <span>Esquerda</span>
                  <span>Centro</span>
                  <span>Direita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lei do Dia */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <LeiDoDiaCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Funcionalidades</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Tudo que você precisa saber
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feat.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-hero rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-thermo-center rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm font-medium mb-4">
                <Brain size={16} />
                30 perguntas · 5 minutos
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
                Descubra seu Termômetro Político
              </h2>
              <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
                Responda nosso quiz baseado nas mesmas 7 dimensões que usamos para avaliar políticos e veja onde você se posiciona no espectro.
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-card text-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Começar o Quiz <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: "594", label: "Deputados Federais" },
              { value: "81", label: "Senadores" },
              { value: "7", label: "Dimensões de Análise" },
              { value: "100%", label: "Dados Públicos" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
