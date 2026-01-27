import { AbsoluteFill } from "remotion";
import { Background } from "./components/Background";
import { ProcessSteps } from "./components/ProcessSteps";
import { FormInteraction } from "./components/FormInteraction";
import { SuccessState } from "./components/SuccessState";
import { EnhancedHeadline } from "./components/EnhancedHeadline";
import { FinalCTA } from "./components/FinalCTA";

export const MyComposition = () => {
  return (
    <AbsoluteFill>
      <Background />

      <EnhancedHeadline
        text="Automate pocket money in 4 simple steps"
        startFrame={0}
        endFrame={90}
        keywords={[
          { word: "Automate", color: "#10B981" },
          { word: "simple", color: "#14F195" },
        ]}
      />

      <ProcessSteps />

      <EnhancedHeadline
        text="Setup in under a minute. No account required."
        startFrame={90}
        endFrame={240}
        keywords={[{ word: "Setup", color: "#10B981" }]}
      />

      <FormInteraction />

      <EnhancedHeadline
        text="Done. Payments handle themselves."
        startFrame={240}
        endFrame={435}
        keywords={[{ word: "themselves.", color: "#10B981" }]}
      />

      <SuccessState />

      <FinalCTA startFrame={435} />
    </AbsoluteFill>
  );
};
