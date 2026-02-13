import { create } from "zustand";
import { SwapState, Chain, Token, Route, TrackedTransaction } from "@/lib/types";
import { CHAINS, POPULAR_TOKENS } from "@/lib/config/chains";

export const useSwapStore = create<SwapState>((set, get) => ({
  srcChain: CHAINS[0], // Ethereum
  dstChain: CHAINS[1], // Arbitrum
  srcToken: POPULAR_TOKENS[1]?.[0] || null, // ETH on Ethereum
  dstToken: POPULAR_TOKENS[42161]?.[1] || null, // USDC on Arbitrum
  amount: "",
  slippage: 0.03,
  routes: [],
  selectedRoute: null,
  isLoadingRoutes: false,
  transactions: [],

  setSrcChain: (chain: Chain) => {
    const tokens = POPULAR_TOKENS[chain.id];
    set({
      srcChain: chain,
      srcToken: tokens?.[0] || null,
      routes: [],
      selectedRoute: null,
    });
  },

  setDstChain: (chain: Chain) => {
    const tokens = POPULAR_TOKENS[chain.id];
    set({
      dstChain: chain,
      dstToken: tokens?.[0] || null,
      routes: [],
      selectedRoute: null,
    });
  },

  setSrcToken: (token: Token | null) =>
    set({ srcToken: token, routes: [], selectedRoute: null }),

  setDstToken: (token: Token | null) =>
    set({ dstToken: token, routes: [], selectedRoute: null }),

  setAmount: (amount: string) =>
    set({ amount, routes: [], selectedRoute: null }),

  setSlippage: (slippage: number) => set({ slippage }),

  setRoutes: (routes: Route[]) =>
    set({
      routes,
      selectedRoute: routes[0] || null,
    }),

  setSelectedRoute: (route: Route | null) => set({ selectedRoute: route }),

  setIsLoadingRoutes: (loading: boolean) => set({ isLoadingRoutes: loading }),

  addTransaction: (tx: TrackedTransaction) =>
    set((s) => ({ transactions: [tx, ...s.transactions] })),

  updateTransaction: (id: string, update: Partial<TrackedTransaction>) =>
    set((s) => ({
      transactions: s.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...update } : tx
      ),
    })),

  switchTokens: () => {
    const { srcChain, dstChain, srcToken, dstToken } = get();
    set({
      srcChain: dstChain,
      dstChain: srcChain,
      srcToken: dstToken,
      dstToken: srcToken,
      routes: [],
      selectedRoute: null,
    });
  },
}));
