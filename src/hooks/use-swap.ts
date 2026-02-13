"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { useSwapStore } from "@/store/swap-store";
import { toRawAmount, generateId } from "@/lib/utils";
import { Route, TrackedTransaction, Token } from "@/lib/types";

// ============================================================
// useQuote — debounced route fetching
// ============================================================
export function useQuote() {
  const { srcChain, dstChain, srcToken, dstToken, amount, slippage, setRoutes, setIsLoadingRoutes } = useSwapStore();
  const { address } = useAccount();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchQuotes = useCallback(async () => {
    if (!srcChain || !dstChain || !srcToken || !dstToken || !amount || parseFloat(amount) <= 0) {
      setRoutes([]);
      return;
    }
    setIsLoadingRoutes(true);
    try {
      const rawAmount = toRawAmount(amount, srcToken.decimals);
      const params = new URLSearchParams({
        srcChainId: srcChain.id.toString(),
        dstChainId: dstChain.id.toString(),
        srcToken: srcToken.address,
        dstToken: dstToken.address,
        amount: rawAmount,
        userAddress: address || "0x0000000000000000000000000000000000000000",
        slippage: slippage.toString(),
      });
      const res = await fetch(`/api/quote?${params}`);
      const data = await res.json();
      setRoutes(data.routes || []);
    } catch {
      setRoutes([]);
    } finally {
      setIsLoadingRoutes(false);
    }
  }, [srcChain, dstChain, srcToken, dstToken, amount, slippage, address, setRoutes, setIsLoadingRoutes]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchQuotes, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fetchQuotes]);

  return { refetch: fetchQuotes };
}

// ============================================================
// useSwapExecution — handles the actual swap transaction
// ============================================================
export function useSwapExecution() {
  const { selectedRoute, addTransaction, updateTransaction } = useSwapStore();
  const { address, chain } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  const execute = useCallback(async () => {
    if (!selectedRoute || !address) throw new Error("No route or wallet");

    const srcChainId = selectedRoute.steps[0]?.srcChainId;
    if (chain?.id !== srcChainId) {
      await switchChainAsync({ chainId: srcChainId });
    }

    let txData;
    if (selectedRoute.adapter === "lifi") {
      const { buildLiFiTransaction } = await import("@/lib/adapters/lifi");
      txData = await buildLiFiTransaction(selectedRoute);
    } else if (selectedRoute.adapter === "socket") {
      const { buildSocketTransaction } = await import("@/lib/adapters/socket");
      txData = await buildSocketTransaction(selectedRoute);
    } else {
      throw new Error(`Unknown adapter: ${selectedRoute.adapter}`);
    }

    const txHash = await sendTransactionAsync({
      to: txData.to as `0x${string}`,
      data: txData.data as `0x${string}`,
      value: BigInt(txData.value || "0"),
    });

    const tracked: TrackedTransaction = {
      id: generateId(), adapter: selectedRoute.adapter, route: selectedRoute,
      srcTxHash: txHash, status: "pending", startedAt: Date.now(), userAddress: address,
    };
    addTransaction(tracked);
    pollStatus(tracked.id, txHash, selectedRoute);
    return txHash;
  }, [selectedRoute, address, chain, sendTransactionAsync, switchChainAsync, addTransaction]);

  const pollStatus = useCallback(async (id: string, txHash: string, route: Route) => {
    let polls = 0;
    const check = async () => {
      if (polls >= 120) { updateTransaction(id, { status: "failed", error: "Timeout" }); return; }
      polls++;
      try {
        const params = new URLSearchParams({ txHash, adapter: route.adapter, routeData: encodeURIComponent(JSON.stringify(route)) });
        const res = await fetch(`/api/status?${params}`);
        const status = await res.json();
        updateTransaction(id, { status: status.status, dstTxHash: status.dstTxHash });
        if (status.status === "completed" || status.status === "failed") {
          updateTransaction(id, { completedAt: Date.now() }); return;
        }
      } catch {}
      setTimeout(check, 15_000);
    };
    setTimeout(check, 10_000);
  }, [updateTransaction]);

  return { execute };
}

// ============================================================
// useTokenSearch — search tokens by chain
// ============================================================
export function useTokenSearch() {
  const search = useCallback(async (chainId: number, query: string) => {
    if (!query || query.length < 1) return [];
    const res = await fetch(`/api/tokens?chainId=${chainId}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.tokens || [];
  }, []);

  return { search };
}

// ============================================================
// useWalletBalances — fetch all token balances with USD from LI.FI
// ============================================================
export interface WalletToken extends Token {
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
}

export function useWalletBalances(chainId?: number) {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUSD, setTotalUSD] = useState(0);

  const fetchBalances = useCallback(async () => {
    if (!address || !isConnected) { setTokens([]); setTotalUSD(0); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ address });
      if (chainId) params.set("chainId", chainId.toString());
      const res = await fetch(`/api/balances?${params}`);
      const data = await res.json();
      const list: WalletToken[] = data.tokens || [];
      setTokens(list);
      setTotalUSD(list.reduce((sum: number, t: WalletToken) => sum + (t.balanceUSD || 0), 0));
    } catch {
      setTokens([]); setTotalUSD(0);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, chainId]);

  useEffect(() => { fetchBalances(); }, [fetchBalances]);

  return { tokens, loading, totalUSD, refetch: fetchBalances };
}
