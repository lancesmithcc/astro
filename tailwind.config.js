/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'antic': ['Antic Slab', 'serif'],
      },
      colors: {
        cosmic: {
          50: '#faf7ff',
          100: '#f4edff',
          200: '#ebe0ff',
          300: '#dbc7ff',
          400: '#c5a3ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        aurora: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        void: {
          900: '#0f0f23',
          800: '#1a1a3e',
          700: '#252547',
          600: '#2d2d5f',
          500: '#363665',
        }
      },
      animation: {
        'aurora': 'aurora 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'card-flip': 'cardFlip 0.8s ease-in-out',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        }
      }
    },
  },
  plugins: [],
};