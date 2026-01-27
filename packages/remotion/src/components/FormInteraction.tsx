import { interpolate, useCurrentFrame } from "remotion";
import { typewriter } from "../utils/typewriter";
import { USDCIcon } from "./USDCIcon";

const walletAddress = "8zN...7kPm";
const amount = "50";
const frequency = "Weekly";

const CLICK_FRAME = 210;
const CLICK_HIGHLIGHT_DURATION = 15;

export const FormInteraction = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [230, 245], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const walletText = typewriter(walletAddress, frame, 105, 3);
  const amountText = typewriter(amount, frame, 150, 2);

  const clickProgress = interpolate(
    frame,
    [CLICK_FRAME, CLICK_FRAME + CLICK_HIGHLIGHT_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

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
      }}
    >
      <div
        style={{
          width: "550px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "28px",
          padding: "64px",
          transform: `scale(${fadeIn})`,
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              color: "white",
              fontSize: "18px",
              fontWeight: "500",
              marginBottom: "12px",
            }}
          >
            Recipient Wallet
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <USDCIcon />
            <input
              type="text"
              value={walletText}
              readOnly
              style={{
                marginLeft: "16px",
                color: "white",
                fontSize: "20px",
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              color: "white",
              fontSize: "18px",
              fontWeight: "500",
              marginBottom: "12px",
            }}
          >
            Amount
          </label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <span
              style={{
                color: "rgba(148, 163, 184, 1)",
                fontSize: "22px",
                fontWeight: "500",
              }}
            >
              $
            </span>
            <input
              type="text"
              value={amountText}
              readOnly
              style={{
                marginLeft: "12px",
                color: "white",
                fontSize: "20px",
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
              }}
            />
            <span style={{ color: "rgba(148, 163, 184, 1)", fontSize: "16px" }}>
              USDC
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              color: "white",
              fontSize: "18px",
              fontWeight: "500",
              marginBottom: "12px",
            }}
          >
            How often
          </label>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <span style={{ color: "white", fontSize: "20px" }}>
              {frequency}
            </span>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            background:
              frame >= CLICK_FRAME &&
              frame < CLICK_FRAME + CLICK_HIGHLIGHT_DURATION
                ? "linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)"
                : "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
            color: "white",
            fontSize: "20px",
            fontWeight: "600",
            padding: "20px",
            border:
              frame >= CLICK_FRAME &&
              frame < CLICK_FRAME + CLICK_HIGHLIGHT_DURATION
                ? "2px solid #6EE7B7"
                : "2px solid transparent",
            borderRadius: "14px",
            cursor: "pointer",
            boxShadow:
              frame >= CLICK_FRAME &&
              frame < CLICK_FRAME + CLICK_HIGHLIGHT_DURATION
                ? `0 0 ${20 + clickProgress * 10}px rgba(110, 231, 183, ${0.2 + clickProgress * 0.2})`
                : "0 4px 12px rgba(16, 185, 129, 0.2)",
          }}
        >
          Create Allowance
        </button>
      </div>
    </div>
  );
};
