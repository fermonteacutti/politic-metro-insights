import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="font-heading text-lg font-bold">Politicômetro</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transparência política para o cidadão brasileiro. Dados públicos, metodologia aberta.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Navegação</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Início</Link>
              <Link to="/cidadania" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Cidadania em Foco</Link>
              <Link to="/quiz" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Quiz do Cidadão</Link>
              <Link to="/metodologia" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Metodologia</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Este termômetro é baseado em dados públicos e votações — não representa opinião editorial.</p>
              <p>Todos os dados são de fontes públicas e governamentais.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 Politicômetro — politicometro.com | Dados públicos, cidadania ativa.
        </div>
      </div>
    </footer>
  );
}
