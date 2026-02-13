"use client";
import { useState } from "react";
import { Chain } from "@/lib/types";
import { CHAINS } from "@/lib/config/chains";
import { ChevronDown, X, Globe } from "lucide-react";

interface Props { selected: Chain | null; onSelect: (c: Chain) => void; label: string; }

export function ChainSelector({ selected, onSelect, label }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-2.5 py-1.5 text-xs transition-all hover:border-border-hover hover:bg-bg-card-hover">
        {selected ? (
          <><img src={selected.logoURI} alt="" className="h-4 w-4 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="font-semibold text-text-primary">{selected.shortName}</span></>
        ) : (
          <><Globe size={12} className="text-text-muted" /><span className="text-text-muted">{label}</span></>
        )}
        <ChevronDown size={10} className="text-text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1.5 w-56 animate-slide-up rounded-xl border border-border bg-bg-card p-1.5 shadow-card">
            <div className="mb-1 flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Select Chain</span>
              <button onClick={() => setOpen(false)}><X size={10} className="text-text-muted hover:text-text-secondary" /></button>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {CHAINS.map((chain) => (
                <button key={chain.id} onClick={() => { onSelect(chain); setOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${selected?.id === chain.id ? "bg-accent-dim text-accent" : "text-text-primary hover:bg-bg-elevated"}`}>
                  <img src={chain.logoURI} alt="" className="h-5 w-5 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="font-medium">{chain.name}</span>
                  {chain.type === "solana" && <span className="ml-auto rounded-full bg-accent-secondary/10 px-1.5 py-0.5 text-[9px] font-medium text-accent-secondary">SOL</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
