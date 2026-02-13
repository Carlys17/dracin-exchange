"use client";
import { useSwapStore } from "@/store/swap-store";
import { TrackedTransaction } from "@/lib/types";
import { formatAmount } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, ExternalLink, ArrowRight, Loader2, Inbox } from "lucide-react";
import { getChain } from "@/lib/config/chains";

const STATUS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-warning", icon: Clock },
  "src-confirmed": { label: "Confirming", color: "text-warning", icon: Loader2 },
  bridging: { label: "Bridging", color: "text-accent-secondary", icon: Loader2 },
  completed: { label: "Completed", color: "text-accent", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-danger", icon: XCircle },
};

export function TransactionHistory() {
  const { transactions } = useSwapStore();
  if (transactions.length === 0) return (
    <div className="rounded-xl border border-border bg-bg-card p-8 text-center">
      <Inbox size={28} className="mx-auto mb-2 text-text-disabled" />
      <p className="text-xs text-text-muted">No transactions yet</p>
      <p className="mt-0.5 text-[10px] text-text-disabled">Your swaps will appear here</p>
    </div>
  );

  return (
    <div className="space-y-1.5">
      <span className="px-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Recent</span>
      {transactions.map((tx) => {
        const cfg = STATUS[tx.status] || STATUS.pending;
        const src = getChain(tx.route.steps[0]?.srcChainId || 1);
        const dst = getChain(tx.route.steps[tx.route.steps.length - 1]?.dstChainId || 1);
        const active = tx.status === "pending" || tx.status === "bridging";
        return (
          <div key={tx.id} className={`rounded-xl border p-3 ${active ? "border-accent/20 bg-accent/[0.02]" : "border-border bg-bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <cfg.icon size={11} className={`${cfg.color} ${active ? "animate-spin" : ""}`} />
                  <span className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[9px] text-text-disabled">{new Date(tx.startedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-mono font-bold text-text-primary">{formatAmount(tx.route.srcAmount, tx.route.srcToken.decimals)} {tx.route.srcToken.symbol}</span>
                  <ArrowRight size={10} className="text-text-disabled" />
                  <span className="font-mono font-bold text-text-primary">{formatAmount(tx.route.dstAmount, tx.route.dstToken.decimals)} {tx.route.dstToken.symbol}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-disabled">
                  <span>{src?.shortName}</span><ArrowRight size={7} /><span>{dst?.shortName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {tx.srcTxHash && src && (
                  <a href={`${src.explorerUrl}/tx/${tx.srcTxHash}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-muted hover:text-accent">
                    Src <ExternalLink size={8} />
                  </a>
                )}
                {tx.dstTxHash && dst && (
                  <a href={`${dst.explorerUrl}/tx/${tx.dstTxHash}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md bg-bg-elevated px-1.5 py-0.5 text-[9px] text-text-muted hover:text-accent">
                    Dst <ExternalLink size={8} />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
