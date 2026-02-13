// ============================================================
// Fee Collection Configuration
// 
// How it works:
// 1. INTEGRATOR FEE (API-level): LI.FI and Socket both support
//    "integrator fee" params in their quote APIs. This takes a
//    percentage from the swap output and sends it to your wallet.
//    This is the cleanest method — no extra contract needed.
//
// 2. The fee is deducted from the output amount, so the user sees
//    the post-fee amount in the quote. Fully transparent.
//
// 3. Set NEXT_PUBLIC_FEE_COLLECTOR to your wallet address and
//    NEXT_PUBLIC_FEE_PERCENT to your desired fee (e.g. 0.05 = 0.05%)
// ============================================================

export interface FeeConfig {
  enabled: boolean;
  collector: string;          // Your wallet address
  percentBps: number;         // Fee in basis points (100 = 1%)
  percentDecimal: number;     // Fee as decimal (0.01 = 1%)
  percentDisplay: string;     // Human readable ("0.05%")
}

export function getFeeConfig(): FeeConfig {
  const collector = process.env.NEXT_PUBLIC_FEE_COLLECTOR || "";
  const percentRaw = parseFloat(process.env.NEXT_PUBLIC_FEE_PERCENT || "0");

  // Validate
  const enabled = !!collector && collector.length >= 42 && percentRaw > 0;
  const percentDecimal = percentRaw / 100; // 0.05 env → 0.0005 decimal
  const percentBps = Math.round(percentRaw * 100); // 0.05% → 5 bps

  return {
    enabled,
    collector,
    percentBps,
    percentDecimal,
    percentDisplay: `${percentRaw}%`,
  };
}

// Calculate fee amount from a raw token amount
export function calculateFee(amount: string, decimals: number): {
  feeAmount: string;
  netAmount: string;
  feeUSD: number;
} {
  const config = getFeeConfig();
  if (!config.enabled) {
    return { feeAmount: "0", netAmount: amount, feeUSD: 0 };
  }

  const amountBig = BigInt(amount);
  const feeBig = (amountBig * BigInt(config.percentBps)) / BigInt(10000);
  const netBig = amountBig - feeBig;

  return {
    feeAmount: feeBig.toString(),
    netAmount: netBig.toString(),
    feeUSD: 0, // Calculated downstream with price data
  };
}
