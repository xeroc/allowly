"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createPayAsYouGo } from "@/lib/tributary";
import { inputFocus } from "@/lib/animations";
import { FormActions } from "@/components/FormActions";
import { ActionCodesWalletName } from "@actioncodes/wallet-adapter";

export function AgentPolicyForm({ compact = false }: { compact?: boolean }) {
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

  useEffect(() => {
    if (wallet.connected) setStatus(null);
  }, [wallet.connected]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!wallet.connected) {
      setStatus({ type: "error", message: "Connect your wallet or use Action Code below to continue." });
      return;
    }

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

      if (isNaN(budgetUSD) || budgetUSD <= 0 || isNaN(perClaimUSD) || perClaimUSD <= 0 || isNaN(days) || days <= 0) {
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

      setStatus({ type: "success", message: "Agent allowance created! Agent can now claim funds within limits." });
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
      if (wallet.wallet?.adapter.name === ActionCodesWalletName) {
        wallet.disconnect().catch(() => {});
      }
    }
  }

  const c = compact;
  const inputCls = c
    ? "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-muted focus:outline-none transition-all duration-200"
    : "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted focus:outline-none transition-all duration-200";
  const selectCls = c
    ? "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
    : "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none transition-all duration-200 appearance-none cursor-pointer";
  const labelCls = "block text-xs font-medium text-white/70";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={c ? "space-y-3" : "space-y-6"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {!c && <h2 className="text-xl font-semibold text-white">Create Agent Allowance</h2>}

      <div className="space-y-1">
        <label htmlFor="agentAddress" className={labelCls}>Agent Wallet Address</label>
        <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
          <input
            id="agentAddress"
            type="text"
            value={agentAddress}
            onChange={(e) => setAgentAddress(e.target.value)}
            placeholder="Solana wallet address"
            className={inputCls}
            required
            disabled={loading}
          />
        </motion.div>
      </div>

      <div className={c ? "grid grid-cols-2 gap-2" : "space-y-6"}>
        <div className="space-y-1">
          <label htmlFor="maxBudget" className={labelCls}>Total Budget</label>
          <div className="relative">
            <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
              <span className={`absolute ${c ? "left-3" : "left-4"} top-1/2 -translate-y-1/2 text-muted font-medium text-sm`}>$</span>
              <input
                id="maxBudget"
                type="number"
                min="0.01"
                step="0.01"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="0.00"
                className={`${inputCls} ${c ? "pl-6" : "pl-8"}`}
                required
                disabled={loading}
              />
            </motion.div>
            {!c && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">USDC</span>}
          </div>
          {!c && <p className="text-xs text-muted mt-1">Total amount agent can claim within period</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="maxPerClaim" className={labelCls}>Max Per Claim</label>
          <div className="relative">
            <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
              <span className={`absolute ${c ? "left-3" : "left-4"} top-1/2 -translate-y-1/2 text-muted font-medium text-sm`}>$</span>
              <input
                id="maxPerClaim"
                type="number"
                min="0.01"
                step="0.01"
                value={maxPerClaim}
                onChange={(e) => setMaxPerClaim(e.target.value)}
                placeholder="0.00"
                className={`${inputCls} ${c ? "pl-6" : "pl-8"}`}
                required
                disabled={loading}
              />
            </motion.div>
            {!c && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">USDC</span>}
          </div>
          {!c && <p className="text-xs text-muted mt-1">Maximum amount agent can claim in a single transaction</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="periodDays" className={labelCls}>Period Length</label>
        <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
          <select
            id="periodDays"
            value={periodDays}
            onChange={(e) => setPeriodDays(e.target.value)}
            className={selectCls}
            disabled={loading}
          >
            <option value="7" className="bg-primary-dark">7 Days</option>
            <option value="30" className="bg-primary-dark">30 Days</option>
            <option value="90" className="bg-primary-dark">90 Days</option>
          </select>
          <div className={`absolute ${c ? "right-3" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none`}>
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
        {!c && <p className="text-xs text-muted mt-1">Budget resets after this period</p>}
      </div>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-lg text-xs px-3 py-2 ${
              status.type === "success"
                ? "bg-accent/10 border border-accent/20 text-accent"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            <p className="break-words">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <FormActions label="Create Agent Allowance" loading={loading} hasError={status?.type === "error"} compact={c} />

      {!c && (
        <p className="text-xs text-muted text-center">
          Agent will autonomously claim funds within limits. Transactions secured by Solana.
        </p>
      )}
    </motion.form>
  );
}
