"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import { AgentPolicyForm } from "@/components/AgentPolicyForm";
import Footer from "@/components/Footer";

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Hero mode="agent" />
      <HowItWorks mode="agent" />
      <AgentPolicyForm />
      <Features />
      <Footer />
    </div>
  );
}
