import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dreamy Lavender - Primary accent
        lavender: {
          50: '#FAF8FF',
          100: '#F3EFFE',
          200: '#E9E0FD',
          300: '#D4C4FA',
          400: '#B794F6',
          500: '#9F6EF0',
          600: '#8B5CE0',
          700: '#7647C9',
          800: '#633DA4',
          900: '#523485',
        },
        // Soft Sage - Secondary accent
        sage: {
          50: '#F6F9F6',
          100: '#E8F0E8',
          200: '#D1E2D1',
          300: '#A8C9A8',
          400: '#7BAF7B',
          500: '#5A9A5A',
          600: '#467B46',
          700: '#3A633A',
          800: '#325032',
          900: '#2B432B',
        },
        // Warm Cream - Background
        cream: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E0D4C3',
        },
        // Rose Mist - Accent
        rose: {
          50: '#FFF5F7',
          100: '#FFE8ED',
          200: '#FFD4DF',
          300: '#FFB0C4',
          400: '#FF85A1',
          500: '#F05D7E',
          600: '#DC3D60',
          700: '#BA2D4C',
          800: '#9B2842',
          900: '#83253C',
        },
        // Neutral - Warm grays
        neutral: {
          50: '#FAFAF9',
          100: '#F5F4F2',
          200: '#E8E6E3',
          300: '#D6D3CF',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        // Elegant display font
        display: [
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        // Modern sans for body
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        // Serif for accents
        serif: [
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
      },
      backgroundImage: {
        // Dreamy gradient backgrounds
        'gradient-dreamy': 'linear-gradient(135deg, #FAF8FF 0%, #F6F9F6 50%, #FAF7F2 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #F3EFFE 0%, #E9E0FD 100%)',
        'gradient-sage': 'linear-gradient(135deg, #E8F0E8 0%, #D1E2D1 100%)',
        'gradient-flow': 'linear-gradient(180deg, rgba(183, 148, 246, 0.1) 0%, rgba(168, 201, 168, 0.1) 50%, rgba(255, 176, 196, 0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'flow': 'flow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'dreamy': '0 20px 60px rgba(183, 148, 246, 0.15)',
        'soft': '0 2px 20px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
export default config
