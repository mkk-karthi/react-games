/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wood: {
          50: "var(--color-wood-50)",
          100: "var(--color-wood-100)",
          200: "var(--color-wood-200)",
          300: "var(--color-wood-300)",
          350: "var(--color-wood-350)",
          400: "var(--color-wood-400)",
          450: "var(--color-wood-450)",
          500: "var(--color-wood-500)",
          600: "var(--color-wood-600)",
          700: "var(--color-wood-700)",
          800: "var(--color-wood-800)",
          900: "var(--color-wood-900)",
        },
        forest: {
          400: "var(--color-forest-400)",
          500: "var(--color-forest-500)",
          600: "var(--color-forest-600)",
        },
        panel: {
          text: "var(--color-panel-text)",
          card: "var(--color-panel-card)",
        },
        coordinate: "var(--color-text-coord)",
        "no-captures": "var(--color-text-muted)",
        piece: {
          "stroke-w": "var(--color-piece-stroke-w)",
          "stroke-b": "var(--color-piece-stroke-b)",
          "accent-w": "var(--color-piece-accent-w)",
          "accent-b": "var(--color-piece-accent-b)",
          shadow: "var(--color-piece-shadow)",
          highlight: "var(--color-piece-highlight)",
          ellipse: "var(--color-piece-ellipse)",
        },
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },

      keyframes: {
        tableIn: {
          "0%": { opacity: "0", transform: "translateY(24px) rotateX(12deg) scale(0.92)" },
          "100%": { opacity: "1", transform: "translateY(0) rotateX(0) scale(1)" },
        },
        floatGlow: {
          "0%, 100%": { opacity: "0.62", transform: "translateY(0)" },
          "50%": { opacity: "0.9", transform: "translateY(-5px)" },
        },
        movePiece: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(var(--move-x), var(--move-y)) scale(1)" },
        },
        movePieceLift: {
          "0%, 100%": { transform: "scale(1) translateY(0)", filter: "drop-shadow(0 13px 8px var(--color-piece-shadow))" },
          "50%": { transform: "scale(1.18) translateY(-14px)", filter: "drop-shadow(0 28px 16px rgba(18, 7, 2, 0.55))" },
        },
        beatPiece: {
          "0%": { opacity: "1", transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "30%": { opacity: "1", transform: "translate(-8px, -16px) scale(1.15) rotate(-15deg)" },
          "100%": { opacity: "0", transform: "translate(60px, 120px) scale(0.15) rotate(180deg)" },
        },
        gridShake: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translate(-2px, 1px)" },
          "20%, 40%, 60%, 80%": { transform: "translate(2px, -1px)" },
        },
        cardFlipIn: {
          "0%": { opacity: "0", transform: "rotateX(24deg) translateY(30px) scale(0.9)" },
          "100%": { opacity: "1", transform: "rotateX(0deg) translateY(0) scale(1)" },
        },
        selectedFloat: {
          "0%, 100%": { transform: "translateY(-6px) scale(1.06)", filter: "drop-shadow(0 18px 10px rgba(25,10,3,0.5))" },
          "50%": { transform: "translateY(-10px) scale(1.06)", filter: "drop-shadow(0 24px 14px rgba(25,10,3,0.6))" },
        },
        landPiece: {
          "0%": { transform: "scale(1.18) translateY(-12px)", filter: "drop-shadow(0 28px 16px rgba(18, 7, 2, 0.6))" },
          "50%": { transform: "scale(0.92) translateY(1px)", filter: "drop-shadow(0 4px 3px var(--color-piece-shadow))" },
          "75%": { transform: "scale(1.04) translateY(-2px)", filter: "drop-shadow(0 10px 6px var(--color-piece-shadow))" },
          "100%": { transform: "scale(1) translateY(0)", filter: "drop-shadow(0 13px 8px var(--color-piece-shadow))" },
        },
        splinterBurst: {
          "0%": { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translate(calc(-50% + var(--splinter-x)), calc(-50% + var(--splinter-y))) scale(0.1) rotate(var(--splinter-rot))", opacity: "0" },
        },
        checkPulse: {
          "0%, 100%": { opacity: "0.6", boxShadow: "inset 0 0 16px rgba(220, 38, 38, 0.75), 0 0 10px rgba(220, 38, 38, 0.55)" },
          "50%": { opacity: "1.0", boxShadow: "inset 0 0 28px rgba(239, 68, 68, 0.95), 0 0 20px rgba(239, 68, 68, 0.75)" },
        },
        targetDotIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        confettiFall: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(105vh) translateX(var(--confetti-drift)) rotate(calc(360deg * var(--confetti-spin-speed)))" },
        },
      },
      animation: {
        tableIn: "tableIn 720ms cubic-bezier(.2,.9,.2,1) both",
        floatGlow: "floatGlow 3.4s ease-in-out infinite",
        movePiece: "movePiece 390ms cubic-bezier(0.2, 0.75, 0.24, 1) both",
        movePieceLift: "movePieceLift 390ms cubic-bezier(0.2, 0.75, 0.24, 1) both",
        beatPiece: "beatPiece 450ms cubic-bezier(0.25, 1, 0.5, 1) both",
        gridShake: "gridShake 350ms cubic-bezier(.36,.07,.19,.97) both",
        cardFlipIn: "cardFlipIn 560ms cubic-bezier(0.2, 0.9, 0.2, 1) both",
        selectedFloat: "selectedFloat 1.8s ease-in-out infinite",
        targetDotIn: "targetDotIn 220ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        confettiFall: "confettiFall 4s linear infinite",
      },
    },
  },
  plugins: [],
};
