import { Link } from "react-router-dom";
import { MapPin, Building2, Loader2, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ResultadoBusca } from "@/lib/searchService";

interface Props {
  results: ResultadoBusca[] | null;
  loading: boolean;
  error: string | null;
  searched: boolean;
}

const fonteBadge: Record<string, { label: string; className: string }> = {
  camara: { label: "Câmara", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  senado: { label: "Senado", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  local: { label: "Perfil Público", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

function buildLink(r: ResultadoBusca): string {
  if (r.fonte === "local") return `/politico/local/${r.id.replace("local-", "")}`;
  if (r.fonte === "senado") return `/politico/senado/${r.id.replace("senado-", "")}`;
  return `/politico/${r.id}`;
}

export default function SearchResults({ results, loading, error, searched }: Props) {
  if (!searched) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Buscando políticos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <SearchX size={32} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm font-medium">Nenhum político encontrado com esse nome.</p>
        <p className="text-xs mt-1">Tente outro nome ou verifique a grafia.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((r) => {
        const badge = fonteBadge[r.fonte];
        return (
          <Link
            key={r.id}
            to={buildLink(r)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {r.urlFoto ? (
              <img
                src={r.urlFoto}
                alt={r.nome}
                className="w-16 h-16 rounded-xl object-cover bg-secondary shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-secondary shrink-0 flex items-center justify-center text-muted-foreground text-xl font-bold">
                {r.nome.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-heading font-bold text-sm truncate">{r.nome}</p>
              {r.cargo && (
                <p className="text-xs text-muted-foreground truncate">{r.cargo}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-0.5"><Building2 size={12} /> {r.partido}</span>
                <span className="flex items-center gap-0.5"><MapPin size={12} /> {r.estado}</span>
              </div>
              <Badge variant="outline" className={`mt-1.5 text-[10px] px-1.5 py-0 ${badge.className}`}>
                {badge.label}
              </Badge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
