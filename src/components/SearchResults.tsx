import { Link } from "react-router-dom";
import { MapPin, Building2, Loader2, SearchX } from "lucide-react";
import type { DeputadoResumo } from "@/lib/camaraApi";

interface Props {
  results: DeputadoResumo[] | null;
  loading: boolean;
  error: string | null;
  searched: boolean;
}

export default function SearchResults({ results, loading, error, searched }: Props) {
  if (!searched) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Buscando deputados...</span>
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
      {results.map((dep) => (
        <Link
          key={dep.id}
          to={`/politico/${dep.id}`}
          className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <img
            src={dep.urlFoto}
            alt={dep.nome}
            className="w-16 h-16 rounded-xl object-cover bg-secondary shrink-0"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm truncate">{dep.nome}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-0.5"><Building2 size={12} /> {dep.siglaPartido}</span>
              <span className="flex items-center gap-0.5"><MapPin size={12} /> {dep.siglaUf}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
