import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaWalletProvider } from "@/components/WalletProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Allowly - Pocket Money the Web3 Way",
    template: "%s | Allowly",
  },
  description:
    "Dead simple recurring allowances using Tributary. Parent wallet → child wallet, automated. No infrastructure, no database, no jobs. Just a clean UI that creates Tributary policies and lets the protocol handle the rest.",
  keywords: [
    "Allowly",
    "pocket money",
    "web3",
    "Solana",
    "Tributary",
    "USDC",
    "allowance",
    "automated payments",
    "recurring payments",
    "crypto",
    "blockchain",
    "parent",
    "child",
    "wallet",
    "subscription",
    "DeFi",
  ],
  authors: [{ name: "Allowly" }],
  creator: "Allowly",
  publisher: "Allowly",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://allowly.app",
    siteName: "Allowly",
    title: "Allowly - Pocket Money the Web3 Way",
    description:
      "Dead simple recurring allowances using Tributary. Parent wallet → child wallet, automated.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Allowly - Web3 Pocket Money",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Allowly - Pocket Money the Web3 Way",
    description:
      "Dead simple recurring allowances using Tributary. Parent wallet → child wallet, automated.",
    images: ["/og-image.png"],
    creator: "@allowly",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
        <Script
          defer
          data-domain="allowly.app"
          src="https://p.chainsquad.com/js/script.js"
        />
      </body>
    </html>
  );
}
