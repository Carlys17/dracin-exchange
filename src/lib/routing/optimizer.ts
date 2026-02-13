import { Route, QuoteRequest, RouteTag } from "@/lib/types";
import { getLiFiQuote } from "@/lib/adapters/lifi";
import { getSocketQuote } from "@/lib/adapters/socket";

// ============================================================
// Route Optimizer
// Aggregates quotes from LI.FI + Socket, ranks them,
// and assigns tags (best-return, fastest, cheapest)
// ============================================================

export async function findBestRoutes(params: QuoteRequest): Promise<Route[]> {
  // Query all adapters in parallel
  const [lifiRoutes, socketRoutes] = await Promise.allSettled([
    getLiFiQuote(params),
    getSocketQuote(params),
  ]);

  const allRoutes: Route[] = [
    ...(lifiRoutes.status === "fulfilled" ? lifiRoutes.value : []),
    ...(socketRoutes.status === "fulfilled" ? socketRoutes.value : []),
  ].filter((r) => r && BigInt(r.dstAmount || "0") > 0n);

  if (allRoutes.length === 0) return [];

  // Clear old tags
  allRoutes.forEach((r) => (r.tags = []));

  // Find best by output amount
  const bestOutput = allRoutes.reduce((best, r) =>
    r.dstAmountUSD > best.dstAmountUSD ? r : best
  );
  bestOutput.tags.push("best-return");

  // Find fastest
  const fastest = allRoutes.reduce((best, r) =>
    r.estimatedTime < best.estimatedTime ? r : best
  );
  if (fastest.id !== bestOutput.id) {
    fastest.tags.push("fastest");
  }

  // Find cheapest (lowest total fees)
  const cheapest = allRoutes.reduce((best, r) =>
    r.totalFeeUSD + r.gasCostUSD < best.totalFeeUSD + best.gasCostUSD
      ? r
      : best
  );
  if (cheapest.id !== bestOutput.id && cheapest.id !== fastest.id) {
    cheapest.tags.push("cheapest");
  }

  // Mark recommended (best composite score)
  const scored = allRoutes.map((r) => ({
    route: r,
    score: computeScore(r, params.sortBy || "output"),
  }));
  scored.sort((a, b) => b.score - a.score);

  if (scored[0] && !scored[0].route.tags.includes("best-return")) {
    scored[0].route.tags.push("recommended");
  }

  // Sort by user preference
  return scored.map((s) => s.route);
}

function computeScore(
  route: Route,
  sortBy: "output" | "speed" | "fee"
): number {
  const outputScore = route.dstAmountUSD;
  const speedScore = Math.max(0, 1 - route.estimatedTime / 3600); // 0-1, faster is better
  const feeScore = Math.max(0, 1 - (route.totalFeeUSD + route.gasCostUSD) / 50); // normalize

  switch (sortBy) {
    case "output":
      return outputScore * 0.5 + speedScore * 10 + feeScore * 5;
    case "speed":
      return outputScore * 0.3 + speedScore * 15 + feeScore * 3;
    case "fee":
      return outputScore * 0.3 + speedScore * 5 + feeScore * 15;
    default:
      return outputScore * 0.5 + speedScore * 10 + feeScore * 5;
  }
}
