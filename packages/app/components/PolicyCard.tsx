"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  pausePolicy,
  resumePolicy,
  cancelPolicy,
  SubscriptionPolicy,
} from "@/lib/tributary";
import { usePolicyRefresh } from "@/components/PolicyRefreshContext";
import { buttonPress, hoverScale } from "@/lib/animations";

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
    <motion.div
      className="relative p-6 rounded-2xl glass border border-accent/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
    >
      <motion.div variants={hoverScale}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                status === "active"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "active" ? "bg-accent" : "bg-yellow-400"
                }`}
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-semibold text-white">
              ${(policy.amount.toNumber() / 1_000_000).toFixed(2)}
            </div>
            <div className="text-sm text-muted">USDC</div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-accent/10">
            <span className="text-sm text-muted">Recipient</span>
            <span className="font-mono text-sm text-white">
              {policy.to.toString().slice(0, 8)}...
              {policy.to.toString().slice(-4)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-accent/10">
            <span className="text-sm text-muted">Frequency</span>
            <span className="text-sm text-white">
              {formatFrequency(policy.frequency)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-accent/10">
            <span className="text-sm text-muted">Next Payment</span>
            <span className="text-sm text-white">
              {nextPaymentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {status === "active" ? (
            <motion.button
              onClick={handlePause}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors text-sm font-medium"
              variants={buttonPress}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              </svg>
              Pause
            </motion.button>
          ) : (
            <motion.button
              onClick={handleResume}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors text-sm font-medium"
              variants={buttonPress}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
              Resume
            </motion.button>
          )}
          <motion.button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm font-medium"
            variants={buttonPress}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
