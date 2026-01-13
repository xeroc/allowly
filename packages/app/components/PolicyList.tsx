"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPolicies, PolicyListResult } from "@/lib/tributary";
import { PolicyCard } from "./PolicyCard";

export function PolicyList() {
  const wallet = useWallet();
  const { connected, publicKey } = wallet;
  const [policies, setPolicies] = useState<PolicyListResult>({
    policies: [],
    userPaymentPubkey: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!connected || !publicKey) {
        setPolicies({ policies: [], userPaymentPubkey: null });
        setLoading(false);
        return;
      }
      const result = await getPolicies(wallet);
      setPolicies(result);
      setLoading(false);
    }
    fetch();
  }, [connected, publicKey, wallet]);

  if (!connected) return null;
  if (loading) return <div>Loading policies...</div>;
  if (policies.policies.length === 0) return <div>No active allowances</div>;

  return (
    <div>
      {policies.policies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  );
}
