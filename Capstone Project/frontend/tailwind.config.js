/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#070B14',
          dark: '#0B1120',
          card: '#0F172A',
          cardHover: '#131E35',
          border: '#1E293B',
          cyan: '#00F0FF',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyan-glow': '0 0 20px -3px rgba(0, 240, 255, 0.3)',
        'purple-glow': '0 0 20px -3px rgba(139, 92, 246, 0.3)',
        'card-glow': '0 4px 20px -2px rgba(0, 240, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
