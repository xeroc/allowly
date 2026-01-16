"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  pausePolicy,
  resumePolicy,
  cancelPolicy,
  SubscriptionPolicy,
} from "@/lib/tributary";
import { usePolicyRefresh } from "@/components/PolicyRefreshContext";

interface PolicyCardProps {
  policy: SubscriptionPolicy;
}

function formatFrequency(frequency: SubscriptionPolicy["frequency"]): string {
  if ("daily" in frequency) return "Daily";
  if ("weekly" in frequency) return "Weekly";
  if ("monthly" in frequency) return "Monthly";
  if ("custom" in frequency) return "Custom";
  return "Unknown";
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const wallet = useWallet();
  const { triggerRefresh } = usePolicyRefresh();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(policy.status);

  const handlePause = async () => {
    if (!wallet.connected) return;
    setLoading(true);
    try {
      await pausePolicy(wallet, policy.id);
      setStatus("paused");
    } catch (error) {
      console.error("Failed to pause policy:", error);
    }
    setLoading(false);
  };

  const handleResume = async () => {
    if (!wallet.connected) return;
    setLoading(true);
    try {
      await resumePolicy(wallet, policy.id);
      setStatus("active");
    } catch (error) {
      console.error("Failed to resume policy:", error);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!wallet.connected) return;
    setLoading(true);
    try {
      await cancelPolicy(wallet, policy.id);
      triggerRefresh();
    } catch (error) {
      console.error("Failed to cancel policy:", error);
    }
    setLoading(false);
  };

  const isLoading = loading || !wallet.connected;
  const nextPaymentDate = new Date(policy.nextPaymentDue.toNumber() * 1000);

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white mb-2">
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">Recipient:</span>
          <span className="ml-2 font-mono text-sm">
            {policy.to.toString().slice(0, 8)}...
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Amount:</span>
          <span className="ml-2 font-medium">
            ${(policy.amount.toNumber() / 1_000_000).toFixed(2)} USDC
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Frequency:</span>
          <span className="ml-2">{formatFrequency(policy.frequency)}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Next Payment:</span>
          <span className="ml-2">{nextPaymentDate.toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Status:</span>
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {status === "active" ? (
          <button
            onClick={handlePause}
            disabled={isLoading}
            className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            disabled={isLoading}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Resume
          </button>
        )}
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
