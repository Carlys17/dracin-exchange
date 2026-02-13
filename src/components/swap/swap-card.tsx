"use client";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useSwapStore } from "@/store/swap-store";
import { useQuote, useSwapExecution } from "@/hooks/use-swap";
import { ChainSelector } from "./chain-selector";
import { TokenSelector } from "./token-selector";
import { RouteList } from "./route-list";
import { TransactionHistory } from "./transaction-history";
import { FeeInfoBanner } from "./fee-info";
import { ArrowDownUp, Settings, Loader2, AlertTriangle, Rocket, History, Clock, Fuel, Route, ChevronDown, ChevronUp, Zap, Wallet } from "lucide-react";
import { formatAmount, formatUSD } from "@/lib/utils";

const feePercent = parseFloat(process.env.NEXT_PUBLIC_FEE_PERCENT || "0");
const feeCollector = process.env.NEXT_PUBLIC_FEE_COLLECTOR || "";
const NATIVE = ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "0x0000000000000000000000000000000000000000"];
const isNative = (a?: string) => a ? NATIVE.includes(a.toLowerCase()) : false;

export function SwapCard() {
  const { srcChain, dstChain, srcToken, dstToken, amount, slippage, selectedRoute, isLoadingRoutes, routes,
    setSrcChain, setDstChain, setSrcToken, setDstToken, setAmount, setSlippage, switchTokens } = useSwapStore();
  const { isConnected, address } = useAccount();
  const { execute } = useSwapExecution();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useQuote();

  const { data: nativeBal } = useBalance({ address, chainId: srcChain?.id });
  const { data: tokenBal } = useBalance({ address, chainId: srcChain?.id, token: srcToken && !isNative(srcToken.address) ? srcToken.address as `0x${string}` : undefined });
  const bal = srcToken && isNative(srcToken.address) ? nativeBal : tokenBal;

  const handleMax = () => {
    if (!bal) return;
    if (srcToken && isNative(srcToken.address)) {
      const m = Math.max(0, parseFloat(bal.formatted) - 0.005);
      setAmount(m > 0 ? m.toString() : "0");
    } else setAmount(bal.formatted);
  };

  const handleSwap = async () => {
    setError(null); setIsSwapping(true);
    try { await execute(); } catch (e: any) { setError(e?.shortMessage || e?.message || "Failed"); }
    finally { setIsSwapping(false); }
  };

  const canSwap = isConnected && selectedRoute && !isLoadingRoutes && !isSwapping && parseFloat(amount) > 0;
  const lowBal = bal && amount && parseFloat(amount) > parseFloat(bal.formatted);

  return (
    <div className="w-full max-w-[440px]">
      <div className="glass-card rounded-2xl shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-accent" />
            <h2 className="text-sm font-bold text-text-primary">Swap</h2>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setShowHistory(!showHistory); setShowSettings(false); }}
              className={`rounded-lg p-2 transition-all ${showHistory ? "bg-accent-dim text-accent" : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"}`}>
              <History size={14} />
            </button>
            <button onClick={() => { setShowSettings(!showSettings); setShowHistory(false); }}
              className={`rounded-lg p-2 transition-all ${showSettings ? "bg-accent-dim text-accent" : "text-text-muted hover:text-text-secondary hover:bg-bg-elevated"}`}>
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="animate-slide-up mx-5 mb-3 rounded-xl border border-border bg-bg-input p-3">
            <span className="text-[11px] font-medium text-text-secondary">Slippage</span>
            <div className="mt-1.5 flex items-center gap-1.5">
              {[0.5, 1, 3, 5].map(v => (
                <button key={v} onClick={() => setSlippage(v / 100)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${slippage * 100 === v ? "bg-accent-dim text-accent border border-accent/20" : "bg-bg-card text-text-secondary hover:bg-bg-elevated border border-transparent"}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 pb-5 space-y-2">
          {/* FROM */}
          <div className="rounded-xl border border-border bg-bg-input p-4 transition-colors focus-within:border-border-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-text-muted">From</span>
              <ChainSelector selected={srcChain} onSelect={setSrcChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input type="text" inputMode="decimal" value={amount}
                  onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value); }}
                  placeholder="0" className="w-full bg-transparent font-mono text-[28px] font-bold leading-none text-text-primary outline-none placeholder:text-text-disabled" />
                {srcToken?.priceUSD && amount && parseFloat(amount) > 0 && (
                  <p className="mt-1 text-[11px] text-text-muted">≈ {formatUSD(parseFloat(amount) * srcToken.priceUSD)}</p>
                )}
              </div>
              <TokenSelector selected={srcToken} chainId={srcChain?.id || 1} onSelect={setSrcToken} />
            </div>
            {isConnected && bal && (
              <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <Wallet size={10} />
                  <span>{parseFloat(bal.formatted).toFixed(bal.decimals > 8 ? 6 : 4)} {bal.symbol}</span>
                </div>
                <button onClick={handleMax} className="rounded-md bg-accent-dim px-2 py-0.5 text-[10px] font-bold text-accent transition-all hover:bg-accent/20">MAX</button>
              </div>
            )}
            {lowBal && <p className="mt-1.5 text-[10px] text-danger">Insufficient balance</p>}
          </div>

          {/* Switch */}
          <div className="relative flex justify-center -my-0.5 z-10">
            <button onClick={switchTokens}
              className="rounded-xl border-[3px] border-bg-secondary bg-bg-card p-2 text-text-muted shadow-card transition-all hover:bg-accent-dim hover:text-accent hover:border-accent/20 active:scale-90">
              <ArrowDownUp size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* TO */}
          <div className="rounded-xl border border-border bg-bg-input p-4 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-text-muted">To</span>
              <ChainSelector selected={dstChain} onSelect={setDstChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                {isLoadingRoutes ? (
                  <div className="h-8 w-36 animate-shimmer rounded-lg bg-gradient-to-r from-bg-card via-bg-elevated to-bg-card bg-[length:200%_100%]" />
                ) : selectedRoute ? (
                  <p className="font-mono text-[28px] font-bold leading-none text-text-primary">{formatAmount(selectedRoute.dstAmount, selectedRoute.dstToken.decimals)}</p>
                ) : (
                  <p className="font-mono text-[28px] font-bold leading-none text-text-disabled">0</p>
                )}
                {selectedRoute && selectedRoute.dstAmountUSD > 0 && <p className="mt-1 text-[11px] text-text-muted">≈ {formatUSD(selectedRoute.dstAmountUSD)}</p>}
              </div>
              <TokenSelector selected={dstToken} chainId={dstChain?.id || 42161} onSelect={setDstToken} />
            </div>
          </div>

          {/* Route details */}
          {selectedRoute && !isLoadingRoutes && (
            <button onClick={() => setShowDetails(!showDetails)}
              className="w-full rounded-xl border border-border bg-bg-card px-3.5 py-2.5 text-left transition-all hover:border-border-hover hover:bg-bg-card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-text-secondary"><Clock size={10} className="text-accent-secondary" />~{Math.ceil(selectedRoute.estimatedTime / 60)}m</span>
                  <span className="flex items-center gap-1 text-text-secondary"><Fuel size={10} className="text-warning" />{formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD + selectedRoute.integratorFeeUSD)}</span>
                  <span className="flex items-center gap-1 text-text-secondary"><Route size={10} className="text-accent" />{selectedRoute.steps.map(s => s.protocol).join(" → ")}</span>
                </div>
                {showDetails ? <ChevronUp size={12} className="text-text-muted" /> : <ChevronDown size={12} className="text-text-muted" />}
              </div>
              {showDetails && (
                <div className="mt-2.5 space-y-1.5 border-t border-border pt-2.5 text-[11px]" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between"><span className="text-text-muted">Network + bridge</span><span className="text-text-secondary">{formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD)}</span></div>
                  {selectedRoute.integratorFeePercent > 0 && (
                    <div className="flex justify-between"><span className="text-text-muted">Platform fee <span className="rounded bg-accent-dim px-1 py-px text-[9px] text-accent">{selectedRoute.integratorFeePercent}%</span></span><span className="text-text-secondary">{formatUSD(selectedRoute.integratorFeeUSD)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-text-muted">Slippage</span><span className="text-text-secondary">{(slippage * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Provider</span><span className="capitalize text-text-secondary">{selectedRoute.adapter}</span></div>
                </div>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5 text-xs text-danger">
              <AlertTriangle size={13} /><span>{error}</span>
            </div>
          )}

          {/* Swap button */}
          <button onClick={handleSwap} disabled={!canSwap || !!lowBal}
            className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all ${lowBal ? "cursor-not-allowed bg-danger/10 text-danger" : canSwap ? "btn-swap text-bg-primary" : "cursor-not-allowed bg-bg-card text-text-disabled"}`}>
            {isSwapping ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" />Swapping...</span>
            : lowBal ? "Insufficient Balance"
            : !isConnected ? "Connect Wallet"
            : !amount || parseFloat(amount) <= 0 ? "Enter Amount"
            : isLoadingRoutes ? <span className="flex items-center justify-center gap-2"><Loader2 size={15} className="animate-spin" />Finding Best Route...</span>
            : !selectedRoute ? "No Routes Available"
            : <span className="flex items-center justify-center gap-2"><Rocket size={14} />Swap</span>}
          </button>

          <FeeInfoBanner feePercent={feePercent} feeCollector={feeCollector} />
        </div>
      </div>

      {!showHistory && routes.length > 1 && <div className="mt-3"><RouteList /></div>}
      {showHistory && <div className="mt-3"><TransactionHistory /></div>}
    </div>
  );
}
