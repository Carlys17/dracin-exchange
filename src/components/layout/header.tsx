"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { Wallet, ChevronDown, LogOut, Flame } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-blue">
            <Flame size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary">
            Dracin
          </span>
          <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-brand">
            Beta
          </span>
        </div>

        {/* Wallet */}
        <div className="relative">
          {isConnected && address ? (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-bg-elevated px-3.5 py-2 text-sm transition-all hover:border-border-hover hover:bg-bg-hover"
            >
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-brand" />
                <div className="absolute inset-0 h-2 w-2 animate-pulse-soft rounded-full bg-brand" />
              </div>
              <span className="font-mono text-xs text-text-primary">{shortenAddress(address)}</span>
              {balance && (
                <span className="hidden text-xs text-text-tertiary sm:inline">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              )}
              <ChevronDown size={12} className="text-text-tertiary" />
            </button>
          ) : (
            <button
              onClick={() => {
                const c = connectors[0];
                if (c) connect({ connector: c });
              }}
              className="btn-swap flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-bg-primary"
            >
              <Wallet size={14} />
              Connect
            </button>
          )}

          {showMenu && isConnected && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-52 animate-slide-up rounded-xl border border-border bg-bg-card p-1.5 shadow-card">
                <div className="mb-1 border-b border-border px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Network</p>
                  <p className="text-xs font-medium text-text-primary">{chain?.name || "Unknown"}</p>
                </div>
                <button
                  onClick={() => { disconnect(); setShowMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut size={12} />
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
