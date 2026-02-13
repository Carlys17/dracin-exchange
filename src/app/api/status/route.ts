import { NextRequest, NextResponse } from "next/server";
import { getLiFiStatus } from "@/lib/adapters/lifi";
import { getSocketStatus } from "@/lib/adapters/socket";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const txHash = sp.get("txHash") || "";
  const adapter = sp.get("adapter") || "";
  const routeData = sp.get("routeData") || "";

  if (!txHash || !adapter) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    let route;
    try {
      route = JSON.parse(decodeURIComponent(routeData));
    } catch {
      route = { steps: [{}] };
    }

    let status;
    if (adapter === "lifi") {
      status = await getLiFiStatus(txHash, route);
    } else if (adapter === "socket") {
      status = await getSocketStatus(txHash, route);
    } else {
      return NextResponse.json({ error: "Unknown adapter" }, { status: 400 });
    }

    return NextResponse.json(status);
  } catch (err) {
    console.error("Status API error:", err);
    return NextResponse.json({ status: "pending", srcTxHash: txHash });
  }
}

export const runtime = "edge";
