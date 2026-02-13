import { Header } from "@/components/layout/header";
import { SwapCard } from "@/components/swap/swap-card";
import { Web3Provider } from "@/providers/web3-provider";

export default function Home() {
  return (
    <Web3Provider>
      <Header />

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-bg-primary" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] animate-float rounded-full bg-blue/[0.06] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] animate-float-slow rounded-full bg-purple/[0.05] blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-brand/[0.04] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-24">
        <SwapCard />

        <div className="mt-8 flex items-center gap-2 text-[10px] text-text-tertiary">
          <span>Powered by</span>
          {["LI.FI", "Socket", "20+ Chains"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-white/[0.02] px-2.5 py-0.5">{t}</span>
          ))}
        </div>
      </main>
    </Web3Provider>
  );
}
