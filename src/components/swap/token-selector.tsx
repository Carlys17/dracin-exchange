"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Token } from "@/lib/types";
import { POPULAR_TOKENS } from "@/lib/config/chains";
import { useTokenSearch } from "@/hooks/use-swap";
import { ChevronDown, Search, X } from "lucide-react";

interface TokenSelectorProps {
  selected: Token | null;
  chainId: number;
  onSelect: (token: Token) => void;
}

export function TokenSelector({ selected, chainId, onSelect }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { search } = useTokenSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const popularTokens = POPULAR_TOKENS[chainId] || [];

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q) { setSearchResults([]); return; }
    setIsSearching(true);
    timerRef.current = setTimeout(async () => {
      const results = await search(chainId, q);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);
  }, [chainId, search]);

  const tokens = query ? searchResults : popularTokens;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm font-semibold transition-all hover:border-border-hover hover:bg-bg-hover"
      >
        {selected?.logoURI && (
          <img src={selected.logoURI} alt={selected.symbol} className="h-5 w-5 rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <span className="text-text-primary">{selected?.symbol || "Select"}</span>
        <ChevronDown size={12} className="text-text-tertiary" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-72 animate-slide-up rounded-xl border border-border bg-bg-card shadow-card">
            {/* Search */}
            <div className="p-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2 focus-within:border-brand/30">
                <Search size={13} className="text-text-tertiary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search name or address"
                  className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-tertiary"
                />
                {query && <button onClick={() => handleSearch("")}><X size={11} className="text-text-tertiary" /></button>}
              </div>
            </div>

            {/* Quick pick chips */}
            {!query && popularTokens.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2.5">
                {popularTokens.slice(0, 5).map((token) => (
                  <button
                    key={token.address}
                    onClick={() => { onSelect(token); setOpen(false); setQuery(""); }}
                    className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors ${
                      selected?.address === token.address
                        ? "border-brand/30 bg-brand/10 text-brand"
                        : "border-border text-text-secondary hover:border-border-hover hover:bg-bg-hover"
                    }`}
                  >
                    {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="h-3.5 w-3.5 rounded-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    {token.symbol}
                  </button>
                ))}
              </div>
            )}

            {/* List */}
            <div className="max-h-56 overflow-y-auto border-t border-border p-1">
              {isSearching ? (
                <div className="flex justify-center py-6"><div className="h-4 w-4 animate-spin rounded-full border-2 border-brand/20 border-t-brand" /></div>
              ) : tokens.length === 0 ? (
                <p className="py-6 text-center text-xs text-text-tertiary">{query ? "No tokens found" : "No tokens"}</p>
              ) : (
                tokens.map((token) => (
                  <button
                    key={`${token.address}-${token.chainId}`}
                    onClick={() => { onSelect(token); setOpen(false); setQuery(""); }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-bg-hover ${
                      selected?.address === token.address ? "bg-brand/5" : ""
                    }`}
                  >
                    {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="h-7 w-7 rounded-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">{token.symbol}</p>
                      <p className="truncate text-[10px] text-text-tertiary">{token.name}</p>
                    </div>
                    {token.priceUSD && <span className="text-[10px] text-text-tertiary">${token.priceUSD.toFixed(2)}</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
