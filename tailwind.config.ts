import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./events/**/*.{ts,tsx}",
    "./event.config.ts",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E1712",
        espresso: "#241C15",
        ivory: "#FFFFFF",
        cream: "#FDFAF3",
        sand: "#E8DCC7",
        muted: "#6F665A",
        // Theme-able via CSS variables (see app/layout.tsx + config/event-schema.ts `theme`).
        // Default values come from the :root declaration in app/globals.css.
        saffron: "var(--saffron)",
        "saffron-2": "var(--saffron-2)",
        maroon: "#7A2E2A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        brand: "14px",
      },
      maxWidth: {
        shell: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
