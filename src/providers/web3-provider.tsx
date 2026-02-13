"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  mainnet,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
  avalanche,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, base, polygon, bsc, avalanche],
  connectors: [
    injected(),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata: {
              name: "Bridge Aggregator",
              description: "Cross-chain DEX Aggregator",
              url: typeof window !== "undefined" ? window.location.origin : "",
              icons: [],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_RPC_ETHEREUM || "https://eth.llamarpc.com"
    ),
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_RPC_ARBITRUM || "https://arb1.arbitrum.io/rpc"
    ),
    [optimism.id]: http(
      process.env.NEXT_PUBLIC_RPC_OPTIMISM || "https://mainnet.optimism.io"
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_RPC_BASE || "https://mainnet.base.org"
    ),
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_RPC_POLYGON || "https://polygon-rpc.com"
    ),
    [bsc.id]: http(
      process.env.NEXT_PUBLIC_RPC_BSC || "https://bsc-dataseed.binance.org"
    ),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, gcTime: 5 * 60_000 },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
