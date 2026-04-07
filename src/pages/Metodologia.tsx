import { BookOpen, Scale, BarChart3, Database, ShieldCheck, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const dimensoes = [
  { nome: "Econômica", peso: 25, desc: "Posição sobre impostos, gastos públicos, privatizações, livre mercado vs. intervencionismo estatal.", cor: "bg-thermo-center" },
  { nome: "Social / Costumes", peso: 20, desc: "Direitos LGBTQIA+, aborto, drogas, casamento, liberdade individual vs. valores tradicionais.", cor: "bg-thermo-left" },
  { nome: "Segurança Pública", peso: 15, desc: "Porte de armas, penas mais duras, sistema carcerário, policiamento comunitário vs. repressão.", cor: "bg-thermo-extreme-right" },
  { nome: "Ambiental", peso: 10, desc: "Desmatamento, energia limpa, agronegócio, demarcação de terras, licenciamento ambiental.", cor: "bg-thermo-center-right" },
  { nome: "Educação / Cultura", peso: 10, desc: "Escola pública vs. voucher, currículo, investimento em ciência, patrimônio cultural.", cor: "bg-thermo-center-left" },
  { nome: "Democracia / Institucional", peso: 15, desc: "Independência dos poderes, reforma política, transparência, liberdade de imprensa.", cor: "bg-thermo-right" },
  { nome: "Saúde / Bem-Estar", peso: 5, desc: "SUS, planos de saúde, saúde mental, acesso a medicamentos, políticas de bem-estar social.", cor: "bg-thermo-extreme-left" },
];

const fontes = [
  { nome: "Câmara dos Deputados API", url: "https://dadosabertos.camara.leg.br", desc: "Votações, projetos, deputados" },
  { nome: "Senado Federal API", url: "https://legis.senado.leg.br/dadosabertos", desc: "Senadores, matérias, votações" },
  { nome: "TSE (Tribunal Superior Eleitoral)", url: "https://dadosabertos.tse.jus.br", desc: "Candidatos, financiamento eleitoral" },
  { nome: "Portal da Transparência", url: "https://portaldatransparencia.gov.br", desc: "Gastos públicos, convênios" },
  { nome: "Diário Oficial da União", url: "https://www.in.gov.br", desc: "Atos normativos, decretos" },
];

export default function Metodologia() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero py-12 md:py-16">
          <div className="container text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm font-medium mb-4">
              <BookOpen size={14} />
              Transparência Total
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
              Nossa Metodologia
            </h1>
            <p className="text-primary-foreground/60 max-w-xl mx-auto">
              Entenda exatamente como calculamos o Termômetro Político — critérios abertos, auditáveis, sem viés editorial.
            </p>
          </div>
        </section>

        <div className="container py-12 md:py-16">
          <div className="max-w-3xl mx-auto space-y-16">

            {/* Como funciona */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Scale size={20} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold">Como funciona</h2>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  O Politicômetro analisa cada político em <strong className="text-foreground">7 dimensões temáticas</strong>,
                  atribuindo uma nota de <strong className="text-foreground">-100</strong> (posições de esquerda) a{" "}
                  <strong className="text-foreground">+100</strong> (posições de direita) em cada uma.
                </p>
                <p>
                  A <strong className="text-foreground">nota final</strong> é a média ponderada das 7 dimensões, 
                  resultando num score único que posiciona o político no espectro ideológico.
                </p>
                <div className="bg-secondary rounded-xl p-4 font-mono text-xs">
                  Score Final = Σ (Score_dimensão × Peso_dimensão) / 100
                </div>
              </div>
            </section>

            {/* Escala */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold">Escala de Classificação</h2>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="w-full h-4 rounded-full thermometer-gradient mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { faixa: "≤ -60", label: "Extrema Esquerda", cor: "bg-thermo-extreme-left" },
                    { faixa: "-59 a -20", label: "Centro-Esquerda", cor: "bg-thermo-center-left" },
                    { faixa: "-19 a +19", label: "Centro", cor: "bg-thermo-center" },
                    { faixa: "+20 a +59", label: "Centro-Direita", cor: "bg-thermo-center-right" },
                    { faixa: "≥ +60", label: "Direita / Extrema Direita", cor: "bg-thermo-right" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <div className={`w-3 h-3 rounded-full ${item.cor}`} />
                      <div>
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground ml-1.5 text-xs">({item.faixa})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dimensões */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Scale size={20} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold">As 7 Dimensões</h2>
              </div>
              <div className="space-y-3">
                {dimensoes.map((d) => (
                  <div key={d.nome} className="bg-card rounded-xl border border-border p-5 flex gap-4 items-start">
                    <div className={`w-2 h-full min-h-[3rem] rounded-full ${d.cor} shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-heading font-bold">{d.nome}</h3>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Peso: {d.peso}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Fontes */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database size={20} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold">Fontes de Dados</h2>
              </div>
              <div className="bg-card rounded-2xl border border-border divide-y divide-border">
                {fontes.map((f) => (
                  <div key={f.nome} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{f.nome}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      Acessar ↗
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold">Compromissos e Avisos</h2>
              </div>
              <div className="space-y-3">
                {[
                  "Acusação não equivale a condenação.",
                  "O Termômetro é baseado em dados públicos — não representa opinião editorial.",
                  "Fontes externas são de responsabilidade de seus veículos.",
                  "Sem patrocinadores políticos. Sem viés editorial.",
                ].map((aviso, i) => (
                  <div key={i} className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
                    <AlertTriangle size={16} className="text-thermo-center-left shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{aviso}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
