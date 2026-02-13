import {
  Route,
  QuoteRequest,
  RouteStep,
  TransactionData,
  StatusResponse,
  Token,
} from "@/lib/types";
import { generateId } from "@/lib/utils";
import { getFeeConfig } from "@/lib/config/fees";

// ============================================================
// LI.FI Adapter
// Uses LI.FI API to get cross-chain quotes and execute swaps
// Supports integrator fee collection via fee parameter
// Docs: https://docs.li.fi/
// ============================================================

const LIFI_API = "https://li.quest/v1";

interface LiFiQuoteResponse {
  routes: LiFiRoute[];
}

interface LiFiRoute {
  id: string;
  fromAmountUSD: string;
  toAmountUSD: string;
  fromAmount: string;
  toAmount: string;
  fromToken: LiFiToken;
  toToken: LiFiToken;
  gasCostUSD: string;
  steps: LiFiStep[];
  tags: string[];
  insurance: { state: string; feeAmountUsd: string };
}

interface LiFiStep {
  id: string;
  type: string;
  tool: string;
  toolDetails: { name: string; logoURI: string };
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: LiFiToken;
    toToken: LiFiToken;
    fromAmount: string;
    slippage: number;
  };
  estimate: {
    fromAmount: string;
    toAmount: string;
    executionDuration: number;
    gasCosts: Array<{ amountUSD: string }>;
    feeCosts: Array<{ amountUSD: string }>;
  };
}

interface LiFiToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  priceUSD: string;
}

function toLiFiTokenToToken(t: LiFiToken): Token {
  return {
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
    chainId: t.chainId,
    logoURI: t.logoURI,
    priceUSD: parseFloat(t.priceUSD) || undefined,
  };
}

export async function getLiFiQuote(params: QuoteRequest): Promise<Route[]> {
  try {
    const feeConfig = getFeeConfig();

    const searchParams = new URLSearchParams({
      fromChainId: params.srcChainId.toString(),
      toChainId: params.dstChainId.toString(),
      fromTokenAddress: params.srcToken,
      toTokenAddress: params.dstToken,
      fromAmount: params.amount,
      fromAddress: params.userAddress,
      toAddress: params.userAddress,
      slippage: params.slippage.toString(),
      order: params.sortBy === "speed" ? "FASTEST" : "RECOMMENDED",
      maxPriceImpact: "0.5",
    });

    // Add integrator fee if configured
    // LI.FI takes fee as decimal: 0.03 = 3%
    // Our config: percentBps 5 = 0.05%, so decimal = 0.0005
    if (feeConfig.enabled) {
      searchParams.set("fee", feeConfig.percentDecimal.toString());
      searchParams.set("referrer", feeConfig.collector);
    }

    const apiKey = process.env.NEXT_PUBLIC_LIFI_API_KEY;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (apiKey) headers["x-lifi-api-key"] = apiKey;

    const res = await fetch(`${LIFI_API}/advanced/routes?${searchParams}`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error("[LI.FI] Quote error:", res.status, await res.text());
      return [];
    }

    const data: LiFiQuoteResponse = await res.json();
    return (data.routes || []).map((r) => mapLiFiRoute(r));
  } catch (err) {
    console.error("[LI.FI] Quote failed:", err);
    return [];
  }
}

