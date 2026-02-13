"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useSwapStore } from "@/store/swap-store";
import { useQuote, useSwapExecution } from "@/hooks/use-swap";
import { ChainSelector } from "./chain-selector";
import { TokenSelector } from "./token-selector";
import { RouteList } from "./route-list";
import { TransactionHistory } from "./transaction-history";
import { FeeInfoBanner } from "./fee-info";
import {
  ArrowDownUp,
  Settings,
  Loader2,
  AlertTriangle,
  Rocket,
  History,
  Clock,
  Fuel,
  Route,
  ChevronDown,
  ChevronUp,
  Flame,
} from "lucide-react";
import { formatAmount, formatUSD } from "@/lib/utils";

const feePercent = parseFloat(process.env.NEXT_PUBLIC_FEE_PERCENT || "0");
const feeCollector = process.env.NEXT_PUBLIC_FEE_COLLECTOR || "";

export function SwapCard() {
  const {
    srcChain, dstChain, srcToken, dstToken, amount, slippage,
    selectedRoute, isLoadingRoutes, routes,
    setSrcChain, setDstChain, setSrcToken, setDstToken,
    setAmount, setSlippage, switchTokens,
  } = useSwapStore();

  const { isConnected } = useAccount();
  const { execute } = useSwapExecution();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useQuote();

  const handleSwap = async () => {
    setError(null);
    setIsSwapping(true);
    try { await execute(); } catch (err: any) {
      setError(err?.shortMessage || err?.message || "Transaction failed");
    } finally { setIsSwapping(false); }
  };

  const canSwap = isConnected && selectedRoute && !isLoadingRoutes && !isSwapping && parseFloat(amount) > 0;

  return (
    <div className="w-full max-w-[440px]">
      {/* Main card */}
      <div className="glass-card rounded-2xl shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-text-primary">Swap</h2>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => { setShowHistory(!showHistory); setShowSettings(false); }}
              className={`rounded-lg p-2 transition-all ${showHistory ? "bg-brand/10 text-brand" : "text-text-tertiary hover:text-text-secondary hover:bg-bg-hover"}`}
              title="History"
            >
              <History size={14} />
            </button>
            <button
              onClick={() => { setShowSettings(!showSettings); setShowHistory(false); }}
              className={`rounded-lg p-2 transition-all ${showSettings ? "bg-brand/10 text-brand" : "text-text-tertiary hover:text-text-secondary hover:bg-bg-hover"}`}
              title="Settings"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Slippage settings */}
        {showSettings && (
          <div className="animate-slide-up mx-5 mb-3 rounded-xl border border-border bg-bg-input p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-text-secondary">Slippage Tolerance</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0.5, 1, 3, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippage(val / 100)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                    slippage * 100 === val
                      ? "bg-brand/15 text-brand border border-brand/20"
                      : "bg-bg-elevated text-text-secondary hover:bg-bg-hover border border-transparent"
                  }`}
                >
                  {val}%
                </button>
              ))}
              <div className="flex items-center rounded-lg border border-border bg-bg-elevated px-2">
                <input
                  type="number"
                  value={(slippage * 100).toFixed(1)}
                  onChange={(e) => setSlippage(Math.min(50, Math.max(0.1, parseFloat(e.target.value) || 0)) / 100)}
                  className="w-10 bg-transparent py-1.5 text-center text-xs text-text-primary outline-none"
                />
                <span className="text-[10px] text-text-tertiary">%</span>
              </div>
            </div>
          </div>
        )}

        <div className="px-5 pb-5 space-y-2">
          {/* === FROM === */}
          <div className="rounded-xl border border-border bg-bg-input p-4 transition-colors focus-within:border-border-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-text-tertiary">From</span>
              <ChainSelector selected={srcChain} onSelect={setSrcChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value); }}
                  placeholder="0"
                  className="w-full bg-transparent font-mono text-[28px] font-bold leading-none text-text-primary outline-none placeholder:text-text-disabled"
                />
                {srcToken?.priceUSD && amount && parseFloat(amount) > 0 && (
                  <p className="mt-1 text-[11px] text-text-tertiary">
                    ≈ {formatUSD(parseFloat(amount) * srcToken.priceUSD)}
                  </p>
                )}
              </div>
              <TokenSelector selected={srcToken} chainId={srcChain?.id || 1} onSelect={setSrcToken} />
            </div>
          </div>

          {/* Switch button — centered, floating */}
          <div className="relative flex justify-center -my-0.5 z-10">
            <button
              onClick={switchTokens}
              className="rounded-xl border-[3px] border-bg-card bg-bg-elevated p-2 text-text-tertiary shadow-input transition-all hover:bg-brand/10 hover:text-brand hover:border-brand/20 active:scale-90"
            >
              <ArrowDownUp size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* === TO === */}
          <div className="rounded-xl border border-border bg-bg-input p-4 transition-colors focus-within:border-border-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-text-tertiary">To</span>
              <ChainSelector selected={dstChain} onSelect={setDstChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                {isLoadingRoutes ? (
                  <div className="h-8 w-36 animate-shimmer rounded-lg bg-gradient-to-r from-bg-elevated via-bg-hover to-bg-elevated bg-[length:200%_100%]" />
                ) : selectedRoute ? (
                  <p className="font-mono text-[28px] font-bold leading-none text-text-primary">
                    {formatAmount(selectedRoute.dstAmount, selectedRoute.dstToken.decimals)}
                  </p>
                ) : (
                  <p className="font-mono text-[28px] font-bold leading-none text-text-disabled">0</p>
                )}
                {selectedRoute && selectedRoute.dstAmountUSD > 0 && (
                  <p className="mt-1 text-[11px] text-text-tertiary">
                    ≈ {formatUSD(selectedRoute.dstAmountUSD)}
                  </p>
                )}
              </div>
              <TokenSelector selected={dstToken} chainId={dstChain?.id || 42161} onSelect={setDstToken} />
            </div>
          </div>

          {/* Route details — expandable like Fly.trade */}
          {selectedRoute && !isLoadingRoutes && (
            <button
              onClick={() => setShowRouteDetails(!showRouteDetails)}
              className="w-full rounded-xl border border-border bg-bg-elevated px-3.5 py-2.5 text-left transition-all hover:border-border-hover hover:bg-bg-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Clock size={10} className="text-blue" />
                    ~{Math.ceil(selectedRoute.estimatedTime / 60)}m
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Fuel size={10} className="text-purple" />
                    {formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD + selectedRoute.integratorFeeUSD)}
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Route size={10} className="text-brand" />
                    {selectedRoute.steps.map((s) => s.protocol).join(" → ")}
                  </span>
                </div>
                {showRouteDetails ? <ChevronUp size={12} className="text-text-tertiary" /> : <ChevronDown size={12} className="text-text-tertiary" />}
              </div>

              {showRouteDetails && (
                <div className="mt-2.5 space-y-1.5 border-t border-border pt-2.5 text-[11px]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Network + bridge</span>
                    <span className="text-text-secondary">{formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD)}</span>
                  </div>
                  {selectedRoute.integratorFeePercent > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">
                        Platform fee <span className="rounded bg-brand/10 px-1 py-px text-[9px] text-brand">{selectedRoute.integratorFeePercent}%</span>
                      </span>
                      <span className="text-text-secondary">{formatUSD(selectedRoute.integratorFeeUSD)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Estimated time</span>
                    <span className="text-text-secondary">~{Math.ceil(selectedRoute.estimatedTime / 60)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Slippage</span>
                    <span className="text-text-secondary">{(slippage * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Provider</span>
                    <span className="capitalize text-text-secondary">{selectedRoute.adapter}</span>
                  </div>
                </div>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5 text-xs text-danger">
              <AlertTriangle size={13} />
              <span>{error}</span>
            </div>
          )}

          {/* Swap button — gradient like Jumper */}
          <button
            onClick={handleSwap}
            disabled={!canSwap}
            className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all ${
              canSwap
                ? "btn-swap text-bg-primary"
                : "cursor-not-allowed bg-bg-elevated text-text-disabled"
            }`}
          >
            {isSwapping ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Swapping...
              </span>
            ) : !isConnected ? (
              "Connect Wallet"
            ) : !amount || parseFloat(amount) <= 0 ? (
              "Enter Amount"
            ) : isLoadingRoutes ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Finding Best Route...
              </span>
            ) : !selectedRoute ? (
              "No Routes Available"
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Rocket size={14} /> Swap
              </span>
            )}
          </button>

          {/* Fee info */}
          <FeeInfoBanner feePercent={feePercent} feeCollector={feeCollector} />
        </div>
      </div>

      {/* Routes below — like Bungee route cards */}
      {!showHistory && routes.length > 1 && (
        <div className="mt-3">
          <RouteList />
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="mt-3">
          <TransactionHistory />
        </div>
      )}
    </div>
  );
}
