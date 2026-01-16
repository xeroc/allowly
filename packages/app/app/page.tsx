"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { CreatePolicyForm } from "@/components/CreatePolicyForm";
import { PolicyList } from "@/components/PolicyList";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />

      <ConnectWallet />

      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Configure Your Subscription
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Create automated allowance policies for your family members. Set
          amounts, frequencies, and let the blockchain handle the rest.
        </p>
        <CreatePolicyForm />
        {connected && <PolicyList />}
      </section>
    </div>
  );
}
