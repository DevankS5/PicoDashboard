import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amoled: '#000000',
        card: '#0a0a0a',
        overlay: '#111111',
        'green-accent': '#00ff87',
        'red-accent': '#ff3b3b',
        border: {
          DEFAULT: '#1f1f1f',
          active: '#333333',
          focus: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(255, 255, 255, 0.08)',
        'glow-md': '0 0 24px rgba(255, 255, 255, 0.14)',
        'glow-green': '0 0 10px rgba(0, 255, 135, 0.35)',
        'glow-red': '0 0 10px rgba(255, 59, 59, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
