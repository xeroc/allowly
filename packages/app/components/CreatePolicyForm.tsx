"use client";

import { useState, FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createAllowance } from "@/lib/tributary";
import { usePolicyRefresh } from "@/components/PolicyRefreshContext";

type Frequency = "weekly" | "biweekly" | "monthly";

export function CreatePolicyForm() {
  const wallet = useWallet();
  const { triggerRefresh } = usePolicyRefresh();
  const [childAddress, setChildAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!wallet.connected || !wallet.publicKey) return;

    setLoading(true);
    setStatus(null);

    try {
      let childWallet: PublicKey;
      try {
        childWallet = new PublicKey(childAddress);
      } catch {
        throw new Error("Invalid wallet address");
      }

      const amountUSD = Number(amount);
      if (isNaN(amountUSD) || amountUSD <= 0) {
        throw new Error("Amount must be a positive number");
      }

      await createAllowance({
        parentWallet: wallet,
        childWallet,
        amountUSD,
        frequency,
      });

      setStatus({
        type: "success",
        message: "Allowance created successfully!",
      });
      setChildAddress("");
      setAmount("");
      setFrequency("weekly");
      triggerRefresh();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to create allowance",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!wallet.connected) {
    return (
      <div className="text-center py-8">
        Connect your wallet to create an allowance
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label
          htmlFor="childAddress"
          className="block text-sm font-medium  mb-1"
        >
          Child Wallet Address
        </label>
        <input
          id="childAddress"
          type="text"
          value={childAddress}
          onChange={(e) => setChildAddress(e.target.value)}
          placeholder="Enter Solana wallet address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium  mb-1">
          Amount (USD)
        </label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {status && (
        <div
          className={`p-3 rounded-md text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Allowance"}
      </button>
    </form>
  );
}
