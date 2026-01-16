"user client";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { CreatePolicyForm } from "@/components/CreatePolicyForm";
import { PolicyList } from "@/components/PolicyList";

export default function AppForm() {
  const { connected } = useWallet();

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Configure Your Subscription
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Create automated allowance policies for your family members. Set
        amounts, frequencies, and let the blockchain handle the rest.
      </p>
      <div className="text-center max-w-md mx-auto">
        {connected && (
          <div className="grid grid-flow-row gap-4">
            <CreatePolicyForm />
            <PolicyList />
          </div>
        )}

        <ConnectWallet />
      </div>
    </section>
  );
}
