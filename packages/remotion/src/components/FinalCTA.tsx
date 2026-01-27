import { interpolate, useCurrentFrame, spring } from "remotion";

export const FinalCTA = ({ startFrame }: { startFrame: number }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const containerScale = spring({
    frame: Math.max(0, frame - startFrame),
    fps: 30,
    config: { damping: 18, stiffness: 200, mass: 0.3 },
  });

  const headlineScale = spring({
    frame: Math.max(0, frame - startFrame - 8),
    fps: 30,
    config: { damping: 15, stiffness: 180, mass: 0.4 },
  });

  const buttonScale = spring({
    frame: Math.max(0, frame - startFrame - 4),
    fps: 30,
    config: { damping: 12, stiffness: 220, mass: 0.25 },
  });

  const glowIntensity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 0.5],
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          transform: `scale(${containerScale})`,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)",
            border: "2px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "36px",
            padding: "100px 120px",
            boxShadow: `0 0 80px rgba(16, 185, 129, ${0.2 + glowIntensity * 0.3}), 0 0 0 rgba(16, 185, 129, ${0.4 + glowIntensity * 0.5})`,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: 48,
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                transform: `scale(${headlineScale})`,
              }}
            >
              Your pocket money setup is ready.
            </h1>
          </div>

          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: 32,
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.6,
                transform: `scale(${buttonScale})`,
              }}
            >
              Start automating allowances in seconds.
            </p>
          </div>

          <a
            href="https://allowly.app"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
                color: "white",
                fontSize: 48,
                fontWeight: 700,
                padding: "32px 80px",
                transform: `scale(${buttonScale})`,
                letterSpacing: "0.02em",
              }}
            >
              https://allowly.app
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
