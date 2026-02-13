import { Chain, Token } from "@/lib/types";

// ============================================================
// Supported Chains — ALL major EVM chains
// ============================================================

export const CHAINS: Chain[] = [
  { id: 1, name: "Ethereum", shortName: "ETH", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg", rpcUrl: "https://eth.llamarpc.com", explorerUrl: "https://etherscan.io", type: "evm" },
  { id: 42161, name: "Arbitrum", shortName: "ARB", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg", rpcUrl: "https://arb1.arbitrum.io/rpc", explorerUrl: "https://arbiscan.io", type: "evm" },
  { id: 10, name: "Optimism", shortName: "OP", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg", rpcUrl: "https://mainnet.optimism.io", explorerUrl: "https://optimistic.etherscan.io", type: "evm" },
  { id: 8453, name: "Base", shortName: "BASE", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg", rpcUrl: "https://mainnet.base.org", explorerUrl: "https://basescan.org", type: "evm" },
  { id: 137, name: "Polygon", shortName: "POLY", nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg", rpcUrl: "https://polygon-rpc.com", explorerUrl: "https://polygonscan.com", type: "evm" },
  { id: 56, name: "BNB Chain", shortName: "BSC", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg", rpcUrl: "https://bsc-dataseed.binance.org", explorerUrl: "https://bscscan.com", type: "evm" },
  { id: 43114, name: "Avalanche", shortName: "AVAX", nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg", rpcUrl: "https://api.avax.network/ext/bc/C/rpc", explorerUrl: "https://snowtrace.io", type: "evm" },
  { id: 59144, name: "Linea", shortName: "LINEA", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/linea.svg", rpcUrl: "https://rpc.linea.build", explorerUrl: "https://lineascan.build", type: "evm" },
  { id: 324, name: "zkSync Era", shortName: "ZK", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zksync.svg", rpcUrl: "https://mainnet.era.zksync.io", explorerUrl: "https://explorer.zksync.io", type: "evm" },
  { id: 534352, name: "Scroll", shortName: "SCROLL", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/scroll.svg", rpcUrl: "https://rpc.scroll.io", explorerUrl: "https://scrollscan.com", type: "evm" },
  { id: 5000, name: "Mantle", shortName: "MNT", nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/mantle.svg", rpcUrl: "https://rpc.mantle.xyz", explorerUrl: "https://explorer.mantle.xyz", type: "evm" },
  { id: 100, name: "Gnosis", shortName: "GNO", nativeCurrency: { name: "xDAI", symbol: "xDAI", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/gnosis.svg", rpcUrl: "https://rpc.gnosischain.com", explorerUrl: "https://gnosisscan.io", type: "evm" },
  { id: 250, name: "Fantom", shortName: "FTM", nativeCurrency: { name: "FTM", symbol: "FTM", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fantom.svg", rpcUrl: "https://rpc.ftm.tools", explorerUrl: "https://ftmscan.com", type: "evm" },
  { id: 1101, name: "Polygon zkEVM", shortName: "zkEVM", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zkevm.svg", rpcUrl: "https://zkevm-rpc.com", explorerUrl: "https://zkevm.polygonscan.com", type: "evm" },
  { id: 1284, name: "Moonbeam", shortName: "GLMR", nativeCurrency: { name: "GLMR", symbol: "GLMR", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonbeam.svg", rpcUrl: "https://rpc.api.moonbeam.network", explorerUrl: "https://moonscan.io", type: "evm" },
  { id: 42220, name: "Celo", shortName: "CELO", nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/celo.svg", rpcUrl: "https://forno.celo.org", explorerUrl: "https://celoscan.io", type: "evm" },
  { id: 1151111081099710, name: "Solana", shortName: "SOL", nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 9 }, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg", rpcUrl: "https://api.mainnet-beta.solana.com", explorerUrl: "https://solscan.io", type: "solana" },
];

export const CHAIN_MAP = new Map(CHAINS.map((c) => [c.id, c]));
export function getChain(chainId: number): Chain | undefined { return CHAIN_MAP.get(chainId); }

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

// Popular tokens per chain (quick pick)
export const POPULAR_TOKENS: Record<number, Token[]> = {
  1: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether", decimals: 6, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdt.svg" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", name: "Dai", decimals: 18, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/dai.svg" },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", name: "Wrapped BTC", decimals: 8, chainId: 1, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/wbtc.svg" },
  ],
  42161: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
    { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether", decimals: 6, chainId: 42161, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdt.svg" },
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
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", name: "Tether", decimals: 6, chainId: 137, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdt.svg" },
  ],
  56: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "BNB", name: "BNB", decimals: 18, chainId: 56, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/bnb.svg" },
    { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", symbol: "USDC", name: "USD Coin", decimals: 18, chainId: 56, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
    { address: "0x55d398326f99059fF775485246999027B3197955", symbol: "USDT", name: "Tether", decimals: 18, chainId: 56, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdt.svg" },
  ],
  43114: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "AVAX", name: "Avalanche", decimals: 18, chainId: 43114, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/avax.svg" },
    { address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", symbol: "USDC", name: "USD Coin", decimals: 6, chainId: 43114, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/usdc.svg" },
  ],
  59144: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 59144, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
  ],
  324: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 324, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
  ],
  534352: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "ETH", name: "Ether", decimals: 18, chainId: 534352, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/eth.svg" },
  ],
  5000: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "MNT", name: "Mantle", decimals: 18, chainId: 5000, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/mnt.svg" },
  ],
  100: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "xDAI", name: "xDAI", decimals: 18, chainId: 100, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/dai.svg" },
  ],
  250: [
    { address: NATIVE_TOKEN_ADDRESS, symbol: "FTM", name: "Fantom", decimals: 18, chainId: 250, logoURI: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/tokens/ftm.svg" },
  ],
};

export const EVM_CHAIN_IDS = CHAINS.filter((c) => c.type === "evm").map((c) => c.id);
export const SOLANA_CHAIN_ID = 1151111081099710;
