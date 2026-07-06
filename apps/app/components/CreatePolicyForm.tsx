"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createAllowance } from "@/lib/tributary";
import { usePolicyRefresh } from "@/components/PolicyRefreshContext";
import { inputFocus } from "@/lib/animations";
import { FormActions } from "@/components/FormActions";
import { ActionCodesWalletName } from "@actioncodes/wallet-adapter";

type Frequency = "weekly" | "biweekly" | "monthly";

export function CreatePolicyForm({ compact = false }: { compact?: boolean }) {
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

      setStatus({ type: "success", message: "Allowance created successfully!" });
      setChildAddress("");
      setAmount("");
      setFrequency("weekly");
      triggerRefresh();
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
      {!c && <h2 className="text-xl font-semibold text-white">Create Allowance</h2>}

      <div className="space-y-1">
        <label htmlFor="childAddress" className={labelCls}>Recipient Wallet</label>
        <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
          <input
            id="childAddress"
            type="text"
            value={childAddress}
            onChange={(e) => setChildAddress(e.target.value)}
            placeholder="Solana wallet address"
            className={inputCls}
            required
            disabled={loading}
          />
        </motion.div>
      </div>

      <div className="space-y-1">
        <label htmlFor="amount" className={labelCls}>Amount</label>
        <div className="relative">
          <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
            <span className={`absolute ${c ? "left-3" : "left-4"} top-1/2 -translate-y-1/2 text-muted font-medium text-sm`}>$</span>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={`${inputCls} ${c ? "pl-7" : "pl-8"}`}
              required
              disabled={loading}
            />
          </motion.div>
          <span className={`absolute ${c ? "right-3" : "right-4"} top-1/2 -translate-y-1/2 text-xs text-muted`}>USDC</span>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="frequency" className={labelCls}>How often</label>
        <motion.div className="relative" variants={inputFocus} initial="rest" whileFocus="focus">
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
            className={selectCls}
            disabled={loading}
          >
            <option value="weekly" className="bg-primary-dark">Weekly</option>
            <option value="biweekly" className="bg-primary-dark">Every 2 weeks</option>
            <option value="monthly" className="bg-primary-dark">Monthly</option>
          </select>
          <div className={`absolute ${c ? "right-3" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none`}>
            <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
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

      <FormActions label="Create Allowance" loading={loading} hasError={status?.type === "error"} compact={c} />

      {!c && (
        <p className="text-xs text-muted text-center">
          Transactions are secured by Solana. You maintain full control.
        </p>
      )}
    </motion.form>
  );
}
