"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AppForm from "@/components/AppForm";

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Hero mode="agent" />
      <HowItWorks mode="agent" />
      <AppForm mode="agent" />
      <Features />
      <Footer />
    </div>
  );
}
