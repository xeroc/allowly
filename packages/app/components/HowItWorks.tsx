import React from "react";

const steps = [
  {
    number: 1,
    title: "Connect Wallet",
    description:
      "Parent connects their Web3 wallet to securely authenticate with Allowly.",
  },
  {
    number: 2,
    title: "Enter Child's Wallet",
    description:
      "Input the wallet address of the child who will receive the allowance.",
  },
  {
    number: 3,
    title: "Set Amount & Frequency",
    description:
      "Choose the USDC amount and how often payments should be sent.",
  },
  {
    number: 4,
    title: "Create Allowance Policy",
    description:
      "Deploy the policy to Tributary protocol and let automated payments begin.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set up automated pocket money in just a few simple steps. Allowly
            handles the rest through Tributary protocol.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-blue-600 text-white text-2xl font-bold rounded-full shadow-lg">
                {step.number}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {step.number < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
