import { BookOpen, ArrowRight, Scale } from "lucide-react";

export default function LeiDoDiaCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-thermo-center/15 text-sm font-semibold" style={{ color: "#E67E22" }}>
          <BookOpen size={14} />
          <span>Cidadania em Foco</span>
        </div>
        <span className="text-xs text-muted-foreground">Atualizado hoje</span>
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl md:text-2xl font-bold mb-2">
        PL 2630/2020 — Lei das Fake News
      </h3>
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
        Projeto que estabelece normas para o funcionamento de redes sociais e serviços de mensagens no Brasil, 
        combatendo a disseminação de conteúdos falsos e regulando a atuação de plataformas digitais.
      </p>

      {/* Pros and Cons */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl bg-thermo-center-right/10 p-4 border border-thermo-center-right/20">
          <p className="text-xs font-semibold mb-1.5" style={{ color: "#2E86C1" }}>✅ Argumentos a favor</p>
          <p className="text-sm text-muted-foreground">
            Combate desinformação, protege democracia, responsabiliza plataformas
          </p>
        </div>
        <div className="rounded-xl bg-destructive/5 p-4 border border-destructive/10">
          <p className="text-xs font-semibold text-destructive mb-1.5">⚠️ Argumentos contra</p>
          <p className="text-sm text-muted-foreground">
            Risco de censura, dificuldade de implementação, impacto na liberdade de expressão
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Scale size={14} />
          <span>Fonte: Câmara dos Deputados</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Ler mais <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
