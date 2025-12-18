/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#e3f8ff',
          100: '#c2edff',
          200: '#95ddff',
          300: '#5cc7ff',
          400: '#1ba6ff',
          500: '#028ae5',
          600: '#006cb4',
          700: '#01558c',
          800: '#0a466f',
          900: '#0e385a',
        },
        abyss: '#0b1424',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(27, 166, 255, 0.35)',
        'bubble-glow': '0 0 25px rgba(147, 197, 253, 0.35)',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translateY(-30px) scale(1.1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-60px) scale(0.8)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        swim: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-5px)' },
          '50%': { transform: 'translateX(0) translateY(-10px)' },
          '75%': { transform: 'translateX(-10px) translateY(-5px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        bubble: 'bubble 3s ease-out infinite',
        pop: 'pop 200ms ease-out',
        swim: 'swim 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
