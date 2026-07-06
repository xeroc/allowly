"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPolicies, PolicyListResult } from "@/lib/tributary";
import { PolicyCard } from "./PolicyCard";
import { usePolicyRefresh } from "@/components/PolicyRefreshContext";

export function PolicyList() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const { refreshKey } = usePolicyRefresh();
  const [policies, setPolicies] = useState<PolicyListResult>({
    subscriptions: [],
    userPaymentPubkey: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (!connected || !publicKey) {
        setPolicies({ subscriptions: [], userPaymentPubkey: null });
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const result = await getPolicies(wallet);
        setPolicies(result);
      } catch {
        setError("Could not load policies. Check your RPC connection.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [connected, publicKey, wallet, refreshKey]);

  if (!connected) return null;
  if (loading)
    return <div className="text-sm text-muted">Loading policies...</div>;
  if (error) return <div className="text-sm text-red-400/70">{error}</div>;
  if (policies.subscriptions.length === 0)
    return <div className="text-sm text-muted">No active allowances yet.</div>;

  return (
    <div>
      {policies.subscriptions.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}
