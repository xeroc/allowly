"use client";

import React from "react";
import { motion } from "framer-motion";

const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Get Started", href: "#get-started" },
    { label: "Features", href: "#features" },
  ],
  resources: [
    {
      label: "Documentation",
      href: "https://docs.tributary.so",
      external: true,
    },
    { label: "Action Codes", href: "https://actioncode.app", external: true },
    {
      label: "Solana Cookbook",
      href: "https://solanacookbook.com",
      external: true,
    },
  ],
  community: [
    { label: "Telegram", href: "https://t.me/tributaryso", external: true },
    {
      label: "GitHub",
      href: "https://github.com/xeroc/allowly",
      external: true,
    },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  {
    name: "Twitter",
    href: "https://x.com/tributaryso",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/tributaryso",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/xeroc/allowly",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-accent/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20">
                    <svg
                      className="w-6 h-6 text-accent"
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
                  </div>
                  <span className="font-display text-xl font-semibold text-white">
                    Allowly
                  </span>
                </div>

                <p className="text-muted mb-6 leading-relaxed">
                  Pocket money, the web3 way. Set up automated USDC allowances
                  for your kids in seconds using Tributary protocol.
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">Powered by</span>
                  <a
                    href="https://tributary.so"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light font-medium transition-colors"
                  >
                    Tributary
                  </a>
                  <span className="text-muted">•</span>
                  <span className="text-muted">Non-custodial</span>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-lg glass text-muted hover:text-white hover:bg-accent/10 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Product
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-muted hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="text-sm text-muted hover:text-white transition-colors flex items-center gap-1"
                        >
                          {link.label}
                          {link.external && (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h3 className="text-sm font-semibold text-white mb-4">
                    Community
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks.community.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="text-sm text-muted hover:text-white transition-colors flex items-center gap-1"
                        >
                          {link.label}
                          {link.external && (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* <motion.div */}
                {/*   initial={{ opacity: 0, y: 20 }} */}
                {/*   whileInView={{ opacity: 1, y: 0 }} */}
                {/*   viewport={{ once: true }} */}
                {/*   transition={{ delay: 0.4, duration: 0.6 }} */}
                {/* > */}
                {/*   <h3 className="text-sm font-semibold text-white mb-4"> */}
                {/*     Legal */}
                {/*   </h3> */}
                {/*   <ul className="space-y-3"> */}
                {/*     {footerLinks.legal.map((link) => ( */}
                {/*       <li key={link.label}> */}
                {/*         <a */}
                {/*           href={link.href} */}
                {/*           className="text-sm text-muted hover:text-white transition-colors" */}
                {/*         > */}
                {/*           {link.label} */}
                {/*         </a> */}
                {/*       </li> */}
                {/*     ))} */}
                {/*   </ul> */}
                {/* </motion.div> */}
              </div>
            </div>
          </div>

          <motion.div
            className="mt-16 pt-8 border-t border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} Allowly. Built with 💗 on Solana
            </p>

            <div className="flex items-center gap-6 text-sm text-muted">
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent"
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
                Non-custodial
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent"
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
                1% Protocol Fee
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
