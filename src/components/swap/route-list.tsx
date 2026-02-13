"use client";
import { Route } from "@/lib/types";
import { useSwapStore } from "@/store/swap-store";
import { formatAmount, formatUSD, formatTime } from "@/lib/utils";
import { Zap, Clock, ArrowRight, Check, TrendingUp, Shield } from "lucide-react";

const TAGS: Record<string, { label: string; border: string; badge: string; badgeBg: string }> = {
  "best-return": { label: "BEST", border: "border-left-purple", badge: "text-accent-purple", badgeBg: "bg-accent-purple-dim" },
  fastest: { label: "FAST", border: "border-left-low", badge: "text-severity-low", badgeBg: "bg-severity-low-bg" },
  cheapest: { label: "CHEAP", border: "border-left-medium", badge: "text-severity-medium", badgeBg: "bg-severity-medium-bg" },
  recommended: { label: "REC", border: "border-left-purple", badge: "text-accent-purple", badgeBg: "bg-accent-purple-dim" },
};

export function RouteList() {
  const { routes, selectedRoute, setSelectedRoute, isLoadingRoutes } = useSwapStore();
  if (isLoadingRoutes) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-bg-card border border-border" />)}</div>;
  if (routes.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-disabled">Routes</span>
        <span className="text-[10px] text-text-disabled">{routes.length} found</span>
      </div>
      {routes.map((r) => {
        const tag = r.tags[0] ? TAGS[r.tags[0]] : null;
        const isSel = selectedRoute?.id === r.id;
        return (
          <button key={r.id} onClick={() => setSelectedRoute(r)}
            className={`w-full rounded-lg border text-left transition-all ${tag?.border || ""} ${isSel ? "border-border-active bg-bg-elevated shadow-glow" : "border-border bg-bg-card hover:border-border-hover hover:bg-bg-card-hover"}`}
            style={{ paddingLeft: tag ? "calc(0.75rem + 3px)" : "0.75rem" }}>
            <div className="flex items-center justify-between gap-3 py-2.5 pr-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {tag && <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${tag.badge} ${tag.badgeBg}`}>{tag.label}</span>}
                  {isSel && <span className="flex items-center gap-0.5 text-[9px] font-semibold text-accent-purple"><Check size={8} />Selected</span>}
                  <div className="flex items-center gap-1 ml-auto">
                    {r.steps.map((s, i) => (
                      <span key={i} className="flex items-center gap-0.5">
                        {i > 0 && <ArrowRight size={7} className="text-text-disabled" />}
                        <span className="font-mono text-[10px] text-text-muted">{s.protocol}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] text-text-disabled">
                  <span className="flex items-center gap-0.5"><Clock size={8} />{formatTime(r.estimatedTime)}</span>
                  <span>Fee {formatUSD(r.totalFeeUSD + r.gasCostUSD)}</span>
                  <span className="capitalize">{r.adapter}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-[13px] font-bold text-text-primary">{formatAmount(r.dstAmount, r.dstToken.decimals)}</p>
                <p className="text-[10px] text-text-muted">{r.dstToken.symbol}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
