"use client";

import React from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/animations";

const features = [
  {
    title: "Set & Forget",
    description:
      "Automate recurring USDC allowances in seconds. Once set up, payments happen automatically on schedule — no manual transfers, no reminders, no hassle.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
        />
      </svg>
    ),
  },
  {
    title: "No Infrastructure",
    description:
      "Built on Tributary protocol — no servers, no databases, no complex backend. Everything runs on-chain, giving you true decentralization and reliability.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Parent Control",
    description:
      "You hold the keys — literally. Pause, adjust, or cancel allowances anytime. Funds never leave your custody. Complete peace of mind.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    title: "Wallet-Only Simplicity",
    description:
      "No accounts to create, no passwords to remember, no email required. Just connect your wallet and you're ready to go. It doesn't get simpler than this.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3.5 3.5 0 11-7 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 9m18 0V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v3"
        />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
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
            Everything you need for automated allowances
          </motion.h2>
          <motion.p
            className="text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Simple, secure, and built for the web3 generation. Allowly makes it
            effortless to give your kids financial freedom.
          </motion.p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative p-8 rounded-2xl glass"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover="hover"
              >
                <motion.div variants={hoverScale}>
                  <dt className="flex items-start gap-x-4 text-lg font-semibold leading-8 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent flex-shrink-0">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-muted">
                    {feature.description}
                  </dd>
                </motion.div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
