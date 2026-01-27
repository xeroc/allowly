import { interpolate, useCurrentFrame, spring } from "remotion";
import { USDCIcon } from "./USDCIcon";

export const SuccessState = () => {
  const frame = useCurrentFrame();
  const checkmarkOpacity = interpolate(frame, [255, 285], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkmarkScale = spring({
    frame: Math.max(0, frame - 255),
    fps: 30,
    config: { damping: 15, stiffness: 150, mass: 0.4 },
  });

  const cardScale = spring({
    frame: Math.max(0, frame - 240),
    fps: 30,
    config: { damping: 18, stiffness: 120, mass: 0.4 },
  });

  const fadeOut = interpolate(frame, [425, 435], [1, 0], {
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
      }}
    >
      <div
        style={{
          width: "550px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "28px",
          padding: "64px",
          transform: `scale(${cardScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "20px",
            margin: "0 auto 40px",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 48 48"
            fill="none"
            style={{
              opacity: checkmarkOpacity,
              transform: `scale(${checkmarkScale})`,
            }}
          >
            <circle cx="24" cy="24" r="24" fill="#10B981" />
            <path
              d="M16 24L21 29L32 18"
              stroke="white"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2
          style={{
            color: "white",
            fontSize: "36px",
            fontWeight: "600",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Allowance Created!
        </h2>

        <p
          style={{
            color: "rgba(148, 163, 184, 1)",
            fontSize: "20px",
            lineHeight: "1.6",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          $50 USDC will transfer weekly to 8zN...7kPm
        </p>

        <div
          style={{
            padding: "32px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <USDCIcon />
            <div style={{ marginLeft: "16px", flex: 1 }}>
              <div
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                To: 8zN...7kPm
              </div>
              <div
                style={{ color: "rgba(148, 163, 184, 1)", fontSize: "16px" }}
              >
                Next payment: <span style={{ color: "#10B981" }}>Tomorrow</span>
              </div>
            </div>
          </div>

          <div
            style={{
              height: "1px",
              background: "rgba(148, 163, 184, 0.1)",
              margin: "20px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "rgba(148, 163, 184, 1)",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Amount
              </div>
              <div
                style={{ color: "white", fontSize: "26px", fontWeight: "600" }}
              >
                $50 USDC
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "rgba(148, 163, 184, 1)",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Frequency
              </div>
              <div
                style={{ color: "white", fontSize: "26px", fontWeight: "600" }}
              >
                Weekly
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(148, 163, 184, 1)",
              fontSize: "16px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#10B981" }}
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Secure
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(148, 163, 184, 1)",
              fontSize: "16px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#10B981" }}
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            On-chain
          </div>
        </div>
      </div>
    </div>
  );
};
