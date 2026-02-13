import { Header } from "@/components/layout/header";
import { SwapCard } from "@/components/swap/swap-card";

export default function Home() {
  return (
    <>
      <Header />
      {/* Background effects — same style as DropScanner */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-bg-primary" />
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] animate-float rounded-full bg-accent/[0.04] blur-[160px]" />
        <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-accent-secondary/[0.03] blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-accent/[0.02] blur-[120px]" />
        {/* Dot grid like DropScanner */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,217,165,0.3) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-24">
        <SwapCard />
        {/* Footer pills */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-text-muted">
          <span>Powered by</span>
          {["LI.FI", "Socket", "20+ Chains"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-bg-card px-2.5 py-0.5 font-medium">{t}</span>
          ))}
        </div>
      </main>
    </>
  );
}
