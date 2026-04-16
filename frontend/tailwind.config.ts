import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ============================================
         THE OBSIDIAN PROTOCOL — Design Token System
         ============================================ */

      colors: {
        /* Deep Space Palette — Layered Dark Scheme */
        vault: {
          DEFAULT: "#0D0E12",     // Level 1 — Cards & Panels (Obsidian)
          base: "#050507",        // Level 0 — Page Background (Rich Black)
          active: "#16181D",      // Level 2 — Active/Interactive elements (Charcoal)
          elevated: "#1C1D23",    // Level 3 — Hover / Focus surfaces
          highest: "#24252B",     // Level 4 — Nested containers
        },

        /* Electric Indigo — Primary Accent */
        indigo: {
          DEFAULT: "#4F46E5",
          light: "#7C3AED",
          dim: "#3730A3",
          glow: "rgba(79, 70, 229, 0.3)",
          muted: "rgba(79, 70, 229, 0.15)",
        },

        /* Functional Colors */
        emerald: {
          DEFAULT: "#10B981",
          bright: "#059669",
          glow: "rgba(16, 185, 129, 0.3)",
        },
        scarlet: {
          DEFAULT: "#EF4444",
          bright: "#DC2626",
          glow: "rgba(239, 68, 68, 0.3)",
        },
        amber: {
          DEFAULT: "#F59E0B",
          dim: "#D97706",
          glow: "rgba(245, 158, 11, 0.2)",
        },

        /* Text Hierarchy */
        "text-primary": "#E8E9ED",       // High emphasis (headings)
        "text-secondary": "#9CA0B0",     // Medium emphasis (body, descriptions)
        "text-tertiary": "#5C6070",      // Low emphasis (labels, captions)
        "text-muted": "#3A3D48",         // Disabled / faint

        /* Borders */
        "border-subtle": "rgba(255, 255, 255, 0.05)",
        "border-medium": "rgba(255, 255, 255, 0.08)",
        "border-focus": "rgba(79, 70, 229, 0.5)",
      },

      borderRadius: {
        DEFAULT: "0.75rem",   // 12px — inputs, badges
        lg: "1rem",           // 16px — buttons, small cards
        xl: "1.25rem",        // 20px — medium cards
        "2xl": "1.5rem",      // 24px — main vault-cards
        "3xl": "2rem",        // 32px — hero containers
        full: "9999px",
      },

      fontFamily: {
        headline: ["Satoshi", "Inter", "sans-serif"],
        body: ["Satoshi", "Inter", "sans-serif"],
        label: ["Space Grotesk", "monospace"],
      },

      letterSpacing: {
        vault: "-0.02em",
        tight: "-0.01em",
      },

      boxShadow: {
        vault: "0 8px 40px rgba(0, 0, 0, 0.4)",
        "vault-lg": "0 16px 64px rgba(0, 0, 0, 0.5)",
        "vault-glow": "0 0 40px rgba(79, 70, 229, 0.15)",
        "indigo-glow": "0 0 20px rgba(79, 70, 229, 0.3)",
        "emerald-glow": "0 0 20px rgba(16, 185, 129, 0.3)",
        "scarlet-glow": "0 0 20px rgba(239, 68, 68, 0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      },

      backdropBlur: {
        vault: "20px",
        "vault-heavy": "40px",
      },

      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        slideGlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(16, 185, 129, 0.4)" },
          "50%": { boxShadow: "0 0 12px rgba(16, 185, 129, 0.8)" },
        },
        borderScan: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 200%" },
        },
      },

      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        "slide-glow": "slideGlow 3s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "border-scan": "borderScan 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
