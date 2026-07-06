"use client";

import { useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ActionCodesWalletName } from "@actioncodes/wallet-adapter";
import { motion } from "framer-motion";
import { buttonPress } from "@/lib/animations";

interface FormActionsProps {
  label: string;
  loading: boolean;
  hasError?: boolean;
  compact?: boolean;
}

export function FormActions({ label, loading, hasError, compact }: FormActionsProps) {
  const { connected, connecting, wallets, select, connect, disconnect, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingACSubmit = useRef(false);

  const acWallet = wallets.find((w) => w.adapter.name === ActionCodesWalletName);
  const acIcon = acWallet?.adapter.icon;

  const handleActionCode = () => {
    const form = containerRef.current?.closest("form");
    if (!form?.checkValidity()) {
      form?.requestSubmit();
      return;
    }
    pendingACSubmit.current = true;
    select(ActionCodesWalletName);
  };

  // When AC wallet becomes selected, connect
  useEffect(() => {
    if (pendingACSubmit.current && wallet?.adapter.name === ActionCodesWalletName && !connected) {
      connect().catch(() => { pendingACSubmit.current = false; });
    }
  }, [wallet]);

  // When connected after AC flow, auto-submit
  useEffect(() => {
    if (connected && pendingACSubmit.current) {
      pendingACSubmit.current = false;
      const form = containerRef.current?.closest("form");
      if (form?.checkValidity()) {
        form.requestSubmit();
      }
    }
  }, [connected]);

  const btnPrimary = compact
    ? "w-full relative overflow-hidden rounded-lg bg-accent py-2.5 text-sm text-white font-semibold shadow-glow disabled:opacity-50"
    : "w-full relative overflow-hidden rounded-xl bg-accent py-4 text-white font-semibold shadow-glow disabled:opacity-50";
  const btnSecondary = compact
    ? "w-full flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm text-white font-semibold shadow-glow hover:bg-accent-hover transition-colors disabled:opacity-50"
    : "w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-white font-semibold shadow-glow hover:bg-accent-hover transition-colors disabled:opacity-50";
  const btnAC = compact
    ? "w-full flex items-center justify-center gap-2 rounded-lg border border-accent/30 py-2.5 text-sm text-accent font-semibold hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    : "w-full flex items-center justify-center gap-2 rounded-xl border border-accent/30 py-4 text-accent font-semibold hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  if (connected) {
    const shortKey = publicKey
      ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
      : null;

    return (
      <div ref={containerRef} className="flex flex-col gap-2 !mt-5">
        <motion.button
          type="submit"
          disabled={loading}
          className={btnPrimary}
          variants={buttonPress}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {label}
              </>
            )}
          </span>
        </motion.button>

        <div className="flex items-center justify-between text-xs text-muted px-1">
          <span className="flex items-center gap-1.5">
            {wallet?.adapter.icon ? (
              <img src={wallet.adapter.icon} alt={wallet.adapter.name} width={14} height={14} className="rounded-sm" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            )}
            {wallet?.adapter.name}{shortKey ? ` · ${shortKey}` : ""}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2 !mt-5">
      <button
        type="submit"
        disabled={connecting}
        onClick={() => setVisible(true)}
        className={btnSecondary}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Sign with Wallet
      </button>

      <button
        type="button"
        disabled={connecting || hasError}
        onClick={handleActionCode}
        className={btnAC}
      >
        {acIcon ? (
          <img src={acIcon} alt="Action Codes" width={18} height={18} className="rounded-sm" />
        ) : null}
        {connecting ? "Connecting…" : "Use Action Code"}
      </button>
    </div>
  );
}
