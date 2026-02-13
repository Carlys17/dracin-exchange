"use client";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { Shield, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [menu, setMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-deep/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber/10 border border-accent-amber/20">
            <Shield size={15} className="text-accent-amber" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold text-text-primary">
            Dracin<span className="text-accent-purple">Exchange</span>
          </span>
        </div>

        <div className="relative">
          {isConnected && address ? (
            <button onClick={() => setMenu(!menu)}
              className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-1.5 text-[12px] transition-all hover:border-border-hover">
              <span className="relative"><span className="h-2 w-2 rounded-full bg-accent-green block" /><span className="absolute inset-0 h-2 w-2 rounded-full bg-accent-green animate-pulse-dot" /></span>
              <span className="font-mono text-text-primary">{shortenAddress(address)}</span>
              {balance && <span className="hidden text-text-muted sm:inline">{parseFloat(balance.formatted).toFixed(4)}</span>}
              <ChevronDown size={11} className="text-text-disabled" />
            </button>
          ) : (
            <button onClick={() => { const c = connectors[0]; if (c) connect({ connector: c }); }}
              className="btn-swap flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold">
              <Shield size={13} /> Connect Wallet
            </button>
          )}
          {menu && isConnected && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-52 animate-slide-up ss-card p-1.5 shadow-card">
                <div className="mb-1 border-b border-border px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-text-disabled">Network</p>
                  <p className="text-xs font-medium text-text-primary">{chain?.name || "Unknown"}</p>
                </div>
                <button onClick={() => { disconnect(); setMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-severity-critical transition-colors hover:bg-severity-critical-bg">
                  <LogOut size={12} /> Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
