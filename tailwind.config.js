/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ShieldScan exact palette
        bg: {
          deep: "#0e0c15",
          primary: "#13111C",
          card: "#1C1A2E",
          "card-hover": "#23203A",
          elevated: "#262342",
          input: "#161424",
          code: "#0f0d19",
        },
        accent: {
          amber: "#F0B429",
          "amber-dim": "rgba(240, 180, 41, 0.12)",
          green: "#2DD4BF",
          "green-dim": "rgba(45, 212, 191, 0.1)",
          purple: "#A78BFA",
          "purple-dim": "rgba(167, 139, 250, 0.12)",
        },
        severity: {
          critical: "#EF4444",
          "critical-bg": "rgba(239, 68, 68, 0.1)",
          high: "#F97316",
          "high-bg": "rgba(249, 115, 22, 0.1)",
          medium: "#EAB308",
          "medium-bg": "rgba(234, 179, 8, 0.1)",
          low: "#22C55E",
          "low-bg": "rgba(34, 197, 94, 0.1)",
        },
        text: {
          primary: "#E8E4F0",
          secondary: "#9B95B0",
          muted: "#6B6580",
          disabled: "#3D3856",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          hover: "rgba(167, 139, 250, 0.2)",
          active: "rgba(167, 139, 250, 0.4)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(167, 139, 250, 0.08)",
        "glow-amber": "0 0 30px rgba(240, 180, 41, 0.1)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "slide-up": "slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.15s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
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
        pulseDot: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
