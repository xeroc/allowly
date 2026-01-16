"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { CreatePolicyForm } from "@/components/CreatePolicyForm";
import { PolicyList } from "@/components/PolicyList";
import { PolicyRefreshProvider } from "@/components/PolicyRefreshContext";
import { fadeInUp } from "@/lib/animations";

export default function AppForm() {
  const { connected } = useWallet();

  return (
    <section className="py-24 px-4 bg-primary-dark" id="get-started">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-display font-semibold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Configure Your Subscription
          </motion.h2>
          <motion.p
            className="text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Create automated allowance policies for your family members. Set
            amounts, frequencies, and let the blockchain handle the rest.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-3xl" />
            <div className="relative glass rounded-3xl p-8">
              {connected && (
                <PolicyRefreshProvider>
                  <motion.div
                    className="grid grid-flow-row gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CreatePolicyForm />
                    <div className="h-px bg-accent/20 my-4" />
                    <PolicyList />
                  </motion.div>
                </PolicyRefreshProvider>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ConnectWallet />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
