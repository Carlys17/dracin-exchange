import { NextRequest, NextResponse } from "next/server";

// LI.FI token balances API — returns all tokens + USD values
const LIFI_API = "https://li.quest/v1";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const address = sp.get("address");
  const chainId = sp.get("chainId");

  if (!address) {
    return NextResponse.json({ tokens: [] });
  }

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const apiKey = process.env.NEXT_PUBLIC_LIFI_API_KEY;
    if (apiKey) headers["x-lifi-api-key"] = apiKey;

    // Fetch token balances from LI.FI — this returns balances + USD values
    const url = chainId
      ? `${LIFI_API}/token/balances?walletAddress=${address}&chainId=${chainId}`
      : `${LIFI_API}/token/balances?walletAddress=${address}`;

    const res = await fetch(url, { headers, next: { revalidate: 30 } });

    if (!res.ok) {
      console.error("LI.FI balance API error:", res.status);
      return NextResponse.json({ tokens: [] });
    }

    const data = await res.json();

    // LI.FI returns: Record<chainId, Token[]> where each token has amount, priceUSD, etc.
    const tokens: any[] = [];

    if (data && typeof data === "object") {
      for (const [cid, tokenList] of Object.entries(data)) {
        if (!Array.isArray(tokenList)) continue;
        for (const t of tokenList) {
          if (!t.amount || t.amount === "0") continue;
          const balance = Number(t.amount) / 10 ** (t.decimals || 18);
          if (balance < 0.000001) continue;
          tokens.push({
            address: t.address || "0x0000000000000000000000000000000000000000",
            symbol: t.symbol,
            name: t.name,
            decimals: t.decimals || 18,
            chainId: parseInt(cid),
            logoURI: t.logoURI || "",
            priceUSD: t.priceUSD || 0,
            balance: balance,
            balanceRaw: t.amount,
            balanceUSD: balance * (t.priceUSD || 0),
          });
        }
      }
    }

    // Sort by USD value descending
    tokens.sort((a, b) => (b.balanceUSD || 0) - (a.balanceUSD || 0));

    return NextResponse.json({ tokens });
  } catch (err) {
    console.error("Balance fetch error:", err);
    return NextResponse.json({ tokens: [] });
  }
}

export const runtime = "edge";
