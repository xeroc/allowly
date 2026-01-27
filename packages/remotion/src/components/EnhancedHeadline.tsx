import { interpolate, useCurrentFrame, spring } from "remotion";

interface Keyword {
  word: string;
  color?: string;
}

interface HeadlineProps {
  text: string;
  startFrame: number;
  endFrame: number;
  keywords?: Keyword[];
}

export const MouseCursor = ({
  x,
  y,
  scale = 1,
  active = false,
}: {
  x: number;
  y: number;
  scale?: number;
  active?: boolean;
}) => {
  const frame = useCurrentFrame();

  const clickScale = active
    ? spring({
        frame,
        fps: 30,
        config: { damping: 15, stiffness: 200, mass: 0.3 },
      })
    : scale;

  return (
    <svg
      width={24 * scale}
      height={24 * scale}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        transform: `scale(${clickScale})`,
        opacity: 0.9,
      }}
    >
      <path
        d="M5.636 5.636a.75.75 0 0 1 1v12.728a.75.75 0 0 1-1V6.636a.75.75 0 0 1-1H5.636z"
        fill="white"
        opacity={0.6}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10 10 0 1-10 0 0 0 0 1 0 0 0 0zM12 17.5a.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5-.5 0 0 0-.5-.5.5 0 0 0-.5zM12 8a4 4 0 1 1 4 4 0 1 1-4-4 0 0 0 1-1 4 4 0 0 1-1 4-4z"
        fill={active ? "#10B981" : "white"}
        stroke={active ? "#10B981" : "white"}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EnhancedHeadline = ({
  text,
  startFrame,
  endFrame,
  keywords = [],
}: HeadlineProps) => {
  const frame = useCurrentFrame();
  const fontSize = 64;
  const lineHeight = 1.1;

  const slideUp = interpolate(frame, [startFrame, startFrame + 10], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideScale = spring({
    frame: Math.max(0, frame - startFrame),
    fps: 30,
    config: { damping: 25, stiffness: 140, mass: 0.3 },
  });

  const textColor = 255;
  const glowIntensity = 0;

  const shouldShow =
    frame >= startFrame && frame <= endFrame && frame >= startFrame + 3;

  const textWithHighlights = (
    <div
      style={{
        color: `rgba(${textColor}, ${textColor}, ${textColor}, 1)`,
        fontSize,
        fontWeight: 700,
        lineHeight,
        textAlign: "center",
        display: "inline",
      }}
    >
      {text.split(" ").map((word, index) => {
        const keyword = keywords.find(
          (k) => k.word.toLowerCase() === word.toLowerCase(),
        );

        return (
          <span key={`${index}-${word}`}>
            {index > 0 && " "}
            {keyword ? (
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #10B981 0%, #14F195 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  fontSize: fontSize * 1.05,
                  fontWeight: 800,
                  filter: `drop-shadow(0 0 20px rgba(16, 185, 129, ${0.3 + glowIntensity * 0.2}))`,
                }}
              >
                {keyword.word}
              </span>
            ) : (
              <span>{word}</span>
            )}
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        opacity: shouldShow ? 1 : 0,
        pointerEvents: "none",
        display: shouldShow ? "block" : "none",
      }}
    >
      <div
        style={{
          background: "transparent",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px 60px",
          transform: `translateY(${slideUp}px) scale(${slideScale})`,
          boxShadow: "0 0 0 rgba(16, 185, 129, 0.15)",
        }}
      >
        {textWithHighlights}
      </div>
    </div>
  );
};
