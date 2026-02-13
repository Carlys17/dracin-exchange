import { Chain, Token } from "@/lib/types";

// ============================================================
// Supported Chains
// ============================================================

export const CHAINS: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_ETHEREUM || "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    type: "evm",
  },
  {
    id: 42161,
    name: "Arbitrum",
    shortName: "ARB",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_ARBITRUM || "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    type: "evm",
  },
  {
    id: 10,
    name: "Optimism",
    shortName: "OP",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_OPTIMISM || "https://mainnet.optimism.io",
    explorerUrl: "https://optimistic.etherscan.io",
    type: "evm",
  },
  {
    id: 8453,
    name: "Base",
    shortName: "BASE",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_BASE || "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    type: "evm",
  },
  {
    id: 137,
    name: "Polygon",
    shortName: "POLY",
    nativeCurrency: { name: "MATIC", symbol: "POL", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_POLYGON || "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    type: "evm",
  },
  {
    id: 56,
    name: "BNB Chain",
    shortName: "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_BSC || "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
    type: "evm",
  },
  {
    id: 43114,
    name: "Avalanche",
    shortName: "AVAX",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerUrl: "https://snowtrace.io",
    type: "evm",
  },
  {
    id: 1151111081099710,
    name: "Solana",
    shortName: "SOL",
    nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 9 },
    logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorerUrl: "https://solscan.io",
    type: "solana",
  },
];

export const CHAIN_MAP = new Map(CHAINS.map((c) => [c.id, c]));

export function getChain(chainId: number): Chain | undefined {
  return CHAIN_MAP.get(chainId);
}

// ============================================================
// Popular Tokens (defaults for quick selection)
// ============================================================

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SOLANA_NATIVE = "So11111111111111111111111111111111111111112";

export const POPULAR_TOKENS: Record<number, Token[]> = {
  1: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether", decimals: 6, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdt.svg" },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", name: "Wrapped BTC", decimals: 8, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/wbtc.svg" },
  ],
  42161: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0x912CE59144191C1204E64559FE8253a0e49E6548", symbol: "ARB", name: "Arbitrum", decimals: 18, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/arb.svg" },
  ],
  10: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 10, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 10, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0x4200000000000000000000000000000000000042", symbol: "OP", name: "Optimism", decimals: 18, chainId: 10, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/op.svg" },
  ],
  8453: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 8453, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 8453, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
  ],
  137: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "POL", name: "POL", decimals: 18, chainId: 137, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/pol.svg" },
    { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 137, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
  ],
  56: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "BNB", name: "BNB", decimals: 18, chainId: 56, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/bnb.svg" },
    { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", name: "USD Coin", decimals: 18, chainId: 56, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
  ],
};

// ============================================================
// Wagmi chain configs
// ============================================================

export const EVM_CHAIN_IDS = CHAINS.filter((c) => c.type === "evm").map((c) => c.id);
export const SOLANA_CHAIN_ID = 1151111081099710;
