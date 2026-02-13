"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount, useSendTransaction, useSwitchChain,
  usePublicClient, useWalletClient,
} from "wagmi";
import { useSwapStore } from "@/store/swap-store";
import { toRawAmount, generateId } from "@/lib/utils";
import { Route, TrackedTransaction, Token } from "@/lib/types";
import { parseAbi, maxUint256, erc20Abi } from "viem";

const NATIVE_ADDRESSES = [
  "0x0000000000000000000000000000000000000000",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "",
];
const isNative = (addr?: string) => !addr || NATIVE_ADDRESSES.includes(addr.toLowerCase());

// ============================================================
// useQuote — debounced route fetching
// ============================================================
export function useQuote() {
  const { srcChain, dstChain, srcToken, dstToken, amount, slippage, setRoutes, setIsLoadingRoutes } = useSwapStore();
  const { address } = useAccount();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchQuotes = useCallback(async () => {
    if (!srcChain || !dstChain || !srcToken || !dstToken || !amount || parseFloat(amount) <= 0) {
      setRoutes([]); return;
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
    } catch { setRoutes([]); }
    finally { setIsLoadingRoutes(false); }
  }, [srcChain, dstChain, srcToken, dstToken, amount, slippage, address, setRoutes, setIsLoadingRoutes]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchQuotes, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [fetchQuotes]);

  return { refetch: fetchQuotes };
}

// ============================================================
// useSwapExecution — with ERC20 approval + swap
// This is how Jumper/Bungee work:
// 1. Switch chain if needed
// 2. Check ERC20 allowance
// 3. If insufficient, send approve tx
// 4. Build swap tx from adapter
// 5. Send swap tx
// 6. Poll for status
// ============================================================
export function useSwapExecution() {
  const { selectedRoute, srcToken, addTransaction, updateTransaction } = useSwapStore();
  const { address, chain } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [step, setStep] = useState<"idle" | "switching" | "approving" | "swapping" | "done">("idle");

  const execute = useCallback(async () => {
    if (!selectedRoute || !address || !walletClient) {
      throw new Error("No route selected or wallet not connected");
    }

    // Step 1: Switch chain if needed
    const srcChainId = selectedRoute.steps[0]?.srcChainId;
    if (chain?.id !== srcChainId) {
      setStep("switching");
      try {
        await switchChainAsync({ chainId: srcChainId });
      } catch (e: any) {
        setStep("idle");
        throw new Error("Please switch to the correct network in your wallet");
      }
      // Wait a bit for chain switch to propagate
      await new Promise(r => setTimeout(r, 1500));
    }

    // Step 2: Build transaction from adapter
    setStep("swapping");
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

    // Step 3: Check ERC20 approval (not needed for native tokens)
    const srcTokenAddr = selectedRoute.srcToken.address;
    if (!isNative(srcTokenAddr) && txData.to) {
      setStep("approving");
      try {
        const tokenAddr = srcTokenAddr as `0x${string}`;
        const spender = txData.to as `0x${string}`;

        // Read current allowance
        const allowance = await walletClient.readContract({
          address: tokenAddr,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address, spender],
        });

        const requiredAmount = BigInt(selectedRoute.srcAmount);

        if (allowance < requiredAmount) {
          // Need approval — approve max for convenience (like Jumper does)
          const approveTxHash = await walletClient.writeContract({
            address: tokenAddr,
            abi: erc20Abi,
            functionName: "approve",
            args: [spender, maxUint256],
          });

          // Wait for approval confirmation
          if (publicClient) {
            await publicClient.waitForTransactionReceipt({
              hash: approveTxHash,
              confirmations: 1,
            });
          } else {
            // Fallback: wait 5 seconds
            await new Promise(r => setTimeout(r, 5000));
          }
        }
      } catch (e: any) {
        setStep("idle");
        const msg = e?.shortMessage || e?.message || "";
        if (msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("denied")) {
          throw new Error("Token approval rejected");
        }
        // If allowance check fails, try to proceed anyway
        // (some tokens like native ETH don't need approval)
        console.warn("Approval check failed, proceeding:", e);
      }
    }

    // Step 4: Send swap transaction
    setStep("swapping");
    const txHash = await sendTransactionAsync({
      to: txData.to as `0x${string}`,
      data: txData.data as `0x${string}`,
      value: BigInt(txData.value || "0"),
      ...(txData.gasLimit ? { gas: BigInt(txData.gasLimit) } : {}),
    });

    // Step 5: Track transaction
    const tracked: TrackedTransaction = {
      id: generateId(),
      adapter: selectedRoute.adapter,
      route: selectedRoute,
      srcTxHash: txHash,
      status: "pending",
      startedAt: Date.now(),
      userAddress: address,
    };
    addTransaction(tracked);
    setStep("done");

    // Step 6: Start polling for bridge status
    pollStatus(tracked.id, txHash, selectedRoute);

    setTimeout(() => setStep("idle"), 3000);
    return txHash;
  }, [selectedRoute, srcToken, address, chain, walletClient, publicClient, sendTransactionAsync, switchChainAsync, addTransaction]);

  const pollStatus = useCallback(async (id: string, txHash: string, route: Route) => {
    let polls = 0;
    const check = async () => {
      if (polls >= 120) { updateTransaction(id, { status: "failed", error: "Timeout" }); return; }
      polls++;
      try {
        const params = new URLSearchParams({
          txHash, adapter: route.adapter,
          routeData: encodeURIComponent(JSON.stringify(route)),
        });
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

  return { execute, step };
}

// ============================================================
// useTokenSearch
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
// useWalletBalances — fetch from LI.FI
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
    } catch { setTokens([]); setTotalUSD(0); }
    finally { setLoading(false); }
  }, [address, isConnected, chainId]);

  useEffect(() => { fetchBalances(); }, [fetchBalances]);

  return { tokens, loading, totalUSD, refetch: fetchBalances };
}
