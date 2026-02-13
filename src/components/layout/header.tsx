"use client";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#0c0a14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c8a84e]/15 border border-[#c8a84e]/20">
            <Shield size={14} className="text-[#c8a84e]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[#e8e3f3]">
            Dracin<span className="text-[#c8a84e]">Exchange</span>
          </span>
        </div>
        <span className="text-[10px] text-[#9b93ab] hidden sm:block">
          Cross-Chain Bridge & DEX Aggregator
        </span>
      </div>
    </header>
  );
}
