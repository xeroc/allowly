"use client";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,

  { ssr: false },
);

export function ConnectWallet() {
  return (
    <div className="text-center max-w-md mx-auto mt-4">
      <WalletMultiButtonDynamic className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors" />
    </div>
  );
}
