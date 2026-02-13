import { NextRequest, NextResponse } from "next/server";
import { findBestRoutes } from "@/lib/routing/optimizer";
import { QuoteRequest } from "@/lib/types";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const srcChainId = parseInt(sp.get("srcChainId") || "0");
  const dstChainId = parseInt(sp.get("dstChainId") || "0");
  const srcToken = sp.get("srcToken") || "";
  const dstToken = sp.get("dstToken") || "";
  const amount = sp.get("amount") || "0";
  const userAddress = sp.get("userAddress") || "";
  const slippage = parseFloat(sp.get("slippage") || "0.03");
  const sortBy = (sp.get("sortBy") as "output" | "speed" | "fee") || "output";

  if (!srcChainId || !dstChainId || !srcToken || !dstToken || !amount || amount === "0") {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  try {
    const params: QuoteRequest = {
      srcChainId,
      dstChainId,
      srcToken,
      dstToken,
      amount,
      userAddress: userAddress || "0x0000000000000000000000000000000000000000",
      slippage,
      sortBy,
    };

    const routes = await findBestRoutes(params);

    return NextResponse.json({
      routes,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch quotes", routes: [] },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
