"use client";

import { Coins, ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface FeeInfoProps {
  feePercent: number;
  feeCollector: string;
}

export function FeeInfoBanner({ feePercent, feeCollector }: FeeInfoProps) {
  if (!feePercent || !feeCollector) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-1.5 text-[10px] text-text-tertiary">
      <Coins size={10} className="text-brand/60" />
      <span>
        Platform fee: <span className="font-semibold text-brand/80">{feePercent}%</span>
      </span>
      <span>·</span>
      <a
        href={`https://debank.com/profile/${feeCollector}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-0.5 font-mono hover:text-brand transition-colors"
      >
        {shortenAddress(feeCollector, 4)}
        <ExternalLink size={8} />
      </a>
    </div>
  );
}
