import type { Metadata } from "next";
import { Web3Provider } from "@/providers/web3-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dracin Exchange — Cross-Chain Bridge & DEX Aggregator",
  description: "Find the best routes across 15+ bridges and 20+ chains.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary font-sans antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
