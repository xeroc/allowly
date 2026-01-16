"use client";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AppForm from "@/components/AppForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <AppForm />
      <Features />
    </div>
  );
}
