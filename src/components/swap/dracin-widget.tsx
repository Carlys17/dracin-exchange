"use client";

import type { WidgetConfig } from "@lifi/widget";
import { LiFiWidget } from "@lifi/widget";
import { useMemo } from "react";

const FEE_COLLECTOR = process.env.NEXT_PUBLIC_FEE_COLLECTOR || "";
const FEE_PERCENT = parseFloat(process.env.NEXT_PUBLIC_FEE_PERCENT || "0") / 100;
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export function DracinWidget() {
  const config: WidgetConfig = useMemo(
    () => ({
      appearance: "dark",
      variant: "compact",
      ...(FEE_PERCENT > 0 ? { fee: FEE_PERCENT } : {}),
      walletConfig: {
        walletConnect: WC_PROJECT_ID ? { projectId: WC_PROJECT_ID } : undefined,
      },
      fromChain: 42161,
      toChain: 8453,
      slippage: 0.03,
      hiddenUI: ["poweredBy", "language", "appearance"],
      theme: {
        container: {
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(232,227,243,0.06)",
          maxWidth: "460px",
        },
        palette: {
          primary: { main: "#c8a84e" },
          secondary: { main: "#a78bfa" },
          background: {
            default: "#0c0a14",
            paper: "#1a1525",
          },
          text: {
            primary: "#e8e3f3",
            secondary: "#9b93ab",
          },
          grey: {
            200: "#2a2236",
            300: "#352c44",
            700: "#7a6f8a",
            800: "#e8e3f3",
          },
        },
        shape: {
          borderRadius: 12,
          borderRadiusSecondary: 8,
          borderRadiusTertiary: 20,
        },
        typography: {
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      },
    }),
    []
  );

  return <LiFiWidget integrator="dracin-exchange" config={config} />;
}
