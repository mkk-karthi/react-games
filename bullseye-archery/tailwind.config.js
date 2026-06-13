/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        timerPulse: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 4px rgba(239, 68, 68, 0.2)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 16px rgba(239, 68, 68, 0.6)",
          },
        },
        floatUpFade: {
          "0%": {
            transform: "translateY(10px) scale(0.9)",
            opacity: "0",
          },
          "20%": {
            transform: "translateY(0) scale(1.05)",
            opacity: "1",
          },
          "80%": {
            transform: "translateY(-5px) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-25px) scale(0.95)",
            opacity: "0",
          },
        },
        rotatePhone: {
          "0%, 15%": {
            transform: "rotate(0deg)",
          },
          "45%, 65%": {
            transform: "rotate(-90deg)",
          },
          "90%, 100%": {
            transform: "rotate(0deg)",
          },
        },
      },
      animation: {
        "timer-pulse": "timerPulse 0.8s infinite ease-in-out",
        "float-up-fade": "floatUpFade 1.2s forwards cubic-bezier(0.16, 1, 0.3, 1)",
        "rotate-phone": "rotatePhone 2.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
}
