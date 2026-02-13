import { Header } from "@/components/layout/header";
import dynamic from "next/dynamic";

const DracinWidget = dynamic(
  () => import("@/components/swap/dracin-widget").then((m) => m.DracinWidget),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[460px] h-[520px] rounded-2xl border border-white/[0.06] bg-[#1a1525] animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#c8a84e]/20 border-t-[#c8a84e] animate-spin" />
          <span className="text-xs text-[#9b93ab]">Loading Dracin Exchange...</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <>
      <Header />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0c0a14]" />
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#c8a84e]/[0.03] blur-[150px]" />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#a78bfa]/[0.03] blur-[130px]" />
      </div>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-20">
        <DracinWidget />
        <div className="mt-6 flex items-center gap-3 text-[10px] text-[#9b93ab]/60">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Powered by LI.FI Protocol
          </span>
          <span>·</span>
          <span>30+ Chains · 20+ Bridges · 30+ DEXs</span>
        </div>
      </main>
    </>
  );
}
