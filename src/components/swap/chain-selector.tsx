"use client";

import { useState } from "react";
import { Chain } from "@/lib/types";
import { CHAINS } from "@/lib/config/chains";
import { ChevronDown, X, Globe } from "lucide-react";

interface ChainSelectorProps {
  selected: Chain | null;
  onSelect: (chain: Chain) => void;
  label: string;
}

export function ChainSelector({ selected, onSelect, label }: ChainSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-2.5 py-1.5 text-xs transition-all hover:border-border-hover hover:bg-bg-hover"
      >
        {selected ? (
          <>
            <img src={selected.logoURI} alt={selected.name} className="h-4 w-4 rounded-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="font-medium text-text-primary">{selected.shortName}</span>
          </>
        ) : (
          <>
            <Globe size={12} className="text-text-tertiary" />
            <span className="text-text-tertiary">{label}</span>
          </>
        )}
        <ChevronDown size={10} className="text-text-tertiary" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1.5 w-52 animate-slide-up rounded-xl border border-border bg-bg-card p-1 shadow-card">
            <div className="mb-1 flex items-center justify-between px-2.5 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">Select Chain</span>
              <button onClick={() => setOpen(false)}><X size={10} className="text-text-tertiary" /></button>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => { onSelect(chain); setOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    selected?.id === chain.id
                      ? "bg-brand/10 text-brand"
                      : "text-text-primary hover:bg-bg-hover"
                  }`}
                >
                  <img src={chain.logoURI} alt={chain.name} className="h-5 w-5 rounded-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="font-medium">{chain.name}</span>
                  {chain.type === "solana" && (
                    <span className="ml-auto rounded-full bg-purple/10 px-1.5 py-0.5 text-[9px] font-medium text-purple">SOL</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
