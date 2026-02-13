"use client";
import { Coins, ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

export function FeeInfoBanner({ feePercent, feeCollector }: { feePercent: number; feeCollector: string }) {
  if (!feePercent || !feeCollector) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-1.5 text-[10px] text-text-disabled">
      <Coins size={10} className="text-accent-amber/50" />
      <span>Platform fee: <span className="font-bold text-accent-amber/70">{feePercent}%</span></span>
      <span>·</span>
      <a href={`https://debank.com/profile/${feeCollector}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-0.5 font-mono hover:text-accent-purple transition-colors">
        {shortenAddress(feeCollector, 4)}<ExternalLink size={8} />
      </a>
    </div>
  );
}
