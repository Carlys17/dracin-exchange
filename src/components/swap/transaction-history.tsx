"use client";

import { useSwapStore } from "@/store/swap-store";
import { TrackedTransaction } from "@/lib/types";
import { formatAmount, formatTime, shortenAddress } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getChain } from "@/lib/config/chains";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "Pending", color: "text-warning", icon: Clock },
  "src-confirmed": { label: "Source Confirmed", color: "text-warning", icon: Loader2 },
  bridging: { label: "Bridging", color: "text-secondary", icon: Loader2 },
  "dst-confirmed": { label: "Dest Confirmed", color: "text-accent", icon: CheckCircle2 },
  completed: { label: "Completed", color: "text-accent", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-danger", icon: XCircle },
  refunded: { label: "Refunded", color: "text-warning", icon: XCircle },
};

export function TransactionHistory() {
  const { transactions } = useSwapStore();

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface-1 p-8 text-center">
        <p className="text-sm text-text-tertiary">No transactions yet</p>
        <p className="mt-1 text-xs text-text-tertiary/60">
          Your cross-chain swaps will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <TxCard key={tx.id} tx={tx} />
      ))}
    </div>
  );
}

function TxCard({ tx }: { tx: TrackedTransaction }) {
  const config = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
  const srcChain = getChain(tx.route.steps[0]?.srcChainId || 1);
  const dstChain = getChain(tx.route.steps[tx.route.steps.length - 1]?.dstChainId || 1);

  return (
    <div className="rounded-xl border border-white/5 bg-surface-2 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Status */}
          <div className="flex items-center gap-1.5 mb-2">
            <config.icon
              size={13}
              className={`${config.color} ${
                tx.status === "bridging" || tx.status === "pending"
                  ? "animate-spin"
                  : ""
              }`}
            />
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.label}
            </span>
            <span className="text-[10px] text-text-tertiary">
              {new Date(tx.startedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Route summary */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono text-text-primary">
              {formatAmount(tx.route.srcAmount, tx.route.srcToken.decimals)}{" "}
              {tx.route.srcToken.symbol}
            </span>
            <ArrowRight size={12} className="text-text-tertiary" />
            <span className="font-mono text-text-primary">
              {formatAmount(tx.route.dstAmount, tx.route.dstToken.decimals)}{" "}
              {tx.route.dstToken.symbol}
            </span>
          </div>

          {/* Chain info */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-tertiary">
            <span>{srcChain?.shortName}</span>
            <ArrowRight size={8} />
            <span>{dstChain?.shortName}</span>
            <span className="mx-1">·</span>
            <span>via {tx.adapter}</span>
          </div>
        </div>

        {/* Explorer links */}
        <div className="flex flex-col gap-1">
          {tx.srcTxHash && srcChain && (
            <a
              href={`${srcChain.explorerUrl}/tx/${tx.srcTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent"
            >
              Source <ExternalLink size={9} />
            </a>
          )}
          {tx.dstTxHash && dstChain && (
            <a
              href={`${dstChain.explorerUrl}/tx/${tx.dstTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent"
            >
              Dest <ExternalLink size={9} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
