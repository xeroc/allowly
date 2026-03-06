"use client";

import { useMemo, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ActionCodesWalletAdapter, ActionCodesWalletName } from "@actioncodes/wallet-adapter";
import config from "@/constants";

// Instantiated once at module level to avoid re-registering the custom element
const acAdapter = new ActionCodesWalletAdapter({
  authToken: process.env.NEXT_PUBLIC_ACTIONCODES_AUTH_TOKEN || "",
  connection: config.rpcUrl,
  environment: "mainnet",
});

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint = config.rpcUrl;

  useEffect(() => {
    if (localStorage.getItem("walletName") === ActionCodesWalletName) {
      localStorage.removeItem("walletName");
    }
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      acAdapter,
      new SolflareWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={(adapter) => adapter.name !== ActionCodesWalletName}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
