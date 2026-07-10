/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0D10",
        panel: "#14171C",
        panel2: "#1B1F26",
        crimson: "#E4283A",
        amber: "#FFB020",
        cyan: "#33E6C8",
        paper: "#F2F1ED",
        smoke: "#8A8F98",
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        scanlines:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
        noise:
          "radial-gradient(circle at 20% 20%, rgba(228,40,58,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(51,230,200,0.06), transparent 45%)",
      },
      boxShadow: {
        tally: "0 0 12px 2px rgba(228,40,58,0.65)",
        glowcyan: "0 0 12px 2px rgba(51,230,200,0.55)",
        panel: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
