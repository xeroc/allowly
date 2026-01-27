import { interpolate, useCurrentFrame, spring } from "remotion";

interface CallToActionProps {
  text: string;
  url: string;
  startFrame: number;
}

export const CallToAction = ({ text, url, startFrame }: CallToActionProps) => {
  const frame = useCurrentFrame();

  const scale = spring({
    frame: Math.max(0, frame - startFrame),
    fps: 30,
    config: { damping: 20, stiffness: 150, mass: 0.5 },
  });

  const linkScale = spring({
    frame: Math.max(0, frame - startFrame - 15),
    fps: 30,
    config: { damping: 18, stiffness: 140, mass: 0.6 },
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        pointerEvents: "none",
        zIndex: 200,
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(10, 15, 28, 0.6) 100%)",
        backdropFilter: "blur(30px)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: 56,
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            lineHeight: 1.2,
          }}
        >
          {text}
        </h1>

        <div
          style={{
            marginTop: "24px",
            opacity: linkScale,
          }}
        >
          <a
            href={url}
            style={{
              display: "inline-block",
              color: "white",
              fontSize: 32,
              fontWeight: 600,
              textDecoration: "none",
              background: "linear-gradient(135deg, #10B981 0%, #14F195 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              padding: "16px 32px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            allowly.app
          </a>
        </div>
      </div>
    </div>
  );
};
