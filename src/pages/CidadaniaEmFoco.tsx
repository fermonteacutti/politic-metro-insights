import { useState } from "react";
import { BookOpen, Filter, Search, ArrowRight, Scale, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categorias = ["Todos", "Economia", "Saúde", "Educação", "Segurança", "Meio Ambiente", "Social"];

const leis = [
  {
    id: 1,
    titulo: "PL 2630/2020 — Lei das Fake News",
    resumo: "Estabelece normas para funcionamento de redes sociais e combate à desinformação.",
    categoria: "Social",
    status: "Em tramitação",
    data: "2024-04-01",
    favoravel: "Combate desinformação, protege democracia",
    contra: "Risco de censura, impacto na liberdade de expressão",
  },
  {
    id: 2,
    titulo: "PEC 45/2019 — Reforma Tributária",
    resumo: "Unifica tributos sobre consumo (IBS e CBS), simplificando o sistema tributário nacional.",
    categoria: "Economia",
    status: "Aprovada",
    data: "2023-12-20",
    favoravel: "Simplificação, redução de burocracia, fim da guerra fiscal",
    contra: "Transição longa (até 2033), possível aumento de carga para serviços",
  },
  {
    id: 3,
    titulo: "PL 1904/2024 — Aborto após 22 semanas",
    resumo: "Equipara aborto acima de 22 semanas a homicídio, mesmo em caso de estupro.",
    categoria: "Social",
    status: "Em tramitação",
    data: "2024-06-12",
    favoravel: "Proteção à vida do nascituro viável",
    contra: "Criminaliza vítimas de violência sexual, risco à saúde",
  },
  {
    id: 4,
    titulo: "PL 490/2007 — Marco Temporal Indígena",
    resumo: "Define que povos indígenas só têm direito a terras que ocupavam em outubro de 1988.",
    categoria: "Meio Ambiente",
    status: "Aprovado na Câmara",
    data: "2023-05-30",
    favoravel: "Segurança jurídica, desenvolvimento econômico",
    contra: "Inconstitucional segundo STF, ameaça direitos indígenas",
  },
  {
    id: 5,
    titulo: "PL 2338/2023 — Marco Legal da IA",
    resumo: "Regulamenta o uso de inteligência artificial no Brasil com foco em transparência e direitos.",
    categoria: "Economia",
    status: "Em tramitação",
    data: "2024-03-15",
    favoravel: "Proteção de dados, transparência algorítmica",
    contra: "Pode limitar inovação, burocracia para startups",
  },
  {
    id: 6,
    titulo: "PL 1459/2022 — Programa Escola Segura",
    resumo: "Cria programa nacional de prevenção à violência em escolas públicas e privadas.",
    categoria: "Educação",
    status: "Em análise",
    data: "2024-02-20",
    favoravel: "Proteção de estudantes, prevenção de ataques",
    contra: "Custo de implementação, debate sobre armamento",
  },
];

export default function CidadaniaEmFoco() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const filtered = leis.filter((l) => {
    const matchCat = filtro === "Todos" || l.categoria === filtro;
    const matchBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      l.resumo.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero py-12 md:py-16">
          <div className="container text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm font-medium mb-4">
              <BookOpen size={14} />
              Cidadania em Foco
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Leis e Projetos que Impactam sua Vida
            </h1>
            <p className="text-primary-foreground/60 max-w-xl mx-auto">
              Entenda os projetos de lei em discussão no Congresso, com argumentos a favor e contra, em linguagem simples.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Search */}
              <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2 mb-4">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por título ou tema..."
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFiltro(cat)}
                    className={`px-3.5 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      filtro === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-4">
                {filtered.map((lei) => (
                  <div key={lei.id} className="rounded-2xl border border-border bg-card p-5 md:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-heading font-bold text-lg">{lei.titulo}</h3>
                      <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-secondary font-medium">
                        {lei.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{lei.resumo}</p>

                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <div className="rounded-xl bg-thermo-center-right/10 p-3 border border-thermo-center-right/20">
                        <p className="text-xs font-semibold mb-1" style={{ color: "hsl(204 63% 46%)" }}>✅ A favor</p>
                        <p className="text-xs text-muted-foreground">{lei.favoravel}</p>
                      </div>
                      <div className="rounded-xl bg-destructive/5 p-3 border border-destructive/10">
                        <p className="text-xs font-semibold text-destructive mb-1">⚠️ Contra</p>
                        <p className="text-xs text-muted-foreground">{lei.contra}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Filter size={12} /> {lei.categoria}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {lei.data}</span>
                      </div>
                      <button className="flex items-center gap-1 text-primary font-medium hover:underline">
                        Detalhes <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Scale size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Nenhum projeto encontrado com esses filtros.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
