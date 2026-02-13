"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Token } from "@/lib/types";
import { POPULAR_TOKENS } from "@/lib/config/chains";
import { useTokenSearch, useWalletBalances, WalletToken } from "@/hooks/use-swap";
import { ChevronDown, Search, X, Wallet, Loader2 } from "lucide-react";

interface Props {
  selected: Token | null;
  chainId: number;
  onSelect: (t: Token) => void;
}

export function TokenSelector({ selected, chainId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [searching, setSearching] = useState(false);
  const { search } = useTokenSearch();
  const { tokens: walletTokens, loading: loadingBalances } = useWalletBalances(chainId);
  const ref = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const popular = POPULAR_TOKENS[chainId] || [];

  useEffect(() => { if (open && ref.current) ref.current.focus(); }, [open]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (timer.current) clearTimeout(timer.current);
    if (!q) { setSearchResults([]); return; }
    setSearching(true);
    timer.current = setTimeout(async () => {
      setSearchResults(await search(chainId, q));
      setSearching(false);
    }, 400);
  }, [chainId, search]);

  // Merge: wallet tokens first (with balance), then popular (without dupes)
  const displayTokens = useMemo(() => {
    if (query) return searchResults;

    const seen = new Set<string>();
    const merged: (Token & { balance?: number; balanceUSD?: number })[] = [];

    // Wallet tokens with balances (filtered by chain)
    for (const wt of walletTokens) {
      if (wt.chainId !== chainId) continue;
      const key = wt.address.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(wt);
    }

    // Popular tokens not already in wallet
    for (const pt of popular) {
      const key = pt.address.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(pt);
    }

    return merged;
  }, [query, searchResults, walletTokens, popular, chainId]);

  const formatBal = (n: number) => {
    if (n < 0.0001) return "<0.0001";
    if (n < 1) return n.toFixed(4);
    if (n < 1000) return n.toFixed(3);
    if (n < 1_000_000) return `${(n / 1000).toFixed(1)}K`;
    return `${(n / 1_000_000).toFixed(2)}M`;
  };

  const formatUsd = (n: number) => {
    if (n < 0.01) return "";
    if (n < 1000) return `$${n.toFixed(2)}`;
    if (n < 1_000_000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${(n / 1_000_000).toFixed(2)}M`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-2 text-[13px] font-bold transition-all hover:border-border-hover hover:bg-bg-card-hover"
      >
        {selected?.logoURI && (
          <img src={selected.logoURI} alt="" className="h-5 w-5 rounded-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <span className="text-text-primary">{selected?.symbol || "Select"}</span>
        <ChevronDown size={11} className="text-text-disabled" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-80 animate-slide-up ss-card shadow-card">
            {/* Search */}
            <div className="p-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg-input px-3 py-2 focus-within:border-accent-purple/30">
                <Search size={13} className="text-text-disabled" />
                <input
                  ref={ref} type="text" value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search name or paste address"
                  className="flex-1 bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-disabled"
                />
                {query && <button onClick={() => handleSearch("")}><X size={11} className="text-text-disabled" /></button>}
              </div>
            </div>

            {/* Quick picks */}
            {!query && popular.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2.5">
                {popular.slice(0, 5).map((t) => (
                  <button key={t.address}
                    onClick={() => { onSelect(t); setOpen(false); setQuery(""); }}
                    className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                      selected?.address === t.address
                        ? "border-accent-purple/30 bg-accent-purple-dim text-accent-purple"
                        : "border-border text-text-secondary hover:border-border-hover hover:bg-bg-elevated"
                    }`}
                  >
                    {t.logoURI && <img src={t.logoURI} alt="" className="h-3.5 w-3.5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    {t.symbol}
                  </button>
                ))}
              </div>
            )}

            {/* Wallet balances header */}
            {!query && walletTokens.length > 0 && (
              <div className="flex items-center gap-1.5 border-t border-border px-3 py-1.5">
                <Wallet size={10} className="text-accent-amber" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-disabled">Your Tokens</span>
                {loadingBalances && <Loader2 size={9} className="animate-spin text-text-disabled" />}
              </div>
            )}

            {/* Token list */}
            <div className="max-h-64 overflow-y-auto border-t border-border p-1">
              {(searching || loadingBalances) && displayTokens.length === 0 ? (
                <div className="flex justify-center py-6">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-purple/20 border-t-accent-purple" />
                </div>
              ) : displayTokens.length === 0 ? (
                <p className="py-6 text-center text-[12px] text-text-disabled">
                  {query ? "No tokens found" : "No tokens"}
                </p>
              ) : (
                displayTokens.map((t) => {
                  const wt = t as WalletToken;
                  const hasBal = wt.balance && wt.balance > 0;
                  return (
                    <button
                      key={`${t.address}-${t.chainId}`}
                      onClick={() => { onSelect(t); setOpen(false); setQuery(""); }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-bg-elevated ${
                        selected?.address === t.address ? "bg-accent-purple/5" : ""
                      }`}
                    >
                      {t.logoURI ? (
                        <img src={t.logoURI} alt="" className="h-7 w-7 rounded-full"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-elevated text-[10px] font-bold text-text-muted">
                          {t.symbol?.slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-text-primary">{t.symbol}</p>
                        <p className="truncate text-[10px] text-text-disabled">{t.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {hasBal ? (
                          <>
                            <p className="font-mono text-[11px] font-semibold text-text-primary">
                              {formatBal(wt.balance)}
                            </p>
                            {wt.balanceUSD > 0.01 && (
                              <p className="font-mono text-[9px] text-text-muted">
                                {formatUsd(wt.balanceUSD)}
                              </p>
                            )}
                          </>
                        ) : t.priceUSD ? (
                          <p className="font-mono text-[10px] text-text-disabled">
                            ${t.priceUSD.toFixed(2)}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
