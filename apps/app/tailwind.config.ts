import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Clash Display", "system-ui", "sans-serif"],
        body: ["General Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        foreground: "rgb(var(--foreground-rgb))",
        background: "rgb(var(--background-rgb))",
        primary: {
          DEFAULT: "#0a0f1c",
          light: "#141c2e",
          dark: "#05080f",
        },
        accent: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#34d399",
          glow: "rgba(16, 185, 129, 0.3)",
        },
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          hover: "rgba(255, 255, 255, 0.06)",
          border: "rgba(148, 163, 184, 0.15)",
        },
        muted: {
          DEFAULT: "rgba(148, 163, 184, 0.6)",
          hover: "rgba(148, 163, 184, 0.8)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient":
          "linear-gradient(135deg, #0a0f1c 0%, #1a1f3c 50%, #0a0f1c 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-lg": "0 0 40px rgba(16, 185, 129, 0.4)",
        inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
