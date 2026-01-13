"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

export function ConnectWallet() {
  const { connected } = useWallet();

  return connected ? (
    <div className="flex gap-2">
      <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors" />
      <WalletDisconnectButton className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors" />
    </div>
  ) : (
    <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
      Connect Wallet
    </WalletMultiButton>
  );
}
