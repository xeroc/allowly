export const Background = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgb(10, 15, 28)",
        backgroundImage: `
        radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(16, 185, 129, 0.08) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(52, 211, 153, 0.03) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.06) 0px, transparent 50%)
      `,
      }}
    />
  );
};
