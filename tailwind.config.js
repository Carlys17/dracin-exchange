/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#080b10",
          secondary: "#0d1117",
          card: "#111820",
          "card-hover": "#161d27",
          elevated: "#1a222d",
          input: "#0f151d",
        },
        accent: {
          DEFAULT: "#00d9a5",
          secondary: "#00b4d8",
          dim: "rgba(0, 217, 165, 0.12)",
          glow: "rgba(0, 217, 165, 0.15)",
        },
        text: {
          primary: "#f0f6fc",
          secondary: "#8b949e",
          muted: "#6e7681",
          disabled: "#3d444d",
        },
        border: {
          DEFAULT: "rgba(240, 246, 252, 0.08)",
          hover: "rgba(0, 217, 165, 0.3)",
          active: "rgba(0, 217, 165, 0.5)",
        },
        success: "#2dd4bf",
        warning: "#f0b429",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 217, 165, 0.15)",
        "glow-strong": "0 0 60px rgba(0, 217, 165, 0.2)",
        card: "0 8px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
