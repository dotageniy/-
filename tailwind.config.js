/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fairy: {
          pink: "#f8d6ff",
          blush: "#fce7f3",
          lavender: "#e9d5ff",
          lilac: "#ddd6fe",
          periwinkle: "#c7d2fe",
          sky: "#bfdbfe",
          mint: "#ccfbf1",
          peach: "#fed7aa",
          gold: "#fbbf24",
          rose: "#fda4af",
        },
      },
      boxShadow: {
        "fairy-soft": "0 10px 40px -10px rgba(168, 85, 247, 0.25), 0 4px 20px -8px rgba(236, 72, 153, 0.2)",
        "fairy-glow": "0 0 60px -20px rgba(196, 181, 253, 0.9), 0 20px 60px -30px rgba(244, 114, 182, 0.4)",
        "star-glow": "0 0 0 4px rgba(251, 191, 36, 0.15), 0 0 40px -10px rgba(251, 191, 36, 0.6)",
      },
      backgroundImage: {
        "fairy-gradient": "radial-gradient(1200px 800px at 20% 0%, #f8f0ff 0%, #fdf2f8 35%, #eef2ff 70%, #f8fafc 100%)",
        "castle-gradient": "linear-gradient(180deg, rgba(168,85,247,0.12) 0%, rgba(236,72,153,0.08) 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(249,245,255,0.9) 100%)",
        "sidebar-gradient": "radial-gradient(400px 600px at 50% 0%, rgba(196,181,253,0.25) 0%, rgba(30,27,75,0.98) 55%, rgba(15,23,42,0.98) 100%)",
        "button-fairy": "linear-gradient(90deg, #c084fc 0%, #f472b6 50%, #fbbf24 100%)",
      },
      animation: {
        "twinkle-slow": "twinkle 6s ease-in-out infinite",
        "twinkle-fast": "twinkle 3.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out infinite 1.2s",
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: 0.25, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(244, 114, 182, 0.25)" },
          "50%": { boxShadow: "0 0 0 12px rgba(196, 181, 253, 0.12)" },
        },
      },
      fontFamily: {
        display: ["'Quicksand'", "'Nunito'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
