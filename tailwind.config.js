/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#07080d",
          card: "#0d0f17",
          elevated: "#131620",
          input: "#171b28",
          hover: "#1c2133",
        },
        brand: {
          DEFAULT: "#06d6a0",
          light: "#34ebc0",
          dark: "#04b886",
          glow: "rgba(6, 214, 160, 0.12)",
          muted: "rgba(6, 214, 160, 0.08)",
        },
        blue: {
          DEFAULT: "#0ea5e9",
          light: "#38bdf8",
        },
        purple: {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
        },
        pink: {
          DEFAULT: "#ec4899",
        },
        text: {
          primary: "#f0f2f7",
          secondary: "#8b92a8",
          tertiary: "#4f5672",
          disabled: "#2e3347",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.12)",
          active: "rgba(6, 214, 160, 0.3)",
        },
        success: "#06d6a0",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(6, 214, 160, 0.15), 0 0 60px rgba(6, 214, 160, 0.05)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover": "0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.06)",
        input: "0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.02)",
      },
      animation: {
        "slide-up": "slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