function mapLiFiRoute(r: LiFiRoute): Route {
  const feeConfig = getFeeConfig();

  const steps: RouteStep[] = r.steps.map((s) => ({
    type: s.type === "cross" ? "cross" : s.type === "lifi" ? "bridge" : (s.type as "swap" | "bridge"),
    protocol: s.toolDetails?.name || s.tool,
    protocolLogo: s.toolDetails?.logoURI,
    srcChainId: s.action.fromChainId,
    dstChainId: s.action.toChainId,
    srcToken: toLiFiTokenToToken(s.action.fromToken),
    dstToken: toLiFiTokenToToken(s.action.toToken),
    srcAmount: s.estimate.fromAmount,
    dstAmount: s.estimate.toAmount,
    estimatedTime: s.estimate.executionDuration,
  }));

  const totalFees = r.steps.reduce((sum, s) => {
    const fees = s.estimate.feeCosts?.reduce(
      (a, f) => a + parseFloat(f.amountUSD || "0"),
      0
    );
    return sum + (fees || 0);
  }, 0);

  const totalTime = r.steps.reduce(
    (sum, s) => sum + (s.estimate.executionDuration || 0),
    0
  );

  const tags: Route["tags"] = [];
  if (r.tags?.includes("RECOMMENDED")) tags.push("recommended");
  if (r.tags?.includes("CHEAPEST")) tags.push("cheapest");
  if (r.tags?.includes("FASTEST")) tags.push("fastest");

  // Calculate integrator fee from output
  const outputUSD = parseFloat(r.toAmountUSD) || 0;
  const integratorFeeUSD = feeConfig.enabled
    ? outputUSD * feeConfig.percentDecimal
    : 0;

  return {
    id: r.id || generateId(),
    adapter: "lifi",
    steps,
    srcToken: toLiFiTokenToToken(r.fromToken),
    dstToken: toLiFiTokenToToken(r.toToken),
    srcAmount: r.fromAmount,
    dstAmount: r.toAmount,
    dstAmountUSD: outputUSD,
    totalFeeUSD: totalFees,
    gasCostUSD: parseFloat(r.gasCostUSD) || 0,
    estimatedTime: totalTime,
    slippage: r.steps[0]?.action.slippage || 0.03,
    tags,
    integratorFeeUSD,
    integratorFeePercent: feeConfig.enabled ? feeConfig.percentBps / 100 : 0,
    rawData: r,
  };
}

export async function buildLiFiTransaction(
  route: Route
): Promise<TransactionData> {
  const lifiRoute = route.rawData as LiFiRoute;
  const step = lifiRoute.steps[0];

  const res = await fetch(`${LIFI_API}/advanced/stepTransaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...step }),
  });

  if (!res.ok) throw new Error(`LI.FI transaction build failed: ${res.status}`);
  const data = await res.json();

  return {
    to: data.transactionRequest.to,
    data: data.transactionRequest.data,
    value: data.transactionRequest.value || "0",
    chainId: data.transactionRequest.chainId,
    gasLimit: data.transactionRequest.gasLimit,
  };
}

export async function getLiFiStatus(
  txHash: string,
  route: Route
): Promise<StatusResponse> {
  const lifiRoute = route.rawData as LiFiRoute;
  const step = lifiRoute.steps[0];

  const params = new URLSearchParams({
    txHash,
    bridge: step.tool,
    fromChain: step.action.fromChainId.toString(),
    toChain: step.action.toChainId.toString(),
  });

  const res = await fetch(`${LIFI_API}/status?${params}`);
  const data = await res.json();

  const statusMap: Record<string, StatusResponse["status"]> = {
    NOT_FOUND: "pending",
    PENDING: "bridging",
    DONE: "completed",
    FAILED: "failed",
  };

  return {
    status: statusMap[data.status] || "pending",
    srcTxHash: data.sending?.txHash || txHash,
    dstTxHash: data.receiving?.txHash,
    bridgeExplorerUrl: data.bridgeExplorerUrl,
    substatus: data.substatus,
  };
}

// Token search via LI.FI
export async function searchLiFiTokens(
  chainId: number,
  query: string
): Promise<Token[]> {
  try {
    const res = await fetch(
      `${LIFI_API}/tokens?chains=${chainId}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const tokens: LiFiToken[] = data.tokens?.[chainId] || [];

    return tokens
      .filter(
        (t) =>
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.address.toLowerCase() === query.toLowerCase()
      )
      .slice(0, 20)
      .map(toLiFiTokenToToken);
  } catch {
    return [];
  }
}

// Get all supported chains from LI.FI
export async function getLiFiChains() {
  const res = await fetch(`${LIFI_API}/chains`);
  return res.json();
}
