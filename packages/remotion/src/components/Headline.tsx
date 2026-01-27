import { interpolate, useCurrentFrame, spring } from "remotion";

interface HeadlineProps {
  text: string;
  startFrame: number;
  endFrame: number;
  size?: "large" | "medium" | "small";
}

export const Headline = ({
  text,
  startFrame,
  endFrame,
  size = "large",
}: HeadlineProps) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [endFrame - 20, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame: Math.max(0, frame - startFrame),
    fps: 30,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  const fontSize = size === "large" ? 48 : size === "medium" ? 36 : 28;

  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: opacity * fadeOut,
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize,
          fontWeight: 700,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.2,
          textShadow: "0 0 40px rgba(16, 185, 129, 0.3)",
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </h1>
    </div>
  );
};
