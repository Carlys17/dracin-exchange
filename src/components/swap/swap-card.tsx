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
import { ArrowDownUp, Settings, Loader2, AlertTriangle, Rocket, History, Clock, Fuel, Route, ChevronDown, ChevronUp, Shield, Wallet } from "lucide-react";
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
    <div className="w-full max-w-[460px]">
      <div className="ss-card shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-accent-amber" />
            <h2 className="text-[14px] font-bold text-text-primary">Cross-Chain Swap</h2>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setShowHistory(!showHistory); setShowSettings(false); }}
              className={`rounded-lg p-2 transition-all ${showHistory ? "bg-accent-purple-dim text-accent-purple" : "text-text-disabled hover:text-text-muted hover:bg-bg-elevated"}`}>
              <History size={14} />
            </button>
            <button onClick={() => { setShowSettings(!showSettings); setShowHistory(false); }}
              className={`rounded-lg p-2 transition-all ${showSettings ? "bg-accent-purple-dim text-accent-purple" : "text-text-disabled hover:text-text-muted hover:bg-bg-elevated"}`}>
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="animate-slide-up mx-5 mb-3 rounded-lg border border-border bg-bg-input p-3">
            <span className="text-[11px] font-semibold text-text-muted">Slippage</span>
            <div className="mt-1.5 flex items-center gap-1.5">
              {[0.5, 1, 3, 5].map(v => (
                <button key={v} onClick={() => setSlippage(v / 100)}
                  className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${slippage * 100 === v ? "bg-accent-purple-dim text-accent-purple border border-accent-purple/20" : "bg-bg-card text-text-muted hover:bg-bg-elevated border border-transparent"}`}>
                  {v}%
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 pb-5 space-y-2">
          {/* FROM */}
          <div className="rounded-lg border border-border bg-bg-input p-4 transition-colors focus-within:border-border-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-disabled">From</span>
              <ChainSelector selected={srcChain} onSelect={setSrcChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input type="text" inputMode="decimal" value={amount}
                  onChange={(e) => { if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value); }}
                  placeholder="0" className="w-full bg-transparent font-mono text-[26px] font-bold leading-none text-text-primary outline-none placeholder:text-text-disabled" />
                {srcToken?.priceUSD && amount && parseFloat(amount) > 0 && (
                  <p className="mt-1 text-[11px] font-mono text-text-disabled">≈ {formatUSD(parseFloat(amount) * srcToken.priceUSD)}</p>
                )}
              </div>
              <TokenSelector selected={srcToken} chainId={srcChain?.id || 1} onSelect={setSrcToken} />
            </div>
            {isConnected && bal && (
              <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-disabled">
                  <Wallet size={10} />
                  <span>{parseFloat(bal.formatted).toFixed(bal.decimals > 8 ? 6 : 4)} {bal.symbol}</span>
                </div>
                <button onClick={handleMax} className="rounded bg-accent-amber-dim px-2 py-0.5 text-[10px] font-bold text-accent-amber transition-all hover:bg-accent-amber/20">MAX</button>
              </div>
            )}
            {lowBal && <p className="mt-1.5 text-[10px] font-semibold text-severity-critical">Insufficient balance</p>}
          </div>

          {/* Switch */}
          <div className="relative flex justify-center -my-0.5 z-10">
            <button onClick={switchTokens}
              className="rounded-lg border-[3px] border-bg-primary bg-bg-card p-2 text-text-disabled shadow-card transition-all hover:bg-accent-purple-dim hover:text-accent-purple hover:border-accent-purple/20 active:scale-90">
              <ArrowDownUp size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* TO */}
          <div className="rounded-lg border border-border bg-bg-input p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-disabled">To</span>
              <ChainSelector selected={dstChain} onSelect={setDstChain} label="Chain" />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                {isLoadingRoutes ? (
                  <div className="h-7 w-32 animate-shimmer rounded-lg bg-gradient-to-r from-bg-card via-bg-elevated to-bg-card bg-[length:200%_100%]" />
                ) : selectedRoute ? (
                  <p className="font-mono text-[26px] font-bold leading-none text-text-primary">{formatAmount(selectedRoute.dstAmount, selectedRoute.dstToken.decimals)}</p>
                ) : (
                  <p className="font-mono text-[26px] font-bold leading-none text-text-disabled">0</p>
                )}
                {selectedRoute && selectedRoute.dstAmountUSD > 0 && <p className="mt-1 text-[11px] font-mono text-text-disabled">≈ {formatUSD(selectedRoute.dstAmountUSD)}</p>}
              </div>
              <TokenSelector selected={dstToken} chainId={dstChain?.id || 42161} onSelect={setDstToken} />
            </div>
          </div>

          {/* Route details */}
          {selectedRoute && !isLoadingRoutes && (
            <button onClick={() => setShowDetails(!showDetails)}
              className="w-full rounded-lg border border-border bg-bg-card px-3.5 py-2.5 text-left transition-all hover:border-border-hover hover:bg-bg-card-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-text-muted"><Clock size={10} className="text-accent-purple" />~{Math.ceil(selectedRoute.estimatedTime / 60)}m</span>
                  <span className="flex items-center gap-1 text-text-muted"><Fuel size={10} className="text-accent-amber" />{formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD + selectedRoute.integratorFeeUSD)}</span>
                  <span className="flex items-center gap-1 text-text-muted"><Route size={10} className="text-accent-green" />{selectedRoute.steps.map(s => s.protocol).join(" → ")}</span>
                </div>
                {showDetails ? <ChevronUp size={11} className="text-text-disabled" /> : <ChevronDown size={11} className="text-text-disabled" />}
              </div>
              {showDetails && (
                <div className="mt-2.5 space-y-1.5 border-t border-border pt-2.5 text-[11px] font-mono" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between"><span className="text-text-disabled">Network + bridge</span><span className="text-text-muted">{formatUSD(selectedRoute.totalFeeUSD + selectedRoute.gasCostUSD)}</span></div>
                  {selectedRoute.integratorFeePercent > 0 && (
                    <div className="flex justify-between"><span className="text-text-disabled">Platform fee <span className="rounded bg-accent-amber-dim px-1 py-px text-[9px] font-bold text-accent-amber">{selectedRoute.integratorFeePercent}%</span></span><span className="text-text-muted">{formatUSD(selectedRoute.integratorFeeUSD)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-text-disabled">Slippage</span><span className="text-text-muted">{(slippage * 100).toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-text-disabled">Provider</span><span className="capitalize text-text-muted">{selectedRoute.adapter}</span></div>
                </div>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border-left-critical border border-severity-critical/20 bg-severity-critical-bg pl-4 pr-3 py-2.5 text-[12px] text-severity-critical">
              <AlertTriangle size={13} /><span>{error}</span>
            </div>
          )}

          {/* Swap button */}
          <button onClick={handleSwap} disabled={!canSwap || !!lowBal}
            className={`w-full rounded-lg py-3.5 text-[13px] font-bold transition-all ${lowBal ? "cursor-not-allowed bg-severity-critical-bg text-severity-critical border border-severity-critical/20" : canSwap ? "btn-swap" : "cursor-not-allowed bg-bg-card text-text-disabled border border-border"}`}>
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
