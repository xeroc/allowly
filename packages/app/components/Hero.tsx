"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInUpStagger,
  buttonPress,
  floatingAnimation,
} from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark">
      <div className="absolute inset-0 bg-mesh" />

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate="animate"
        variants={floatingAnimation}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl"
        animate="animate"
        variants={{
          animate: {
            y: [0, 15, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          },
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUpStagger}
        >
          <motion.div className="mb-8" variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-accent-light border border-accent/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Now open to everyone
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-white leading-tight"
            variants={fadeInUp}
          >
            Pocket money,{" "}
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-bold">
              reimagined
            </span>{" "}
            for the
            <br className="hidden sm:block" />
            <span className="text-gradient-subtle">web3 generation</span>
          </motion.h1>

          <motion.p
            className="mb-10 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Set up automated USDC allowances for your kids in seconds. Parent
            wallet controls everything — no apps, no approvals, just simple,
            reliable transfers via Tributary.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8"
            variants={fadeInUp}
          >
            <motion.a
              href="/#get-started"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-glow hover:bg-accent-hover transition-colors"
              variants={buttonPress}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.a>

            <motion.a
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl glass px-8 py-4 text-base font-semibold text-white glass-hover"
              variants={buttonPress}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Learn how it works
            </motion.a>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted"
            variants={fadeInUp}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Secure
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              No custody
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Instant transfers
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </section>
  );
}
