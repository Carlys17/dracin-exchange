import { Header } from "@/components/layout/header";
import { SwapCard } from "@/components/swap/swap-card";

export default function Home() {
  return (
    <>
      <Header />
      {/* ShieldScan-style subtle background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-bg-deep" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-accent-purple/[0.03] blur-[160px]" />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent-amber/[0.02] blur-[140px]" />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-24">
        <SwapCard />
        {/* Footer like ShieldScan */}
        <div className="mt-10 flex items-center gap-4 text-[11px] text-text-disabled">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-amber animate-pulse-dot" />
            <span className="text-accent-amber/70">Powered by LI.FI & Socket</span>
          </span>
          <span>·</span>
          <span>20+ Chains</span>
          <span>·</span>
          <span>github.com/Carlys17/dracin-exchange</span>
        </div>
      </main>
    </>
  );
}
