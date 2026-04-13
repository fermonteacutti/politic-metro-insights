import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, Users, Scale, Brain, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThermometerGauge from "@/components/ThermometerGauge";
import LeiDoDiaCard from "@/components/LeiDoDiaCard";
import SearchResults from "@/components/SearchResults";
import { Link } from "react-router-dom";
import { buscarUnificado, type ResultadoBusca } from "@/lib/searchService";

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

function SuggestionPhoto({ url, nome }: { url?: string; nome: string }) {
  const [errored, setErrored] = useState(false);
  if (url && !errored) {
    return <img src={url} alt="" className="w-8 h-8 rounded-lg object-cover bg-secondary shrink-0" onError={() => setErrored(true)} />;
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-secondary shrink-0 flex items-center justify-center text-xs font-bold text-muted-foreground">
      {nome.charAt(0)}
    </div>
  );
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ResultadoBusca[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<ResultadoBusca[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const autocompleteRequestRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (query?: string) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    autocompleteRequestRef.current += 1;
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchLoading(true);
    setSearchError(null);
    setSearched(true);
    try {
      const data = await buscarUnificado(q);
      setSearchResults(data);
    } catch {
      setSearchError("Erro ao buscar políticos. Tente novamente.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced autocomplete
  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const requestId = autocompleteRequestRef.current + 1;
    autocompleteRequestRef.current = requestId;

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await buscarUnificado(value.trim());
        if (autocompleteRequestRef.current !== requestId) return;
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(results.length > 0);
      } catch {
        if (autocompleteRequestRef.current !== requestId) return;
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest(".search-container")?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-hero py-20 md:py-28 overflow-hidden">
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
            <div className="relative max-w-xl mx-auto animate-fade-up animation-delay-400 search-container">
              <div className="flex items-center bg-card rounded-2xl shadow-2xl p-1.5">
                <div className="flex items-center flex-1 px-4 gap-3">
                  <Search size={20} className="text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Digite o nome de um político..."
                    className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="shrink-0 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Buscar
                </button>
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSearchQuery(s.nome);
                        setShowSuggestions(false);
                        handleSearch(s.nome);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-3"
                    >
                      <SuggestionPhoto url={s.urlFoto} nome={s.nome} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{s.nome}</p>
                        <p className="text-xs text-muted-foreground">{s.partido} · {s.estado}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

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
              <ThermometerGauge score={0} size="lg" />
              <p className="text-sm text-muted-foreground">
                Busque um político para ver seu termômetro
              </p>
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
                31 perguntas · 5 minutos
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
