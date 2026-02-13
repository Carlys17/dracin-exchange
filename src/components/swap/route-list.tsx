"use client";
import { Route } from "@/lib/types";
import { useSwapStore } from "@/store/swap-store";
import { formatAmount, formatUSD, formatTime } from "@/lib/utils";
import { Zap, Clock, Shield, ArrowRight, Check, TrendingUp } from "lucide-react";

const TAGS: Record<string, { label: string; color: string; icon: typeof Zap }> = {
  "best-return": { label: "Best Return", color: "text-accent", icon: TrendingUp },
  fastest: { label: "Fastest", color: "text-accent-secondary", icon: Clock },
  cheapest: { label: "Cheapest", color: "text-warning", icon: Shield },
  recommended: { label: "Recommended", color: "text-accent", icon: Zap },
};

export function RouteList() {
  const { routes, selectedRoute, setSelectedRoute, isLoadingRoutes } = useSwapStore();
  if (isLoadingRoutes) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-[68px] animate-pulse rounded-xl border border-border bg-bg-card" />)}</div>;
  if (routes.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <span className="px-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">{routes.length} Routes</span>
      {routes.map((r) => (
        <button key={r.id} onClick={() => setSelectedRoute(r)}
          className={`group w-full rounded-xl border p-3 text-left transition-all ${selectedRoute?.id === r.id ? "border-border-hover bg-accent/[0.03] shadow-glow" : "border-border bg-bg-card hover:border-border-hover hover:bg-bg-card-hover"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                {r.tags[0] && TAGS[r.tags[0]] && (() => { const t = TAGS[r.tags[0]]; return (
                  <span className={`inline-flex items-center gap-1 rounded-md bg-accent-dim px-1.5 py-0.5 text-[10px] font-bold ${t.color}`}><t.icon size={9} />{t.label}</span>
                ); })()}
                {selectedRoute?.id === r.id && <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-accent"><Check size={9} />Selected</span>}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {r.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <ArrowRight size={8} className="text-text-disabled" />}
                    <span className="flex items-center gap-1 rounded-md bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary">
                      {s.protocolLogo && <img src={s.protocolLogo} alt="" className="h-3 w-3 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      {s.protocol}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 text-[10px] text-text-muted">
                <span className="flex items-center gap-0.5"><Clock size={8} />{formatTime(r.estimatedTime)}</span>
                <span>·</span><span>Fee {formatUSD(r.totalFeeUSD + r.gasCostUSD)}</span>
                {r.integratorFeeUSD > 0 && <><span>·</span><span className="text-accent/50">+{formatUSD(r.integratorFeeUSD)}</span></>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-sm font-bold text-text-primary">{formatAmount(r.dstAmount, r.dstToken.decimals)}</p>
              <p className="text-[10px] text-text-secondary">{r.dstToken.symbol}</p>
              {r.dstAmountUSD > 0 && <p className="text-[10px] text-text-muted">{formatUSD(r.dstAmountUSD)}</p>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
