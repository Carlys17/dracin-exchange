"use client";

import { Route } from "@/lib/types";
import { useSwapStore } from "@/store/swap-store";
import { formatAmount, formatUSD, formatTime } from "@/lib/utils";
import { Zap, Clock, Shield, ArrowRight, Check, TrendingUp } from "lucide-react";

const TAG_STYLES: Record<string, { label: string; color: string; bg: string; icon: typeof Zap }> = {
  "best-return": { label: "Best Return", color: "text-brand", bg: "bg-brand/10", icon: TrendingUp },
  fastest: { label: "Fastest", color: "text-blue", bg: "bg-blue/10", icon: Clock },
  cheapest: { label: "Cheapest", color: "text-purple", bg: "bg-purple/10", icon: Shield },
  recommended: { label: "Recommended", color: "text-brand", bg: "bg-brand/10", icon: Zap },
};

export function RouteList() {
  const { routes, selectedRoute, setSelectedRoute, isLoadingRoutes } = useSwapStore();

  if (isLoadingRoutes) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-xl border border-border bg-bg-elevated" />
        ))}
      </div>
    );
  }

  if (routes.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {routes.length} Routes Found
        </span>
      </div>
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          isSelected={selectedRoute?.id === route.id}
          onSelect={() => setSelectedRoute(route)}
        />
      ))}
    </div>
  );
}

function RouteCard({ route, isSelected, onSelect }: { route: Route; isSelected: boolean; onSelect: () => void }) {
  const mainTag = route.tags[0];
  const tag = mainTag ? TAG_STYLES[mainTag] : null;

  return (
    <button
      onClick={onSelect}
      className={`group w-full rounded-xl border p-3 text-left transition-all ${
        isSelected
          ? "border-brand/30 bg-brand/[0.04] shadow-glow"
          : "border-border bg-bg-elevated hover:border-border-hover hover:bg-bg-hover"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Tag + Steps */}
          <div className="flex items-center gap-2 mb-1.5">
            {tag && (
              <span className={`inline-flex items-center gap-1 rounded-md ${tag.bg} px-1.5 py-0.5 text-[10px] font-semibold ${tag.color}`}>
                <tag.icon size={9} />
                {tag.label}
              </span>
            )}
            {isSelected && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-brand">
                <Check size={9} /> Selected
              </span>
            )}
          </div>

          {/* Protocol chain */}
          <div className="flex items-center gap-1">
            {route.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <ArrowRight size={8} className="text-text-tertiary" />}
                <span className="flex items-center gap-1 rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-text-secondary">
                  {step.protocolLogo && <img src={step.protocolLogo} alt="" className="h-3 w-3 rounded-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  {step.protocol}
                </span>
              </div>
            ))}
          </div>

          {/* Meta row */}
          <div className="mt-1.5 flex items-center gap-2.5 text-[10px] text-text-tertiary">
            <span className="flex items-center gap-0.5"><Clock size={8} />{formatTime(route.estimatedTime)}</span>
            <span>·</span>
            <span>Fee {formatUSD(route.totalFeeUSD + route.gasCostUSD)}</span>
            {route.integratorFeeUSD > 0 && (
              <><span>·</span><span className="text-brand/60">+{formatUSD(route.integratorFeeUSD)}</span></>
            )}
            <span>·</span>
            <span className="capitalize">{route.adapter}</span>
          </div>
        </div>

        {/* Output */}
        <div className="text-right shrink-0">
          <p className="font-mono text-sm font-bold text-text-primary">
            {formatAmount(route.dstAmount, route.dstToken.decimals)}
          </p>
          <p className="text-[10px] text-text-secondary">{route.dstToken.symbol}</p>
          {route.dstAmountUSD > 0 && (
            <p className="text-[10px] text-text-tertiary">{formatUSD(route.dstAmountUSD)}</p>
          )}
        </div>
      </div>
    </button>
  );
}
