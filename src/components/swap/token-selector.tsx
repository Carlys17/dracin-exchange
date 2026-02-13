"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Token } from "@/lib/types";
import { POPULAR_TOKENS } from "@/lib/config/chains";
import { useTokenSearch } from "@/hooks/use-swap";
import { ChevronDown, Search, X } from "lucide-react";

interface Props { selected: Token | null; chainId: number; onSelect: (t: Token) => void; }

export function TokenSelector({ selected, chainId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const { search } = useTokenSearch();
  const ref = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const popular = POPULAR_TOKENS[chainId] || [];

  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (timer.current) clearTimeout(timer.current);
    if (!q) { setResults([]); return; }
    setLoading(true);
    timer.current = setTimeout(async () => { setResults(await search(chainId, q)); setLoading(false); }, 400);
  }, [chainId, search]);

  const tokens = query ? results : popular;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-3 py-2 text-sm font-bold transition-all hover:border-border-hover hover:bg-bg-card-hover">
        {selected?.logoURI && <img src={selected.logoURI} alt="" className="h-5 w-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
        <span className="text-text-primary">{selected?.symbol || "Select"}</span>
        <ChevronDown size={12} className="text-text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-72 animate-slide-up rounded-xl border border-border bg-bg-card shadow-card">
            <div className="p-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2 focus-within:border-accent/30">
                <Search size={13} className="text-text-muted" />
                <input ref={ref} type="text" value={query} onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search name or address" className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted" />
                {query && <button onClick={() => handleSearch("")}><X size={11} className="text-text-muted" /></button>}
              </div>
            </div>
            {!query && popular.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2.5">
                {popular.slice(0, 5).map((t) => (
                  <button key={t.address} onClick={() => { onSelect(t); setOpen(false); setQuery(""); }}
                    className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors ${selected?.address === t.address ? "border-accent/30 bg-accent-dim text-accent" : "border-border text-text-secondary hover:border-border-hover hover:bg-bg-elevated"}`}>
                    {t.logoURI && <img src={t.logoURI} alt="" className="h-3.5 w-3.5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    {t.symbol}
                  </button>
                ))}
              </div>
            )}
            <div className="max-h-56 overflow-y-auto border-t border-border p-1">
              {loading ? (
                <div className="flex justify-center py-6"><div className="h-4 w-4 animate-spin rounded-full border-2 border-accent/20 border-t-accent" /></div>
              ) : tokens.length === 0 ? (
                <p className="py-6 text-center text-xs text-text-muted">{query ? "No tokens found" : "No tokens"}</p>
              ) : tokens.map((t) => (
                <button key={`${t.address}-${t.chainId}`} onClick={() => { onSelect(t); setOpen(false); setQuery(""); }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-bg-elevated ${selected?.address === t.address ? "bg-accent/5" : ""}`}>
                  {t.logoURI && <img src={t.logoURI} alt="" className="h-7 w-7 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text-primary">{t.symbol}</p>
                    <p className="truncate text-[10px] text-text-muted">{t.name}</p>
                  </div>
                  {t.priceUSD && <span className="text-[10px] text-text-muted">${t.priceUSD.toFixed(2)}</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
