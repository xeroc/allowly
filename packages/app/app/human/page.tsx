"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UseCases from "@/components/UseCases";
import AppForm from "@/components/AppForm";
import Footer from "@/components/Footer";

export default function HumanPage() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Hero mode="human" />
      <HowItWorks mode="human" />
      <UseCases />
      <AppForm mode="human" />
      <Features />
      <Footer />
    </div>
  );
}
