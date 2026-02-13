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
// Socket (Bungee) Adapter
// Uses Socket API for cross-chain quotes
// Supports integrator fee via feePercent + feeTakerAddress
// Docs: https://docs.socket.tech/
// ============================================================

const SOCKET_API = "https://api.socket.tech/v2";

function getHeaders(): Record<string, string> {
  const apiKey = process.env.NEXT_PUBLIC_SOCKET_API_KEY;
  return {
    Accept: "application/json",
    ...(apiKey ? { "API-KEY": apiKey } : {}),
  };
}

interface SocketRoute {
  routeId: string;
  fromAmount: string;
  toAmount: string;
  usedBridgeNames: string[];
  usedDexName: string;
  totalGasFeesInUsd: number;
  totalUserTx: number;
  serviceTime: number;
  inputValueInUsd: number;
  outputValueInUsd: number;
  userTxs: SocketUserTx[];
}

interface SocketUserTx {
  userTxType: string;
  txType: string;
  chainId: number;
  toAmount: string;
  toAsset: SocketToken;
  stepCount: number;
  steps: SocketStep[];
  gasFees: { gasAmount: string; feesInUsd: number };
}

interface SocketStep {
  type: string;
  protocol: { displayName: string; icon: string };
  fromChainId: number;
  toChainId: number;
  fromAsset: SocketToken;
  toAsset: SocketToken;
  fromAmount: string;
  toAmount: string;
  serviceTime: number;
}

interface SocketToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

function socketTokenToToken(t: SocketToken): Token {
  return {
    address: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
    chainId: t.chainId,
    logoURI: t.logoURI,
  };
}

export async function getSocketQuote(params: QuoteRequest): Promise<Route[]> {
  try {
    const feeConfig = getFeeConfig();

    const searchParams = new URLSearchParams({
      fromChainId: params.srcChainId.toString(),
      toChainId: params.dstChainId.toString(),
      fromTokenAddress: params.srcToken,
      toTokenAddress: params.dstToken,
      fromAmount: params.amount,
      userAddress: params.userAddress,
      sort: params.sortBy === "speed" ? "time" : "output",
      singleTxOnly: "true",
      uniqueRoutesPerBridge: "true",
      defaultSwapSlippage: (params.slippage * 100).toString(),
      defaultBridgeSlippage: (params.slippage * 100).toString(),
    });

    // Add integrator fee if configured
    // Socket takes feePercent as bps: 5 = 0.05%
    if (feeConfig.enabled) {
      searchParams.set("feePercent", feeConfig.percentBps.toString());
      searchParams.set("feeTakerAddress", feeConfig.collector);
    }

    const res = await fetch(`${SOCKET_API}/quote?${searchParams}`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error("[Socket] Quote error:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    if (!data.success || !data.result?.routes) return [];

    return data.result.routes.slice(0, 5).map((r: SocketRoute, idx: number) =>
      mapSocketRoute(r, params, idx === 0)
    );
  } catch (err) {
    console.error("[Socket] Quote failed:", err);
    return [];
  }
}

function mapSocketRoute(
  r: SocketRoute,
  params: QuoteRequest,
  isBest: boolean
): Route {
  const feeConfig = getFeeConfig();
  const steps: RouteStep[] = [];

  for (const userTx of r.userTxs || []) {
    for (const step of userTx.steps || []) {
      steps.push({
        type:
          step.type === "bridge"
            ? "bridge"
            : step.type === "middleware"
            ? "cross"
            : "swap",
        protocol: step.protocol?.displayName || "Unknown",
        protocolLogo: step.protocol?.icon,
        srcChainId: step.fromChainId,
        dstChainId: step.toChainId,
        srcToken: socketTokenToToken(step.fromAsset),
        dstToken: socketTokenToToken(step.toAsset),
        srcAmount: step.fromAmount,
        dstAmount: step.toAmount,
        estimatedTime: step.serviceTime || 60,
      });
    }
  }

  const tags: Route["tags"] = [];
  if (isBest) tags.push("best-return");

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];

  // Calculate integrator fee from output
  const outputUSD = r.outputValueInUsd || 0;
  const integratorFeeUSD = feeConfig.enabled
    ? outputUSD * feeConfig.percentDecimal
    : 0;

  return {
    id: r.routeId || generateId(),
    adapter: "socket",
    steps,
    srcToken: firstStep?.srcToken || ({} as Token),
    dstToken: lastStep?.dstToken || ({} as Token),
    srcAmount: r.fromAmount,
    dstAmount: r.toAmount,
    dstAmountUSD: outputUSD,
    totalFeeUSD: r.totalGasFeesInUsd || 0,
    gasCostUSD: r.totalGasFeesInUsd || 0,
    estimatedTime: r.serviceTime || 120,
    slippage: params.slippage,
    tags,
    integratorFeeUSD,
    integratorFeePercent: feeConfig.enabled ? feeConfig.percentBps / 100 : 0,
    rawData: r,
  };
}

export async function buildSocketTransaction(
  route: Route
): Promise<TransactionData> {
  const socketRoute = route.rawData as SocketRoute;

  const res = await fetch(`${SOCKET_API}/build-tx`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ route: socketRoute }),
  });

  if (!res.ok) throw new Error(`Socket tx build failed: ${res.status}`);
  const data = await res.json();

  if (!data.success) throw new Error("Socket tx build unsuccessful");

  return {
    to: data.result.txTarget,
    data: data.result.txData,
    value: data.result.value || "0",
    chainId: data.result.chainId,
  };
}

export async function getSocketStatus(
  txHash: string,
  route: Route
): Promise<StatusResponse> {
  const firstStep = route.steps[0];

  const params = new URLSearchParams({
    transactionHash: txHash,
    fromChainId: firstStep.srcChainId.toString(),
    toChainId: firstStep.dstChainId.toString(),
  });

  const res = await fetch(`${SOCKET_API}/bridge-status?${params}`, {
    headers: getHeaders(),
  });
  const data = await res.json();

  if (!data.success) {
    return { status: "pending", srcTxHash: txHash };
  }

  const statusMap: Record<string, StatusResponse["status"]> = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    READY: "bridging",
  };

  return {
    status: statusMap[data.result?.destinationTransactionHash ? "COMPLETED" : "PENDING"] || "pending",
    srcTxHash: txHash,
    dstTxHash: data.result?.destinationTransactionHash,
  };
}

// Token list from Socket
export async function getSocketTokens(
  fromChainId: number,
  toChainId: number
): Promise<Token[]> {
  try {
    const params = new URLSearchParams({
      fromChainId: fromChainId.toString(),
      toChainId: toChainId.toString(),
      isShortList: "true",
    });

    const res = await fetch(`${SOCKET_API}/token-lists/from-token-list?${params}`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!data.success) return [];

    return (data.result || []).map(socketTokenToToken);
  } catch {
    return [];
  }
}
