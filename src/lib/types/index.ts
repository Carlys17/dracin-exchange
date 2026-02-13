// ============================================================
// Core Types for Cross-Chain DEX Aggregator
// ============================================================

export interface Chain {
  id: number;
  name: string;
  shortName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  logoURI: string;
  rpcUrl: string;
  explorerUrl: string;
  type: "evm" | "solana";
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  priceUSD?: number;
}

export interface QuoteRequest {
  srcChainId: number;
  dstChainId: number;
  srcToken: string;
  dstToken: string;
  amount: string; // raw amount in smallest unit
  userAddress: string;
  slippage: number; // 0.01 = 1%
  sortBy?: "output" | "speed" | "fee";
}

export interface RouteStep {
  type: "swap" | "bridge" | "cross";
  protocol: string;
  protocolLogo?: string;
  srcChainId: number;
  dstChainId: number;
  srcToken: Token;
  dstToken: Token;
  srcAmount: string;
  dstAmount: string;
  estimatedTime: number; // seconds
}

export interface Route {
  id: string;
  adapter: string; // "lifi" | "socket" | "custom"
  steps: RouteStep[];
  srcToken: Token;
  dstToken: Token;
  srcAmount: string;
  dstAmount: string;
  dstAmountUSD: number;
  totalFeeUSD: number;
  gasCostUSD: number;
  estimatedTime: number; // seconds
  slippage: number;
  tags: RouteTag[];
  // Fee collection info
  integratorFeeUSD: number;
  integratorFeePercent: number;
  // Raw adapter data for execution
  rawData: unknown;
}

export type RouteTag = "best-return" | "fastest" | "cheapest" | "recommended";

export interface RouteQuote {
  routes: Route[];
  bestRoute: Route | null;
  timestamp: number;
}

export type TransactionStatus =
  | "pending"
  | "src-confirmed"
  | "bridging"
  | "dst-confirmed"
  | "completed"
  | "failed"
  | "refunded";

export interface TrackedTransaction {
  id: string;
  adapter: string;
  route: Route;
  srcTxHash: string;
  dstTxHash?: string;
  status: TransactionStatus;
  startedAt: number;
  completedAt?: number;
  userAddress: string;
  error?: string;
}

// Adapter interface — every bridge/DEX adapter must implement this
export interface BridgeAdapter {
  name: string;
  logo: string;
  supportedChains: number[];

  getQuote(params: QuoteRequest): Promise<Route[]>;
  buildTransaction(route: Route): Promise<TransactionData>;
  getStatus(txHash: string, route: Route): Promise<StatusResponse>;
}

export interface TransactionData {
  to: string;
  data: string;
  value: string;
  chainId: number;
  gasLimit?: string;
}

export interface StatusResponse {
  status: TransactionStatus;
  srcTxHash: string;
  dstTxHash?: string;
  bridgeExplorerUrl?: string;
  substatus?: string;
}

// Zustand store types
export interface SwapState {
  srcChain: Chain | null;
  dstChain: Chain | null;
  srcToken: Token | null;
  dstToken: Token | null;
  amount: string;
  slippage: number;
  routes: Route[];
  selectedRoute: Route | null;
  isLoadingRoutes: boolean;
  transactions: TrackedTransaction[];

  setSrcChain: (chain: Chain) => void;
  setDstChain: (chain: Chain) => void;
  setSrcToken: (token: Token | null) => void;
  setDstToken: (token: Token | null) => void;
  setAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setRoutes: (routes: Route[]) => void;
  setSelectedRoute: (route: Route | null) => void;
  setIsLoadingRoutes: (loading: boolean) => void;
  addTransaction: (tx: TrackedTransaction) => void;
  updateTransaction: (id: string, update: Partial<TrackedTransaction>) => void;
  switchTokens: () => void;
}
