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
    payAsYouGo: [],
    userPaymentPubkey: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!connected || !publicKey) {
        setPolicies({
          subscriptions: [],
          payAsYouGo: [],
          userPaymentPubkey: null,
        });
        setLoading(false);
        return;
      }
      const result = await getPolicies(wallet);
      setPolicies(result);
      setLoading(false);
    }
    fetch();
  }, [connected, publicKey, wallet, refreshKey]);

  if (!connected) return null;
  if (loading) return <div>Loading policies...</div>;
  if (policies.subscriptions.length === 0)
    return <div>No active allowances</div>;

  return (
    <div>
      {policies.subscriptions.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}
