import { interpolate, useCurrentFrame } from "remotion";
import { SolanaLogo } from "./SolanaLogo";
import { USDCIcon } from "./USDCIcon";

const steps = [
  {
    icon: <SolanaLogo />,
    title: "Connect Wallet",
    description: "Secure Web3 authentication",
  },
  {
    icon: <USDCIcon />,
    title: "Enter Child's Wallet",
    description: "Input recipient address",
  },
  {
    icon: <USDCIcon />,
    title: "Set Amount & Frequency",
    description: "Weekly, bi-weekly, monthly",
  },
  {
    icon: <USDCIcon />,
    title: "Create Allowance",
    description: "Automated payments on Solana",
  },
];

export const ProcessSteps = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [85, 95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "48px",
          padding: "80px",
          maxWidth: "1100px",
          transform: `scale(${scale})`,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              padding: "48px",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "20px",
              opacity: interpolate(
                frame,
                [index * 12, index * 12 + 15],
                [0, 1],
                { extrapolateRight: "clamp" },
              ),
              transform: `translateY(${interpolate(frame, [index * 12, index * 12 + 15], [30, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "16px",
                marginBottom: "20px",
              }}
            >
              {step.icon}
            </div>
            <div
              style={{
                color: "rgba(16, 185, 129, 0.2)",
                fontSize: "42px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                color: "white",
                fontSize: "28px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              {step.title}
            </div>
            <div
              style={{
                color: "rgba(148, 163, 184, 1)",
                fontSize: "20px",
                lineHeight: "1.6",
              }}
            >
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
