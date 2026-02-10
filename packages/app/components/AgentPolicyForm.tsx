"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createPayAsYouGo } from "@/lib/tributary";
import { buttonPress, inputFocus } from "@/lib/animations";

export function AgentPolicyForm() {
  const wallet = useWallet();
  const [agentAddress, setAgentAddress] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [maxPerClaim, setMaxPerClaim] = useState("");
  const [periodDays, setPeriodDays] = useState("30");
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
      let agentWallet: PublicKey;
      try {
        agentWallet = new PublicKey(agentAddress);
      } catch {
        throw new Error("Invalid wallet address");
      }

      const budgetUSD = Number(maxBudget);
      const perClaimUSD = Number(maxPerClaim);
      const days = Number(periodDays);

      if (
        isNaN(budgetUSD) ||
        budgetUSD <= 0 ||
        isNaN(perClaimUSD) ||
        perClaimUSD <= 0 ||
        isNaN(days) ||
        days <= 0
      ) {
        throw new Error("All values must be positive numbers");
      }

      if (perClaimUSD > budgetUSD) {
        throw new Error("Max per claim cannot exceed total budget");
      }

      await createPayAsYouGo({
        humanWallet: wallet,
        agentWallet,
        maxBudget: budgetUSD,
        maxPerClaim: perClaimUSD,
        periodDays: days,
      });

      setStatus({
        type: "success",
        message:
          "Agent allowance created successfully! Agent can now claim funds within limits.",
      });
      setAgentAddress("");
      setMaxBudget("");
      setMaxPerClaim("");
      setPeriodDays("30");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to create allowance",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!wallet.connected) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <p className="text-muted">
            Connect your wallet to create an agent allowance
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="space-y-1">
        <label htmlFor="agentAddress" className="block text-sm font-medium text-white">
          Agent Wallet Address
        </label>
        <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
          <input
            id="agentAddress"
            type="text"
            value={agentAddress}
            onChange={(e) => setAgentAddress(e.target.value)}
            placeholder="Solana wallet address"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none transition-all duration-200"
            required
            disabled={loading}
          />
        </motion.div>
      </div>

      <div className="space-y-1">
        <label htmlFor="maxBudget" className="block text-sm font-medium text-white">
          Total Budget (USDC)
        </label>
        <div className="relative">
          <motion.div
            className="relative"
            variants={inputFocus}
            initial="rest"
            whileFocus="focus"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
              $
            </span>
            <input
              id="maxBudget"
              type="number"
              min="0.01"
              step="0.01"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none transition-all duration-200"
              required
              disabled={loading}
            />
          </motion.div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
            USDC
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          Total amount agent can claim within period
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="maxPerClaim" className="block text-sm font-medium text-white">
          Max Per Claim (USDC)
        </label>
        <div className="relative">
          <motion.div
            className="relative"
            variants={inputFocus}
            initial="rest"
            whileFocus="focus"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
              $
            </span>
            <input
              id="maxPerClaim"
              type="number"
              min="0.01"
              step="0.01"
              value={maxPerClaim}
              onChange={(e) => setMaxPerClaim(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none transition-all duration-200"
              required
              disabled={loading}
            />
          </motion.div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
            USDC
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          Maximum amount agent can claim in a single transaction
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="periodDays" className="block text-sm font-medium text-white">
          Period Length (Days)
        </label>
        <motion.div
          className="relative"
          variants={inputFocus}
          initial="rest"
          whileFocus="focus"
        >
          <select
            id="periodDays"
            value={periodDays}
            onChange={(e) => setPeriodDays(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value="7" className="bg-primary-dark">
              7 Days
            </option>
            <option value="30" className="bg-primary-dark">
              30 Days
            </option>
            <option value="90" className="bg-primary-dark">
              90 Days
            </option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </motion.div>
        <p className="text-xs text-muted mt-1">
          Budget resets after this period
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={`p-4 rounded-xl text-sm ${
              status.type === "success"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {status.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {status.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full relative overflow-hidden rounded-xl bg-accent py-4 text-white font-semibold shadow-glow disabled:opacity-50"
        variants={buttonPress}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Create Agent Allowance
            </>
          )}
        </span>
      </motion.button>

      <p className="text-xs text-muted text-center">
        Agent will autonomously claim funds within limits. Transactions secured by
        Solana.
      </p>
    </motion.form>
  );
}
