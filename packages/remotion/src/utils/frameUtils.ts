export const typewriter = (
  text: string,
  frame: number,
  startFrame: number,
  speed: number = 2,
) => {
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return "";
  const charIndex = Math.floor(relativeFrame / speed);
  return text.slice(0, Math.min(charIndex, text.length));
};
