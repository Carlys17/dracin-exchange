import { NextRequest, NextResponse } from "next/server";
import { searchLiFiTokens } from "@/lib/adapters/lifi";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const chainId = parseInt(sp.get("chainId") || "1");
  const query = sp.get("query") || "";

  if (!query || query.length < 1) {
    return NextResponse.json({ tokens: [] });
  }

  try {
    const tokens = await searchLiFiTokens(chainId, query);
    return NextResponse.json({ tokens });
  } catch {
    return NextResponse.json({ tokens: [] });
  }
}

export const runtime = "edge";
