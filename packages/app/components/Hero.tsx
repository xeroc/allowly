import React from "react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-600/20">
            <span className="mr-2">🎉</span>
            Now open to everyone!
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Pocket money,{" "}
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-bold">
              reimagined
            </span>{" "}
            for the web3 generation
          </h1>

          <p className="mb-10 text-lg text-gray-600 sm:text-xl">
            Set up automated USDC allowances for your kids in seconds. Parent
            wallet controls everything — no apps, no approvals, just simple,
            reliable transfers via Tributary.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/#get-started"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get Started
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            <a
              href="/#how-it-works"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              Learn how it works
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Built on Tributary • Secure • No custody • Instant transfers
          </p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[800px] w-[800px] -translate-x-1/2 opacity-30 blur-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30" />
        </div>
      </div>
    </section>
  );
}
