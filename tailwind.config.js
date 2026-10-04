/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF5EE',
          200: '#F3EBDD',
          300: '#EBDCC8',
        },
        coral: {
          50: '#FFF0EC',
          100: '#FFE0D6',
          200: '#FFC4B3',
          300: '#FFA488',
          400: '#FF8260',
          500: '#F9633F',
          600: '#E04E2D',
          700: '#B83D22',
          800: '#8F311C',
        },
        sage: {
          50: '#F1F8F3',
          100: '#DEEFE2',
          200: '#BDE0C5',
          300: '#92C9A0',
          400: '#6BAE7B',
          500: '#4E9260',
          600: '#3B7749',
        },
        ink: {
          900: '#1F1A15',
          800: '#2D2722',
          700: '#4A3F37',
          600: '#6B5D52',
          500: '#8A7B6E',
          400: '#A89889',
          300: '#C9BCB0',
          200: '#E0D7CD',
          100: '#EFE9E1',
        },
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(74, 63, 55, 0.06)',
        cardHover: '0 6px 24px 0 rgba(74, 63, 55, 0.10)',
        floating: '0 8px 30px 0 rgba(249, 99, 63, 0.20)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
