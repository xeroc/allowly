"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { CreatePolicyForm } from "@/components/CreatePolicyForm";
import { PolicyList } from "@/components/PolicyList";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import { WaitlistForm } from "./components/WaitlistForm";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <WaitlistForm />

      {connected && (
        <section className="py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Your Allowances
          </h2>
          <ConnectWallet />
          <CreatePolicyForm />
          <PolicyList />
        </section>
      )}
    </div>
  );
}
