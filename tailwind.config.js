/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // app surfaces, darkest to lightest
        ink: {
          950: "#07070f",
          900: "#0b0b1a",
          850: "#10101f",
          800: "#15152a",
          700: "#1e1e38",
          600: "#2a2a4a",
        },
        aqua: "#22d3ee",
        violet: "#8b5cf6",
      },
      backgroundImage: {
        brand: "linear-gradient(110deg, #22d3ee, #4db5ff 45%, #8b5cf6)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,.25), 0 10px 40px -10px rgba(139,92,246,.45)",
        card: "0 20px 50px -20px rgba(0,0,0,.6)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        float: {
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s cubic-bezier(.2,.8,.2,1) both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
