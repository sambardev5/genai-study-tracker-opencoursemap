import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#fffaf3",
        ink: "#1e1b18",
        sand: "#f2dfc6",
        copper: "#b65e32",
        pine: "#21473e",
        sky: "#8ac9d1",
        sage: "#b4c8a8",
      },
      fontFamily: {
        display: ["Avenir Next", "Trebuchet MS", "sans-serif"],
        body: ["IBM Plex Sans", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -30px rgba(34, 26, 18, 0.45)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(182, 94, 50, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 94, 50, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
