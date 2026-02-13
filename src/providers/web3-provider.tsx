"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  mainnet, arbitrum, optimism, base, polygon, bsc, avalanche,
  linea, zkSync, scroll, mantle, gnosis, fantom, polygonZkEvm,
  moonbeam, celo,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [
    mainnet, arbitrum, optimism, base, polygon, bsc, avalanche,
    linea, zkSync, scroll, mantle, gnosis, fantom, polygonZkEvm,
    moonbeam, celo,
  ],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({
      projectId,
      metadata: {
        name: "Dracin Exchange",
        description: "Cross-chain bridge & DEX aggregator",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: [],
      },
    })] : []),
  ],
  transports: {
    [mainnet.id]: http("https://eth.llamarpc.com"),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
    [optimism.id]: http("https://mainnet.optimism.io"),
    [base.id]: http("https://mainnet.base.org"),
    [polygon.id]: http("https://polygon-rpc.com"),
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
    [linea.id]: http("https://rpc.linea.build"),
    [zkSync.id]: http("https://mainnet.era.zksync.io"),
    [scroll.id]: http("https://rpc.scroll.io"),
    [mantle.id]: http("https://rpc.mantle.xyz"),
    [gnosis.id]: http("https://rpc.gnosischain.com"),
    [fantom.id]: http("https://rpc.ftm.tools"),
    [polygonZkEvm.id]: http("https://zkevm-rpc.com"),
    [moonbeam.id]: http("https://rpc.api.moonbeam.network"),
    [celo.id]: http("https://forno.celo.org"),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, gcTime: 5 * 60_000 } },
  }));

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
