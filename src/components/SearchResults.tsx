import { useState } from "react";
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
  web: { label: "Pesquisa Web", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
};

function buildLink(r: ResultadoBusca): string {
  if (r.fonte === "local") return `/politico/local/${r.id.replace("local-", "")}`;
  if (r.fonte === "senado") return `/politico/senado/${r.id.replace("senado-", "")}`;
  if (r.fonte === "web") return `/politico/web/${encodeURIComponent(r.id)}`;
  return `/politico/${r.id}`;
}

function getInitials(nome: string): string {
  const parts = nome.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return nome.charAt(0).toUpperCase();
}

function AvatarFallback({ nome, size = "w-16 h-16", textSize = "text-xl" }: { nome: string; size?: string; textSize?: string }) {
  return (
    <div className={`${size} rounded-xl bg-secondary shrink-0 flex items-center justify-center text-muted-foreground ${textSize} font-bold`}>
      {getInitials(nome)}
    </div>
  );
}

function FotoComFallback({ url, nome, size = "w-16 h-16", textSize = "text-xl" }: { url?: string; nome: string; size?: string; textSize?: string }) {
  const [errored, setErrored] = useState(false);
  if (url && !errored) {
    return (
      <img
        src={url}
        alt={nome}
        className={`${size} rounded-xl object-cover bg-secondary shrink-0`}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    );
  }
  return <AvatarFallback nome={nome} size={size} textSize={textSize} />;
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
        const badge = fonteBadge[r.fonte] ?? fonteBadge.local;
        return (
          <Link
            key={r.id}
            to={buildLink(r)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <FotoComFallback url={r.urlFoto} nome={r.nome} size="w-16 h-16" textSize="text-xl" />
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
